import { colorType, ToolsEventConstant } from 'kgsheet';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { SheetContext } from '../../..';

function ShadowInput() {
  const { toolBar, sheet } = useContext(SheetContext);

  const [value, setValue] = useState('');

  useEffect(() => {
    if (toolBar) {
      toolBar.on(ToolsEventConstant.SET_SHADOW_INPUT, (v) => {
        setValue(v);
      });
    }
  }, [toolBar]);

  return (
    <div className='kgsheet_topBar_shadow' style={{ borderColor: sheet?.getColor(colorType.gray) }}>
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
