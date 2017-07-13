import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import MarkdownElement from './markd-element';
import {Tabs, Tab} from 'material-ui/Tabs';
import Slider from 'material-ui/Slider';
import topics from './help/topics.md';
import math1 from './help/math1.md';
import math2 from './help/math2.md';
import math3 from './help/math3.md';
//import readme from './help/README.md';

class TkHelp extends Component{
  constructor(props){
    super(props);
  }
  componentWillReceiveProps(nextProps){
  }
  handleClose(){
      this.props.onClose();
  }
  render(){
      setTimeout(()=>{
          this.forceUpdate();
      },500);
      return <Dialog title={"帮助"}
        open={this.props.open}
        onRequestClose={this.handleClose.bind(this)}>
        <Tabs>        
            <Tab label="题型编辑" >
                <MarkdownElement text={topics}/>
            </Tab>
            <Tab label="基本公式输入" >
                <MarkdownElement text={math1}/>
            </Tab>
            <Tab label="高级公式" >
                <MarkdownElement text={math2}/>
            </Tab>
            <Tab label="数学符号" >
                <MarkdownElement text={math3}/>
            </Tab>                     
        </Tabs>
      </Dialog>;
  }
};

export default TkHelp;