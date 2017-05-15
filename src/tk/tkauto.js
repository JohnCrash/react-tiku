import htmldom from './htmldom';

//追溯父节点链条
function inheritList(node){
    let result = [];
    while( node && node.parent ){
        result.push(node);
        node = node.parent;
    }
    return result;
}
/**
 * 返回最近的父节点
 */
function matchParent(options){
    if(options.length < 3)
        return null;
    let inherit = [];
    for(let i=0;i<options.length;i++){
        inherit.push(inheritList(options[i].node));
    }
    //节点不是同一深度
    let length = inherit[0].length;
    for(let i=0;i<inherit.length;i++){
        if(inherit[i].length != length){
            return null;
        }
    }
    //找到最近的父节点
    for(let i=0;i<length;i++){
        let v = null;
        let b = true;
        for(let j=0;j<inherit.length;j++){
            if(!v){
                v = inherit[j][i];
            }else if(v!==inherit[j][i]){
                b = false;
                break;
            }
        }
        if(b){
            return [v,i];
        }
    }
    return null;
}
/**
 * 返回第level级父节点
 */
function parentN(child,level){
    let parent = null;
    let op = child.option;
    let node = child.node;
    for(let i=0;i<level;i++){
        if('parent' in node){
            node = node.parent;
        }else return null;
    }
    return {option:op,node:node};
}
/**
 * 返回给定的子节点child是不是一个选项
 */
function isInOptions(child,options){
    for(let i=0;i<options.length;i++){
        if(options[i].node==child){
            return options[i];
        }
    }
    return null;
}
/**
 * 删除数组中的指定元素
 */
function removeElement(a,node){
    for(let i=0;i<a.length;i++){
        if(a[i]===node){
            a.splice(i,1);
            return;
        }
    }
}
/**
 * 将节点转换为一个选项
 */
function conversionElement(child,islast,answer){
    child.node.name = 'span'; //改变节点
    if(answer && child.option==answer){
        child.node.attribs['option-correct'] = child.option;
    }else{
        child.node.attribs['option-btn'] = child.option;
    }
    child.node.attribs['onclick'] = 'option_onclick(this);';
    if(!islast){//在该节点尾部加入换行
        let parent = child.node.parent;
        for(let i=0;i<parent.children.length;i++){
            if(parent.children[i] === child.node){
                parent.children.splice(i+1,0,{name:'br',type:'tag',attribs:{},children:{}});
                return;
            }
        }
    }
}
/**
 * 解析正确答案
 */
function praserAnswer(an){
    let dom = htmldom.parseDOM(an);
    let result = null;
    htmldom.foreachNode(dom,(node,data,parent)=>{
        if(node.type=="text"&&node.data){
            let m =node.data.match(/(故选|答案为|选|因此选)[：:]?\s*([ABCDEFGH])/);
            if(m && m.length>2){
                result =  m[2];
            }
        }
    });
    return result;
}
/**
 * 如果doc文档是一个选择题就将其转化为交互选择题
 */
export function optionAuto(doc,an){
    let dom = htmldom.parseDOM(doc);
    let options = [];
    htmldom.foreachNode(dom,(node,data,parent)=>{
        node.parent = parent?parent:null; //dom初始化好父节点
        if(node.type=="text"&&node.data){
            let m = node.data.match(/^[\s　]*([ABCDEFGH])[\s　,.，、。]/);
            if(m && m[0]){
                if(data.length>0){
                    if( data[data.length-1].option.charCodeAt()+1 == m[0].charCodeAt() )//假设是顺序的(A,B,C...)
                        data.push({option:m[1],node:node});
                }else{
                    data.push({option:m[1],node:node});
                }
            }
        }
    },options);
    let answer = praserAnswer(an);
    let [commParent,level] = matchParent(options);
    if(commParent){
        if(level==1){
            let childcopy = [];
            //复制一份便于下面的算法
            for(let i=0;i<commParent.children.length;i++){
                childcopy.push(commParent.children[i]);
            }
            let childs = [];
            let current = null;
            for(let i=0;i<childcopy.length;i++){
                let child = isInOptions(childcopy[i],options);
                if(child){
                    if(current){
                        childs.push(current);
                        childs.push({name:'br',type:'tag',attribs:{},children:{}});
                    }
                    //这里产生一个新的节点span，并把下个选项的前面的都加入这个节点
                    let attrs = {};
                    if(answer&&answer==child.option){
                        attrs['option-correct'] = child.option;
                    }else{
                        attrs['option-btn'] = child.option;
                    }
                    attrs['onclick'] = 'option_onclick(this);';
                    current = {type:'tag',name:'span',attribs:attrs};
                    current.children = [];
                    current.children.push(child.node);
                    removeElement(commParent.children,child.node);
                }else if(current){
                    current.children.push(childcopy[i]);
                    removeElement(commParent.children,childcopy[i]);
                }
            }
            if(current)
                childs.push(current);
            // 过滤掉结尾的<br>然后简单的追加到尾部
            for(let i=commParent.children.length-1;i>0;i--){
                if(commParent.children[i].name !== 'br')
                    break;
                else commParent.children.pop();
            }
            for(let i=0;i<childs.length;i++){
                let child = childs[i];
                commParent.children.push(child);
            }
            return [htmldom.writeHTML(dom),answer];
        }else{
            for(let i=0;i<options.length;i++){
                let parent = parentN(options[i],level-1);
                if(parent){
                    //已经发现节点直接简单的转换
                    conversionElement(parent,i==options.length-1?true:false,answer);
                }else{
                    console.log(`parentN error :${i}`);
                }
            }
            return [htmldom.writeHTML(dom),answer];
        }
    }
    return ["",null];
}

export function feildAuto(doc){
    return "";
}