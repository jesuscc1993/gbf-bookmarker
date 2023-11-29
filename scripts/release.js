const { copyFileSync, mkdirSync } = require('fs');
const { sync: rimrafSync } = require('rimraf');

const buildPath = 'build';
const assetsPath = 'assets';
const srcPath = 'src';
const vendorPath = 'vendor';
const manifestPath = 'manifest.json';

const run = () => {
  remove(buildPath);
  mkdirSync(buildPath);

  copyToBuildFolder(assetsPath);
  copyToBuildFolder(manifestPath);
  copyToBuildFolder(srcPath);
  copyToBuildFolder(vendorPath);
};

const copyToBuildFolder = (path) => {
  copy(path, `${buildPath}/${path}`);
};

const copy = (source, destination) => {
  copyFileSync(source, destination);
};

const remove = (path) => {
  rimrafSync(path);
};

run();
