const { copyFolder, createPath, remove } = require('./file-utils');
const { execute } = require('./cmd-utils');

const buildPath = 'build';
const assetsPath = 'assets';
const srcPath = 'src';
const vendorPath = 'vendor';
const manifestPath = 'manifest.json';
const packagePath = 'package.json';

const blacklistedExtensions = ['scss', 'css.map'];

const run = async () => {
  remove(buildPath);
  createPath(buildPath);

  copyToBuildFolder(assetsPath);
  copyToBuildFolder(manifestPath);
  copyToBuildFolder(srcPath);
  copyToBuildFolder(vendorPath);

  removeBlacklistedFiles();

  execute('git checkout release');

  remove(assetsPath);
  remove(manifestPath);
  remove(srcPath);
  remove(vendorPath);
  remove(packagePath);

  copyFolder(buildPath, `.`);
  remove(buildPath);
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
