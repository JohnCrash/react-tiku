import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import IconButton from 'material-ui/IconButton';
import TkCloseIcon from 'material-ui/svg-icons/navigation/close';

class TkNavDrawer extends Component{
    constructor(props){
        super(props);
        this.state = {
            openDrawer:false
        };
        this.actionClose = false;
    }
    toggle(){
        this.actionClose = true;
        this.setState({openDrawer:false},()=>{
            this.actionClose = false;
        });
    }
    render(){
        if(!this.actionClose){
            this.state.openDrawer = this.props.open;
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
            </Drawer>
        );
    }
};

export default TkNavDrawer;