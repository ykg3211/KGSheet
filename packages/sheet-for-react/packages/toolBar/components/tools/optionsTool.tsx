import React, { useContext, useRef, useState } from 'react';
import { Tooltip } from 'antd';
import OptionBase from 'kgsheet/dist/toolBar/tools/base/optionBase';
import { SheetContext } from '../../..';
import { colorType } from 'kgsheet/dist/toolBar/plugins/DarkMode.ts';
import Popover from '../popover';
import { TooltipPlacement } from 'antd/es/tooltip';
import Icon from '../../../icons/icon';

interface Props {
  tool: OptionBase;
  toolTipPlacement?: TooltipPlacement;
  style: React.CSSProperties;
}

const OptionsTool = ({ tool, toolTipPlacement = 'top' }: Props) => {
  const { color: getColor } = useContext(SheetContext);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  const clickItem = (item: any) => {
    setVisible(false);
    tool.click(item);
  };

  return (
    <Tooltip placement={toolTipPlacement} title={tool.toolTip}>
      <div ref={ref}>
        <Popover
          open={visible}
          onOpenChange={(v) => {
            setVisible(v);
          }}
          color={getColor(colorType.white)}
          triggerElm={
            <div className='kgsheet_option' style={{ color: getColor(colorType.black), width: '80px' }}>
              <span>{tool.valueLabel}</span>
              <Icon fontSize={16} icon='sheet-iconarrow-down' color={getColor(colorType.black)}></Icon>
            </div>
          }>
          <div style={{ color: getColor(colorType.black) }}>
            {tool.options.map((v) => (
              <div
                className='kgsheet_option_btn'
                onClick={() => {
                  clickItem(v);
                }}
                key={v.value}>
                {v.label}
              </div>
            ))}
          </div>
        </Popover>
      </div>
    </Tooltip>
  );
};
export default OptionsTool;
