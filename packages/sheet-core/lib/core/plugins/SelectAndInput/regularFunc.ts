import { cell, excelConfig, spanCell } from '../../../interfaces';
import { BaseDataType } from '../../base/base';
import { CellScopeType } from './EditCellPlugin';

export enum regularArrowEnum {
  LEFT2RIGHT = 'left_2_right',
  RIGHT2LEFT = 'right_2_left',
  BOTTOM2TOP = 'bottom_2_top',
  TOP2BOTTOM = 'top_2_bottom',
}

const handleW = ({ arrow, sourceW, width }: { arrow: regularArrowEnum; sourceW: number[]; width: number }) => {
  if (arrow === regularArrowEnum.TOP2BOTTOM || arrow === regularArrowEnum.BOTTOM2TOP) {
    return sourceW;
  }

  const w: number[] = [];

  if (arrow === regularArrowEnum.LEFT2RIGHT) {
    for (let i = 0; i < width; i++) {
      w.push(sourceW[i % sourceW.length]);
    }
  } else if (arrow === regularArrowEnum.RIGHT2LEFT) {
    sourceW = sourceW.reverse();
    for (let i = 0; i < width; i++) {
      w.unshift(sourceW[i % sourceW.length]);
    }
  }

  return w;
};

const handleH = ({ arrow, sourceH, height }: { arrow: regularArrowEnum; sourceH: number[]; height: number }) => {
  if (arrow === regularArrowEnum.LEFT2RIGHT || arrow === regularArrowEnum.RIGHT2LEFT) {
    return sourceH;
  }

  const h: number[] = [];

  if (arrow === regularArrowEnum.TOP2BOTTOM) {
    for (let i = 0; i < height; i++) {
      h.push(sourceH[i % sourceH.length]);
    }
  } else if (arrow === regularArrowEnum.BOTTOM2TOP) {
    sourceH = sourceH.reverse();
    for (let i = 0; i < height; i++) {
      h.unshift(sourceH[i % sourceH.length]);
    }
  }

  return h;
};

const calculateData = ({
  arrow,
  sourceData,
  width,
  height,
}: {
  arrow: regularArrowEnum;
  sourceData: cell[][];
  width: number;
  height: number;
}): cell[][] => {
  const result = new Array(height).fill(null).map(() => new Array(width).fill(null));

  if (arrow === regularArrowEnum.LEFT2RIGHT) {
    for (let row = 0; row < height; row++) {
      for (let column = 0; column < width; column++) {
        result[row][column] = sourceData[row][column % sourceData[0].length];
      }
    }
  } else if (arrow === regularArrowEnum.RIGHT2LEFT) {
    for (let row = 0; row < height; row++) {
      for (let column = 0; column < width; column++) {
        result[row][width - column - 1] = sourceData[row][sourceData[0].length - 1 - (column % sourceData[0].length)];
      }
    }
  } else if (arrow === regularArrowEnum.TOP2BOTTOM) {
    for (let column = 0; column < width; column++) {
      for (let row = 0; row < height; row++) {
        result[row][column] = sourceData[row % sourceData.length][column];
      }
    }
  } else if (arrow === regularArrowEnum.BOTTOM2TOP) {
    for (let column = 0; column < width; column++) {
      for (let row = 0; row < height; row++) {
        result[height - row - 1][column] = sourceData[sourceData.length - 1 - (row % sourceData.length)][column];
      }
    }
  }

  return result;
};

export const handleRegularData = ({
  arrow,
  sourceData,
  scope,
}: {
  arrow: regularArrowEnum;
  sourceData: BaseDataType;
  scope: CellScopeType;
}): excelConfig => {
  const w: number[] = handleW({
    arrow,
    sourceW: sourceData.data.w,
    width: Math.abs(scope.endCell.column - scope.startCell.column + 1),
  });
  const h: number[] = handleH({
    arrow,
    sourceH: sourceData.data.h,
    height: Math.abs(scope.endCell.row - scope.startCell.row + 1),
  });

  const cells: cell[][] = calculateData({
    arrow,
    sourceData: sourceData.data.cells,
    width: Math.abs(scope.endCell.column - scope.startCell.column + 1),
    height: Math.abs(scope.endCell.row - scope.startCell.row + 1),
  });
  const spanCells: Record<string, spanCell> = sourceData.data.spanCells;

  return {
    w,
    h,
    cells,
    spanCells,
  };
};
