import React, {Component, PropTypes} from 'react';
import TkMarkd from './tkmarkd';

function decode(text){
    let txt = text.toString();
    txt = txt.replace(/data:text\/x\-markdown;base64,(.*)/g,($1,$2)=>{
       return $2; 
    });
    return new Buffer(txt,'base64').toString();
}

class MarkdownElement extends Component {
  componentWillMount() {
  }
  
  render() {
    let {text} = this.props;
    return <div style={{width:"100%",height:"640px",overflowY:"scroll"}}>
        <TkMarkd preview={true}
            content={decode(text)}/>
        </div>;
  }
}

export default MarkdownElement;
