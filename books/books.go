package books

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Books struct {
	Src   string `json:"src"`
	Title string `json:"title"`
	Href  string `json:"href"`
}

// GetBooks ...
func GetBooks(c *gin.Context) {
	// port, _ := c.MustGet("port").(string)
	// domainAddress, _ := c.MustGet("domainAddress").(string)

	// serverLocation := domainAddress + ":" + port

	books := []Books{
		Books{
			Src:   "cover/b1.jpg",
			Title: "dummy book",
			Href:  "/b1",
		},
	}
	c.JSON(http.StatusOK, gin.H{
		"books": books,
	})
}

// UploadBooks ...
func UploadBooks(c *gin.Context) {
	form, _ := c.MultipartForm()
	files := form.File["upload[]"]

	for _, file := range files {
		fmt.Println(file.Filename)
	}
	c.String(http.StatusOK, "Uploaded...")
}
