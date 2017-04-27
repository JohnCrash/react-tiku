import React, {Component} from 'react';
import TkToolBar from './tktoolbar';
import TkFrame from './tkframe';
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
			image:'',
			topic:'',
			answer:'',
			analysis:'',
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
	handleToolMenu(){
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
			this.setState({topic:this.currentTopic.topic_body,
			answer:this.currentTopic.topic_answer,
			analysis:this.currentTopic.topic_analysis,
			image:this.currentTopic.topic_image});
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
			try{
				this.setState({topicsNumber:`${this.curTopicsIndex}/${this.totalTopics}`});
			}catch(e){
				console.log(e.toString());
			}
			if(this.curTopicsIndex===1){
				this.loadTopic(this.currentUnit[this.curTopicsIndex-1].QuestionID);
			}else{
				this.setState({topic:'',
				answer:'',
				analysis:'',
				image:''});
			}
			//关闭边栏
			this.handleToolMenu();
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
				<TkToolBar
				onPrevTopic={this.handlePrevTopic.bind(this)}
				onNextTopic={this.handleNextTopic.bind(this)}
				topicsNumber={this.state.topicsNumber}
				onToolMenu={this.handleToolMenu.bind(this)}/>
				<TkNavDrawer ref={(drawer)=>{this.drawer = drawer}} 
					onSelectUnit={this.handleSelectUnit.bind(this)}
					messageBar={this.messageBar.bind(this)}/>
				<TkFrame title='原题' content={this.state.image} type={0}/>
				<TkFrame title='题目' content={this.state.topic} type={1}/>
				<TkFrame title='解答' content={this.state.answer} type={2}/>
				<TkFrame title='分析' content={this.state.analysis} type={3}/>
				<Snackbar open={this.state.errorOpen} 
                message={this.state.errorMsg} 
                autoHideDuration={5000} />
			</div>
		);
	}
};

export default TkEditor;
