const { execSync } = require('child_process');

const execute = (command) => {
  try {
    execSync(command);
  } catch (error) {
    console.error(error);
  }
};

exports.execute = execute;
