import React, {Component} from 'react';
import TkToolBar from './tktoolbar';
import TkFrame from './tkframe';
import TkNavDrawer from './tknavdrawer';
import TkBrowser from './tkbrowser';
import TkEdit from './tkedit';
/* 在屏幕下方弹上一个消息 */
import Snackbar from 'material-ui/Snackbar';
import 'whatwg-fetch'
import htmldom from './htmldom';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

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
			mode:'browser',
			currentTopic:1,
			topics:[],
			current:1,
			count:0,
			secation:0,
			editIndex:-1,			
			openDialog:false
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
	toHtmlDocument(body){
		let newbody = removeJavaScriptTag(body);
		return `<html>
		<head>
			<link rel="stylesheet" type="text/css" href="css/reset.css">
			<link rel="stylesheet" type="text/css" href="css/style.css">
			<link rel="stylesheet" type="text/css" href="css/ti.css">
			<link rel="stylesheet" type="text/css" href="css/topics.css">
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

			this.setState({
			body:this.toHtmlDocument(css,this.currentTopic.body),
			answer:this.toHtmlDocument(css,this.currentTopic.answer),
			analysis:this.toHtmlDocument(css,this.currentTopic.analysis),
			tag:this.currentTopic.topic_tag,
			image:this.currentTopic.topic_image,
			css:css,
			source_body:this.toHtmlDocument(css,this.currentTopic.topic_body),
			source_answer:this.toHtmlDocument(css,this.currentTopic.topic_answer),
			source_analysis:this.toHtmlDocument(css,this.currentTopic.topic_analysis),
			source_tag:this.currentTopic.topic_tag,
			tid:this.currentTopic.tid,
			qid:QuestionID,
			topicsType:this.currentTopic.state,
			markd_body:this.currentTopic.markd_body,
			markd_analysis:this.currentTopic.markd_analysis,
			markd_answer:this.currentTopic.markd_answer,
			markd_tag:this.currentTopic.markd_tag,
			seat_body:this.currentTopic.seat_body,
			seat_analysis:this.currentTopic.seat_analysis,
			seat_answer:this.currentTopic.seat_answer,
			seat_tag:this.currentTopic.seat_tag});
		}.bind(this)).catch(function(e){
			if(this.error){
				this.messageBar(this.error);
			}else{
				this.messageBar(e.toString());
			} 
		}.bind(this));
	}
	/**
	 * {
	 * 		sectionID //当前单元ID
	 * 		pageCount //当前单元题的页数，每页固定10
	 * 		currentPage //当前页
	 * 		items //当前页包含的题数组
	 * }
	 */
	handleSelectUnit(page,b){
		if(this.currentPage!==page){
			this.currentPage = page;
			this.setState({
				topics:page.items,
				current:page.currentPage,
				count:page.pageCount,
				section:page.sectionID,
				mode:'browser',
				editIndex:-1,
			});
			//关闭边栏
			if(!b)
				this.handleToolMenu();
		}
	}
	//切换页
	handlePage(i){		
		let url;
		if(this.addEditMode){
			//重新查询页数
			url = encodeURI(`/SectionPage10?SectionID=${this.currentPage.sectionID}&SectionPage=${i}`);
		}else{
			url = encodeURI(`/SectionPage10?SectionID=${this.currentPage.sectionID}&SectionPage=${i}&PageCount=${this.currentPage.pageCount}`);
		}
        fetch(url).then(function(response){
            return response.text()
        }).then(function(data){
		  this.error = data;
          let json = JSON.parse(data);
          if(json&&json.originalError&&json.originalError.info){
              this.error = 'ERROR:'+json.originalError.info.message;
              throw this.error;
          }
          this.handleSelectUnit(json,true);
        }.bind(this)).catch(function(e){
            //加载数目失败
			if(this.error)
          		this.messageBar(this.error);
			else
				this.messageBar(e.toString());
        }.bind(this));
	}
	//切换题进行编辑
	handleTopics(i){
		console.log(i);
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
	handleEdit(i){
		//记住滚动位置
		this.sx = window.scrollX;
		this.sy = window.scrollY;
		this.setState({mode:'edit',editIndex:i});
	}
	handleReturnBrowser(){
		this.edit.save();
		this.setState({mode:'browser'});
		if(this.addEditMode){
			this.handlePage(1); //重新载入第一页，
			this.addEditMode = undefined;
		}else{
			this.forceUpdate();
			var id = setInterval(()=>{
				clearInterval(id);
				window.scrollTo(this.sx,this.sy);
			},100);
		}
	}
	handleAdd(rowid){
		this.addEditMode = 1;
		this.state.topics.push({
			state:0,
			seat_body:2,
			markd_body:'',
			seat_answer:2,
			markd_answer:'',
			seat_analysis:2,
			markd_analysis:'',
			seat_tag:2,
			markd_tag:'',
			rowid:rowid,
		});
		this.setState({
			mode:'edit',
			editIndex:this.state.topics.length-1});
	}
	handleAddTopic(){
		let url = encodeURI(`/add?SectionID=${this.currentPage.sectionID}`);
        fetch(url).then(function(response){
            return response.text()
        }).then(function(data){
		  this.error = data;
          let json = JSON.parse(data);
          if(json&&json.originalError&&json.originalError.info){
              this.error = 'ERROR:'+json.originalError.info.message;
              throw this.error;
          }
          this.handleAdd(json.rowid);
        }.bind(this)).catch(function(e){
            //加载数目失败
			if(this.error)
          		this.messageBar(this.error);
			else
				this.messageBar(e.toString());
        }.bind(this));
	}
	handleRemoveIgnore(){
		this.setState({openDialog:true});
	}
	handleRemoveIgnoreOk(){
		this.setState({openDialog:false});
		let url = encodeURI(`/clear?SectionID=${this.currentPage.sectionID}`);
        fetch(url).then(function(response){
            return response.text()
        }).then(function(data){
		  this.error = data;
		  if(data==='ok'){
			this.messageBar('成功清理',1);
          	this.handlePage(1); //重新载入第一页，
		  }else
		    throw '没有正确删除忽略项!';
        }.bind(this)).catch(function(e){
            //加载数目失败
			if(this.error)
          		this.messageBar(this.error);
			else
				this.messageBar(e.toString());
        }.bind(this));		
	}
	handleRemoveIgnoreCancel(){
		this.setState({openDialog:false});
	}
	render(){
		return (
			<div>
				<TkToolBar
				section={this.state.section}
				onPrevTopic={this.handlePrevTopic.bind(this)}
				onNextTopic={this.handleNextTopic.bind(this)}
				topicsNumber={this.state.topicsNumber}
				onToolMenu={this.handleToolMenu.bind(this)}
				onAddTopic={this.handleAddTopic.bind(this)}
				openReturnBrowser={this.state.mode!=="browser"}
				onReturnBrowser={this.handleReturnBrowser.bind(this)}
				onRemoveIgnore={this.handleRemoveIgnore.bind(this)}/>
				<TkNavDrawer ref={(drawer)=>{this.drawer = drawer}} 
					onSelectUnit={this.handleSelectUnit.bind(this)}
					messageBar={this.messageBar.bind(this)}/>
				<div style={{display:this.state.mode==="browser"?undefined:'none'}}>
					<TkBrowser topics={this.state.topics}
					current={this.state.current}
					count={this.state.count}
					section={this.state.section}
					onPage={this.handlePage.bind(this)}
					onEdit={this.handleEdit.bind(this)}
					messageBar={this.messageBar.bind(this)}/>
				</div>
				<div style={{display:this.state.mode!=="browser"?undefined:'none'}}>
					<TkEdit topics={this.state.topics}
						current={this.state.editIndex}
						section={this.state.section}
						onTopic={this.handleTopics.bind(this)}
						messageBar={this.messageBar.bind(this)}
						ref={(iframe)=>{this.edit = iframe;}}/>
				</div>
				<Snackbar open={this.state.errorOpen} 
				bodyStyle={{backgroundColor:this.state.messageColor}}
                message={this.state.errorMsg} 
                autoHideDuration={5000} />
				<Dialog open={this.state.openDialog}
				 	title={'提示'}
            		actions={[<FlatButton label='取消' primary={true} onTouchTap={this.handleRemoveIgnoreCancel.bind(this)}/>,
                	<FlatButton label='确定' primary={true} onTouchTap={this.handleRemoveIgnoreOk.bind(this)}/>]}
					onRequestClose={this.handleRemoveIgnoreCancel.bind(this)}>
					你确定要删除该章节下全部被标注为‘忽略’的题吗？
				</Dialog>
			</div>
		);
	}
};

export default TkEditor;