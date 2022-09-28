function getPreviewUrl(file) {
  var url; // @ts-ignore

  if (window.createObjectURL) {
    // @ts-ignore
    url = window.createObjectURL(file);
  }

  url = window.URL.createObjectURL(file);
  return url;
}

var getKey = function getKey() {
  return String(Math.random() * Date.now());
}; // 下载文件


var download = function download(file) {
  // @ts-ignore
  var trueFile = file.file || file;
  var url = getPreviewUrl(trueFile);
  var filename = trueFile.name;
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export { getPreviewUrl, getKey, download };