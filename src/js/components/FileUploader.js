const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;

class FileUploader {
  constructor() {
    this._callback = null;
    this._errorCallback = null;
  }

  init(dropZoneEl, fileInputEl) {
    this._dropZoneEl = dropZoneEl;
    this._fileInputEl = fileInputEl;

    dropZoneEl.addEventListener('dragover', e => {
      e.preventDefault();
      dropZoneEl.classList.add('drop-zone--dragover');
    });

    dropZoneEl.addEventListener('dragleave', () => {
      dropZoneEl.classList.remove('drop-zone--dragover');
    });

    dropZoneEl.addEventListener('drop', e => {
      e.preventDefault();
      dropZoneEl.classList.remove('drop-zone--dragover');
      const file = e.dataTransfer.files[0];
      if (file) this._handleFile(file);
    });

    fileInputEl.addEventListener('change', () => {
      const file = fileInputEl.files[0];
      if (file) this._handleFile(file);
      fileInputEl.value = '';
    });

    dropZoneEl.addEventListener('click', () => {
      fileInputEl.click();
    });
  }

  onFileSelected(callback) {
    this._callback = callback;
  }

  onError(callback) {
    this._errorCallback = callback;
  }

  _handleFile(file) {
    const isXmlMime = file.type === 'application/xml' || file.type === 'text/xml';
    if (!file.name.endsWith('.xml') && !isXmlMime) {
      this._emitError('XMLファイルを選択してください（.xml 拡張子）');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      this._emitError('ファイルサイズが大きすぎます（上限100MB）。別のファイルを選択してください');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      if (this._callback) {
        this._callback(e.target.result, file.name);
      }
    };
    reader.onerror = () => {
      this._emitError('ファイルの読み込みに失敗しました');
    };
    reader.readAsText(file, 'UTF-8');
  }

  _emitError(message) {
    if (this._errorCallback) {
      this._errorCallback(message);
    }
  }
}
