import React, {Component} from 'react';
import TkToolBar from './tktoolbar';
import TkFrame from './tkframe';
import TkNavDrawer from './tknavdrawer';
/* 在屏幕下方弹上一个消息 */
import Snackbar from 'material-ui/Snackbar';
import 'whatwg-fetch'

const warningColor = "#D50000";
const greenColor = "#1B5E20";

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
			tag:'',
			css:'',
			source:'',
			qid:-1,
			body:'',
			tid:'',
			topicsType:-1,
			hasBody:false,
			messageColor:warningColor,
		}
	}
	//弹出一个错误条
	messageBar(str,f){
		setInterval((()=>{
			this.state.errorOpen = false;
		}).bind(this),5000);
		this.setState({errorOpen:true,errorMsg:str,messageColor:f?greenColor:warningColor});
	}
    componentDidMount(){

    }
	handleToolMenu(){
		//打开边栏
		this.drawer.toggle();
	}
	toHtmlDocument(css,body){
		return `<html>
		<head>
			<link rel="stylesheet" type="text/css" href="css/reset.css">
			<link rel="stylesheet" type="text/css" href="css/style.css">
			<link rel="stylesheet" type="text/css" href="css/ti.css">
		</head>
		<body>${body}</body>
		<script inner-script>
			function option_onclick(node){
				if(node.hasAttribute('option-btn')){
					var value = node.getAttribute('option-btn');
					node.removeAttribute('option-btn');
					node.setAttribute('option-correct',value);
				}else if(node.hasAttribute('option-correct')){
					var value = node.getAttribute('option-correct');
					node.removeAttribute('option-correct');
					node.setAttribute('option-btn',value);	
				}
			}
			function answer_onchange(node){
				node.removeAttribute('value');
				node.setAttribute('value',node.value);
				if(node.hasAttribute('answer-feild'))
					node.setAttribute('answer-feild',node.value);
				else
					node.setAttribute('answer-feild2',node.value);
			}
		</script>
		</html>`;
	}
	//加载一道题进行编辑
	loadTopic(QuestionID){
		fetch(`/topic?QuestionID=${QuestionID}`).then(function(responese){
			return responese.text();
		}).then(function(data){
			this.error = data;
			this.currentTopic = JSON.parse(data);
			
			let css = this.currentTopic.topic_css;
			//如果body有内容，并且state是(1选择题，2填空题，3解答题)之一
			let hasBody = this.currentTopic.state>=1 && this.currentTopic.state<=3 && this.currentTopic.body;
			this.setState({
			hasBody:hasBody,
			topic:this.toHtmlDocument(css,this.currentTopic.topic_body),
			body:this.toHtmlDocument(css,this.currentTopic.body),
			answer:this.toHtmlDocument(css,this.currentTopic.topic_answer),
			analysis:this.toHtmlDocument(css,this.currentTopic.topic_analysis),
			image:this.currentTopic.topic_image,
			css:css,
			tag:this.currentTopic.topic_tag,
			source:this.currentTopic.source,
			tid:this.currentTopic.tid,
			qid:QuestionID,
			topicsType:this.currentTopic.state});
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
				<TkFrame title='原题' content={this.state.image} source={this.state.source} tid={this.state.tid} type={0}/>
				<TkFrame title='题目' messageBar={this.messageBar.bind(this)}
					content={this.state.topic}
					type={1}
					hasBody={this.state.hasBody}
					qid={this.state.qid}
					body={this.state.body}
					topicsType={this.state.topicsType}/>
				<TkFrame title='解答' messageBar={this.messageBar.bind(this)} content={this.state.answer} type={2}/>
				<TkFrame title='分析' messageBar={this.messageBar.bind(this)} content={this.state.analysis} type={3}/>
				<TkFrame title='知识点' messageBar={this.messageBar.bind(this)} content={this.state.tag} type={4}/>
				<Snackbar open={this.state.errorOpen} 
				bodyStyle={{backgroundColor:this.state.messageColor}}
                message={this.state.errorMsg} 
                autoHideDuration={5000} />
			</div>
		);
	}
};

export default TkEditor;
