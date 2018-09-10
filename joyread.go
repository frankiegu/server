package joyread

import (
	// built-in packages
	"database/sql"
	"fmt"
	"os"
	"path"
	"strconv"

	// vendor packages
	"github.com/gin-gonic/gin"

	// custom packages
	"github.com/joyread/server/books"
	cError "github.com/joyread/server/error"
	"github.com/joyread/server/home"
	"github.com/joyread/server/middleware"
	"github.com/joyread/server/models"
	"github.com/joyread/server/onboard"
	"github.com/joyread/server/settings"
)

// StartServer handles the URL routes and starts the server
func StartServer() {
	// Gin initiate
	r := gin.Default()

	conf := settings.GetConf()

	// Serve static files
	r.Static("/assets", path.Join(conf.BaseValues.AssetPath, "assets"))
	r.Static("/cover", path.Join(conf.BaseValues.DataPath, "uploads/img"))

	// HTML rendering
	r.LoadHTMLGlob(path.Join(conf.BaseValues.AssetPath, "assets/templates/*"))

	// Open postgres database
	connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s", conf.BaseValues.DBValues.DBUsername, conf.BaseValues.DBValues.DBPassword, conf.BaseValues.DBValues.DBHostname, conf.BaseValues.DBValues.DBPort, conf.BaseValues.DBValues.DBName, conf.BaseValues.DBValues.DBSSLMode)
	db, err := sql.Open("postgres", connStr)
	cError.CheckError(err)
	defer db.Close()

	r.Use(
		middleware.CORSMiddleware(),
		middleware.APIMiddleware(db),
	)

	models.CreateUser(db)
	models.CreateSMTP(db)
	models.CreateNextcloud(db)

	// Gin handlers
	r.GET("/", home.Home)
	r.GET("/signin", home.Home)
	r.POST("/signin", onboard.PostSignIn)
	r.GET("/signup", onboard.GetSignUp)
	r.POST("/signup", onboard.PostSignUp)
	r.GET("/smtp", onboard.GetSMTP)
	r.POST("/smtp", onboard.PostSMTP)
	r.POST("/test-email", onboard.TestEmail)
	r.GET("/storage", home.Home)
	r.POST("/nextcloud", onboard.PostNextcloud)
	r.GET("/nextcloud-auth/:user_id", onboard.NextcloudAuthCode)
	r.GET("/is-admin-present", onboard.IsAdminPresent)
	r.GET("/is-smtp-present", onboard.IsSMTPPresent)
	r.GET("/is-storage-present", onboard.IsStoragePresent)
	r.GET("/check-onboard", onboard.CheckOnboard)
	r.GET("/books", books.GetBooks)
	r.POST("/upload-books", books.UploadBooks)

	// Listen and serve
	port, err := strconv.Atoi(conf.BaseValues.ServerPort)
	if err != nil {
		fmt.Println("Invalid port specified")
		os.Exit(1)
	}
	r.Run(fmt.Sprintf(":%d", port))
}
