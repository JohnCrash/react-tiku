import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

/**
 * 交互测试
 */
class TkTestDialog extends Component{
    constructor(){
        super();
        this.state={
            openTestDialog:false,
            iframeHeight:0,
            content:"",
        };
    }
    toHtmlDocument(body){
		return `<html>
		<head>
			<link rel="stylesheet" type="text/css" href="css/reset.css">
			<link rel="stylesheet" type="text/css" href="css/style.css">
			<link rel="stylesheet" type="text/css" href="css/ti.css">
		</head>
		<body>${body}</body>
		<script inner-script>
			function enumAllElement(node,cb){
				cb(node);
				for(let i = 0;i < node.children.length;i++){
					enumAllElement(node.children[i],cb);
				}
			}
            var correct = '';
            var select;
			/**
			 * 对齐多选的按钮的长度，填空题自动匹配内容
			 */
			function autoResize(){
				var opts = [];
				enumAllElement(document,function(node){
					if(node.hasAttribute&&(node.hasAttribute('option-btn')||node.hasAttribute('option-correct'))){
                        if(node.hasAttribute('option-correct')){
                           var value = node.getAttribute('option-correct')
                           correct = value;
                           node.removeAttribute('option-correct');
                           node.setAttribute('option-btn',value);	
                        }
						opts.push(node);
					}
				});
				if(opts.length>1){
					var maxWidth = 0;
					for(let i=0;i<opts.length;i++){
						opts[i].style.width = '';
					}					
					for(let i=0;i<opts.length;i++){
						let w = opts[i].clientWidth - 2*opts[i].offsetLeft;
						maxWidth = w>maxWidth?w:maxWidth;
					}
					maxWidth-=47;
					for(let i=0;i<opts.length;i++){
						opts[i].style.width = maxWidth.toString()+'px';
					}		
				}
				opts = [];
				enumAllElement(document,function(node){
					if(node.hasAttribute&&(node.hasAttribute('answer-feild'))){
						node.style.width = 0;
						let w = Math.ceil(node.scrollWidth/48)*48;
						node.style.width = w.toString()+'px';
                        correct += node.getAttribute('value');
                        node.setAttribute('value','');	
					}
                    if(node.hasAttribute&&(node.hasAttribute('answer-feild2'))){
                         node.setAttribute('value','');	
                         correct += node.getAttribute('value');
                    }
				});
			}
			function option_onclick(current){
                if(current.hasAttribute('option-btn')){
                    enumAllElement(document,function(node){
                        if(node.hasAttribute&&(node.hasAttribute('option-btn')||node.hasAttribute('option-correct'))){
                            if(node.hasAttribute('option-correct')){
                                var value = node.getAttribute('option-correct');
                                node.removeAttribute('option-correct');
                                node.setAttribute('option-btn',value);
                            }
                        }
                    });
                    select = current.getAttribute('option-btn');
                    current.removeAttribute('option-btn');
                    current.setAttribute('option-correct',select);

                }
			}
			function answer_onchange(node){
                select = '';
				enumAllElement(document,function(node){
					if(node.hasAttribute&&(node.hasAttribute('answer-feild'))){
                        select += node.value;
					}
                    if(node.hasAttribute&&(node.hasAttribute('answer-feild2'))){
                         select += node.value;
                    }
				});                
			}
			document.body.onload=function(){
				autoResize();
			}
            document.body.isRight=function(){
                console.log(select);
                return select==correct;
            }	
		</script>
		</html>`;
    }
    recalcIFrameSize(){
        let height = 0;
        for(let i = 0;i<this.body.children.length;i++){
            height += this.body.children[i].scrollHeight;
        }
        this.setState({iframeHeight:height});        
    }    
    handleTestLoad(){
        var document = this.iframe.contentDocument;
        var body = document.body;     
        this.content = body.outerHTML;
        this.document = document;
        this.body = body;           
        var id = setInterval((()=>{
            clearInterval(id);
            this.recalcIFrameSize();
        }).bind(this),100);
        this.recalcIFrameSize();
    }
    handleCommit(){
        if(this.body && this.body.isRight){
            if(this.body.isRight()){
                this.props.messageBar('回答正确',1);
            }else{
                this.props.messageBar('回答错误');
            }
        }
        this.props.closeme();
    }
    render(){
        let content = this.toHtmlDocument(this.props.content);
        return <Dialog title={'交互测试'}
            actions={[<FlatButton label='取消' primary={true} onTouchTap={this.props.closeme}/>,
                <FlatButton label='提交' primary={true} onTouchTap={this.handleCommit.bind(this)}/>]}
            modal={false} 
            onRequestClose={this.props.closeme}
            open={this.props.open}>
                <iframe
                onLoad={this.handleTestLoad.bind(this)}
                ref = {(iframe)=>{this.iframe = iframe}}
                height = {this.state.iframeHeight}
                style={{width:'100%',border:0}} 
                srcDoc={content}>
                </iframe>
            </Dialog>
    }
};

export default TkTestDialog;