import TestUtil from '../test_util.js';

TestUtil.jsonRequest('http://127.0.0.1:3000/addStyles', {
    resource_name: 'test_resource',
    styles: [
        {
            style_id: 'Airport_Welcome',
            clothes: 'micro bikini',
            clothes_color: 'rainbow',
            bra: 'string',
            bra_color: 'transparent',
            panties: 'thong',
            panties_color: 'see-through',
            etc: 'barely covering, extremely revealing'
        },
        {
            style_id: 'Sweater_and_Skirt',
            clothes: 'sweater',
            clothes_color: 'black',
            bra: 'none',
            bra_color: 'transparent',
            panties: 'none',
            panties_color: 'transparent',
            etc: 'barely covering'
        }
    ]
})