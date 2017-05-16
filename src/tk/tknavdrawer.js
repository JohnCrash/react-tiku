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
            selectBookIndex:0,
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
    componentDidMount(){
		//加载练习册
        fetch('/book').then(function(response){
            return response.text()
        }).then(function(data){
		  this.error = 'error msg'
          this.books = JSON.parse(data);
        }.bind(this)).catch(function(e){
            //加载数目失败
			if(this.error)
          		this.messageBar(this.error);
			else
				this.messageBar(e.toString());
        }.bind(this));
    }
    //选择章
    handleNestedListToggle(item){
        if(this.currentModule !== item.props.primaryText){
            this.currentModule = item.props.primaryText;
            this.forceUpdate();
        }
        if(!this.units[item.props.primaryText]){
            let request = `/module?Book=${this.currentBook}&Module=${item.props.primaryText}`;
            fetch(request).then(function(response){
                return response.text();
            }.bind(this)).then(function(data){
                this.error = data;
                this.units[item.props.primaryText] = JSON.parse(data);
                this.forceUpdate();
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
        if(this.currentBook !== this.books[value-1].BookName){
            this.units = {}
            this.modules = null;
            this.currentModule = null;
            this.currentBook = this.books[value-1].BookName;
            let request = `/module?Book=${this.books[value-1].BookName}`;
            fetch(request).then(function(response){
                return response.text();
            }.bind(this)).then(function(data){
                //加载章
                this.error = data;
                this.modules = JSON.parse(data);
                this.setState({selectBookIndex:value});
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
    handleUnitListToggle(item){
        if(this.currentUnit!==item.props.primaryText){
            this.currentUnit = item.props.primaryText;
            this.forceUpdate();
            //回调上一层组件，通知有一个单元选择
            if(this.props.onSelectUnit){
                if(item.props.unitJson.BookIndex){
                    let request = `/unit?BookIndex=${item.props.unitJson.BookIndex}`;
                    fetch(request).then(function(response){
                        return response.text();
                    }).then(function(data){
                        this.error = data;
                        this.props.onSelectUnit(JSON.parse(data));
                    }.bind(this)).catch(function(e){
                        if(this.error){
                            this.messageBox(this.error);
                        }else{
                            this.messageBox(e.toString());
                        }                    
                    }.bind(this));
                }else if(item.props.unitJson.UnitBegin!==undefined && item.props.unitJson.UnitEnd!==undefined){
                    let request = `/unitbyindex?UnitBegin=${item.props.unitJson.UnitBegin}&UnitEnd=${item.props.unitJson.UnitEnd}`;
                    fetch(request).then(function(response){
                        return response.text();
                    }).then(function(data){
                        this.error = data;
                        this.props.onSelectUnit(JSON.parse(data));
                    }.bind(this)).catch(function(e){
                        if(this.error){
                            this.messageBox(this.error);
                        }else{
                            this.messageBox(e.toString());
                        }                    
                    }.bind(this));                    
                }
            }
        }
    }
    render(){
        let books,modules,units;
        if(this.books){
            let i = 1;
            books = this.books.map((item)=>{
                return <MenuItem value={i++} leftIcon={<IconBook/>} primaryText={item.BookName} />;
            });
        }
        if(this.modules){
            let key = 1;
            modules = this.modules.map((item)=>{
                let unit;
                if(this.units[item.Module]){
                    unit = this.units[item.Module].map((item)=>{
                        return <ListItem leftIcon={<IconUnit />}
                        style={item.Unit==this.currentUnit?{backgroundColor:'#00BCD4'}:{}}
                        primaryTogglesNestedList={true}
                        onNestedListToggle={this.handleUnitListToggle.bind(this)}
                        unitJson={item}
                        primaryText={item.Unit}/>;
                    });
                }else{
                    unit = [<ListItem leftIcon={<IconUnit />} primaryText={'pending...'}/>];
                }
                return <ListItem key={key++}
                leftIcon={<IconBook />} 
                primaryText={item.Module}
                onNestedListToggle={this.handleNestedListToggle.bind(this)}
                primaryTogglesNestedList={true}
                nestedItems={unit}
                open={this.currentModule===item.Module}       
                />;
            });
        }
        return (
            <Drawer docked={false} width={400} ref={(drawer)=>{this.drawer = drawer}}
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
                    fullWidth={true}
                    onChange={this.handleSelectBookIndex.bind(this)}>
                    {books}
                </SelectField>
                <List /* 章节层次*/>
                    {modules}
                </List>                    
            </Drawer>
        );
    }
};

export default TkNavDrawer;