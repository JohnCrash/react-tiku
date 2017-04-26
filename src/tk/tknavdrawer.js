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
import Subheader from 'material-ui/Subheader';
import Toggle from 'material-ui/Toggle';
/* 引用的图标 */
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContentSend from 'material-ui/svg-icons/content/send';
import IconBook from 'material-ui/svg-icons/file/folder';
import IconUnit from 'material-ui/svg-icons/editor/format-align-justify';
import 'whatwg-fetch'

class TkNavDrawer extends Component{
    constructor(props){
        super(props);
        this.state = {
            openDrawer:false,
            books:[],
            selectBookIndex:0,
            modules:[],
            units:{},
        };
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
    componentDidMount(){
        //加载练习册列表
    }
    //选择章
    handleNestedListToggle(item){
        this.currentModule = item.props.primaryText;
        if(!this.state.units[item.props.primaryText]){
            let request = `/module?Book=${this.currentBook}&Module=${item.props.primaryText}`;
            fetch(request).then(function(response){
                return response.text();
            }.bind(this)).then(function(data){
                this.error = data;
                let unit = JSON.parse(data);
                this.state.units[item.primaryText] = (unit.map((item)=>{
                    return (<ListItem leftIcon={<IconUnit />} primaryText={unit.BookUnit} />);
                }));
                this.setState();
            }.bind(this)).catch(function(e){
                //加载出错
                if(this.error){
                    this.messageBox(this.error);
                }else{
                    this.messageBox(e.toString());
                }
            }.bind(this));
        }
    }
    //选择练习册
    handleSelectBookIndex(event, index, value){
        this.setState({selectBookIndex:value});
        this.currentBook = this.props.books[value-1].BookName;
        let request = `/module?Book=${this.props.books[value-1].BookName}`;
        fetch(request).then(function(response){
            return response.text();
        }.bind(this)).then(function(data){
            //加载章
            this.error = data;
            let key = 1;
            this.setState({modules:JSON.parse(data).map((item)=>{
                //映射章
                return (<ListItem key={key++} 
                leftIcon={<IconBook />} 
                primaryText={item.Module}
                onNestedListToggle={this.handleNestedListToggle.bind(this)}
                primaryTogglesNestedList={true}
                nestedItems={this.state.units[item.Module]}
                />);
            })});
        }.bind(this)).catch(function(e){
            //加载出错
            if(this.error){
                this.messageBox(this.error);
            }else{
                this.messageBox(e.toString());
            }
        }.bind(this));
    }
    render(){
        let books
        if(this.props.books){
            let i = 1;
            books = this.props.books.map((item)=>{
                return <MenuItem value={i++} leftIcon={<IconBook/>} primaryText={item.BookName} />;
            });
        }
        return (
            <Drawer ref={(drawer)=>{this.drawer = drawer}}
                open={this.state.openDrawer}>
                <Toolbar>
                    <ToolbarTitle text='选择练习册'/>
                    <ToolbarGroup>
                    <IconButton onClick={this.toggle.bind(this)}>
                        <TkCloseIcon />
                    </IconButton>                                                                     
                    </ToolbarGroup>
                </Toolbar>
                <SelectField /* 练习册选择 */
                    value={this.state.selectBookIndex}
                    onChange={this.handleSelectBookIndex.bind(this)}>
                    {books}
                </SelectField>
                <List /* 章节层次*/>
                    {this.state.modules}
                </List>                    
            </Drawer>
        );
    }
};

export default TkNavDrawer;