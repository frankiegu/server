package settings

import (
	"fmt"
	"io/ioutil"

	"gopkg.in/yaml.v2"

	cError "github.com/joyread/server/error"
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

var conf BaseStruct

// BaseStruct struct
type BaseStruct struct {
	BaseValues BaseValuesStruct `yaml:"server" binding:"required"`
}

type BaseValuesStruct struct {
	ServerPort string         `yaml:"port" binding:"required"`
	AssetPath  string         `yaml:"asset_path" binding:"required"`
	DBValues   DBValuesStruct `yaml:"database" binding:"required"`
}

// DBValuesStruct struct
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
	yamlFile, err := ioutil.ReadFile("config/app.yaml")
	cError.CheckError(err)

	err = yaml.Unmarshal(yamlFile, &conf)
	cError.CheckError(err)
}

func GetConf() *BaseStruct {
	return &conf
}
