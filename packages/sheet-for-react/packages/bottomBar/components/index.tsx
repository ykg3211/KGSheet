import { TooltipPlacement } from 'antd/es/tooltip';
import { BottomBaseTool, BottomToolTypeEnum } from 'kgsheet';
import React from 'react';
import ButtonTool from './buttonTool';
import ZoomTool from './zoomTool';

interface Props {
  tool: BottomBaseTool;
  toolTipPlacement?: TooltipPlacement;
  needLabel?: boolean;
}

const ComponentsMap: Record<BottomToolTypeEnum, any> = {
  [BottomToolTypeEnum.BUTTON]: ButtonTool,
  [BottomToolTypeEnum.ZOOM]: ZoomTool,
};

const Tool = (props: Props) => {
  const { tool } = props;
  const Components = ComponentsMap[tool.type];
  return Components && <Components {...props} />;
};

export default Tool;
