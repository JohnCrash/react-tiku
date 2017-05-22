import React, {Component} from 'react';

function editormd(body,height){
    return `<!DOCTYPE html>
<html lang="zh">
    <head>
        <meta charset="utf-8" />
        <title>Tex 科学公式语言 (TeX/LaTeX) - Editor.md examples</title>
        <link rel="stylesheet" href="editormd/examples/css/style.css" />
        <link rel="stylesheet" href="editormd/css/editormd.css" />
        <link rel="shortcut icon" href="https://pandao.github.io/editor.md/favicon.ico" type="image/x-icon" />
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
                    tex  : true,
                    saveHTMLToTextarea : true,
                    flowChart : true,
                    sequenceDiagram : true,
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