import React, {Component} from 'react';
import TkToolBar from './tktoolbar';
import TkViewer from './tkviewer';
import TkNavDrawer from './tknavdrawer';

class TkEditor extends Component{
	constructor(){
		super();
		this.state = {
			isNavDrawerOpen:false
		}
		this.topics = {
			text:"hello world"
		}
	}

	toolReset(){
		console.log("click reset : " + this.topics.text);
	}

	toolMenu(){
		//打开边栏
		this.setState({isNavDrawerOpen:true});
	}

	render(){
		return (
			<div>
				<TkToolBar toolReset={this.toolReset.bind(this)} toolMenu={this.toolMenu.bind(this)}/>
				<TkNavDrawer open={this.state.isNavDrawerOpen}/>
				<TkViewer />
			</div>
		);
	}
};

export default TkEditor;
