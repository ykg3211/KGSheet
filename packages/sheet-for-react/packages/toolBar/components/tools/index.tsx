import { TooltipPlacement } from 'antd/es/tooltip';
import { BaseTool, ToolTypeEnum } from 'kgsheet/dist/toolBar/tools/base';
import React from 'react';
import ButtonTool from './buttonTool';
import OptionsTool from './optionsTool';

interface Props {
  tool: BaseTool;
  style: React.CSSProperties;
  toolTipPlacement?: TooltipPlacement;
  needLabel?: boolean;
}

const ComponentsMap: Record<ToolTypeEnum, any> = {
  [ToolTypeEnum.BUTTON]: ButtonTool,
  [ToolTypeEnum.OPTION]: OptionsTool,
};

const Tool = (props: Props) => {
  const { tool } = props;
  const Components = ComponentsMap[tool.type];
  return <Components {...props} />;
};

export default Tool;
