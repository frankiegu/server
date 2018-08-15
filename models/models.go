package models

import (
	"database/sql"
	"fmt"

	// custom packages
	cError "github.com/joyread/server/error"
	"github.com/joyread/server/settings"
)

// ConnectDB
func ConnectDB() *sql.DB {
	dbConf := settings.GetDBConf()

	// Open postgres database
	connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s", dbConf.DBUsername, dbConf.DBPassword, dbConf.DBHostname, dbConf.DBPort, dbConf.DBName, dbConf.DBPassword, dbConf.DBSSLMode)
	db, err := sql.Open("postgres", connStr)
	cError.CheckError(err)

	return db
}

// CreateUser ...
func CreateUser() {
	db := ConnectDB()
	_, err := db.Query("CREATE TABLE IF NOT EXISTS account (id BIGSERIAL PRIMARY KEY, username VARCHAR(255) UNIQUE NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, jwt_token VARCHAR(255) NOT NULL, is_admin BOOLEAN NOT NULL DEFAULT FALSE, is_nextcloud BOOLEAN NOT NULL DEFAULT FALSE)")
	cError.CheckError(err)

	db.Close()
}

// InsertUser ...
func InsertUser(username string, email string, passwordHash string, tokenString string, isAdmin bool) {
	db := ConnectDB()
	_, err := db.Query("INSERT INTO account (username, email, password_hash, jwt_token, is_admin) VALUES ($1, $2, $3, $4, $5)", username, email, passwordHash, tokenString, isAdmin)
	cError.CheckError(err)

	db.Close()
}

// SelectOneAdmin ...
func SelectOneAdmin() bool {
	db := ConnectDB()

	// Check for Admin in the user table
	rows, err := db.Query("SELECT id FROM account WHERE is_admin = $1", true)
	cError.CheckError(err)

	var isAdminPresent = false

	if rows.Next() {
		isAdminPresent = true
	}
	rows.Close()

	db.Close()

	return isAdminPresent
}

// SelectPasswordHashAndJWTToken ...
func SelectPasswordHashAndJWTToken(usernameoremail string) (string, string) {
	db := ConnectDB()

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

	db.Close()

	return passwordHash, tokenString
}

// CreateSMTP ...
func CreateSMTP() {
	db := ConnectDB()

	_, err := db.Query("CREATE TABLE IF NOT EXISTS smtp (hostname VARCHAR(255) NOT NULL, port INTEGER NOT NULL, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL)")
	cError.CheckError(err)

	db.Close()
}

// InsertSMTP ...
func InsertSMTP(hostname string, port int, username string, password string) {
	db := ConnectDB()

	_, err := db.Query("INSERT INTO smtp (hostname, port, username, password) VALUES ($1, $2, $3, $4)", hostname, port, username, password)
	cError.CheckError(err)

	db.Close()
}

// CheckSMTP ...
func CheckSMTP() bool {
	db := ConnectDB()

	// Check for Admin in the user table
	rows, err := db.Query("SELECT hostname FROM smtp")
	cError.CheckError(err)

	var isSMTPPresent = false

	if rows.Next() {
		isSMTPPresent = true
	}
	rows.Close()

	db.Close()

	return isSMTPPresent
}
