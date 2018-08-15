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

	baseConf := settings.GetBaseConf()

	// Serve static files
	r.Static("/service-worker.js", path.Join(baseConf.AssetPath, "build/service-worker.js"))
	r.Static("/static", path.Join(baseConf.AssetPath, "build/static"))
	r.Static("/cover", path.Join(baseConf.AssetPath, "uploads/img"))

	// HTML rendering
	r.LoadHTMLGlob(path.Join(baseConf.AssetPath, "build/index.html"))

	r.Use(
		middleware.CORSMiddleware(),
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
	port, err := strconv.Atoi(baseConf.ServerPort)
	if err != nil {
		fmt.Println("Invalid port specified")
		os.Exit(1)
	}
	r.Run(fmt.Sprintf(":%d", port))
}
