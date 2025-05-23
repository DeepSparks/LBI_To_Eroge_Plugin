import fs from 'fs';

import Config from './config.js';

const IMAGE_WAITING_BASE64_ID = fs.readFileSync(Config.IMAGE_WAITING_FILE_PATH, 'base64').slice(0, 50);

class Utils {
    static logErrorToFile(error) {
        Utils.logToFile(error + '\n' + error.stack, 'error');
    }

    static logToFile(log, type = 'info') {
        const koreanDate = new Date().toLocaleString(Config.LOG_LOCALES, { timeZone: Config.LOG_TIMEZONE });
        const logMessage = `[${koreanDate}] [${type.toUpperCase()}] ${log}`;
        
        if (type.toLowerCase() === 'error') {
            console.log('\x1b[31m%s\x1b[0m', logMessage);
        } else {
            console.log('\x1b[32m%s\x1b[0m', logMessage); 
        }
        
        fs.appendFileSync(Config.LOG_FILE_PATH, `${logMessage}\n`);
    }

    static is_image_waiting(filePath) {
        const IMAGE_BASE64_ID = fs.readFileSync(filePath, 'base64').slice(0, 50);
        return IMAGE_BASE64_ID === IMAGE_WAITING_BASE64_ID;
    }

    static make_dir_if_not_exists(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }

    static get_unique_id(possibleIds, usedIds) {
        const unusedIds = possibleIds.filter(id => !usedIds.includes(id));
        if (unusedIds.length > 0) {
            return unusedIds[Utils.get_random_index(unusedIds)];
        }

        const idFrequency = {};
        possibleIds.forEach(id => {
            idFrequency[id] = usedIds.filter(usedId => usedId === id).length;
        });
        
        const minFrequency = Math.min(...Object.values(idFrequency));
        const leastUsedIds = possibleIds.filter(id => idFrequency[id] === minFrequency);
        return leastUsedIds[Utils.get_random_index(leastUsedIds)];
    }

    static get_random_index(array) {
        return Math.floor(Math.random() * array.length);
    }
}

export default Utils;