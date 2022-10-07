import Excel from "./core";
import SideBarResizePlugin from "./plugins/SideBarResizePlugin";
import createDefaultData from "./utils/defaultData";

export default Excel;
const plugin = {
  SideBarResizePlugin
}
export {
  createDefaultData,
  plugin
}