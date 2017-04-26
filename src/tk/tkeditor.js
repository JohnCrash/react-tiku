import React, {Component} from 'react';
import TkToolBar from './tktoolbar';
import TkViewer from './tkviewer';
import TkNavDrawer from './tknavdrawer';
/* 在屏幕下方弹上一个消息 */
import Snackbar from 'material-ui/Snackbar';
import 'whatwg-fetch'

class TkEditor extends Component{
	constructor(){
		super();
		this.state = {
			isNavDrawerOpen:false,
			errorOpen:false,
            errorMsg:'',
		}
		this.topics = {
			text:"hello world"
		}
	}
	//弹出一个错误条
	messageBar(str){
		this.setState({errorOpen:true,errorMsg:str});
	}
    componentDidMount(){
		//加载练习册
        fetch('/book').then(function(response){
            return response.text()
        }).then(function(data){
		  this.error = 'error msg'
          this.setState({books:JSON.parse(data)});
        }.bind(this)).catch(function(e){
            //加载数目失败
			if(this.error)
          		this.messageBar(this.error);
			else
				this.messageBar(e.toString());
        }.bind(this));
    }
	toolReset(){
		console.log("click reset : " + this.topics.text);
	}

	toolMenu(){
		//打开边栏
		this.drawer.toggle();
	}

	render(){
		return (
			<div>
				<TkToolBar toolReset={this.toolReset.bind(this)} toolMenu={this.toolMenu.bind(this)}/>
				<TkNavDrawer ref={(drawer)=>{this.drawer = drawer}} books={this.state.books} messageBar={this.messageBar.bind(this)}/>
				<TkViewer />
				<Snackbar open={this.state.errorOpen} 
                message={this.state.errorMsg} 
                autoHideDuration={5000} />
			</div>
		);
	}
};

export default TkEditor;
