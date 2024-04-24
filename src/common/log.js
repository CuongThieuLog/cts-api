const fs = require("fs");
const moment = require("./moment");
const constants = require("./constants");
const logPath = "src/storage/logs/";

const debug = function (messsage) {
  let option = getLogOption();

  return writeLog(option.fileName, messsage, "DEBUG", option.useConsole);
};

const error = function (messsage) {
  let option = getLogOption();

  return writeLog(option.fileName, messsage, "ERROR", option.useConsole);
};

function getLogOption() {
  let useConsole = false;
  var fileName;
  switch (constants.LOG_CHANNEL) {
    case "single":
      fileName = "nodejs.log";
      break;
    case "daily":
      fileName = "nodejs-" + moment().format("Y-MM-DD") + ".log";
      break;
    case "console":
      useConsole = true;
      break;
  }

  if (fileName) {
    fileName = logPath + fileName;
  }

  return { fileName, useConsole };
}

function writeLog(fileName, messsage, logText, useConsole) {
  let outputMessage =
    "[" + moment().format("Y-MM-DD HH:mm:ss") + "] LOG " + logText + " : ";
  if (messsage instanceof Error) {
    outputMessage += messsage.stack;
  } else {
    outputMessage += messsage;
  }

  if (useConsole) {
    console.log(outputMessage);
  }

  if (fileName) {
    fs.writeFileSync(fileName, outputMessage + `\n`, { flag: "a" });
  }

  return true;
}

module.exports = {
  debug: debug,
  error: error,
};
