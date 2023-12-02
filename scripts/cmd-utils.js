const { exec } = require('child_process');

const execute = (command) => {
  exec(command, (error) => {
    if (error) {
      console.error(error);
    }
  });
};

exports.execute = execute;
