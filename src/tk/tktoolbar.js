import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
//import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';

import TkMoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import TkArrowLeft from 'material-ui/svg-icons/navigation/chevron-left';
import TkArrowRight from 'material-ui/svg-icons/navigation/chevron-right';

/**
 * 主工具条
 * onToolMenu (主菜单)
 * onPrevTopic (上一题)
 * onNextTopic (下一题)
 * topicsNumber (总题数和当前题显示例如:1/8)
 */
class TkToolBar extends Component{
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
          {/*如果没有数值设置就不显示上一题、下一题导航*/}
          {this.props.topicsNumber.length>0?
			     [<IconButton tooltip='上一题'>
              <TkArrowLeft  color='#FFFFFF' onTouchTap={this.props.onPrevTopic}/>
            </IconButton>,
           <ToolbarTitle text={this.props.topicsNumber} style={{color:'#FFFFFF'}}/>,
			      <IconButton tooltip='下一题'  onTouchTap={this.props.onNextTopic}>
           <TkArrowRight  color='#FFFFFF'/>
           </IconButton>]:[]}
			</ToolbarGroup>				
		</Toolbar>
		);
	}
};

export default TkToolBar;