import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class TkAddBookDialog extends Component{
    constructor(props){
        super(props);
    }
    handleCommit(){

    }
     render(){
         return <Dialog title={'加入新的书目'}
            actions={[<FlatButton label='取消' primary={true} onTouchTap={this.props.closeme}/>,
                <FlatButton label='提交' primary={true} onTouchTap={this.handleCommit.bind(this)}/>]}
            onRequestClose={this.props.closeme}
            open={this.props.open}>
         <div>
         <textarea style={{width:'100%',resize:'none'}} rows={32} autofocus></textarea >
         </div>
         </Dialog>
     }
};

export default TkAddBookDialog;