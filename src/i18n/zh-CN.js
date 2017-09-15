import counterpart from 'counterpart';

const translation = {
  lang: {
    'en-US': 'English',
    'es-ES': 'Español',
    'fr-FR': 'Français',
    'de-DE': 'Deutsch',
    'ko-KR': '한국어',
    'zh-CN': '中文'
  }
};

//counterpart.registerTranslations('zh-CN', require('counterpart/locales/zh'));
counterpart.registerTranslations('zh-CN', translation);
export default translation;
