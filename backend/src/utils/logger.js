import chalk from "chalk";
import fs from "fs";
import path from "path";

//declare __dirname
const __dirname = path.resolve();

class Logger {

  //make a directory for log
  static directoryPath = path.join(__dirname, "./logs");

  static loglevel = {
    success: { color: chalk.green.bold, folder: "base" },
    info: { color: chalk.blue, folder: "base" },
    warn: { color: chalk.hex("#FF5F15"), folder: "base" },
    error: { color: chalk.red.bold, folder: "error" },
  };


  static filename = Date.now() + ".log";

  constructor () {
    console.clear();

    if (!fs.existsSync(Logger.directoryPath)) {
      fs.mkdirSync(Logger.directoryPath);
    }
    // if (!fs.existsSync(Logger.directoryPath + "/base")) {
    //   fs.mkdirSync(Logger.directoryPath + "/base");
    // }

    // if (!fs.existsSync(Logger.directoryPath + "/error")) {
    //   fs.mkdirSync(Logger.directoryPath + "/error");
    // }
  }

  static timestamp() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return hours + ":" + minutes + ":" + seconds;
  }

  static writeonfile(level, message, logpath) {
    const tsl = level.charAt(0).toUpperCase() + level.slice(1);
    const directoryPath = path.join(__dirname, "./logs");
    // const directoryPath = path.join(__dirname, "./logs" + "/" + logpath);
    // if(logpath !== "base") {
    //     const basepath = path.join(__dirname, "./logs" + "/base");
    // }
    const filepath = directoryPath + "/" + Logger.filename;
    const nowdate = new Date();
    const data = nowdate.toUTCString() + " | " + tsl + " | " + message + "\n";
    fs.appendFile(filepath, data, function(err) {
      if (err) {
        return console.log(err);
      }
    });

  }

  static log(level, message) {
    if (!level || !Logger.loglevel[level]) { level = "info"; }
    if (!Logger.loglevel[level].color) return console.log("Invalid log level: " + level);
    Logger.writeonfile(level, message, Logger.loglevel[level].folder);
    const tsl = level.charAt(0).toUpperCase() + level.slice(1);
    console.log(Logger.loglevel[level].color(Logger.timestamp() + " | " + tsl + " | " + message));
  }
}

const logger = new Logger();

export default Logger.log;
