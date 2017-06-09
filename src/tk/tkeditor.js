import React, {Component} from 'react';
import TkToolBar from './tktoolbar';
import TkFrame from './tkframe';
import TkNavDrawer from './tknavdrawer';
/* 在屏幕下方弹上一个消息 */
import Snackbar from 'material-ui/Snackbar';
import 'whatwg-fetch'
import htmldom from './htmldom';

const warningColor = "#D50000";
const greenColor = "#1B5E20";

/**
 * 删除脚本中的js脚本标签
 */
function removeJavaScriptTag(html){
	return htmldom.writeHTML(htmldom.parseDOM(html),(node)=>{
		if(node.type=="script")
			return null;
		else
			return node;
	})
}

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
			markd_body:'',
			markd_answer:'',
			markd_analysis:'',
			markd_tag:'',
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
		let newbody = removeJavaScriptTag(body);
		return `<html>
		<head>
			<link rel="stylesheet" type="text/css" href="css/reset.css">
			<link rel="stylesheet" type="text/css" href="css/style.css">
			<link rel="stylesheet" type="text/css" href="css/ti.css">
		</head>
		<body>${newbody}</body>
		<script inner-script>
			function enumAllElement(node,cb){
				cb(node);
				for(let i = 0;i < node.children.length;i++){
					enumAllElement(node.children[i],cb);
				}
			}
			/**
			 * 对齐多选的按钮的长度，填空题自动匹配内容
			 */
			function autoResize(){
				var opts = [];
				enumAllElement(document,function(node){
					if(node.hasAttribute&&(node.hasAttribute('option-btn')||node.hasAttribute('option-correct'))){
						opts.push(node);
					}
				});
				if(opts.length>1){
					var maxWidth = 0;
					for(let i=0;i<opts.length;i++){
						opts[i].style.width = '';
					}					
					for(let i=0;i<opts.length;i++){
						let w = opts[i].clientWidth - 2*opts[i].offsetLeft;
						maxWidth = w>maxWidth?w:maxWidth;
					}
					maxWidth-=47;
					for(let i=0;i<opts.length;i++){
						opts[i].style.width = maxWidth.toString()+'px';
					}		
				}
				opts = [];
				enumAllElement(document,function(node){
					if(node.hasAttribute&&(node.hasAttribute('answer-feild'))){
						node.style.width = 0;
						let w = Math.ceil(node.scrollWidth/48)*48;
						node.style.width = w.toString()+'px';
					}
				});
			}		
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
				autoResize();
			}
			function answer_onchange(node){
				node.removeAttribute('value');
				node.setAttribute('value',node.value);
				if(node.hasAttribute('answer-feild')){
					node.setAttribute('answer-feild',node.value);
					autoResize();					
				}else
					node.setAttribute('answer-feild2',node.value);

			}
			document.body.onload=function(){
				autoResize();
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
			topicsType:this.currentTopic.state,
			markd_body:this.currentTopic.markd_body,
			markd_analysis:this.currentTopic.markd_analysis,
			markd_answer:this.currentTopic.markd_answer,
			markd_tag:this.currentTopic.markd_tag});
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
					answer={this.state.answer}
					markd={this.state.markd_body}
					type={1}
					hasBody={this.state.hasBody}
					qid={this.state.qid}
					body={this.state.body}
					topicsType={this.state.topicsType}/>
				<TkFrame title='解答' 
					markd={this.state.markd_answer}
					messageBar={this.messageBar.bind(this)}
					qid={this.state.qid}
				 	content={this.state.answer} 
					type={2}/>
				<TkFrame title='分析' 
					markd={this.state.markd_analysis}
					messageBar={this.messageBar.bind(this)} 
					qid={this.state.qid}
					content={this.state.analysis} 
					type={3}/>
				<TkFrame title='知识点' 
					markd={this.state.markd_tag}
					messageBar={this.messageBar.bind(this)}
					qid={this.state.qid}
					content={this.state.tag}
					type={4}/>
				<Snackbar open={this.state.errorOpen} 
				bodyStyle={{backgroundColor:this.state.messageColor}}
                message={this.state.errorMsg} 
                autoHideDuration={5000} />
			</div>
		);
	}
};

export default TkEditor;
