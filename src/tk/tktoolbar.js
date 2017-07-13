import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
//import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';

import TkMoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import TkArrowLeft from 'material-ui/svg-icons/navigation/chevron-left';
import TkArrowRight from 'material-ui/svg-icons/navigation/chevron-right';
import TkLinkPhone from 'material-ui/svg-icons/notification/tap-and-play';
import TkAdd from 'material-ui/svg-icons/content/add';
import TkReturn from 'material-ui/svg-icons/content/reply';
import TkDelete from 'material-ui/svg-icons/action/delete';
import TkLogout from 'material-ui/svg-icons/social/people-outline';
import TkHelp from 'material-ui/svg-icons/action/help';

import TkLinkPhoneDialog from './tklinkphone';
import TkLink from './tklink';

/**
 * 主工具条
 * onToolMenu (主菜单)
 * onPrevTopic (上一题)
 * onNextTopic (下一题)
 * topicsNumber (总题数和当前题显示例如:1/8)
 */
class TkToolBar extends Component{
  constructor(props){
    super(props);
    this.state = {
      openLinkDialog:false,
      connectMac:''
    };
  }
  componentWillMount(){
      TkLink.addEventListener(this.onTkLinkMessage.bind(this));
  }
  componentDidMount(){
      TkLink.removeEventListener(this.onTkLinkMessage.bind(this));
  }  
  onTkLinkMessage(msg,data){
    switch(msg){
        case 'accept':
            this.setState({
                connectMac:TkLink.mac
            });            
            break;
        case 'refuse':
        case 'close':
            this.setState({
                connectMac:''
            }); 
            break;
    }
  }
  openLinkDialog(){
    this.setState({openLinkDialog:true});
  }
  closeLinkDialog(){
    this.setState({openLinkDialog:false});
  }
  addTopic(){
    this.props.onAddTopic();
  }
  returnBrowser(){
    this.props.onReturnBrowser();
  }
  deleteIgnore(){
    this.props.onRemoveIgnore();
  }
  logout(){
    this.props.onLogout();
  }
  help(){
    this.props.onHelp();
  }
	render(){
		return (
			<Toolbar style={{backgroundColor:'#00BCD4'}}>
        <ToolbarGroup>          
          <IconButton tooltip='选择练习册' onClick={this.props.onToolMenu}>
            <TkMoreVertIcon color='#FFFFFF'/>
          </IconButton>
          <ToolbarTitle text={'题库编辑器'} style={{color:'#FFFFFF'}}/>
        </ToolbarGroup>		        
        <ToolbarGroup>
          <IconButton tooltip={`帮助:${this.props.userName}`} onClick={this.help.bind(this)}>
            <TkHelp  color='#FFFFFF'/>
          </IconButton>            
          <IconButton tooltip={`登出:${this.props.userName}`} onClick={this.logout.bind(this)}>
            <TkLogout  color='#FFFFFF'/>
          </IconButton>          
          {!this.props.openReturnBrowser&&this.props.section?
          <IconButton tooltip='删除章节下所有忽略的题' onClick={this.deleteIgnore.bind(this)}>
            <TkDelete  color='#FFFFFF'/>
          </IconButton>:undefined}          
          {!this.props.openReturnBrowser?
          <IconButton tooltip='使用手机录入' onClick={this.openLinkDialog.bind(this)}>
            <TkLinkPhone  color={this.state.connectMac?'#FFCDD2':'#FFFFFF'} />
          </IconButton>:undefined}
          {!this.props.openReturnBrowser&&this.props.section?
          <IconButton tooltip='在当前章节加入新题' onClick={this.addTopic.bind(this)}>
            <TkAdd  color='#FFFFFF'/>
          </IconButton>:undefined}
          {this.props.openReturnBrowser?
          <IconButton tooltip='返回浏览模式并保存更改' onClick={this.returnBrowser.bind(this)}>
            <TkReturn  color='#FFFFFF'/>
          </IconButton>:undefined}

          {/*如果没有数值设置就不显示上一题、下一题导航*/}
          {/*this.props.topicsNumber.length>0?
			     [<IconButton tooltip='上一题'>
              <TkArrowLeft  color='#FFFFFF' onTouchTap={this.props.onPrevTopic}/>
            </IconButton>,
           <ToolbarTitle text={this.props.topicsNumber} style={{color:'#FFFFFF'}}/>,
			      <IconButton tooltip='下一题'  onTouchTap={this.props.onNextTopic}>
           <TkArrowRight  color='#FFFFFF'/>
           </IconButton>]:[]*/}
			</ToolbarGroup>
      <TkLinkPhoneDialog open={this.state.openLinkDialog}
          closeme={this.closeLinkDialog.bind(this)}>
      </TkLinkPhoneDialog>
		</Toolbar>
		);
	}
};

export default TkToolBar;