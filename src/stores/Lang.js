import counterpart from 'counterpart';
import { action, observable } from 'mobx';

import Store from './Store'

import '../i18n/de-DE'
import '../i18n/en-US'
import '../i18n/es-ES'
import '../i18n/fr-FR'
import '../i18n/ko-KR'
import '../i18n/zh-CN'

export const LANG_EN_US = 'en-US';
export const LANG_LIST = [
  'en-US',
  'zh-CN',
  'ko-KR',
  'fr-FR',
  'de-DE',
  'es-ES',
];


export default class LangStore extends Store {
  @observable langIdx = 0;
  @observable lang;
  @observable langShort;

  init(defaultLang = LANG_EN_US) {
    this.changeLang(defaultLang);
  }

  t = (...args) => {
    return counterpart.translate(...args);
  };

  @action changeLang = (lang) => {
    counterpart.setLocale(lang);
    this.lang = lang;
    this.langIdx = LANG_LIST.indexOf( lang );
  }
}