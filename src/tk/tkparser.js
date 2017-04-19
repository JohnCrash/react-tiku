import React from 'react';
var camelize = require('underscore.string.fp/camelize');
var toPairs = require('ramda/src/toPairs');
var reduce = require('ramda/src/reduce');
var camelCaseAttrMap = require('./camel-case-attribute-names');

/*
 * tkparser将把html字符串转换为React原件
 * 例如：
 * var topic = '<div><h2>Hello</h2> <RaisedButton label="Primary"></RaisedButton> <h2>World</h2> </div>'
 * render(){
 * 	return TkParser.parserElement(topic,[RaisedButton])
 * }
 * 注意两点1.如果你的html中包括React原件标签需要注册如：[RaisedButton]
 *	2.不能这么写html标签<RaisedButton />需要写成<RaisedButton></RaisedButton>分解其不能正确分解
 */
// https://github.com/facebook/react/blob/15.0-stable/src/renderers/dom/shared/ReactDOMComponent.js#L457
var voidElementTags = [
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', 'menuitem', 'textarea',
];

function createStyleJsonFromString(styleString) {
  styleString = styleString || '';
  var styles = styleString.split(';');
  var singleStyle, key, value, jsonStyles = {};
  for (var i = 0; i < styles.length; ++i) {
    singleStyle = styles[i].split(':');
    key = camelize(singleStyle[0]);
    value = singleStyle[1];
    if (key.length > 0 && value.length > 0) {
      jsonStyles[key] = value;
    }
  }
  return jsonStyles;
}

/*
 * 创建React节点
 */
function createElement(node,index,data,children,elementTable){
  var elementProps = {
    key: index,
  };
  if (node.attribs) {
    elementProps = reduce(function(result, keyAndValue) {
      var key = keyAndValue[0];
      var value = keyAndValue[1];
      key = camelCaseAttrMap[key.replace(/[-:]/, '')] || key;
      if (key === 'style') {
        value = createStyleJsonFromString(value);
      } else if (key === 'class') {
        key = 'className';
      }
      if (typeof value === 'string') {
        value = value;
      }
      result[key] = value || key;
      return result;
    }, elementProps, toPairs(node.attribs));
  }

  children = children || [];
  var allChildren = data != null ? [data,].concat(children) : children;
  if(elementTable[node.name]){
	  return React.createElement.apply(
		null, [elementTable[node.name], elementProps,].concat(allChildren)
	  );		  
  }else{
	  return React.createElement.apply(
		null, [node.name, elementProps,].concat(allChildren)
	  );	
  }
}

/*
 * 接口函数:
 * shouldProcessNode(node) : 是否处理该节点node,如果返回false将不处理该节点,返回true处理。
 * processNode(node,children,index) : 处理具体的节点node
 */
function ProcessingInstructions(elementTable){
	return {
		defaultProcessingInstructions:[
		{
			shouldProcessNode:(node)=>{
				return true;
			},
			processNode:(node, children, index)=>{
				if (node.type === 'text') {
				  return node.data;
				} else if (node.type === 'comment') {
				  // FIXME: The following doesn't work as the generated HTML results in
				  // "&lt;!--  This is a comment  --&gt;"
				  // return '<!-- ' + node.data + ' -->';
				  return false;
				}				
				if (voidElementTags.indexOf(node.name) > -1) {
					return createElement(node, index,null,null,elementTable);
				} else {
					return createElement(node, index, node.data, children,elementTable);
				}
			}
		},],
	};
}

/*
 * 函数htmlElement将把html字符串转换为React Element
 */
export default {
	htmlElement:(html,elementTable)=>{
		var HtmlToReactParser = require('html-to-react').Parser;
		var htmlToReactParser = new HtmlToReactParser();
		var eleTable = {}
		for(var i in elementTable){
			var cls = elementTable[i]
			eleTable[cls.name.toLowerCase()] = cls
		}
		return (htmlToReactParser.parseWithInstructions(html,
			(node)=>{
				return true;
			},
			new ProcessingInstructions(eleTable).defaultProcessingInstructions));
	},
}
