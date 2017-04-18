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

class TkToolBar extends Component{
	render(){
		return (
			<Toolbar>
			<ToolbarGroup>
              <IconButton tooltip='重新编辑'>
                <TkReset />
              </IconButton>
			  <IconButton tooltip='入库'>
                <TkSave />
              </IconButton>		
			  <ToolbarSeparator />
              <IconButton tooltip='编辑知识点'>
                <TkTag />
              </IconButton>			  
			  <ToolbarSeparator />
              <IconButton tooltip='标记选择题'>
                <TkOption />
              </IconButton>
			  <IconButton tooltip='标记填空题'>
                <TkEdit />
              </IconButton>			
  			  <IconButton tooltip='标记解答题'>
                <TkEdit2 />
              </IconButton>	
			  <ToolbarSeparator />
			  <IconButton tooltip='删除选择'>
                <TkDelete />
              </IconButton>				
			</ToolbarGroup>				
		</Toolbar>
		);
	}
};

export default TkToolBar;