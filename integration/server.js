const path = require('path')
const { spawn } = require('child_process')

const SERVER_EXE = path.join(__dirname, '../main')
const serverReadyMsg = "Listening and serving HTTP on"

const startServer = (showLogs) => 
  new Promise((resolve, reject) => {
    const cp = spawn(SERVER_EXE, { cwd: path.join(__dirname, '../') });

    cp.stdout.on('data', data => {
      const logMsg = data.toString();
      if (showLogs === 'stdout' || showLogs == 'all')
        console.log('[stderr]', logMsg);
    })
    cp.stderr.on('data', data => {
      const logMsg = data.toString();
      if (showLogs === 'stderr' || showLogs == 'all')
        console.log('[stderr]', logMsg);
      if (logMsg.indexOf(serverReadyMsg) !== -1) {
        resolve({ kill: () => cp.kill() })
      }
    });

    cp.on('error', (err) => {
      reject(err);
    });
  });

module.exports = { startServer }

