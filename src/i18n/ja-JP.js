import counterpart from 'counterpart';

const translation = {
  carac: {
    'HP' : 'HP',
    'MP' : 'MP',
    'ATK' : '攻撃',
    'DEF' : '防御',
    'MAG' : '魔力',
    'SPR' : '精神',
    'RES_FIRE' : '火耐性',
    'RES_ICE' : '氷耐性',
    'RES_LIGHTNING' : '雷耐性',
    'RES_WATER' : '水耐性',
    'RES_WIND' : '風耐性',
    'RES_EARTH' : '土耐性',
    'RES_LIGHT' : '光耐性',
    'RES_DARK' : '闇耐性',
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

//counterpart.registerTranslations('ja-JP', require('counterpart/locales/jp'));
counterpart.registerTranslations('ja-JP', translation);
export default translation;
