import Excel from "./core"

export default (dom: any) => {
  const excel = new Excel(dom);
  return excel;
};