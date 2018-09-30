/*
	Copyright (C) 2018 Nirmal Almara
	
    This file is part of Joyread.

    Joyread is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Joyread is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
	along with Joyread.  If not, see <https://www.gnu.org/licenses/>.
*/

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
