package onboard

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	// vendor packages
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	// custom packages

	"github.com/joyread/server/email"
	cError "github.com/joyread/server/error"
	"github.com/joyread/server/models"
)

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func generateJWTToken(passwordHash string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{})
	tokenString, err := token.SignedString([]byte(passwordHash))
	return tokenString, err
}

func validateJWTToken(tokenString string, passwordHash string) (bool, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(passwordHash), nil
	})

	return token.Valid, err
}

// ErrorResponse struct
type ErrorResponse struct {
	Error string `json:"error"`
}

// SignUpRequest struct
type SignUpRequest struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// SignUpResponse struct
type SignUpResponse struct {
	Status string `json:"status"`
	Token  string `json:"token"`
	UserID int    `json:"user_id"`
}

// PostSignUp ...
func PostSignUp(c *gin.Context) {
	var form SignUpRequest

	if err := c.BindJSON(&form); err == nil {
		// Generate password hash using bcrypt
		passwordHash, err := hashPassword(form.Password)
		cError.CheckError(err)

		// Generate JWT token using the hash password above
		token, err := generateJWTToken(passwordHash)
		cError.CheckError(err)

		db, ok := c.MustGet("db").(*sql.DB)
		if !ok {
			fmt.Println("Middleware db error")
		}

		signUpModel := models.SignUpModel{
			Username:     form.Username,
			Email:        form.Email,
			PasswordHash: passwordHash,
			Token:        token,
			IsAdmin:      true,
		}

		lastInsertID := models.InsertUser(db, signUpModel)

		signUpResponse := &SignUpResponse{
			Status: "registered",
			Token:  token,
			UserID: lastInsertID,
		}

		c.JSON(http.StatusMovedPermanently, signUpResponse)
	} else {
		errorResponse := &ErrorResponse{
			Error: err.Error(),
		}
		c.JSON(http.StatusBadRequest, errorResponse)
	}
}

// SMTPRequest struct
type SMTPRequest struct {
	SMTPHostname string `json:"smtp_hostname" binding:"required"`
	SMTPPort     string `json:"smtp_port" binding:"required"`
	SMTPUsername string `json:"smtp_username" binding:"required"`
	SMTPPassword string `json:"smtp_password" binding:"required"`
}

// SMTPResponse struct
type SMTPResponse struct {
	Status string `json:"status"`
}

// PostSMTP ...
func PostSMTP(c *gin.Context) {
	var form SMTPRequest

	if err := c.BindJSON(&form); err == nil {
		db, ok := c.MustGet("db").(*sql.DB)
		if !ok {
			fmt.Println("Middleware db error")
		}

		smtpPort, _ := strconv.Atoi(form.SMTPPort)

		smtpModel := models.SMTPModel{
			Hostname: form.SMTPHostname,
			Port:     smtpPort,
			Username: form.SMTPUsername,
			Password: form.SMTPPassword,
		}

		models.InsertSMTP(db, smtpModel)

		smtpResponse := &SMTPResponse{
			Status: "registered",
		}

		c.JSON(http.StatusMovedPermanently, smtpResponse)
	} else {
		errorResponse := &ErrorResponse{
			Error: err.Error(),
		}
		c.JSON(http.StatusBadRequest, errorResponse)
	}
}

// TestEmailRequest struct
type TestEmailRequest struct {
	SMTPHostname  string `json:"smtp_hostname" binding:"required"`
	SMTPPort      string `json:"smtp_port" binding:"required"`
	SMTPUsername  string `json:"smtp_username" binding:"required"`
	SMTPPassword  string `json:"smtp_password" binding:"required"`
	SMTPTestEmail string `json:"smtp_test_email" binding:"required"`
}

// TestEmailResponse struct
type TestEmailResponse struct {
	IsEmailSent bool `json:"is_email_sent"`
}

// TestEmail ...
func TestEmail(c *gin.Context) {
	var form TestEmailRequest

	if err := c.BindJSON(&form); err == nil {
		smtpPort, _ := strconv.Atoi(form.SMTPPort)
		emailSubject := "Joyread - Test email for your SMTP configuration"
		emailBody := "Congratulations mate!<br /><br /> You've successfully set up your email server.<br /><br />Cheers,<br/>Joyread"

		sendEmailRequest := email.SendEmailRequest{
			From:         form.SMTPUsername,
			To:           form.SMTPTestEmail,
			Subject:      emailSubject,
			Body:         emailBody,
			SMTPHostname: form.SMTPHostname,
			SMTPPort:     smtpPort,
			SMTPUsername: form.SMTPUsername,
			SMTPPassword: form.SMTPPassword,
		}

		isEmailSent := email.SendSyncEmail(sendEmailRequest)

		testEmailResponse := &TestEmailResponse{
			IsEmailSent: isEmailSent,
		}

		c.JSON(http.StatusMovedPermanently, testEmailResponse)
	} else {
		errorResponse := &ErrorResponse{
			Error: err.Error(),
		}
		c.JSON(http.StatusBadRequest, errorResponse)
	}
}

// NextcloudRequest struct
type NextcloudRequest struct {
	UserID                int    `json:"user_id" binding:"required"`
	NextcloudURL          string `json:"nextcloud_url" binding:"required"`
	NextcloudClientID     string `json:"nextcloud_client_id" binding:"required"`
	NextcloudClientSecret string `json:"nextcloud_client_secret" binding:"required"`
	NextcloudDirectory    string `json:"nextcloud_directory" binding:"required"`
}

// NextcloudResponse struct
type NextcloudResponse struct {
	Status  string `json:"status"`
	AuthURL string `json:"auth_url"`
}

// PostNextcloud ...
func PostNextcloud(c *gin.Context) {
	var form NextcloudRequest

	if err := c.BindJSON(&form); err == nil {
		fmt.Println(form)
		db, ok := c.MustGet("db").(*sql.DB)
		if !ok {
			fmt.Println("Middleware db error")
		}

		nextcloudModel := models.NextcloudModel{
			UserID:       form.UserID,
			URL:          form.NextcloudURL,
			ClientID:     form.NextcloudClientID,
			ClientSecret: form.NextcloudClientSecret,
			Directory:    form.NextcloudDirectory,
		}

		models.InsertNextcloud(db, nextcloudModel)

		authURL := fmt.Sprintf("%s/apps/oauth2/authorize?response_type=code&client_id=%s&redirect_uri=%s&scope=write", form.NextcloudURL, form.NextcloudClientID, "http://localhost:8080/nextcloud-code")
		nextcloudResponse := &NextcloudResponse{
			Status:  "registered",
			AuthURL: authURL,
		}

		c.JSON(http.StatusMovedPermanently, nextcloudResponse)
	} else {
		errorResponse := &ErrorResponse{
			Error: err.Error(),
		}
		c.JSON(http.StatusBadRequest, errorResponse)
	}
}

// NextcloudTokenStruct struct
type NextcloudTokenStruct struct {
	AccessToken  string `json:"access_token" binding:"required"`
	RefreshToken string `json:"refresh_token" binding:"required"`
}

// NextcloudAuthCode ...
func NextcloudAuthCode(c *gin.Context) {
	code := c.Query("code")
	var nextcloudToken NextcloudTokenStruct

	db, ok := c.MustGet("db").(*sql.DB)
	if !ok {
		fmt.Println("Middleware db error")
	}

	url, clientID, clientSecret := models.SelectNextcloud(db)
	body := strings.NewReader(fmt.Sprintf("client_id=%s&client_secret=%s&grant_type=%s&code=%s&redirect_uri=%s", clientID, clientSecret, "authorization_code", code, "http://localhost:8080/nextcloud-code"))
	req, err := http.NewRequest("POST", fmt.Sprintf("%s/apps/oauth2/api/v1/token", url), body)
	cError.CheckError(err)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{
		Timeout: 15 * time.Second,
	}
	resp, err := client.Do(req)
	cError.CheckError(err)
	json.NewDecoder(resp.Body).Decode(&nextcloudToken)
	fmt.Println(&nextcloudToken)
	resp.Body.Close()

	models.UpdateNextcloudToken(db, nextcloudToken.AccessToken, nextcloudToken.RefreshToken)

	c.Redirect(http.StatusMovedPermanently, "/")
}

// SignInStruct struct
type SignInStruct struct {
	UsernameOrEmail string `json:"usernameoremail" binding:"required"`
	Password        string `json:"password" binding:"required"`
}

// PostSignIn ...
func PostSignIn(c *gin.Context) {
	var form SignInStruct

	if err := c.BindJSON(&form); err == nil {
		db, ok := c.MustGet("db").(*sql.DB)
		if !ok {
			fmt.Println("Middleware db error")
		}
		passwordHash, tokenString := models.SelectPasswordHashAndJWTToken(db, form.UsernameOrEmail)

		if isPasswordValid := checkPasswordHash(form.Password, passwordHash); isPasswordValid == true {
			isTokenValid, err := validateJWTToken(tokenString, passwordHash)
			cError.CheckError(err)

			if isTokenValid == true {
				c.JSON(http.StatusMovedPermanently, gin.H{
					"status": "authorized",
					"token":  tokenString,
				})
			} else {
				c.JSON(http.StatusMovedPermanently, gin.H{"status": "unauthorized"})
			}
		} else {
			c.JSON(http.StatusMovedPermanently, gin.H{"status": "unauthorized"})
		}
	} else {
		errorResponse := &ErrorResponse{
			Error: err.Error(),
		}
		c.JSON(http.StatusBadRequest, errorResponse)
	}
}

// CheckOnboard ...
func CheckOnboard(c *gin.Context) {
	db, ok := c.MustGet("db").(*sql.DB)
	if !ok {
		fmt.Println("Middleware db error")
	}
	isAdminPresent, userID := models.SelectOneAdmin(db)

	var isSMTPPresent, isNextcloud, isNextcloudPresent bool

	if isAdminPresent {
		isSMTPPresent = models.CheckSMTP(db)
		isNextcloud = models.CheckIsNextcloud(db, userID)
		isNextcloudPresent = false

		if isNextcloud {
			accessToken := models.CheckNextcloudToken(db, userID)

			if len(accessToken) > 0 {
				isNextcloudPresent = true
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"is_admin_present": isAdminPresent, "user_id": userID, "is_smtp_present": isSMTPPresent, "is_nextcloud_present": isNextcloudPresent})
}
