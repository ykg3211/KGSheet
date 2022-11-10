export enum BASE_KEYS_ENUM {
  Alt = "Alt",
  Control = "Control",
  Meta = "Meta",
  Shift = "Shift",
}

export const BASE_KEYS: Record<BASE_KEYS_ENUM, boolean> = {
  Shift: true,
  Control: true,
  Meta: true,
  Alt: true,
}

export enum OPERATE_KEYS_ENUM {
  ArrowDown = "ArrowDown",
  ArrowLeft = "ArrowLeft",
  ArrowRight = "ArrowRight",
  ArrowUp = "ArrowUp",
  Backspace = "Backspace",
  CapsLock = "CapsLock",
  End = "End",
  Enter = "Enter",
  Escape = "Escape",
  Home = "Home",
  PageDown = "PageDown",
  PageUp = "PageUp",
  Tab = "Tab",
  q = "q",
  a = "a",
  z = "z",
  w = "w",
  s = "s",
  x = "x",
  e = "e",
  d = "d",
  c = "c",
  r = "r",
  f = "f",
  v = "v",
  t = "t",
  g = "g",
  b = "b",
  y = "y",
  h = "h",
  n = "n",
  u = "u",
  j = "j",
  m = "m",
  i = "i",
  k = "k",
  o = "o",
  l = "l",
  p = "p",
}
export const OPERATE_KEYS: Partial<Record<OPERATE_KEYS_ENUM, boolean>> = {
  Escape: true,
  Enter: true,
  ArrowUp: true,
  ArrowDown: true,
  ArrowRight: true,
  ArrowLeft: true,
  End: true,
  PageDown: true,
  PageUp: true,
  Home: true,
  Tab: true,
  Backspace: true,
  CapsLock: true,
}

export const CONTENT_KEYS = {
  "0": true,
  "1": true,
  "2": true,
  "3": true,
  "4": true,
  "5": true,
  "6": true,
  "7": true,
  "8": true,
  "9": true,
  "q": true,
  "a": true,
  "z": true,
  "w": true,
  "s": true,
  "x": true,
  "e": true,
  "d": true,
  "c": true,
  "r": true,
  "f": true,
  "v": true,
  "t": true,
  "g": true,
  "b": true,
  "y": true,
  "h": true,
  "n": true,
  "u": true,
  "j": true,
  "m": true,
  "i": true,
  "k": true,
  ",": true,
  "o": true,
  "l": true,
  ".": true,
  "p": true,
  ";": true,
  "/": true,
  "[": true,
  "'": true,
  "]": true,
  "\\": true,
  "-": true,
  "=": true,
  "Shift": true,
  "+": true,
  "_": true,
  ")": true,
  "(": true,
  "*": true,
  "&": true,
  "^": true,
  "%": true,
  "$": true,
  "#": true,
  "@": true,
  "!": true,
  "Q": true,
  "{": true,
  "}": true,
  "|": true,
  "\"": true,
  ":": true,
  "?": true,
  ">": true,
  "<": true,
  "`": true,
  "~": true,
  "A": true,
  "Z": true,
  "W": true,
  "S": true,
  "X": true,
  "E": true,
  "D": true,
  "C": true,
  "R": true,
  "F": true,
  "V": true,
  "T": true,
  "G": true,
  "B": true,
  "Y": true,
  "H": true,
  "N": true,
  "U": true,
  "J": true,
  "M": true,
  "I": true,
  "K": true,
  "O": true,
  "L": true,
  "P": true,
}