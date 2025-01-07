const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const dbFilePath = path.join(__dirname, 'data.json');
const twoMinutes = 2 * 60 * 1000; // 2 minutes in milliseconds


const calculateSeconds = (lastTimestamp) => {
  let currentTimestamp = Date.now();
  let seconds = Math.floor((currentTimestamp - lastTimestamp) / 1000);
  lastTimestamp = currentTimestamp;
  return seconds;
}

function monitorDbFile() {
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const dbData = JSON.parse(data);
    const now = Math.floor(Date.now() / 1000);

    Object.keys(dbData).forEach((key) => {
      const obj = dbData[key];
      const timestamp = obj.timestamp || obj.createdAt;

      if (timestamp && now - timestamp > twoMinutes) {
        delete dbData[key];
      }
    });

    fs.writeFile(dbFilePath, JSON.stringify(dbData, null, 2), (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
}

// Run the monitor function every minute
cron.schedule('*/1 * * * *', monitorDbFile);

// Initial run
monitorDbFile();
