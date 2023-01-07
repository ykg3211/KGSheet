import React, { useContext, useRef, useState } from 'react';
import { colorType, ColorBase } from 'kgsheet';
import { Tooltip } from 'antd';
import { SheetContext } from '../../..';
import Popover from '../popover';
import { TooltipPlacement } from 'antd/es/tooltip';
import Icon from '../../../icons/icon';

interface Props {
  tool: ColorBase;
  toolTipPlacement?: TooltipPlacement;
  style: React.CSSProperties;
}

const ColorTool = ({ tool, toolTipPlacement = 'bottom' }: Props) => {
  const { color: getColor } = useContext(SheetContext);
  const [visible, setVisible] = useState(false);

  const clickItem = (item: any) => {
    setVisible(false);
    tool.click(item);
  };

  return (
    <Tooltip placement={toolTipPlacement} title={tool.toolTip}>
      <div className='kgsheet_base_btn kgsheet_color_btn_container'>
        <div
          className='kgsheet_color_btn'
          style={{ color: getColor(colorType.black) }}
          onClick={() => {
            clickItem(tool.value);
          }}>
          <Icon fontSize={16} icon={tool.icon} color={getColor(colorType.black)}></Icon>
          <span style={{ backgroundColor: tool.value }} className='kgsheet_color_bar'></span>
        </div>
        <Popover
          open={visible}
          onOpenChange={(v) => {
            setVisible(v);
          }}
          color={getColor(colorType.white)}
          triggerElm={
            <div className='kgsheet_base_btn kgsheet_color_sm_arrow' style={{ color: getColor(colorType.black) }}>
              <Icon fontSize={10} icon='sheet-iconarrow-down' color={getColor(colorType.black)}></Icon>
            </div>
          }>
          <div className='kgsheet_color_store_container' style={{ color: getColor(colorType.black) }}>
            {tool.colorStore.map((colors, i) => (
              <div key={i} className='kgsheet_color_store_row'>
                {colors.map((color) => (
                  <div
                    key={color}
                    onClick={() => {
                      clickItem(color);
                    }}
                    className='kgsheet_color_panel'
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            ))}
          </div>
        </Popover>
      </div>
    </Tooltip>
  );
};
export default ColorTool;
