import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import ContentInbox from 'material-ui/svg-icons/communication/phonelink-ring';

class TkLinkPhone extends Component{
    constructor(props){
        super(props);
    }
    handleCommit(){
        console.log("commit...");
        this.props.closeme();
    }
    addPhone(){
        console.log("add phone...");
    }
     render(){
         return <Dialog title={'使用设备录入'}
            actions={[<FlatButton label='取消' primary={true} onTouchTap={this.props.closeme}/>,
                <FlatButton label='提交' primary={true} onTouchTap={this.handleCommit.bind(this)}/>]}
            onRequestClose={this.props.closeme}
            open={this.props.open}>
            <p>选择你正在使用的设备:</p>
            <div style={{width:'100%',height:200,overflowY:'scroll'}}>
            <List>
                <ListItem primaryText="开发机(f4:4d:30:a6:79:56)" leftIcon={<ContentInbox />} />
                <ListItem primaryText="测试机(a4:71:74:27:c5:92)" leftIcon={<ContentInbox />} />
                <ListItem primaryText="开发机(f4:4d:30:a6:79:56)" leftIcon={<ContentInbox />} />
                <ListItem primaryText="测试机(a4:71:74:27:c5:92)" leftIcon={<ContentInbox />} />
                <ListItem primaryText="开发机(f4:4d:30:a6:79:56)" leftIcon={<ContentInbox />} />
                <ListItem primaryText="测试机(a4:71:74:27:c5:92)" leftIcon={<ContentInbox />} />
                <ListItem primaryText="开发机(f4:4d:30:a6:79:56)" leftIcon={<ContentInbox />} />
                <ListItem primaryText="测试机(a4:71:74:27:c5:92)" leftIcon={<ContentInbox />} />
                <ListItem primaryText="开发机(f4:4d:30:a6:79:56)" leftIcon={<ContentInbox />} />
                <ListItem primaryText="测试机(a4:71:74:27:c5:92)" leftIcon={<ContentInbox />} />
                <ListItem primaryText="开发机(f4:4d:30:a6:79:56)" leftIcon={<ContentInbox />} />
                <ListItem primaryText="测试机(a4:71:74:27:c5:92)" leftIcon={<ContentInbox />} />
                <ListItem primaryText="开发机(f4:4d:30:a6:79:56)" leftIcon={<ContentInbox />} />
                <ListItem primaryText="测试机(a4:71:74:27:c5:92)" leftIcon={<ContentInbox />} />                                                                                                
            </List>
            </div>
            <p>或者增加一台新设备:<FlatButton label="添加"
                onTouchTap={this.addPhone.bind(this)}
                secondary={true}/></p>
            <TextField hintText="设备名称" fullWidth={true}/><br/>
            <TextField hintText="设备mac地址,可以在设备网络设置中找到" fullWidth={true}/>
         </Dialog>
     }
};

export default TkLinkPhone;