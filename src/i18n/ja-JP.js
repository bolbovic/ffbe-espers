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

//counterpart.registerTranslations('ja-JP', require('counterpart/locales/jp'));
counterpart.registerTranslations('ja-JP', translation);
export default translation;
