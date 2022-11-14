import React, { useContext, useEffect } from 'react';
import { ToolBar } from 'kgsheet';
import './index.css';
import { SheetContext } from '..';
import { useState } from 'react';

function Tools() {
	const { sheet, setToolBar, toolBar } = useContext(SheetContext);

	const [flag, setFlag] = useState(0);
	const refresh = () => {
		setFlag((v) => v + 1);
	};
	useEffect(() => {
		if (sheet && !toolBar) {
			const instance = new ToolBar(sheet);
			setToolBar(instance);

			instance.on?.('refresh', refresh);
		}
		return () => {
			toolBar?.off?.('refresh', refresh);
		};
	}, [sheet]);

	return (
		<div className='tgsheet_toolBarContainer'>
			<div>12</div>
			<div>12</div>
			<div>12</div>
			<div>12</div>
		</div>
	);
}

export default Tools;
