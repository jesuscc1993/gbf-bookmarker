const { exec } = require('child_process');

const execute = async (command) => {
  try {
    await exec(command);
  } catch (error) {
    console.error(error);
  }
};

exports.execute = execute;
