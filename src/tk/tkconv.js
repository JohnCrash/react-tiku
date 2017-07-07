import htmldom from './htmldom';

function removeJavaScriptTag(html){
	return htmldom.writeHTML(htmldom.parseDOM(html),(node)=>{
		if(node.type=="script")
			return null;
		else
			return node;
	})
}

function toHtmlDocument(body){
    if(!body)return body;
    let newbody = removeJavaScriptTag(body);
    return `<html>
    <head>
        <link rel="stylesheet" type="text/css" href="css/reset.css">
        <link rel="stylesheet" type="text/css" href="css/style.css">
        <link rel="stylesheet" type="text/css" href="css/ti.css">
        <link rel="stylesheet" type="text/css" href="css/topics.css">
    </head>
    <body>${newbody}</body>
    <script inner-script>
        function enumAllElement(node,cb){
            cb(node);
            for(let i = 0;i < node.children.length;i++){
                enumAllElement(node.children[i],cb);
            }
        }
        /**
         * 对齐多选的按钮的长度，填空题自动匹配内容
         */
        function autoResize(){
            var opts = [];
            console.log('autoResize');
            enumAllElement(document,function(node){
                if(node.hasAttribute&&(node.hasAttribute('option-btn')||node.hasAttribute('option-correct'))){
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
                }
            });
        }		
        function option_onclick(node){
            if(node.hasAttribute('option-btn')){
                var value = node.getAttribute('option-btn');
                node.removeAttribute('option-btn');
                node.setAttribute('option-correct',value);
            }else if(node.hasAttribute('option-correct')){
                var value = node.getAttribute('option-correct');
                node.removeAttribute('option-correct');
                node.setAttribute('option-btn',value);	
            }
            autoResize();
        }
        function answer_onchange(node){
            node.removeAttribute('value');
            node.setAttribute('value',node.value);
            if(node.hasAttribute('answer-feild')){
                node.setAttribute('answer-feild',node.value);
                autoResize();					
            }else
                node.setAttribute('answer-feild2',node.value);

        }
        document.body.onload=function(){
            autoResize();
        }			
    </script>
    </html>`;
}

function toHtmlDocumentPreview(body){
    if(!body)return body;
    let newbody = removeJavaScriptTag(body);
    return `<html>
    <head>
        <link rel="stylesheet" type="text/css" href="css/reset.css">
        <link rel="stylesheet" type="text/css" href="css/style.css">
        <link rel="stylesheet" type="text/css" href="css/ti.css">
        <link rel="stylesheet" type="text/css" href="css/topics.css">
    </head>
    <body>${newbody}</body>
    <script inner-script>
        function enumAllElement(node,cb){
            cb(node);
            for(let i = 0;i < node.children.length;i++){
                enumAllElement(node.children[i],cb);
            }
        }
        /**
         * 对齐多选的按钮的长度，填空题自动匹配内容
         */
        function autoResize(){
            var opts = [];
            console.log('autoResize');
            enumAllElement(document,function(node){
                if(node.hasAttribute&&(node.hasAttribute('option-btn')||node.hasAttribute('option-correct'))){
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
                }
            });
        }		
        document.body.onload=function(){
            autoResize();
        }			
    </script>
    </html>`;
}

export {toHtmlDocument,toHtmlDocumentPreview};