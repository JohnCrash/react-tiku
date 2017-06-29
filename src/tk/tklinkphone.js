import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import ContentInbox from 'material-ui/svg-icons/communication/phonelink-ring';
import 'whatwg-fetch';
const warningColor = "#D50000";
const greenColor = "#1B5E20";
import Snackbar from 'material-ui/Snackbar';
import CloseIcon from 'material-ui/svg-icons/content/clear';
const IconColor = '#616161';

class TkLinkPhone extends Component{
    constructor(props){
        super(props);
        this.state = {
            devices:[],
            errorOpen:false,
            messageColor:warningColor,
            errorMsg:'',
            currentItem:-1,
            openDefiniteDialog:false,
            openDefiniteMessage:'',
            openDefiniteCB:null,
        };
    }
    componentWillMount(){
    }
    componentDidMount(){
    }
    componentWillReceiveProps(nextProps){
        this.loadDeviceInfo();
    }
    handleCommit(){
        this.props.closeme();
    }
    addPhone(){
        let name = this.deviceName.getValue();
        let mac = this.deviceMac.getValue();
        if(!name || !mac ){
            this.messageBar("请正确填写设备名称和设备MAC");
        }else{
            fetch(`/add_devices?name=${name}&mac=${mac}`,{method:'POST'}).then(function(responese){
                return responese.text();
            }).then(function(data){
                this.error = data;
                let result = Number(data);
                if(!isNaN(result)){
                    this.devices.push({id:result,device_name:name,device_mac:mac});
                    this.setState({devices:this.devices,currentItem:result});
                    this.messageBar("成功添加设备",true);
                }else{
                    throw 'invalid result!';
                }
            }.bind(this)).catch(function(e){
                if(this.error){
                    this.messageBar(this.error);
                }else{
                    this.messageBar(e.toString());
                } 
            }.bind(this));            
        }
    }
    messageBar(str,f){
		setInterval((()=>{
			this.state.errorOpen = false;
		}).bind(this),5000);
		this.setState({errorOpen:true,errorMsg:str,messageColor:f?greenColor:warningColor});
    }    
    loadDeviceInfo(){
       	fetch(`/get_devices`,{method:'POST'}).then(function(responese){
			return responese.text();
		}).then(function(data){
			this.error = data;
			this.devices = JSON.parse(data);
			this.setState({devices:this.devices});
		}.bind(this)).catch(function(e){
			if(this.error){
				this.messageBar(this.error);
			}else{
				this.messageBar(e.toString());
			} 
		}.bind(this)); 
    }
    handleTouchItem(item){
        let prop = item.props;
        if(prop && prop.unitJson)
            this.setState({currentItem:prop.unitJson.id});
    }
    handleDefinteClose(){
        this.setState({openDefiniteDialog:false,
            openDefiniteMessage:'',
            openDefiniteCB:null});
    } 
    //弹出对话栏'确定'调用cb
    definiteDialog(msg,cb){
        this.setState({openDefiniteDialog:true,
            openDefiniteMessage:msg,
            openDefiniteCB:cb});
    }
    handleRemove(id,name,item){
        this.definiteDialog(`确定要删除"${name}"设备吗?`,()=>{  
            this.handleDefinteClose();     	
            fetch(`/remove_devices?id=${id}`,{method:'POST'}).then(function(responese){
                return responese.text();
            }).then(function(data){
                this.error = data;
                if(data==='ok'){
                    for(let i=0;i<this.devices.length;i++){
                        if(this.devices[i].id==id){
                            this.devices.splice(i,1);
                            break;
                        }
                    }
                    this.setState({devices:this.devices,
                        currentItem:(id==this.state.currentItem?-1:this.state.currentItem)});
                }else{
                    throw 'invalid result!';
                }
            }.bind(this)).catch(function(e){
                if(this.error){
                    this.messageBar(this.error);
                }else{
                    this.messageBar(e.toString());
                } 
            }.bind(this)); 
        });
    }
     render(){
         let listitems = this.state.devices.map((item)=>{
             return <ListItem primaryText={`${item.device_name} (${item.device_mac})`}
                style={item.id==this.state.currentItem?{backgroundColor:'#00BCD4'}:{}}
                onNestedListToggle={this.handleTouchItem.bind(this)}
                primaryTogglesNestedList={true}
                unitJson={item}
                rightIconButton={<IconButton ><CloseIcon onTouchTap={this.handleRemove.bind(this,item.id,item.device_name)} color={IconColor}/></IconButton>}
                leftIcon={<ContentInbox />} />;
            });
         return <Dialog title={'使用设备录入'}
            actions={[<FlatButton label='取消' primary={true} onTouchTap={this.props.closeme}/>,
                <FlatButton label='连接' primary={true} onTouchTap={this.handleCommit.bind(this)}/>]}
            onRequestClose={this.props.closeme}
            open={this.props.open}>
            <p>选择你正在使用的设备:</p>
            <div style={{width:'100%',height:200,overflowY:'scroll'}}>
            <List>
                {listitems}
            </List>
            </div>
            <p>或者增加一台新设备:<FlatButton label="添加"
                onTouchTap={this.addPhone.bind(this)}
                secondary={true}/></p>
            <TextField hintText="请为设备起一个名字" floatingLabelText="设备名称" fullWidth={true}
             ref={(ref)=>{this.deviceName=ref}}/><br/>
            <TextField hintText="设备MAC地址,可以在设备网络设置中找到"  floatingLabelText="设备MAC地址"  fullWidth={true}
            ref={(ref)=>{this.deviceMac=ref}}/>
			<Snackbar open={this.state.errorOpen} 
				bodyStyle={{backgroundColor:this.state.messageColor}}
                message={this.state.errorMsg} 
                autoHideDuration={5000} /> 
            <Dialog title={'删除'}
                actions={[<FlatButton label='取消' primary={true} onTouchTap={this.handleDefinteClose.bind(this)}/>,
                <FlatButton label='确定' primary={true} onTouchTap={this.state.openDefiniteCB}/>]}
                open={this.state.openDefiniteDialog}>
                <p>{this.state.openDefiniteMessage}</p>
            </Dialog>           
         </Dialog>         
     }
};

export default TkLinkPhone;