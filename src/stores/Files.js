import { action, observable } from 'mobx';

import Store from './Store';

export default class FilesStore extends Store {
  @observable files = {};

  @action
  init(fileList) {
    fileList.forEach(file => {
      if (!this.files[file.Name]) {
        this.files[file.Name] = {};
      }
      this.files[file.Name][file.Region] = {
        fileName: file.Filename,
        key: file.Key,
        isLocalizedText: file.IsLocalizedText,
        version: file.FileVersion
      };
    });
  }
}
