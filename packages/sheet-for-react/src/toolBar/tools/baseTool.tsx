import React, { useEffect } from 'react';
import { UndoOutlined, RedoOutlined } from '@ant-design/icons';
const icons = {
	UndoOutlined,
	RedoOutlined,
};
const BaseTool = ({ tool }: any) => {
	return (
		<span
			onClick={() => {
				tool.click?.();
			}}
			className='tgsheet_btn'>
			{React.createElement(icons[tool.icon])}
		</span>
	);
};
export default BaseTool;
