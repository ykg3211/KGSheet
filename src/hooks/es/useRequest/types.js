// D: Data
// P: Params
// S: state
// A: action
// tips: 写一个函数前,要先明确输入输出的类型.
// 类型要求:
// 1. 传入一个异步函数,如果异步函数有明确的返回类型,则 useRequest 返回的 data 的类型应跟它保持一致
// 2. 传入一个异步函数,如果异步函数有明确的形参类型,则 useRequest 返回的 run 的实参应跟它保持一致
export var Mode;
/** 下拉加载 */

(function (Mode) {
  Mode["loadMore"] = "loadMore";
  Mode["pagination"] = "pagination";
  Mode["search"] = "search";
})(Mode || (Mode = {}));