React.DOM.RaisedButton = React.createFactory(RaisedButton)
/*
 * 使用React.createElement直接创建节点
 * 尝试使用字符串'RaisedButton'来创建RaisedButton，但是不工作
 */
function useFunctionCreateElement(){
	var child = [
		//React.createElement('h2',null,'Hello'),
		//React.createElement('RaisedButton',{label:"Primary"},' '),
		//React.createElement('h2',null,'World'),
		React.DOM.h2(null,'Hello'),
		React.DOM.RaisedButton({label:"Primary"}),
		React.DOM.h2('h2',null,'World'),
	]
	var div = React.createElement('div',null,child)
	return div
}