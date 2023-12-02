const { copyFileSync, cpSync, mkdirSync } = require('fs');
const { sync: rimrafSync } = require('rimraf');

const copyFile = (source, destination) => {
  copyFileSync(source, destination);
};

const copyFolder = (source, destination) => {
  cpSync(source, destination, { recursive: true });
};

const createPath = (path) => {
  mkdirSync(path, { recursive: true });
};

const remove = (path) => {
  rimrafSync(path);
};

exports.copyFile = copyFile;
exports.copyFolder = copyFolder;
exports.createPath = createPath;
exports.remove = remove;
