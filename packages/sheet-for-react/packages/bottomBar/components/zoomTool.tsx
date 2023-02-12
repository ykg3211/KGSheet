import { TooltipPlacement } from 'antd/es/tooltip';
import React, { useContext, useMemo, useState } from 'react';
import { ZoomBar, toolBarColorType } from 'kgsheet';
import Icon from '../../icons/icon';
import { Tooltip } from 'antd';
import { SheetContext } from '../..';
import Popover from '../../components/popover';

interface Props {
  tool: ZoomBar;
  style: React.CSSProperties;
  toolTipPlacement?: TooltipPlacement;
  needLabel?: boolean;
}

const ZoomTool = ({ tool, style, needLabel = false, toolTipPlacement = 'top' }: Props) => {
  const { color } = useContext(SheetContext);
  const [visible, setVisible] = useState(false);

  const className = useMemo(() => {
    return [
      tool.class,
      'kgsheet_btn kgsheet_base_btn',
      tool.active ? 'kgsheet_active_color' : '',
      tool.disabled ? 'kgsheet_btn_disabled' : '',
    ].join(' ');
  }, [tool.class, tool.active]);

  const fontColor = tool.active ? 'rgb(76, 136, 255)' : color(toolBarColorType.black);

  return (
    <>
      <Tooltip placement={toolTipPlacement} title={tool.down.toolTip}>
        <span
          style={Object.assign(
            {
              ...style,
              color: fontColor,
              marginRight: 0,
            },
            tool.style,
          )}
          className={className}
          onClick={() => {
            !tool.disabled && tool.click(false);
          }}>
          <Icon icon={tool.down.icon} color={fontColor}></Icon>
          {needLabel && <span className='kgsheet_btn_label'>{tool.down.label}</span>}
        </span>
      </Tooltip>
      <Popover
        open={tool.disabled ? false : visible}
        onOpenChange={(v) => {
          setVisible(v);
        }}
        color={color(toolBarColorType.white)}
        triggerElm={
          <div
            className={
              'kgsheet_base_btn kgsheet_option' +
              (tool.disabled ? ' kgsheet_btn_disabled' : '' + ' kgsheet_flex_center')
            }
            style={{ color: color(toolBarColorType.black), width: '44px', margin: 0 }}>
            <span>{tool.value + '%'}</span>
          </div>
        }>
        <div style={{ color: color(toolBarColorType.black) }}>
          {tool.zoomOptions.map((v) => (
            <div
              className={
                'kgsheet_option_btn ' + (tool.value === v ? 'kgsheet_option_btn_active' : 'kgsheet_option_btn_normal')
              }
              onClick={() => {
                tool.selectZoom(v);
                setVisible(false);
              }}
              key={v}>
              {v + '%'}
            </div>
          ))}
        </div>
      </Popover>
      <Tooltip placement={toolTipPlacement} title={tool.up.toolTip}>
        <span
          style={Object.assign(
            {
              ...style,
              color: fontColor,
              marginLeft: 0,
            },
            tool.style,
          )}
          className={className}
          onClick={() => {
            !tool.disabled && tool.click(true);
          }}>
          <Icon icon={tool.up.icon} color={fontColor}></Icon>
          {needLabel && <span className='kgsheet_btn_label'>{tool.up.label}</span>}
        </span>
      </Tooltip>
    </>
  );
};
export default ZoomTool;
