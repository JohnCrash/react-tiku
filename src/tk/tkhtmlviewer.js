import React,{Component} from 'react';
import transitions from 'material-ui/styles/transitions';

const styles = {
  root: {
    background: '#f8f8f8',
    borderTop: 'solid 1px #e0e0e0',
  },
  markdown: {
    overflow: 'auto',
    background: '#f8f8f8',
    maxHeight: 1400,
    transition: transitions.create('max-height', '800ms', '0ms', 'ease-in-out'),
    marginTop: 0,
    marginBottom: 0,
  },
  markdownRetracted: {
    maxHeight: 0,
  },
  description: {
    background: '#ffffff',
    overflow: 'auto',
    padding: '10px 20px 0',
    marginTop: 0,
    marginBottom: 0,
  },
  codeBlockTitle: {
    cursor: 'pointer',
  },
};

/**
 * html源码查看
 */
class TkHtmlViewer extends Component{  
    constructor(){
        super();
    }
    render(){
        let codeStyle = Object.assign({}, styles.markdown, styles.markdownRetracted);
        if(this.props.expend){
            codeStyle = styles.markdown;
        }
        return (
        <div style={codeStyle}>
            {this.props.children}
        </div>
        );
    }
}

export default TkHtmlViewer;