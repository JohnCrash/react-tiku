import React, {Component} from 'react';

function editormd(body,height){
    return `<!DOCTYPE html>
<html lang="zh">
    <head>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="editormd/css/editormd.css" />
    </head>
    <body>
        <div id="layout">
            <div id="tk-editormd">
                <textarea style="display:none;">${body}</textarea>
            </div>
        </div>
        <script src="editormd/examples/js/jquery.min.js"></script>
        <script src="editormd/editormd.js"></script>
        <script type="text/javascript">
            $(function() {
                document.markd = editormd("tk-editormd", {
                    width: "100%",
                    height: ${height},
                    path : 'editormd/lib/',
                    tex  : false,
                    mathjax : true,
                    taskList : true,
                    saveHTMLToTextarea : true,
                    flowChart : true,
                    sequenceDiagram : true,
                    toolbarIcons : function() {
                        return [
            "undo", "redo", "|", 
            "bold", "del", "italic", "quote","|", 
            "h1", "h2", "h3", "|", 
            "list-ul", "list-ol", "hr", "|",
            "link", "reference-link", "image", "code", "preformatted-text", "code-block", "table", "html-entities", "|",
            "watch", "preview", "fullscreen", "|",
            "help"]
                    },                    
                });
            });
        </script>
    </body>
</html>`;
}
/**
 * Markdown编辑
 * 使用editor.md
 */
class TkMarkd extends Component{
    constructor(){
        super();
        this.state={
            content:''
        };
    }
    componentWillMount(){
        let content = this.props.content?this.props.content:"";
        this.setState({content:editormd(content,this.props.height)});
    }    
    handleLoad(){
        if(this.props.onLoad){
            this.props.onLoad(this.iframe);
        }
        if(this.iframe && this.iframe.contentDocument){
            this.markd = this.iframe.contentDocument.markd;
            this.markd.on('change',this.props.onkeyup);
        }
    }
    //读取当前编辑的markdown
    getMarkdown(){
        if(this.markd){
            return this.markd.getMarkdown();
        }
    }
    //读取当前的HTML
    getHTML(){
        if(this.markd){
            return this.markd.getHTML();
        }        
    }
    getHeight(){
        if(this.markd){
            var tb = this.markd.toolbar[0];
            var prc = this.markd.previewContainer[0];
            return tb.scrollHeight + prc.scrollHeight;
        }
    }
    doFullScreen(){
        if(this.markd){
            this.markd.doFullScreen();
        }
    }
    render(){
       return <iframe
          onLoad={this.handleLoad.bind(this)}
          ref = {(iframe)=>{this.iframe = iframe}}
          style={{width:'100%',border:0}}
          height={this.props.height}
          scrolling={'no'}
          srcDoc={this.state.content}>
        </iframe>
    }
};

export default TkMarkd;