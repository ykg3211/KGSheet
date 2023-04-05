import React, { useContext, useRef, useState } from 'react';
import { OptionBase, toolBarColorType } from 'kgsheet';
import { Tooltip } from 'antd';
import { SheetContext } from '../../..';
import Popover from '../../../components/popover';
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
          open={tool.disabled ? false : visible}
          onOpenChange={(v) => {
            setVisible(v);
          }}
          color={getColor(toolBarColorType.white)}
          triggerElm={
            <div
              className={'kgsheet_base_btn kgsheet_option' + (tool.disabled ? ' kgsheet_btn_disabled' : '')}
              style={{ color: getColor(toolBarColorType.black), width: '80px' }}>
              <span>{tool.valueLabel}</span>
              <Icon fontSize={16} icon='sheet-iconarrow-down' color={getColor(toolBarColorType.black)}></Icon>
            </div>
          }>
          <div style={{ color: getColor(toolBarColorType.black) }}>
            {tool.options.map((v) => (
              <div
                className={
                  'kgsheet_option_btn ' +
                  (tool.value === v.value ? 'kgsheet_option_btn_active' : 'kgsheet_option_btn_normal')
                }
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
