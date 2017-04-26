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
			topicsNumber:'',
			topic:'',
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

    }
	toolReset(){
		console.log("click reset : " + this.topics.text);
	}

	toolMenu(){
		//打开边栏
		this.drawer.toggle();
	}
	//加载一道题进行编辑
	loadTopic(QuestionID){
		fetch(`/topic?QuestionID=${QuestionID}`).then(function(responese){
			return responese.text();
		}).then(function(data){
			this.error = data;
			this.currentTopic = JSON.parse(data);
			this.setState({topic:this.currentTopic.topic_body});
		}.bind(this)).catch(function(e){
			if(this.error){
				this.messageBar(this.error);
			}else{
				this.messageBar(e.toString());
			} 
		}.bind(this));
	}
	handleSelectUnit(unit){
		if(this.currentUnit!==unit){
			this.currentUnit = unit;
			this.curTopicsIndex = unit.length===0?0:1;
			this.totalTopics = unit.length;
			this.setState({topicsNumber:`${this.curTopicsIndex}/${this.totalTopics}`});
			if(this.curTopicsIndex===1){
				//有题关闭边栏
				this.toolMenu();
				this.loadTopic(this.currentUnit[this.curTopicsIndex-1].QuestionID);
			}
		}
	}
	handleNextTopic(){
		if(this.currentUnit){
			if(this.curTopicsIndex<this.totalTopics){
				this.curTopicsIndex++;
				this.setState({topicsNumber:`${this.curTopicsIndex}/${this.totalTopics}`});
				this.loadTopic(this.currentUnit[this.curTopicsIndex-1].QuestionID);
			}
		}else{
			this.messageBar('请先选择练习册');
		}
	}
	handlePrevTopic(){
		if(this.currentUnit){
			if(this.curTopicsIndex>1){
				this.curTopicsIndex--;
				this.setState({topicsNumber:`${this.curTopicsIndex}/${this.totalTopics}`});
				this.loadTopic(this.currentUnit[this.curTopicsIndex-1].QuestionID);
			}
		}else{
			this.messageBar('请先选择练习册');
		}
	}
	render(){
		return (
			<div>
				<TkToolBar toolReset={this.toolReset.bind(this)}
				onPrevTopic={this.handlePrevTopic.bind(this)}
				onNextTopic={this.handleNextTopic.bind(this)}
				topicsNumber={this.state.topicsNumber}
				toolMenu={this.toolMenu.bind(this)}/>
				<TkNavDrawer ref={(drawer)=>{this.drawer = drawer}} 
					onSelectUnit={this.handleSelectUnit.bind(this)}
					messageBar={this.messageBar.bind(this)}/>
				<TkViewer content={this.state.topic} />
				<Snackbar open={this.state.errorOpen} 
                message={this.state.errorMsg} 
                autoHideDuration={5000} />
			</div>
		);
	}
};

export default TkEditor;
