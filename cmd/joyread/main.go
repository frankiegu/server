package main

import (
	_ "github.com/lib/pq"
	joyread "source.joyread.app/scm/joyr/server"
)

func main() {
	joyread.StartServer()
}
