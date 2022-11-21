import { cell, CellTypeEnum, excelConfig } from '../interfaces';

interface tableElement {
  tag: string;
  attrs: Record<string, string>;
  children: Array<tableElement | string>;
  parent?: null | tableElement;
}

function parseAttrs(v: string) {
  const result: Record<string, string> = {};

  let key = '';
  let value = '';
  const source = v.split('');
  let current = source.shift();
  let temp: string[] = [];
  let state = 'end';
  while (current) {
    if (current === '=') {
      key = temp.join('').trim();
      temp = [];
    } else if (current === '"' || current === "'") {
      if (state === 'end') {
        state = 'start';
      } else {
        state = 'end';
        value = temp.join('');
        result[key] = value;
        temp = [];
      }
    } else {
      temp.push(current);
    }

    current = source.shift();
  }
  return result;
}

function parseHtml(html: string) {
  const result: tableElement = {
    tag: '.',
    children: [],
    parent: null,
    attrs: {},
  };
  // 指针
  let point = result;

  const source: string[] = html.split('');
  let stack: string[] = [];

  let temp: string[] = [];
  let state = 'end';
  let current = source.shift();
  while (current) {
    if (current === '<') {
      state = 'start';

      if (temp.join('')) {
        point.children.push(temp.join(''));
      }

      temp = [];
    } else if (current === '>') {
      let tag = temp.join('').split(' ').slice(1).join(' ');
      const elementTag = temp.join('').split(' ').shift();

      if (elementTag) {
        if (!elementTag?.startsWith('/')) {
          const newElement: tableElement = {
            tag: elementTag,
            attrs: parseAttrs(tag),
            parent: point,
            children: [],
          };
          point.children.push(newElement);
          if (elementTag !== 'col') {
            point = newElement;
            stack.unshift(elementTag);
          }
        } else {
          if (stack[0] === elementTag.split('').slice(1).join('')) {
            stack.shift();
            point = point.parent || point;
          } else {
            throw new Error('Invalid HTML: ' + stack[0] + '_' + elementTag);
          }
        }
      }
      temp = [];
      state = 'end';
    } else if (state === 'start') {
      temp.push(current);
    } else if (state === 'end') {
      temp.push(current);
    }

    current = source.shift();
  }

  return point;
}

function findTag(root: tableElement, tag: string) {
  const nodes = [root];
  while (nodes.length > 0) {
    const node = nodes.shift();
    if (node?.tag === tag) {
      return node;
    } else {
      node?.children.forEach((subNode) => {
        if (typeof subNode !== 'string') {
          nodes.push(subNode);
        }
      });
    }
  }
  return null;
}

export function html2excel(html: string) {
  const root = parseHtml(html);
  const tbodyNode = findTag(root, 'tbody');
  if (!tbodyNode) {
    return null;
  }
  const cells: excelConfig['cells'] = [];
  const w: number[] = [];
  const h: number[] = [];
  tbodyNode.children.forEach((tr, r) => {
    const row: cell[] = [];
    if (typeof tr !== 'string') {
      tr.children.forEach((td, c) => {
        if (typeof td !== 'string') {
          row.push({
            style: {},
            content: td.children[0]?.toString?.() || '',
            type: CellTypeEnum.text,
          });
        }
      });
    }
    cells.push(row);
  });
  const result: excelConfig = {
    w: [],
    h: [],
    cells,
    spanCells: {},
  };
  return result;
}
