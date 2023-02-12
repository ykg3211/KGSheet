import React, { useContext, useRef, useState } from 'react';
import { toolBarColorType, ColorBase } from 'kgsheet';
import { Tooltip } from 'antd';
import { SheetContext } from '../../..';
import { TooltipPlacement } from 'antd/es/tooltip';
import Icon from '../../../icons/icon';
import Popover from '../../../components/popover';

interface Props {
  tool: ColorBase;
  toolTipPlacement?: TooltipPlacement;
  style: React.CSSProperties;
}

const ColorTool = ({ tool, toolTipPlacement = 'bottom' }: Props) => {
  const { color: getColor } = useContext(SheetContext);
  const [visible, setVisible] = useState(false);
  const inputColor = useRef(null);

  const clickItem = (item: any) => {
    setVisible(false);
    tool.click(item);
  };

  return (
    <Tooltip placement={toolTipPlacement} title={tool.toolTip}>
      <div className={'kgsheet_base_btn kgsheet_color_btn_container' + (tool.disabled ? ' kgsheet_btn_disabled' : '')}>
        <div
          className='kgsheet_color_btn'
          style={{ color: getColor(toolBarColorType.black) }}
          onClick={() => {
            !tool.disabled && clickItem(tool.value);
          }}>
          <Icon fontSize={16} icon={tool.icon} color={getColor(toolBarColorType.black)}></Icon>
          <span style={{ backgroundColor: tool.value }} className='kgsheet_color_bar'></span>
        </div>
        <Popover
          open={tool.disabled ? false : visible}
          onOpenChange={(v) => {
            setVisible(v);
          }}
          color={getColor(toolBarColorType.white)}
          triggerElm={
            <div
              className='kgsheet_base_btn kgsheet_color_sm_arrow'
              style={{ color: getColor(toolBarColorType.black) }}>
              <Icon fontSize={10} icon='sheet-iconarrow-down' color={getColor(toolBarColorType.black)}></Icon>
            </div>
          }>
          <div>
            <div className='kgsheet_color_store_container' style={{ color: getColor(toolBarColorType.black) }}>
              {tool.colorStore.map((colors, i) => (
                <div key={i} className='kgsheet_color_store_row'>
                  {colors.map((color) => (
                    <div
                      key={color}
                      onClick={() => {
                        clickItem(color);
                      }}
                      className='kgsheet_color_panel'
                      style={{ backgroundColor: color }}>
                      {color === tool.value && (
                        <Icon className='kgsheet_color_panel_selected' fontSize={18} icon='sheet-iconselect'></Icon>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {Boolean(tool.recentColorStore.length) && (
              <span className='kgsheet_recent_color_span' style={{ color: getColor(toolBarColorType.black) }}>
                最近使用
              </span>
            )}
            <div className='kgsheet_recent_color_row'>
              {tool.recentColorStore.map((color, i) => (
                <div
                  key={color}
                  onClick={() => {
                    clickItem(color);
                  }}
                  className='kgsheet_color_panel'
                  style={{ backgroundColor: color }}>
                  {color === tool.value && (
                    <Icon className='kgsheet_color_panel_selected' fontSize={18} icon='sheet-iconselect'></Icon>
                  )}
                </div>
              ))}
            </div>
            <div
              className='kgsheet_more_color kgsheet_base_btn'
              onClick={() => {
                inputColor.current.click();
              }}>
              <div className='kgsheet_more_color_label'>
                <span style={{ color: getColor(toolBarColorType.black) }}>更多颜色</span>
                <Icon color={getColor(toolBarColorType.black)} fontSize={14} icon='sheet-iconarrow-right'></Icon>
              </div>
              <input
                ref={inputColor}
                className='kgsheet_more_color_input'
                onChange={() => {
                  tool.changeColor(inputColor.current.value);
                }}
                type='color'
              />
            </div>
          </div>
        </Popover>
      </div>
    </Tooltip>
  );
};
export default ColorTool;
