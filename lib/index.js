import Excel from "./base/core";

export default {
  create: (dom) => {
    if (!dom) {
      console.error('dom is not a element');
      return;
    }
    const instance = new Excel(dom);
    window.excel = instance;
    return instance;
  }
};