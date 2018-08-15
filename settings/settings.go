package settings

import (
	"fmt"

	"github.com/joyread/server/getenv"
)

const (
	portDefault      = "8080"
	portEnv          = "JOYREAD_PORT"
	assetPathEnv     = "JOYREAD_ASSET_PATH"
	assetPathDefault = "."
)

var (
	serverPort = portDefault
	assetPath  = assetPathDefault
)

type DBStruct struct {
	DBType     string
	DBHostname string
	DBPort     string
	DBName     string
	DBUsername string
	DBPassword string
	DBSSLMode  string
}

func init() {
	fmt.Println("Running init ...")
	serverPort = getenv.GetEnv(portEnv, portDefault)
	assetPath = getenv.GetEnv(assetPathEnv, assetPathDefault)
}

func GetAssetPath() string {
	return assetPath
}

func GetDBConf() *DBStruct {
	dbConf := &DBStruct{
		DBType:     "postgresql",
		DBHostname: "localhost",
		DBPort:     "5432",
		DBName:     "joyread",
		DBUsername: "postgres",
		DBPassword: "postgres",
		DBSSLMode:  "disable",
	}

	return dbConf
}

func GetServerPort() string {
	return serverPort
}
