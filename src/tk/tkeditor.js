import React, {Component} from 'react';
import TkToolBar from './tktoolbar';
import TkViewer from './tkviewer';

class TkEditor extends Component{
	render(){
		return (
			<div>
				<TkToolBar/>
				<TkViewer/>
			</div>
		);
	}
};

export default TkEditor;