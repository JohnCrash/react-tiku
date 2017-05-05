import React, {Component} from 'react';
import Page from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import CodeIcon from 'material-ui/svg-icons/action/code';
import {Toolbar, ToolbarGroup, ToolbarTitle,ToolbarSeparator} from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

import TkReset from 'material-ui/svg-icons/navigation/refresh';
import TkDownload from 'material-ui/svg-icons/file/cloud-download';
import TkUpload from 'material-ui/svg-icons/file/cloud-upload';
import TkAutomatic from 'material-ui/svg-icons/notification/adb';
import TkManual from 'material-ui/svg-icons/maps/directions-walk';
import TkHtmlViewer from './tkhtmlviewer';

const checkColor = '#69F0AE';
const toolbarIconColor = '#616161';
const warningColor = '#EF9A9A';
//取得节点的属性，属性名称为attrName
function getAttribute(node,attrName){
    for(let i = 0;i < node.attributes.length;i++){
        if( node.attributes[i].name === attrName){
            return node.attributes[i];
        }
    }
    return null;
}
//遍历全部子节点，查找插入的节点
function forChildren(node,cb){
    if(cb(node))return;
    for(let i=0;i<node.children.length;i++){
        if(cb(node.children[i]))return;
        forChildren(node.children[i],cb);
    }
}
/**
 * 具体的html编辑
 * type = (0:image,1:body,2:answer,3:analysis)
 * topicsType = (1选择题，2填空题，3解答题，4其他，－1忽略，0未处理)
 * content = (html content)
 * title = (标题)
 */
class TkFrame extends Component{
	constructor(){
		super();      
        this.state={
            expendHTML:false,
            iframeHeight:0,
            isAuto:true,
            topicsType:-1,
            isContentChange:false,
            htmlContent:'',
        }; 
	}
    componentWillMount(){
        console.log('componentWillMount');
    }
    componentDidMount(){
        console.log('componentDidMount');
    }
    componentWillReceiveProps(nextProps){
    }
    componentWillUnmount(){
        console.log('componentWillUnmount');
    }
    handleHTMLContent(){
        this.setState({expendHTML:!this.state.expendHTML});
    }
    recalcIFrameSize(){
        let height = 0;
        for(let i = 0;i<this.body.children.length;i++){
            height += this.body.children[i].scrollHeight;
        }
        this.setState({iframeHeight:height});        
    }
    handleLoad(){
        if(this.iframe&&this.iframe.contentDocument&&this.iframe.contentDocument.body){
            var id;
            var document = this.iframe.contentDocument;
            var body = document.body;
            this.content = body.outerHTML;
            this.document = document;
            this.body = body;
            this.state.htmlContent = this.content;
            var cb = (()=>{
                clearInterval(id);
                this.recalcIFrameSize();
            }).bind(this);
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
            document.onkeyup=this.handleKeyup.bind(this);
        }else{
            this.setState({iframeHeight:0,
                topicsType:this.props.topicsType});
        }
    }
    //弹出原题
    handlePopUrl(){
        window.open(this.props.source);
    }
    //切换到自动
    handleAutoClick(){
        this.setState({isAuto:true});
        this.automaticOption();
    }
    //切换到手动
    handleManualClick(){
        this.setState({isAuto:false});
    }
    //选择题，填空题..., DropDownMenu选择
    handleDropDownMenuChange(event,index,value){
        if(this.state.isAuto){
            if(value==1){
                this.automaticOption();
            }else if(value==2){
                this.automaticFeild();
            }
        }
        this.setState({topicsType:value});
    }
    //将选择的内容转换为交互按键
    handleOptionClick(event){
        let option = event.target.textContent;
        let map1 = {'A':1,'B':2,'C':3,'D':4,'E':5,'F':6};
        let map2 = [' ','A','B','C','D','E','F'];
        let value = `#0${map1[option]}0000`;
        this.document.execCommand('backcolor',false,value);
        this.handleKeyup();

        forChildren(this.body,(node)=>{
            //发现要找的节点
            let attr = getAttribute(node,'style');
            if(attr){
                let patten = /background-color:\s*rgb\((\d+),\s*(\d+),\s*(\d+)\);/;
                let result = attr.nodeValue.match(patten);
                console.log(attr.nodeValue);
                if(result){
                    let r = Number(result[1]);
                    let g = Number(result[2]);
                    let b = Number(result[3]);
                    let option2 = map2[r];
                    return true;
                }
            }
            return false;
        });
        console.log(option);
    }
    //将选择的内容转换为填空
    handleFeildClick(event){
        this.document.execCommand('cut',false,null);
        this.document.execCommand('inserthtml',false,'<input></input>');
        this.handleKeyup();
        console.log("handleFeildClick");
    }
    /**
     * 分析this.props.content的内容，自动做选项转换操作
     * 如果成功返回true,失败返回false
     */
    automaticOption(){
        console.log("automaticOption");
    }
    /**
     * 分析this.props.content的内容，自动做填空转换操作
     * 如果成功返回true,失败返回false
     */
    automaticFeild(){
        console.log("automaticFeild");
    }
    //重新编辑
    handleReset(){
        this.iframe.srcdoc = this.props.content;
        this.setState({isContentChange:false});
    }
    //上传
    handleUpload(){

    }
    //加载上次上传
    handleLoadPrev(){

    }
    //使用keyup事件跟踪文档的变化
    handleKeyup(event){
        if(this.body.outerHTML!=this.content){
            this.setState({isContentChange:true,
                htmlContent:this.body.outerHTML});
            this.recalcIFrameSize();
        }else{
            this.setState({isContentChange:false});
        }
    }
	render(){
        let tool,saveTool,optionTool,topic_image,content;
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
                saveTool = [
                    <IconButton tooltip='重新编辑' onClick={this.handleReset.bind(this)}>
                        <TkReset color={toolbarIconColor}/>
                    </IconButton>,
                    <IconButton tooltip='装入上次编辑内容' onClick={this.handleLoadPrev.bind(this)}>
                        <TkDownload color={toolbarIconColor}/>
                    </IconButton>,                    
                    <IconButton tooltip='存储入库' onClick={this.handleUpload.bind(this)}>
                        <TkUpload  color={this.state.isContentChange?warningColor:toolbarIconColor}/>
                    </IconButton>,                    
                    <ToolbarSeparator />];
            if(this.state.topicsType==1 ||this.state.topicsType==2){
                    tool = [	
                <FlatButton
                    label="自动"
                    backgroundColor = {this.state.isAuto?checkColor:undefined}
                    hoverColor = {this.state.isAuto?checkColor:undefined}
                    onClick={this.handleAutoClick.bind(this)}
                    style={{marginLeft:0,marginRight:0}}
                    icon={<TkAutomatic color={toolbarIconColor}/>}>
                </FlatButton>,
                <FlatButton
                    label="手动"
                    backgroundColor = {this.state.isAuto?undefined:checkColor}
                    hoverColor = {this.state.isAuto?undefined:checkColor}
                    onClick={this.handleManualClick.bind(this)}
                    style={{marginLeft:0,marginRight:0}}
                    icon={<TkManual color={toolbarIconColor}/>}>
                </FlatButton>,                                         
                <ToolbarSeparator />
                ];
            }
            if(this.state.topicsType==1){ //选择题
                if(!this.state.isAuto){ //手动
                    optionTool = ['A','B','C','D','E','F'].map((item)=>{
                        return <FlatButton
                            label={item}
                            onTouchTap={this.handleOptionClick.bind(this)}
                            style={{marginLeft:0,marginRight:0}}>
                        </FlatButton>;
                    });
                }
            }else if(this.state.topicsType==2){ //填空题
                if(!this.state.isAuto){ //手动
                    optionTool = [<FlatButton
                                label={'填空'}
                                onTouchTap={this.handleFeildClick.bind(this)}
                                style={{marginLeft:0,marginRight:0}}>
                            </FlatButton>];
                }
            }
        }
		return (<Page style={{margin:32}}>
            <Toolbar>
                <ToolbarGroup>
                    <ToolbarTitle text={this.props.title || 'None'} />
                    {saveTool}
                    {tool}
                    {optionTool}
                </ToolbarGroup>
                <ToolbarGroup>
                {this.props.type==1 &&
                <DropDownMenu value={this.state.topicsType}
                    onChange={this.handleDropDownMenuChange.bind(this)}>
                    <MenuItem value={1} primaryText="选择题" />
                    <MenuItem value={2} primaryText="填空题" />
                    <MenuItem value={3} primaryText="解答题" />
                    <MenuItem value={4} primaryText="其他" />
                    <MenuItem value={-1} primaryText="忽略" />
                    <MenuItem value={0} primaryText="未处理" />
                </DropDownMenu>
                }
                <IconButton touch={true} onTouchTap={this.handleHTMLContent.bind(this)}>
                    <CodeIcon />
                </IconButton>
                </ToolbarGroup>                
            </Toolbar>
            <TkHtmlViewer expend={this.state.expendHTML}>{this.state.htmlContent}</TkHtmlViewer>
            {topic_image}
            {content}
		</Page>);
	}
};

export default TkFrame;
