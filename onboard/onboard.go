package onboard

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

	// vendor packages
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	// custom packages
	"github.com/joyread/server/email"
	cError "github.com/joyread/server/error"
	"github.com/joyread/server/models"
	"github.com/joyread/server/nextcloud"
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
	UserID       int    `json:"user_id" binding:"required"`
}

// SMTPResponse struct
type SMTPResponse struct {
	Status string `json:"status"`
	UserID int    `json:"user_id"`
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
	NextcloudRedirectURI  string `json:"nextcloud_redirect_uri" binding:"required"`
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
		db, ok := c.MustGet("db").(*sql.DB)
		if !ok {
			fmt.Println("Middleware db error")
		}

		// Redirect URI - https://myjoyread.com/nextcloud-auth/:user_id
		redirectURI := fmt.Sprintf("%s/nextcloud-auth/%d", form.NextcloudRedirectURI, form.UserID)

		nextcloudModel := models.NextcloudModel{
			UserID:       form.UserID,
			URL:          form.NextcloudURL,
			ClientID:     form.NextcloudClientID,
			ClientSecret: form.NextcloudClientSecret,
			Directory:    form.NextcloudDirectory,
			RedirectURI:  redirectURI,
		}
		models.InsertNextcloud(db, nextcloudModel)

		authURLRequest := nextcloud.AuthURLRequest{
			URL:         form.NextcloudURL,
			ClientID:    form.NextcloudClientID,
			RedirectURI: redirectURI,
		}
		authURL := nextcloud.GetAuthURL(authURLRequest)

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

// NextcloudAuthCode ...
func NextcloudAuthCode(c *gin.Context) {
	// Get UserID from the URL
	userIDString := c.Param("user_id")
	var userID int
	if len(userIDString) > 0 {
		userID, _ = strconv.Atoi(userIDString)
	}

	// Get authorization code from the URL
	code := c.Query("code")

	db, ok := c.MustGet("db").(*sql.DB)
	if !ok {
		fmt.Println("Middleware db error")
	}

	selectNextcloudModel := models.SelectNextcloudModel{
		UserID: userID,
	}
	selectNextcloudResponse := models.SelectNextcloud(db, selectNextcloudModel)

	accessTokenRequest := nextcloud.AccessTokenRequest{
		URL:          selectNextcloudResponse.URL,
		ClientID:     selectNextcloudResponse.ClientID,
		ClientSecret: selectNextcloudResponse.ClientSecret,
		AuthCode:     code,
		RedirectURI:  selectNextcloudResponse.RedirectURI,
	}
	accessTokenResponse := nextcloud.GetAccessToken(accessTokenRequest)

	nextcloudTokenModel := models.NextcloudTokenModel{
		AccessToken:  accessTokenResponse.AccessToken,
		RefreshToken: accessTokenResponse.RefreshToken,
		UserID:       userID,
	}
	models.UpdateNextcloudToken(db, nextcloudTokenModel)

	c.Redirect(http.StatusMovedPermanently, "/")
}

// SignInRequest struct
type SignInRequest struct {
	UsernameOrEmail string `json:"usernameoremail" binding:"required"`
	Password        string `json:"password" binding:"required"`
}

// SignInResponse struct
type SignInResponse struct {
	Status string `json:"status"`
	Token  string `json:"token"`
}

// PostSignIn ...
func PostSignIn(c *gin.Context) {
	var form SignInRequest

	if err := c.BindJSON(&form); err == nil {
		db, ok := c.MustGet("db").(*sql.DB)
		if !ok {
			fmt.Println("Middleware db error")
		}

		selectPasswordHashAndJWTTokenModel := models.SelectPasswordHashAndJWTTokenModel{
			UsernameOrEmail: form.UsernameOrEmail,
		}
		selectPasswordHashAndJWTTokenResponse := models.SelectPasswordHashAndJWTToken(db, selectPasswordHashAndJWTTokenModel)

		if isPasswordValid := checkPasswordHash(form.Password, selectPasswordHashAndJWTTokenResponse.PasswordHash); isPasswordValid == true {
			isTokenValid, err := validateJWTToken(selectPasswordHashAndJWTTokenResponse.Token, selectPasswordHashAndJWTTokenResponse.PasswordHash)
			cError.CheckError(err)

			signInResponse := &SignInResponse{
				Status: "authorized",
				Token:  selectPasswordHashAndJWTTokenResponse.Token,
			}

			if isTokenValid == true {
				c.JSON(http.StatusMovedPermanently, signInResponse)
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

	var currentProgress string

	if userID := models.SelectAdmin(db); userID > 0 {
		currentProgress = "signup"

		if models.CheckSMTP(db) {
			currentProgress = "smtp"

			if models.CheckIsNextcloud(db, userID) {
				currentProgress = "nextcloud"
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"current_progress": currentProgress})
}
