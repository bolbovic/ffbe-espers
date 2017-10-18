import counterpart from 'counterpart';

const translation = {
  carac: {
    'HP' : 'HP',
    'MP' : 'MP',
    'ATK' : '攻',
    'DEF' : '防',
    'MAG' : '魔',
    'SPR' : '精',
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

//counterpart.registerTranslations('zh-CN', require('counterpart/locales/zh'));
counterpart.registerTranslations('zh-CN', translation);
export default translation;
