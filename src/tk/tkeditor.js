import React, {Component} from 'react';
import TkToolBar from './tktoolbar';
import TkViewer from './tkviewer';

class TkEditor extends Component{
	constructor(){
		super();
		this.state = {
		}
		this.topics = {
			text:"hello world"
		}
	}

	toolReset(){
		console.log("click reset : " + this.topics.text);
	}

	render(){
		return (
			<div>
				<TkToolBar toolReset={this.toolReset.bind(this)}/>
				<TkViewer />
			</div>
		);
	}
};

export default TkEditor;
