import React, {Component} from 'react';
import Page from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
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
	}
    state={
        expendHTML:false
    };      
    handleHTMLContent(){
        this.setState({expendHTML:!this.state.expendHTML});
    }
	render(){
        let tool,topic_image,content;
        if(!this.props.content || this.props.content.length===0){
            return null;
        }
        if(this.props.type==0){
            topic_image = <img style={{margin:'auto',
            width:'60%'}} 
            src={this.props.content}/>;
        }
        if(this.props.type==1||this.props.type==2||this.props.type==3){
            content = <TkViewer content={this.props.content} style={{margin:24}}/>
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
            <IconButton tooltip='编辑知识点'>
                <TkTag/>
            </IconButton>,			  
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
            <p style={{textAlign:'center'}}>{topic_image}</p>
            {content}
		</Page>);
	}
};

export default TkFrame;
