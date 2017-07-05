import React, {Component} from 'react';
import Page from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import CodeIcon from 'material-ui/svg-icons/action/code';
import {Toolbar, ToolbarGroup, ToolbarTitle,ToolbarSeparator} from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

import TkTest from 'material-ui/svg-icons/av/airplay';
import TkReset from 'material-ui/svg-icons/navigation/refresh';
import TkDownload from 'material-ui/svg-icons/file/cloud-download';
import TkUpload from 'material-ui/svg-icons/file/cloud-upload';
import TkAutomatic from 'material-ui/svg-icons/notification/adb';
import TkManual from 'material-ui/svg-icons/maps/directions-walk';
import TkMarkdown from 'material-ui/svg-icons/communication/swap-calls';
import TkBrowserEdit from 'material-ui/svg-icons/editor/mode-edit';

import TkHtmlViewer from './tkhtmlviewer';
import TkTestDailog from './tktest';
import TkMarkd from './tkmarkd';
import htmldom from './htmldom';
import {optionAuto,feildAuto} from './tkauto';

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

function getTypeString(id){
    switch(id){
        case 1:return "选择题";
        case 2:return "填空题";
        case 3:return "解答题";
        case 4:return "其他";
        case 5:return "连线题";
        case 6:return "排序";
        case -1:return "忽略";
        case 0:return "未处理";
    }
    return "";
}

function getTypeColor(id){
    switch(id){
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            return '#69F0AE';
        case -1:
            return '#BDBDBD';
        case 0:
            return '#EF9A9A';
    }
    return '#E0E0E0';
}
/**
 * 具体的html编辑
 * type = (0:image,1:body,2:answer,3:analysis)
 * qid (问题id)
 * topicsType = (1选择题，2填空题，3解答题，4其他，－1忽略，0未处理)
 * content = (html content)
 * markd = (markd content)
 * source = (source html content)
 * seat = (0.source,1.content,2.markd)
 * answer (为了分析交互答案)
 * title = (标题)
 * index = 浏览模式下第几题的索引
 * 属性browser表示处于浏览模式
 */
class TkFrame extends Component{
	constructor(props){
		super(props);  
        //确定模式
        this.isIFrameLoad = false;
        this.isFirstLoad = true;        
        let mode = "html";
        let content = "";
        if('seat' in props){
            if(props.seat==0){
                content = props.source;
            }else if(props.seat==1){
                content = props.content;
            }else if(props.seat==2){
                mode = "markd";
            }else{
                content = props.content?props.content:props.source;
            }
        }else{
            content = props.content?props.content:props.source;
        }            
        this.state={
            expendHTML:false,
            iframeHeight:0,
            isAuto:true,
            topicsType:props.topicsType,
            isContentChange:false,
            htmlContent:'',
            openTestDialog:false,
            testContent:"",
            mode:mode,
            content:content,
            markd:"",
            seat:0,
            isMarkdContentChange:false,
        }; 
	}
    componentWillMount(){
    }
    componentDidMount(){
    }
    componentWillReceiveProps(nextProps){
 //       if(this.props.qid!=nextProps.qid){
            this.isIFrameLoad = false;
            this.isFirstLoad = true;
            //自动保存上一个
            if(!nextProps.browser)
                this.handleUpload();
            //新的加载
            if(!nextProps.hasBody){
                if(nextProps.topicsType>=1&&nextProps.topicsType<=3){
                    //自动根据标记的类型进自动转换
                }else{
                    //这里先做选择题判断
                    //不是判断题？
                }
            }else{
                //如果已经有过编辑设置手动
                this.setState({isAuto:false});
            }
            //确定模式
            let mode = "html";
            let content = "";
            if('seat' in nextProps){
                if(nextProps.seat==0){
                    content = nextProps.source;
                }else if(nextProps.seat==1){
                    content = nextProps.content;
                }else if(nextProps.seat==2){
                    mode = "markd";
                }else{
                    content = nextProps.content?nextProps.content:nextProps.source;
                }
            }else{
                content = nextProps.content?nextProps.content:nextProps.source;
            }
            this.setState({isContentChange:false,//新加载都是没有改变
                topicsType:nextProps.topicsType,
                mode:mode,
                content:content,
                seat:nextProps.seat,
                markd:nextProps.markd});
//        }
    }
    componentWillUnmount(){
    }
    handleHTMLContent(){
        this.setState({expendHTML:!this.state.expendHTML});
    }
    recalcIFrameSize(){
        let height = 0;
        if(this.state.mode==="html"){
            for(let i = 0;i<this.body.children.length;i++){
                height += this.body.children[i].scrollHeight;
            }
        }else{
            height = this.markd.getHeight();
            this.markd.doFullScreen();
        }
        this.setState({iframeHeight:height<32?32:height});
    }
    onHtmlContentChange(content){
        //去掉内部操作用的JavaScript代码,见tkeditor.toHtmlDocument
        let dom = htmldom.parseDOM(content);
        let newcontent = htmldom.writeHTML(dom,(node)=>{
            if(node.type=="script" && 'inner-script' in node.attribs){
                return null;
            }
            return node;
        });
        this.state.htmlContent = newcontent;
        this.setState({htmlContent:newcontent});
    }
    handleLoad(){
        if(this.state.mode=="html"){
            if(this.iframe&&this.iframe.contentDocument&&this.iframe.contentDocument.body){
                var id;
                var document = this.iframe.contentDocument;
                var body = document.body;
                this.content = body.outerHTML;
                this.document = document;
                this.body = body;
                this.isIFrameLoad = true; //标记已经装载
                if(this.isFirstLoad){
                    this.sourceContent = body.outerHTML;
                    this.isFirstLoad = false;
                }
                //this.state.htmlContent = this.content;
                this.onHtmlContentChange(this.content);
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
                if(!this.props.browser){
                    /**
                     * 这里打开编辑功能
                     */
                    document.designMode = 'on';
                    document.contentEditable=true;
                    document.onkeyup=this.handleKeyup.bind(this);
                }
            }else{
                this.setState({iframeHeight:0,
                    topicsType:this.props.topicsType});
            }
        }else{//markd
            if(this.isIFrameLoad){
                return;
            }
            if(this.markd && this.markd.iframe){
                var id;
                var document = this.markd.iframe.contentDocument; 
                var body = document.body;
                this.content = body.outerHTML;
                this.document = document;
                this.body = body;
                this.isIFrameLoad = true; //标记已经装载
                if(this.isFirstLoad){
                    this.sourceContent = body.outerHTML;
                    this.isFirstLoad = false;
                }
                var cb = (()=>{
                    clearInterval(id);
                    this.recalcIFrameSize();
                }).bind(this);
                cb();
                id = setInterval(cb,510);
            }else{
                this.setState({iframeHeight:0,
                    topicsType:this.props.topicsType});
            }
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
        if(this.state.mode=="html"){
            this.handleReset();
            //上面的调用将重新装载,并触发iframe.onLoad函数
            function cb(){
                if(this.isIFrameLoad) //已经加载完成
                    clearInterval(id);
                else
                    return; //继续等待知道加载完成

                if(value!=this.props.topicsType){
                    this.setState({isContentChange:true});
                }

                if(this.state.isAuto){
                    if(value==1){
                        this.automaticOption();
                    }else{
                        this.setState({isAuto:false});
                    }
                }
                if(value==3){
                    //自动在最后面插入输入横线
                    var lastNode = null;
                    for(let i = this.body.children.length-1;i>=0;i--){
                        if(this.body.children[i].tagName in {"DD":1,"DIV":1,"SPAN":1} ){
                            lastNode = this.body.children[i];
                        }
                    }
                    if(!lastNode)
                        lastNode = this.body;
                    let input = document.createElement('input');
                    input.setAttribute('type','text');
                    input.setAttribute('size','64');
                    input.setAttribute('answer-feild2','');
                    input.setAttribute('onchange','answer_onchange(this);');
                    input.setAttribute('onkeyup','answer_onchange(this);');
                    lastNode.appendChild(document.createElement('br'));
                    lastNode.appendChild(input);
                    this.onHtmlContentChange(this.body.outerHTML);
                    this.recalcIFrameSize();
                }
                this.setState({topicsType:value});
            }
            var id = setInterval(cb.bind(this),100);
        }else{//markd
            this.setState({isMarkdContentChange:true,topicsType:value});
        }
    }
    //将选择的内容转换为交互按键
    handleOptionClick(event){
        let option = event.target.textContent;
        let map1 = {'A':1,'B':2,'C':3,'D':4,'E':5,'F':6};
        let map2 = [' ','A','B','C','D','E','F'];
        let value = `#0${map1[option]}FFFF`;
        this.document.execCommand('backcolor',false,value);
        this.checkChange();

        forChildren(this.body,(node)=>{
            //发现要找的节点
            let attr = getAttribute(node,'style');
            if(attr){
                let patten = /background-color:\s*rgb\((\d+),\s*(\d+),\s*(\d+)\);/;
                let result = attr.nodeValue.match(patten);
                console.log(attr.nodeValue);
                if(result){
                    let r = Number(result[1]);
                    let option2 = map2[r];
                    node.removeAttribute('style');
                    node.setAttribute('option-btn',option2);
                    node.setAttribute('onclick','option_onclick(this);');
                    //通知改变并且调整编辑区大小
                    this.checkChange();
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
        this.document.execCommand('inserthtml',false,
        '<input type="text" size="1" answer-feild="" onchange="answer_onchange(this);" onkeyup="answer_onchange(this);"></input>');
        this.checkChange();
        console.log("handleFeildClick");
    }
    /**
     * 分析this.props.content的内容，自动做选项转换操作
     * 如果成功返回true,失败返回false
     */
    automaticOption(){
        let [result,answer] = optionAuto(this.state.content,this.props.answer);
        if(result){
            this.iframe.srcdoc = result;
            let a = answer ? `答案为${answer}`:'但未解析出正确答案';
            this.messageBar(`成功转化为选择题,${a}.`,1);
            this.checkChange();
        }else{
            this.messageBar('不能自动转换为选择题');
        }
    }
    //检查看看文档内容是不是改变了
    checkChange(){
        var id = setInterval((()=>{
            clearInterval(id);
            this.handleKeyup();
        }).bind(this),100);
    }
    //重新编辑
    handleReset(){
        if(this.state.mode=="html"){
            this.isIFrameLoad = false;
            this.iframe.srcdoc = this.props.source;
            this.setState({content:this.props.source});
            this.checkChange();
        }else{//markd
            this.setState({isMarkdContentChange:true,
                markd:this.props.markd});
        }
    }
    messageBar(msg,p){
        if(this.props.messageBar)
            this.props.messageBar(msg,p);
    }
    //上传
    handleUpload(event){
        if(this.state.mode=="html"){
            if(this.state.isContentChange){
                this.state.isContentChange = false;
                //因为使用handleKeyup不能侦测到全部的改变，这里强制更新
                this.onHtmlContentChange(this.body.outerHTML);
                var updateData = {mode:'html'};
                switch(this.props.type){
                    case 1: //body
                        updateData.state = this.state.topicsType;
                        updateData.seat_body = 1;
                        updateData.body = this.state.htmlContent;
                        break;
                    case 2: //answer
                        updateData.seat_answer = 1;
                        updateData.answer = this.state.htmlContent;
                        break;
                    case 3: //analysis
                        updateData.seat_analysis = 1;
                        updateData.analysis = this.state.htmlContent;
                        break;
                    case 4: //tag
                        updateData.seat_tag = 1;
                        updateData.tag = this.state.htmlContent;
                        break;
                }
                /**
                 * 通知更新
                 */
                if(this.props.onSave){
                    this.props.onSave(updateData);
                }                
                /**
                 * 如果html模式下确保情况对应markd格式的数据
                 */
                fetch(`upload?QuestionID=${this.props.qid}`,
                    {method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body:JSON.stringify(updateData)}).then(function(responese){
                    return responese.text();
                }).then(function(data){
                    if(data!='ok'){
                        this.messageBar(data);
                    }else{
                        this.setState({isContentChange:false});
                        this.messageBar('成功保存',1);
                    }
                }.bind(this)).catch(function(e){
                    this.messageBar(e.toString());
                }.bind(this));
            }else if(event){
                this.messageBar('没有任何改变');
            }
        }else{//markd
            if(this.state.isMarkdContentChange){
                this.state.isMarkdContentChange = false;
                var updateData = {mode:'markd'};
                switch(this.props.type){
                    case 1: //body
                        updateData.seat_body = 2;
                        updateData.state = this.state.topicsType;
                        updateData.markd_body = this.markd.getMarkdown();
                        break;
                    case 2: //answer
                        updateData.seat_answer = 2;
                        updateData.markd_answer = this.markd.getMarkdown();
                        break;
                    case 3: //analysis
                        updateData.seat_analysis = 2;
                        updateData.markd_analysis = this.markd.getMarkdown();
                        break;
                    case 4: //tag
                        updateData.seat_tag = 2;
                        updateData.markd_tag = this.markd.getMarkdown();
                        break;
                }      
                /**
                 * 通知更新
                 */
                if(this.props.onSave){
                    this.props.onSave(updateData);
                }                         
                fetch(`upload?QuestionID=${this.props.qid}`,
                    {method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body:JSON.stringify(updateData)}).then(function(responese){
                    return responese.text();
                }).then(function(data){
                    if(data!='ok'){
                        this.messageBar(data);
                    }else{
                        this.setState({isMarkdContentChange:false});
                        this.messageBar('成功保存',1);
                    }
                }.bind(this)).catch(function(e){
                    this.messageBar(e.toString());
                }.bind(this));                
            }else if(event){
                this.messageBar('内容没有任何改变');
            }
        }
    }
    //加载上次上传
    handleLoadPrev(){
        if(this.state.mode=="html"){
            this.isIFrameLoad = false;
            this.iframe.srcdoc = this.props.content;
            this.setState({
                topicsType:this.props.topicsType,
                isContentChange:false});
        }else{//markd
            this.isIFrameLoad = false;
            this.setState({isMarkdContentChange:true,
                markd:this.props.markd});
        }
    }
    //使用keyup事件跟踪文档的变化
    handleKeyup(event){
        if(this.state.mode=="html"){
            if(this.body.outerHTML!=this.sourceContent || this.state.topicsType!=this.props.topicsType){
                this.setState({isContentChange:true});
            }else{
                this.setState({isContentChange:false});
            }
            if(this.body.outerHTML!=this.sourceContent){
                this.onHtmlContentChange(this.body.outerHTML);
                this.recalcIFrameSize();
            }
        }else{//markd
            //TkMarkd有改变
            let cur = this.markd.getMarkdown();
            if(cur!=this.props.markd && !(this.props.markd==null && cur.length==0)){
                this.setState({isMarkdContentChange:true});
            }else{
                this.setState({isMarkdContentChange:false});
            }
            this.recalcIFrameSize();
        }
    }
    //交互测试
    handleTest(event){
        if(this.state.mode=="html"){
            if(this.body && this.body.outerHTML){
                this.state.testContent = this.body.outerHTML;
                this.setState({openTestDialog:true});
            }else{
                this.messageBar("没有要测试的内容!");
            }
        }else{//markd
            if(this.markd){
                this.state.testContent = this.markd.getMarkdown();
                this.setState({openTestDialog:true});
            }else{
                this.messageBar("没有要测试的内容!");
            }
        }        
    }
    handleTestClose(event){
        this.setState({openTestDialog:false});
    }
    //使用Markdown重新进行编辑
    handleMarkdown(){
        if(this.state.mode=="markd"){
            this.state.markd = this.markd.getMarkdown();
            this.setState({mode:"html",
            isContentChange:true,
            seat:1});
        }else if(this.state.mode=="html"){
            this.setState({mode:"markd",
            isMarkdContentChange:true,
            seat:2});
        }
    }
    //当在浏览模式下点击了编辑
    handleBrowserEdit(index,event){
        this.props.onEdit(index);
    }
	render(){
        let tool,saveTool,optionTool,topic_image,content;
        if(!this.state.content || this.state.content.length===0){
            return null;
        }
        if(this.props.type==0){
            topic_image = <p style={{textAlign:'center'}}>
                <img frameBorder={0}
            style={{margin:'auto',
            width:'60%'}} 
            src={this.props.content}/>
            </p>;
            tool = <a href="javascript:;" onClick={this.handlePopUrl.bind(this)}>{this.props.tid}</a>;
        }
        if(this.props.type>=1 && this.props.type<=4){
            if(this.state.mode=="html"){
                content = (<iframe
                onLoad={this.handleLoad.bind(this)}
                ref = {(iframe)=>{this.iframe = iframe}}
                height = {this.state.iframeHeight}
                style={{width:'100%',border:0}} 
                srcDoc={this.state.content}>
                </iframe>);
            }else if(this.state.mode=="markd"){
                content = <TkMarkd 
                preview = {this.props.browser}
                qid = {this.props.qid}
                onLoad={this.handleLoad.bind(this)}
                ref = {(iframe)=>{this.markd = iframe}}
                content = {this.state.markd}
                onkeyup = {this.handleKeyup.bind(this)}
                height={this.state.iframeHeight<320?320:this.state.iframeHeight}>
                </TkMarkd>;
            }
        }
        if(this.props.type>=1 && this.props.type<=4){
                let c;
                if(this.state.mode=="html"){
                    c = this.state.isContentChange?warningColor:toolbarIconColor;
                }else{
                    c = this.state.isMarkdContentChange?warningColor:toolbarIconColor;
                }
                saveTool = [
                    <IconButton tooltip='重新编辑' onClick={this.handleReset.bind(this)}>
                        <TkReset color={toolbarIconColor}/>
                    </IconButton>,
                    <IconButton tooltip='装入上次编辑内容' onClick={this.handleLoadPrev.bind(this)}>
                        <TkDownload color={toolbarIconColor}/>
                    </IconButton>,                    
                    <IconButton tooltip='存储入库' onClick={this.handleUpload.bind(this)}>
                        <TkUpload  color={c}/>
                </IconButton>];
                if(this.props.type==1){
                    saveTool.push( 
                        <IconButton tooltip='交互测试' onClick={this.handleTest.bind(this)}>
                            <TkTest  color={toolbarIconColor}/>
                        </IconButton>);
                }
                saveTool.push(
                    <IconButton tooltip='切换Markdown' onClick={this.handleMarkdown.bind(this)}>
                        <TkMarkdown  color={toolbarIconColor}/>
                    </IconButton>);                                                    
                saveTool.push(<ToolbarSeparator/>);
            if((this.state.topicsType==1 ||this.state.topicsType==2)&&this.state.mode=="html"){
                tool = [];
                if(this.state.topicsType==1){
                    tool.push(<FlatButton
                        label="自动"
                        backgroundColor = {this.state.isAuto?checkColor:undefined}
                        hoverColor = {this.state.isAuto?checkColor:undefined}
                        onClick={this.handleAutoClick.bind(this)}
                        style={{marginLeft:0,marginRight:0}}
                        icon={<TkAutomatic color={toolbarIconColor}/>}>
                    </FlatButton>);
                }
                tool.push(
                <FlatButton
                    label="手动"
                    backgroundColor = {this.state.isAuto?undefined:checkColor}
                    hoverColor = {this.state.isAuto?undefined:checkColor}
                    onClick={this.handleManualClick.bind(this)}
                    style={{marginLeft:0,marginRight:0}}
                    icon={<TkManual color={toolbarIconColor}/>}>
                </FlatButton>);                                      
                tool.push(<ToolbarSeparator />);
            }
            if(this.state.topicsType==1&&this.state.mode=="html"){ //选择题
                if(!this.state.isAuto){ //手动
                    optionTool = ['A','B','C','D','E','F'].map((item)=>{
                        return <FlatButton
                            label={item}
                            onTouchTap={this.handleOptionClick.bind(this)}
                            style={{marginLeft:0,marginRight:0,minWidth:36}}>
                        </FlatButton>;
                    });
                }
            }else if(this.state.topicsType==2&&this.state.mode=="html"){ //填空题
                optionTool = [<FlatButton
                            label={'填空'}
                            onTouchTap={this.handleFeildClick.bind(this)}
                            style={{marginLeft:0,marginRight:0}}>
                        </FlatButton>];
            }
        }
		return (<Page 
        transitionEnabled={false}
        style={{margin:32}}>
            <Toolbar style={{backgroundColor:getTypeColor(this.state.topicsType)}}>
                {!this.props.browser?
                <ToolbarGroup>
                    <ToolbarTitle text={this.props.title || 'None'} />
                    {saveTool}
                    {tool}
                    {optionTool}
                </ToolbarGroup>:<ToolbarGroup><ToolbarTitle text={getTypeString(this.state.topicsType)} /></ToolbarGroup>}
                <ToolbarGroup>
                {this.props.type==1 && !this.props.browser &&
                <DropDownMenu value={this.state.topicsType}
                    onChange={this.handleDropDownMenuChange.bind(this)}>
                    <MenuItem value={1} primaryText="选择题" />
                    <MenuItem value={2} primaryText="填空题" />
                    <MenuItem value={3} primaryText="解答题" />
                    <MenuItem value={5} primaryText="连线题" />
                    <MenuItem value={6} primaryText="排序" />
                    <MenuItem value={4} primaryText="其他" />
                    <MenuItem value={-1} primaryText="忽略" />
                    <MenuItem value={0} primaryText="未处理" />
                </DropDownMenu>
                }
                {this.state.mode=="html"&&!this.props.browser?
                    <IconButton touch={true} onTouchTap={this.handleHTMLContent.bind(this)}>
                        <CodeIcon />
                    </IconButton>:undefined}                 
                {this.props.browser?<IconButton tooltip='编辑' onClick={this.handleBrowserEdit.bind(this,this.props.index)}>
                        <TkBrowserEdit color={toolbarIconColor}/>
                    </IconButton>:undefined}
                </ToolbarGroup>                
            </Toolbar>
            {<TkHtmlViewer expend={this.state.expendHTML}>{this.state.htmlContent}</TkHtmlViewer>}
            {topic_image}
            {content}
            <TkTestDailog 
                type={this.state.mode=="html"?1:2}
                open={this.state.openTestDialog}
                content={this.state.testContent}
                closeme={this.handleTestClose.bind(this)}
                messageBar={this.messageBar.bind(this)}/>
		</Page>);
	}
};

export default TkFrame;
