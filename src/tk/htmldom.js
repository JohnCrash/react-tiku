import htmlparser2 from 'htmlparser2';

const closedTag={link:1,meta:1,img:1,hr:1,br:1,comment:1};

function attributeString(attr){
    let str = "";
    for(let k in attr){
        str += ` ${k}="${attr[k]}"`;
    }
    return str;
}
/**
 * 将dom转换为HTML文本，每个节点都通过cb过滤
 */
function writeHTML(dom,cb){
    var str = "";
    for(let i = 0;i<dom.length;i++){
        let node = cb?cb(dom[i]):dom[i];
        if(node){
            if(node.type=="tag"||node.type=="script"){
                let attr = attributeString(node.attribs);
                if(node.name in closedTag){
                    str += `<${node.name}${attr}/>`;
                }else{
                    str += `<${node.name}${attr}>`;
                    str += writeHTML(node.children,cb);
                    str += `</${node.name}>`;
                }
            }else if(node.type=="text"){
                str += node.data;
            }
        }
    }
    return str;
}

/**
 * 遍历每一个节点
 */
function foreachNode(dom,cb,data,parent){
    if(dom){
        for(let i=0;i<dom.length;i++){
            cb(dom[i],data,parent);
            foreachNode(dom[i].children,cb,data,dom[i]);
        }
    }
}
export default {
    parseDOM: htmlparser2.parseDOM,
    writeHTML:writeHTML,
    foreachNode:foreachNode,
};