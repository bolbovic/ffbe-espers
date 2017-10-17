import counterpart from 'counterpart';

const translation = {
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

//counterpart.registerTranslations('es-ES', require('counterpart/locales/es'));
counterpart.registerTranslations('es-ES', translation);
export default translation;
