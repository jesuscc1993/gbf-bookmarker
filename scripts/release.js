const { copyFolder, createPath, remove } = require('./file-utils');

const buildPath = 'build';
const assetsPath = 'assets';
const srcPath = 'src';
const vendorPath = 'vendor';
const manifestPath = 'manifest.json';

const blacklistedExtensions = ['scss', 'css.map'];

const run = () => {
  remove(buildPath);
  createPath(buildPath);

  copyToBuildFolder(assetsPath);
  copyToBuildFolder(manifestPath);
  copyToBuildFolder(srcPath);
  copyToBuildFolder(vendorPath);

  removeBlacklistedFiles();
};

const copyToBuildFolder = (path) => {
  copyFolder(`${path}`, `${buildPath}/${path}`);
};

const removeBlacklistedFiles = () => {
  blacklistedExtensions.forEach((blacklistedExtension) => {
    remove(`${buildPath}/**/*.${blacklistedExtension}`);
  });
};

run();
