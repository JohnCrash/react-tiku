import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';

import TkReset from 'material-ui/svg-icons/action/delete';
import TkSave from 'material-ui/svg-icons/file/cloud-upload';
import TkOption from 'material-ui/svg-icons/editor/format-list-numbered';
import TkEdit from 'material-ui/svg-icons/editor/mode-edit';
import TkEdit2 from 'material-ui/svg-icons/editor/format-align-justify';
import TkDelete from 'material-ui/svg-icons/content/content-cut';
import TkTag from 'material-ui/svg-icons/action/find-in-page';
import TkMoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import TkArrowLeft from 'material-ui/svg-icons/navigation/chevron-left';
import TkArrowRight from 'material-ui/svg-icons/navigation/chevron-right';

class TkToolBar extends Component{
	render(){
		return (
			<Toolbar style={{backgroundColor:'#00BCD4'}}>
			<ToolbarGroup>
              <IconButton tooltip='选择练习册' onClick={this.props.toolMenu}>
                <TkMoreVertIcon color='#FFFFFF'/>
              </IconButton>
              <ToolbarSeparator />
              <IconButton tooltip='重新编辑' onClick={this.props.toolReset}>
                <TkReset  color='#FFFFFF'/>
              </IconButton>
			  <IconButton tooltip='入库'>
                <TkSave  color='#FFFFFF'/>
              </IconButton>		
			  <ToolbarSeparator />
              <IconButton tooltip='编辑知识点'>
                <TkTag  color='#FFFFFF'/>
              </IconButton>			  
			  <ToolbarSeparator />
              <IconButton tooltip='标记选择题'>
                <TkOption  color='#FFFFFF'/>
              </IconButton>
			  <IconButton tooltip='标记填空题'>
                <TkEdit  color='#FFFFFF'/>
              </IconButton>			
  			  <IconButton tooltip='标记解答题'>
              <TkEdit2  color='#FFFFFF'/>
          </IconButton>	
			  <ToolbarSeparator />
			  <IconButton tooltip='删除选择'>
          <TkDelete  color='#FFFFFF'/>
        </IconButton>		
      </ToolbarGroup>		        
      <ToolbarGroup>
			  <IconButton tooltip='上一题'>
          <TkArrowLeft  color='#FFFFFF' onTouchTap={this.props.onPrevTopic}/>
        </IconButton>
        <ToolbarTitle text={this.props.topicsNumber} style={{color:'#FFFFFF'}}/>
			  <IconButton tooltip='下一题'  onTouchTap={this.props.onNextTopic}>
          <TkArrowRight  color='#FFFFFF'/>
        </IconButton>	        		
			</ToolbarGroup>				
		</Toolbar>
		);
	}
};

export default TkToolBar;