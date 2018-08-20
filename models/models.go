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
func InsertUser(db *sql.DB, username string, email string, passwordHash string, tokenString string, isAdmin bool) int {
	var lastInsertId int
	err := db.QueryRow("INSERT INTO account (username, email, password_hash, jwt_token, is_admin) VALUES ($1, $2, $3, $4, $5) returning id", username, email, passwordHash, tokenString, isAdmin).Scan(&lastInsertId)
	cError.CheckError(err)

	return lastInsertId
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
	rows.Close()

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

// CheckSMTP ...
func CheckSMTP(db *sql.DB) bool {

	// Check for Admin in the user table
	rows, err := db.Query("SELECT hostname FROM smtp")
	cError.CheckError(err)

	var isSMTPPresent = false

	if rows.Next() {
		isSMTPPresent = true
	}
	rows.Close()

	return isSMTPPresent
}

// CreateNextcloud ...
func CreateNextcloud(db *sql.DB) {
	_, err := db.Query("CREATE TABLE IF NOT EXISTS nextcloud (id BIGSERIAL, user_id INTEGER REFERENCES account(id), url VARCHAR(255) NOT NULL, client_id VARCHAR(1200) NOT NULL, client_secret VARCHAR(1200) NOT NULL, directory VARCHAR(255) NOT NULL, access_token VARCHAR(255), refresh_token VARCHAR(255), PRIMARY KEY (id, user_id))")
	cError.CheckError(err)
}

// InsertNextcloud ...
func InsertNextcloud(db *sql.DB, userID int, url string, clientID string, clientSecret string, directory string) {
	_, err := db.Query("INSERT INTO nextcloud (user_id, url, client_id, client_secret, directory) VALUES ($1, $2, $3, $4, $5)", userID, url, clientID, clientSecret, directory)
	cError.CheckError(err)
}

// SelectNextcloud ...
func SelectNextcloud(db *sql.DB) (string, string, string) {
	rows, err := db.Query("SELECT url, client_id, client_secret FROM nextcloud WHERE user_id = $1", 1)
	cError.CheckError(err)

	var url, clientID, clientSecret string

	if rows.Next() {
		err := rows.Scan(&url, &clientID, &clientSecret)
		cError.CheckError(err)
	}
	rows.Close()

	return url, clientID, clientSecret
}

// UpdateNextcloudToken ...
func UpdateNextcloudToken(db *sql.DB, accessToken string, refreshToken string) {
	_, err := db.Query("UPDATE nextcloud SET access_token=$1, refresh_token=$2 WHERE user_id=$3", accessToken, refreshToken, 1)
	cError.CheckError(err)
}
