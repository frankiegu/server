package settings

import (
	"fmt"
	"io/ioutil"

	"gopkg.in/yaml.v2"

	cError "github.com/joyread/server/error"
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

// BaseStruct struct
type BaseStruct struct {
	ServerPort string
	AssetPath  string
}

type DBStruct struct {
	DBValues DBValuesStruct `yaml:"database"`
}

// DBStruct struct
type DBValuesStruct struct {
	DBType     string `yaml:"type" binding:"required"`
	DBHostname string `yaml:"hostname" binding:"required"`
	DBPort     string `yaml:"port" binding:"required"`
	DBName     string `yaml:"name" binding:"required"`
	DBUsername string `yaml:"username" binding:"required"`
	DBPassword string `yaml:"password" binding:"required"`
	DBSSLMode  string `yaml:"sslmode" binding:"required"`
}

func init() {
	fmt.Println("Running init ...")
	serverPort = getenv.GetEnv(portEnv, portDefault)
	assetPath = getenv.GetEnv(assetPathEnv, assetPathDefault)
}

// GetBaseConf ...
func GetBaseConf() *BaseStruct {
	baseConf := &BaseStruct{
		ServerPort: serverPort,
		AssetPath:  assetPath,
	}

	return baseConf
}

// GetDBConf ...
func GetDBConf() *DBStruct {
	yamlFile, err := ioutil.ReadFile("config/app.yaml")
	cError.CheckError(err)

	var dbConf DBStruct

	err = yaml.Unmarshal(yamlFile, &dbConf)
	cError.CheckError(err)

	return &dbConf
}
