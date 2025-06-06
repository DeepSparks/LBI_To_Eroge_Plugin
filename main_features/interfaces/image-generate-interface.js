import fs from 'fs';

import { GlobalQueueUtil, ImageQueueUtil } from '../queue_utils/index.js';
import Utils from '../utils.js';
import { ImageModel } from '../models/index.js';
import { ImageMemoryInterface } from '../interfaces/index.js';
import Config from '../config.js';

class ImageGenerateInterface {
    static async generateImages(imageModels, is_ignore_cache=false) {
        const urls = [];
        for (const imageModel of imageModels) {
            const url = await this.generateImage(new ImageModel(imageModel), is_ignore_cache);
            urls.push(url);
        }
        return urls;
    }
    
    static async generateImage(imageModel, is_ignore_cache=false) {
        if(!Config.IMAGE_GENERATION_SERVER_URL) {
            Utils.logToFile('Image Generation Server url is not set. Please set it in the config.js file.', 'error');
            return null;
        }

        Utils.make_dir_if_not_exists(imageModel.toDirPath());
        if(!fs.existsSync(imageModel.toFilePath())) {
            fs.copyFileSync(Config.IMAGE_WAITING_FILE_PATH, imageModel.toFilePath());
        }

        if(Config.IS_USE_GLOBAL_QUEUE) {
            GlobalQueueUtil.addRequest({
                type: 'image',
                data: imageModel,
                is_ignore_cache: is_ignore_cache
            });
        } else {
            ImageQueueUtil.addRequest({
                type: 'image',
                data: imageModel,
                is_ignore_cache: is_ignore_cache
            });
        }

        return imageModel.toFilePath();
    }

    static async waitUntilImagesGenerated(imageModels) {
        const urls = [];
        for (const imageModel of imageModels) {
            const filePath = (new ImageModel(imageModel)).toFilePath();
            while (!this.isImageCompleted(filePath)) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            urls.push(filePath);
        }
        return urls;
    }

    static checkImageCompletions(imageModels) {
        const completions = [];
        for (const imageModel of imageModels) {
            const filePath = (new ImageModel(imageModel)).toFilePath();
            completions.push({
                filePath: filePath,
                isCompleted: this.isImageCompleted(filePath)
            });
        }
        return completions;
    }

    static isImageCompleted(filePath) {
        return fs.existsSync(filePath) && !Utils.is_image_waiting(filePath);
    }

    static async reGenerateImages(imageModels) {
        const loadedImageModels = []
        for (const imageModel of imageModels) {
            const loadedImageModel = ImageMemoryInterface.getImage(imageModel, imageModel.resource_name);
            fs.rmSync(loadedImageModel.toFilePath());
            loadedImageModels.push(loadedImageModel.toJsonDict());
        }

        const urls = await this.generateImages(loadedImageModels, true);
        return {urls, imageModels: loadedImageModels};
    }
}

export default ImageGenerateInterface;