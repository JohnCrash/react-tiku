import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import 'whatwg-fetch';

const warningColor = "#D50000";
const greenColor = "#1B5E20";

class TkLogin extends Component{
    constructor(props){
        super(props);
        this.state={
            open:false,
            errorOpen:false,
            messageColor:warningColor,
            errorMsg:'',            
        };
    }
    messageBar(str,f){
		setInterval((()=>{
			this.state.errorOpen = false;
		}).bind(this),5000);
		this.setState({errorOpen:true,errorMsg:str,messageColor:f?greenColor:warningColor});
    }      
    login(user,pwd){
        let data={
            user:user?user:'',
            passwd:pwd?pwd:''
        };
        fetch('/login',{method:'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify(data)}).then(function(responese){
			return responese.text();
		}).then(function(data){
            let json = JSON.parse(data);
            if(json.result==='ok'){
                //成功登录
                this.props.onLogin(json.user);
                this.setState({open:false});
            }else{
                if(user)this.messageBar(json.result);
                this.setState({open:true});
            }
            console.log(data);
        }.bind(this)).catch(function(e){
            this.messageBar(e);
            this.setState({open:true});
        }.bind(this));
    }
    logout(){
        this.setState({open:true});
        fetch('/logout',{method:'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'}}).then(function(responese){
			return responese.text();
		}).then(function(data){
        }).catch(function(e){
            this.messageBar(e);
        });        
    }
    componentDidMount(){
        this.login();
    }
    openLogin(){
        let user = this.user.getValue();
        let pwd = this.pwd.getValue();
        this.login(user,pwd);
    }
    render(){
        return <Dialog open={this.state.open}
            title={'登录'}actions={[<FlatButton label='登录' primary={true} onTouchTap={this.openLogin.bind(this)}/>]}>
            <p>请输入用户名和密码:</p>
            <TextField
                hintText="用户名"
                floatingLabelText="请输入用户名"
                ref={(ref)=>{this.user=ref}}/>
            <TextField
                hintText="密码"
                type="password"
                floatingLabelText="请输入密码"
                ref={(ref)=>{this.pwd=ref}}/>
			<Snackbar open={this.state.errorOpen} 
				bodyStyle={{backgroundColor:this.state.messageColor}}
                message={this.state.errorMsg} 
                autoHideDuration={5000} />                 
            </Dialog>;
    }
};

export default TkLogin;

