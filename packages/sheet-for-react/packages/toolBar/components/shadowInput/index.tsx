import { colorType, EventConstant, getABC, ToolsEventConstant } from 'kgsheet';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { SheetContext } from '../../..';

function ShadowInput() {
  const { toolBar, sheet } = useContext(SheetContext);

  const [value, setValue] = useState('');
  const [cellPointer, setCellPointer] = useState('');

  useEffect(() => {
    if (toolBar) {
      toolBar.on(ToolsEventConstant.SET_SHADOW_INPUT, (v) => {
        setValue(v);
      });
      sheet.on(EventConstant.SELECT_CELLS_CHANGE, (selectedCells) => {
        if (selectedCells) {
          if (
            selectedCells.leftTopCell.column === selectedCells.rightBottomCell.column &&
            selectedCells.leftTopCell.row === selectedCells.rightBottomCell.row
          ) {
            const { column, row } = selectedCells.leftTopCell;
            setCellPointer(getABC(column) + '' + row);
          } else {
            const { column, row } = selectedCells.leftTopCell;
            const { column: _column, row: _row } = selectedCells.rightBottomCell;
            setCellPointer(getABC(column) + '' + row + ':' + getABC(_column) + '' + _row);
          }
        }
      });
    }
  }, [toolBar]);

  return (
    <div className='kgsheet_topBar_shadow' style={{ borderColor: sheet?.getColor(colorType.gray) }}>
      <div
        className='kgsheet_topBar_cell_pointer'
        style={{
          backgroundColor: sheet?.getColor(colorType.white),
          borderColor: sheet?.getColor(colorType.gray),
          color: sheet?.getColor(colorType.black),
        }}>
        {cellPointer}
      </div>
      <input
        style={{
          color: sheet?.getColor(colorType.black),
          backgroundColor: sheet?.getColor(colorType.white),
        }}
        className='kgsheet_topBar_shadowInput'
        type='text'
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        onFocus={() => {
          sheet.emit(ToolsEventConstant.SHADOW_INPUT_FOCUS);
        }}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          sheet.emit(ToolsEventConstant.SHADOW_INPUT_CHANGE, e.target.value);
        }}
      />
    </div>
  );
}

export default ShadowInput;
