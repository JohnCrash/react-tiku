import React, {Component} from 'react';
import Page from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import CodeIcon from 'material-ui/svg-icons/action/code';
import {Toolbar, ToolbarGroup, ToolbarTitle,ToolbarSeparator} from 'material-ui/Toolbar';
import TkTag from 'material-ui/svg-icons/action/find-in-page';
import TkEdit from 'material-ui/svg-icons/editor/mode-edit';
import TkOption from 'material-ui/svg-icons/editor/format-list-numbered';
import TkEdit2 from 'material-ui/svg-icons/editor/format-align-justify';
import TkReset from 'material-ui/svg-icons/action/delete';
import TkSave from 'material-ui/svg-icons/file/cloud-upload';
import TkDelete from 'material-ui/svg-icons/content/content-cut';
import TkHtmlViewer from './tkhtmlviewer';
import TkViewer from './tkviewer';

/**
 * 具体的html编辑
 * type = (0:image,1:body,2:answer,3:analysis)
 * content = (html content)
 * title = (标题)
 */
class TkFrame extends Component{
	constructor(){
		super();      
        this.state={
            expendHTML:false,
            iframeHeight:0,
        }; 
	}     
    handleHTMLContent(){
        this.setState({expendHTML:!this.state.expendHTML});
    }
    handleLoad(){
        if(this.iframe&&this.iframe.contentDocument&&this.iframe.contentDocument.body){
            var id;
            var document = this.iframe.contentDocument;
            var body = document.body;
            var cb = ()=>{
                clearInterval(id);
                let height = 0;
                for(let i = 0;i<body.children.length;i++){
                    height += body.children[i].scrollHeight;
                }
                this.setState({iframeHeight:height});
            };
            cb.bind(this);
            /**
             * 这里可能还没有计算出布局，因此scrollHeight可能不准确
             * 如果在100ms秒后再设置一回height将会基本正常。
             */
            cb();
            id = setInterval(cb,100);
            /**
             * 这里打开编辑功能
             */
            document.designMode = 'on';
            document.contentEditable=true;
        }else{
            this.setState({iframeHeight:0});
        }
    }
    handlePopUrl(){
        window.open(this.props.source);
    }
	render(){
        let tool,topic_image,content;
        if(!this.props.content || this.props.content.length===0){
            return null;
        }
        if(this.props.type==0){
            topic_image = <p style={{textAlign:'center'}}>
                <img frameborder={0}
            style={{margin:'auto',
            width:'60%'}} 
            src={this.props.content}/>
            </p>;
            tool = <a href="javascript:;" onClick={this.handlePopUrl.bind(this)}>{this.props.tid}</a>;
        }
        if(this.props.type>=1 && this.props.type<=3){
          content = (<iframe
          onLoad={this.handleLoad.bind(this)}
          ref = {(iframe)=>{this.iframe = iframe}}
          height = {this.state.iframeHeight}
          style={{width:'100%',border:0}} 
          srcDoc={this.props.content}>
          </iframe>);
        }
        if(this.props.type==1){
                tool = [
            <IconButton tooltip='重新编辑' onClick={this.props.toolReset}>
                <TkReset/>
            </IconButton>,
            <IconButton tooltip='入库'>
                <TkSave/>
            </IconButton>,		
            <ToolbarSeparator />,			  
            <IconButton tooltip='标记选择题'>
                <TkOption/>
            </IconButton>,
            <IconButton tooltip='标记填空题'>
                <TkEdit/>
            </IconButton>,
            <IconButton tooltip='标记解答题'>
                <TkEdit2/>
            </IconButton>,
            <ToolbarSeparator/>,
			  <IconButton tooltip='删除选择'>
                <TkDelete/>
            </IconButton>];
        }
		return (<Page style={{margin:32}}>
            <Toolbar>
                <ToolbarGroup>
                    <ToolbarTitle text={this.props.title || 'None'} />
                    {tool}
                </ToolbarGroup>
                <ToolbarGroup>
                <IconButton touch={true} onTouchTap={this.handleHTMLContent.bind(this)}>
                    <CodeIcon />
                </IconButton>
                </ToolbarGroup>                
            </Toolbar>
            <TkHtmlViewer expend={this.state.expendHTML}>{this.props.content}</TkHtmlViewer>
            {topic_image}
            {content}
		</Page>);
	}
};

export default TkFrame;
