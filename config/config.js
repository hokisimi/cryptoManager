var convict = require('convict');

var config = convict({

  env: {
    doc: "The applicaton environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV"
  },
  ip: {
    doc: "The IP address to bind.",
    format: "ipaddress",
    default: "127.0.0.1",
    env: "IP_ADDRESS",
    arg: "ip",
    sensitive: true
  },
  port: {
  doc: "The port to bind.",
  format: "port",
  default: 3000,
  env: "PORT",
  arg: "port",
  },
  session : {
    secret_key:{
      doc: "secret key",
      format: "*",
      default: "",
      env:"SECRET_KEY",
      arg: "session_secret_key"
    },
    cookie:{
      maxage : {
        doc: "session cookie maxage",
        format: "*",
        default: "",
        env:"COOKIE_MAXAGE",
        arg: "session_cookie_maxage"
      }
    }
  },
  api:{
    bithumb:{
      connect_key : {
        doc: "connect key",
        format: "*",
        default: "",
        env:"API_BITHUMB_CONNECT_KEY",
        arg: "api_bithumb_conn_key"

      },
      secret_key : {
        doc: "secret key",
        format: "*",
        default: "",
        env:"API_BITHUMB_SECRET_KEY",
        arg: "api_bithumb_secret_key"
      }
    }
  },
  cookie : {
    secret_key:{
      doc: "secret key",
      format: "*",
      default: "keyboard cat",
      env:"SECRET_KEY",
      arg: "cookie_secret_key"
    },
  },
  database: {
    host: {
      doc: "Database host name/IP",
      format: "*",
      default: "localhost",
      env: "DB_HOST"
    },
    port: {
      doc: "Database port",
      format: "port",
      default: 3306,
      env: "DB_PORT"
    },
    user: {
      doc: "Database username",
      format: "*",
      default: "root",
      env: "DB_USER"
    },
    password: {
      doc: "Database password",
      format: "*",
      default: "",
      env: "DB_PASSWORD"
    },
    name: {
      doc: "Database name",
      format: "*",
      default: "crytoManager",
      env: "DB_NAME"
    }
  }
});

// database config file
config.loadFile('config/db-config.json');
// session config file
config.loadFile('config/session-config.json');
// cookie config file
config.loadFile('config/cookie-config.json');
// api config file
config.loadFile('config/api-config.json');

// Perform validation
config.validate({allowed: 'strict'});

module.exports = config;
