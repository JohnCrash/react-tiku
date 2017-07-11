import React, {Component} from 'react';

function editormd_preview(body){
    return `<html>
    <head>
        <link rel="stylesheet" type="text/css" href="editormd/css/editormd.preview.css">
        <link rel="stylesheet" type="text/css" href="css/topics.css">
    </head>
    <body>
        <div id="layout">
            <div id="test-editormd-view2">
                <textarea id="append-test" style="display:none;">${body}</textarea>
            </div>
        </div>
        <script src="editormd/examples/js/jquery.min.js"></script>
        <script src="editormd/lib/marked.min.js"></script>
        <script src="editormd/lib/prettify.min.js"></script>
        
        <script src="editormd/lib/raphael.min.js"></script>
        <script src="editormd/lib/underscore.min.js"></script>
        <script src="editormd/lib/sequence-diagram.min.js"></script>
        <script src="editormd/lib/flowchart.min.js"></script>
        <script src="editormd/lib/jquery.flowchart.min.js"></script>

        <script src="editormd/editormd.js"></script>
        <script type="text/javascript">
            $(function() {
            testEditormdView2 = editormd.markdownToHTML("test-editormd-view2", {
                htmlDecode      : "style,script,iframe",  // you can filter tags decode
                emoji           : true,
                taskList        : true,
                tex             : false,
                mathjax         : true,
                flowChart       : true,  // 默认不解析
                sequenceDiagram : true,  // 默认不解析
            });                 
        });
        </script>
    </body>
    </html>`
}

function editormd(body,height){
    return `<!DOCTYPE html>
<html lang="zh">
    <head>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="editormd/css/editormd.css" />
        <link rel="stylesheet" type="text/css" href="css/topics.css">
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
                    imageUpload : true,
                    imageUploadURL : "upload_image",
                    toolbarIcons : function() {
                        return [
            "undo", "redo", "|", 
            "bold", "del", "italic", "quote","|", 
            "h1", "h2", "h3", "|", 
            "list-ul", "list-ol", "hr", "|",
            "link", "reference-link", "image", "table", "html-entities", "|",
            "watch", "preview"]
                    }               
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
    constructor(props){
        super(props);
        let content = props.content?props.content:"";
        this.state={
            iframeHeight:0,
            content:props.preview?editormd_preview(content):editormd(content,props.height)
        };
    }
    componentWillMount(){  
    }
    componentWillReceiveProps(nextProps){
       if(this.props.qid!==nextProps.qid || nextProps.preview || !this.markd){
            let content = nextProps.content?nextProps.content:"";
            let cc = nextProps.preview?editormd_preview(content):editormd(content,nextProps.height);
            this.setState({content:cc});
       }
    }    
    recalcIFrameSize(){
        let height = 0;
        for(let i = 0;i<this.body.children.length;i++){
            height += this.body.children[i].scrollHeight;
        }
        console.log('markd.recalcIFrameSize '+height);
        this.setState({iframeHeight:height});        
    }      
    handleLoad(){
        if(!this.props.preview){
            if(this.iframe && this.iframe.contentDocument){
                this.markd = this.iframe.contentDocument.markd;
                if(this.markd && 'on' in this.markd)
                    this.markd.on('change',this.props.onkeyup);
                this.iframe.contentDocument.body.onresize=this.handleSizeChange.bind(this);
            }
            if(this.props.onLoad){
                this.props.onLoad();
            }
        }else{
            if(this.iframe && this.iframe.contentDocument){
                var document = this.iframe.contentDocument;
                var body = document.body;     
                this.content = body.outerHTML;
                this.document = document;
                this.body = body;           
                var id = setInterval((()=>{
                    clearInterval(id);
                    this.recalcIFrameSize();
                }).bind(this),510);
                this.recalcIFrameSize();                
            }
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
            var prc;
            //前后缓存区
            if(this.markd.previewCurrent==0){
                prc = this.markd.previewContainer[0];
            }else{
                prc = this.markd.previewContainer2[0];
            }
            return tb.scrollHeight + prc.scrollHeight;
        }
    }
    doFullScreen(){
        if(this.markd){
            this.markd.doFullScreen();
        }
    }
    handleSizeChange(){
        this.doFullScreen();
    }
    render(){
       return <iframe
          onLoad={this.handleLoad.bind(this)}
          ref = {(iframe)=>{this.iframe = iframe}}
          style={{width:'100%',border:0}}
          height={this.props.preview?this.state.iframeHeight:this.props.height}
          scrolling={'no'}
          srcDoc={this.state.content}>
        </iframe>
    }
};

export default TkMarkd;