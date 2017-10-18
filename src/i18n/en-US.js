import counterpart from 'counterpart';

const translation = {
  carac: {
    'HP' : 'HP',
    'MP' : 'MP',
    'ATK' : 'ATK',
    'DEF' : 'DEF',
    'MAG' : 'MAG',
    'SPR' : 'SPR',
    'RES_FIRE' : 'Fire Res.',
    'RES_ICE' : 'Ice Res.',
    'RES_LIGHTNING' : 'Lightning Res.',
    'RES_WATER' : 'Water Res.',
    'RES_WIND' : 'Wind Res.',
    'RES_EARTH' : 'Earth Res.',
    'RES_LIGHT' : 'Light Res.',
    'RES_DARK' : 'Dark Res.',
  },
  lang: {
    'en-US': 'English',
    'es-ES': 'Español',
    'fr-FR': 'Français',
    'de-DE': 'Deutsch',
    'ko-KR': '한국어',
    'ja-JP': '日本語',
    'zh-CN': '中文'
  }
};

counterpart.registerTranslations('en-US', require('counterpart/locales/en'));
counterpart.registerTranslations('en-US', translation);
export default translation;
