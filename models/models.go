package models

import (
	"database/sql"

	// custom packages
	cError "github.com/joyread/server/error"
)

// CreateUser ...
func CreateUser(db *sql.DB) {
	_, err := db.Query("CREATE TABLE IF NOT EXISTS account (id BIGSERIAL PRIMARY KEY, username VARCHAR(255) UNIQUE NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, jwt_token VARCHAR(255) NOT NULL, is_admin BOOLEAN NOT NULL DEFAULT FALSE, is_nextcloud BOOLEAN NOT NULL DEFAULT FALSE)")
	cError.CheckError(err)
}

// InsertUser ...
func InsertUser(db *sql.DB, username string, email string, passwordHash string, tokenString string, isAdmin bool) {
	_, err := db.Query("INSERT INTO account (username, email, password_hash, jwt_token, is_admin) VALUES ($1, $2, $3, $4, $5)", username, email, passwordHash, tokenString, isAdmin)
	cError.CheckError(err)
}

// SelectOneAdmin ...
func SelectOneAdmin(db *sql.DB) bool {
	// Check for Admin in the user table
	rows, err := db.Query("SELECT id FROM account WHERE is_admin = $1", true)
	cError.CheckError(err)

	var isAdminPresent = false

	if rows.Next() {
		isAdminPresent = true
	}

	return isAdminPresent
}

// SelectPasswordHashAndJWTToken ...
func SelectPasswordHashAndJWTToken(db *sql.DB, usernameoremail string) (string, string) {
	// Search for username in the 'account' table with the given string
	rows, err := db.Query("SELECT password_hash, jwt_token FROM account WHERE username = $1", usernameoremail)
	cError.CheckError(err)

	var (
		passwordHash string
		tokenString  string
	)

	if rows.Next() {
		err := rows.Scan(&passwordHash, &tokenString)
		cError.CheckError(err)
	} else {
		// if username doesn't exist, search for email in the 'account' table with the given string
		rows, err := db.Query("SELECT password_hash, jwt_token FROM account WHERE email = $1", usernameoremail)
		cError.CheckError(err)

		if rows.Next() {
			err := rows.Scan(&passwordHash, &tokenString)
			cError.CheckError(err)
		}
		rows.Close()
	}
	rows.Close()

	return passwordHash, tokenString
}

// CreateSMTP ...
func CreateSMTP(db *sql.DB) {
	_, err := db.Query("CREATE TABLE IF NOT EXISTS smtp (hostname VARCHAR(255) NOT NULL, port INTEGER NOT NULL, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL)")
	cError.CheckError(err)
}

// InsertSMTP ...
func InsertSMTP(db *sql.DB, hostname string, port int, username string, password string) {
	_, err := db.Query("INSERT INTO smtp (hostname, port, username, password) VALUES ($1, $2, $3, $4)", hostname, port, username, password)
	cError.CheckError(err)
}
