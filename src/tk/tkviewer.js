import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';

var topic = '<div><h2>Hello</h2><RaisedButton label="Primary" /><h2>World</h2></div>'
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();

class TkViewer extends Component{
	render(){
		return (htmlToReactParser.parse(topic));
		//return <div><RaisedButton label="Primary" /></div>;
		//return React.createElement(RaisedButton,{label:"A.选择",fullWidth:"true"})
	}
};

export default TkViewer;