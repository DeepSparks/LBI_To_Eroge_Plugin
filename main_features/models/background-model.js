import { TranslateInterface } from '../interfaces/index.js';
import Config from '../config.js';

class BackgroundModel {
    constructor(req_body) {
        this.background_id = req_body.background_id || '';
        this.setting_type = req_body.setting_type || '';
        this.location = req_body.location || '';
        this.time_period = req_body.time_period || '';
        this.season = req_body.season || '';
        this.weather = req_body.weather || '';
        this.special_features = req_body.special_features || '';
        this.etc = req_body.etc || '';

        for(let [key, value] of Object.entries(Config.TAG_VALUE_OVERRIDE_MAP)) {
            if(this[key]) this[key] = value;
        }
    }

    static async translateReqBody(reqBody) {
        for (let key of ['setting_type', 'location', 'time_period', 'season', 'weather', 'special_features', 'etc']) {
            if(/[^\x00-\x7F]/.test(reqBody[key])) {
                reqBody[key] = await TranslateInterface.translateText('auto', 'en', reqBody[key]);
                reqBody[key] = reqBody[key].toLowerCase();
            }
        }
    }

    toJsonDict() {
        return {...this};
    }

    toPrompt() {
        return [this.setting_type, this.location, this.time_period, this.season, this.weather, this.special_features, this.etc].filter(attr => attr).join(', ').toLowerCase();
    }
}

export default BackgroundModel;