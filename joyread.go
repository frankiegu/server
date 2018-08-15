package joyread

import (
	// built-in packages

	"fmt"
	"os"
	"path"
	"strconv"

	// vendor packages
	"github.com/gin-gonic/gin"

	// custom packages
	"github.com/joyread/server/books"
	"github.com/joyread/server/home"
	"github.com/joyread/server/middleware"
	"github.com/joyread/server/onboard"
	"github.com/joyread/server/settings"
)

// StartServer handles the URL routes and starts the server
func StartServer() {
	// Gin initiate
	r := gin.Default()

	// Serve static files
	r.Static("/service-worker.js", path.Join(settings.GetAssetPath(), "build/service-worker.js"))
	r.Static("/static", path.Join(settings.GetAssetPath(), "build/static"))
	r.Static("/cover", path.Join(settings.GetAssetPath(), "uploads/img"))

	// HTML rendering
	r.LoadHTMLGlob(path.Join(settings.GetAssetPath(), "build/index.html"))

	r.Use(
		middleware.CORSMiddleware(),
		//middleware.APIMiddleware(db),
	)

	// Gin handlers
	r.GET("/", home.Home)
	r.GET("/signin", home.Home)
	r.POST("/signin", onboard.PostSignIn)
	r.GET("/database", home.Home)
	r.POST("/database", onboard.PostDatabase)
	r.GET("/signup", home.Home)
	r.POST("/signup", onboard.PostSignUp)
	r.GET("/smtp", home.Home)
	r.POST("/smtp", onboard.PostSMTP)
	r.POST("/test-email", onboard.TestEmail)
	r.GET("/check-onboard", onboard.CheckOnboard)
	r.GET("/books", books.GetBooks)
	r.POST("/upload-books", books.UploadBooks)

	// Listen and serve
	port, err := strconv.Atoi(settings.GetServerPort())
	if err != nil {
		fmt.Println("Invalid port specified")
		os.Exit(1)
	}
	r.Run(fmt.Sprintf(":%d", port))
}
