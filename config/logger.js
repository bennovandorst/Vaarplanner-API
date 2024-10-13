import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

const getTimestamp = () => new Date().toISOString();

const getLogFileName = () => {
  const date = new Date().toISOString().split('T')[0];
  return path.join('logs', `server-${date}.log`);
};

const logToFile = (message) => {
  const logFileName = getLogFileName();
  fs.appendFileSync(logFileName, `${message}\n`);
};

const getColorFunction = (color) => {
  const colorFunctions = {
    white: chalk.white,
    yellow: chalk.yellow,
    green: chalk.bold.green,
    red: chalk.red,
    blue: chalk.blue,
  };

  return colorFunctions[color] || chalk.white;
};

const log = (message, color = 'white') => {
  const colorFn = getColorFunction(color);
  const coloredMessage = colorFn(message);
  console.log(coloredMessage);
  logToFile(message);
};

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

export default log;
export { getTimestamp };