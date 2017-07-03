import React, {Component} from 'react';
/* 边栏 */
import Drawer from 'material-ui/Drawer';
/* 工具条 */
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import SelectField from 'material-ui/SelectField';
import {List, ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import TkCloseIcon from 'material-ui/svg-icons/navigation/close';
import TkAddIcon from 'material-ui/svg-icons/content/add';
import Subheader from 'material-ui/Subheader';
import Toggle from 'material-ui/Toggle';
/* 引用的图标 */
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContentSend from 'material-ui/svg-icons/content/send';
import IconBook from 'material-ui/svg-icons/file/folder';
import IconUnit from 'material-ui/svg-icons/editor/format-align-justify';
import 'whatwg-fetch';
import TkAddBookDialog from './tkaddbook';

/**
 * 书目边栏
 * 属性有:
 * messageBar 一个弹出错误消息的回调
 * onSelectUnit 当书目被选择了就用该函数通知
 * 方法:
 * toggle() 打开或者关闭边栏
 */
class TkNavDrawer extends Component{
    constructor(props){
        super(props);
        this.state = {
            openDrawer:false,
            selectBookSubject:null,
            selectBookVersion:null,
            selectBookPeriod:null,
            openAddBookDialog:false
        };
        this.units = {};
    }
    toggle(){
        this.state.openDrawer = !this.state.openDrawer;
        this.setState({openDrawer:this.state.openDrawer});
    }
    //消息对话栏
    messageBox(str){
        if(this.props.messageBar){
            this.props.messageBar(str);
        }
    }
    fetchGetJson(url,cb){
        fetch(url).then(function(response){
            return response.text()
        }).then(function(data){
		  this.error = data;
          let json = JSON.parse(data);
          if(json&&json.originalError&&json.originalError.info){
              this.error = 'ERROR:'+json.originalError.info.message;
              throw this.error;
          }
          cb(json);
        }.bind(this)).catch(function(e){
            //加载数目失败
			if(this.error)
          		this.messageBox(this.error);
			else
				this.messageBox(e.toString());
        }.bind(this));
    }
    componentDidMount(){
		//加载练习册
        this.fetchGetJson('/BookSubject',(json)=>{
            this.books = json;
        });
    }
    //选择章
    handleNestedListToggle(item){
        if(this.currentModule !== item.props.primaryText){
            this.currentModule = item.props.primaryText;
            this.forceUpdate();
        }
        if(!this.units[item.props.primaryText]){
            let request = encodeURI(`/Section?BookSubject=${this.currentBook}&BookVersion=${this.currentVersion}&BookPeriod=${this.currentPeriod}&BookChapter=${this.currentModule}`);
            this.fetchGetJson(request,(json)=>{
                this.units[item.props.primaryText] = json;
                this.forceUpdate();
            });
        }
    }
    //选择科目
    handleSelectBookSubject(event, index, value){
        if(this.currentBook !== this.books[value-1].BookSubject){
            this.currentBook = this.books[value-1].BookSubject;
            this.currentVersion = null;
            this.currentPeriod = null;
            this.currentUnit = null;
            let request = encodeURI(`/BookVersion?BookSubject=${this.currentBook}`);
            this.fetchGetJson(request,(json)=>{
                this.versions = json;
                this.periods = null;
                this.modules = null;
                this.setState({selectBookSubject:index+1,
                    selectBookVersion:null,
                    selectBookPeriod:null});
            });
        }
    }
    //选择版本
    handleSelectBookVersion(event, index, value){
        if(this.currentVersion !== this.versions[value-1].BookVersion){
            this.currentVersion = this.versions[value-1].BookVersion;
            this.currentPeriod = null;
            this.currentUnit = null;
            let request = encodeURI(`/BookPeriod?BookSubject=${this.currentBook}&BookVersion=${this.currentVersion}`);
            this.fetchGetJson(request,(json)=>{
                this.periods = json;
                this.modules = null;
                this.setState({selectBookVersion:index+1,
                    selectBookPeriod:null});
            });
        }
    }
    //选择册
    handleSelectBookPeriod(event, index, value){
        if(this.currentPeriod !== this.periods[value-1].BookPeriod){
            this.currentPeriod = this.periods[value-1].BookPeriod;
            this.currentUnit = null;
            let request = encodeURI(`/Chapter?BookSubject=${this.currentBook}&BookVersion=${this.currentVersion}&BookPeriod=${this.currentPeriod}`);
            this.fetchGetJson(request,(json)=>{
                this.modules = json;
                this.setState({selectBookPeriod:index+1});                
            });
        }
    }
    handleUnitListToggle(item){
        if(this.currentUnit!==item.props.primaryText){
            this.currentUnit = item.props.primaryText;
            this.forceUpdate();
            //回调上一层组件，通知有一个单元选择
            if(this.props.onSelectUnit){
                if(item.props.unitJson.SectionID){
                    let request = encodeURI(`/SectionPage10?SectionID=${item.props.unitJson.SectionID}`);
                    this.fetchGetJson(request,(json)=>{
                        this.props.onSelectUnit(json);
                    });
                }else{
                    this.messageBox('该节不存在SectionID');                
                }
            }
        }
    }
    add(){
        this.setState({openAddBookDialog:true});
        console.log("add..");
    }
    closeAddBook(){
        this.setState({openAddBookDialog:false});
        console.log("close..");
    }
    render(){
        let books,modules,units,versions,periods;
        if(this.books){
            let i = 1;
            books = this.books.map((item)=>{
                return <MenuItem value={i++} leftIcon={<IconBook/>} primaryText={item.BookSubject} />;
            });
        }
        if(this.versions){
            let i = 1;
            versions = this.versions.map((item)=>{
                return <MenuItem value={i++} leftIcon={<IconBook/>} primaryText={item.BookVersion} />;
            });            
        }
        if(this.periods){
            let i = 1;
            periods = this.periods.map((item)=>{
                return <MenuItem value={i++} leftIcon={<IconBook/>} primaryText={item.BookPeriod} />;
            });            
        }        
        if(this.modules){
            let key = 1;
            modules = this.modules.map((item)=>{
                let unit;
                if(this.units[item.BookUnit]){
                    unit = this.units[item.BookUnit].map((item)=>{
                        return <ListItem leftIcon={<IconUnit />}
                        style={item.BookLesson==this.currentUnit?{backgroundColor:'#00BCD4'}:{}}
                        primaryTogglesNestedList={true}
                        onNestedListToggle={this.handleUnitListToggle.bind(this)}
                        unitJson={item}
                        primaryText={item.BookLesson}/>;
                    });
                }else{
                    unit = [<ListItem leftIcon={<IconUnit />} primaryText={'pending...'}/>];
                }
                return <ListItem key={key++}
                leftIcon={<IconBook />} 
                primaryText={item.BookUnit}
                onNestedListToggle={this.handleNestedListToggle.bind(this)}
                primaryTogglesNestedList={true}
                nestedItems={unit}
                open={this.currentModule===item.BookUnit}       
                />;
            });
        }
        return (
            <Drawer docked={false} width={400} ref={(drawer)=>{this.drawer = drawer}}
                open={this.state.openDrawer}>
                <Toolbar>
                    <ToolbarTitle text='选择章节'/>
                    <ToolbarGroup>
                    <IconButton onClick={this.toggle.bind(this)}>
                        <TkCloseIcon />
                    </IconButton>                                                                     
                    </ToolbarGroup>
                </Toolbar>
                <SelectField
                    floatingLabelText={"科目"}
                    value={this.state.selectBookSubject}
                    fullWidth={true}
                    onChange={this.handleSelectBookSubject.bind(this)}>
                    {books}
                </SelectField>
                <SelectField
                    floatingLabelText={"版本"}
                    value={this.state.selectBookVersion}
                    fullWidth={true}
                    onChange={this.handleSelectBookVersion.bind(this)}>
                    {versions}
                </SelectField>    
                <SelectField
                    floatingLabelText={"册"}
                    value={this.state.selectBookPeriod}
                    fullWidth={true}
                    onChange={this.handleSelectBookPeriod.bind(this)}>
                    {periods}
                </SelectField>                             
                <List /* 章节层次*/>
                    {modules}
                </List>
                <TkAddBookDialog open={this.state.openAddBookDialog}
                    closeme={this.closeAddBook.bind(this)}>
                </TkAddBookDialog>                    
            </Drawer>
        );
    }
};

export default TkNavDrawer;