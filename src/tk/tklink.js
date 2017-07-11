
/**
 * 管理websocket连接
 * 该连接是一个全局的websocket对象
 */
class LinkDevic{
    constructor(){
        this.state = 'disconnect';
        this.mac = '';
        this.cbs = [];
        this.index = -1;
    }
    connect(mac){
        if( this.ws ){
            this.ws.close();
        }
        let ws = new WebSocket(`ws://localhost:3002/${mac}`);
        this.ws = ws;
        ws.onopen = ()=>{};
        ws.onmessage = (event)=>{
            switch(event.data){
                case 'req':
                    this.callEvent('req',event);
                    break;
                case 'accept':
                    this.state = 'connect';
                    this.mac = mac;
                    ws.send(`sectionid=${this.index}`);
                    this.callEvent('accept',event);
                    break;
                case 'refuse':
                    this.state = 'disconnect';
                    this.mac = '';
                    this.callEvent('refuse',event);
                    break;
                case 'news':
                    this.callEvent('news',event);
                    break;
            }
        };
        ws.onclose = ()=>{
            if(this.ws===ws){
                this.ws = null;
                this.state = 'disconnect';
            }
            ws = null;
            this.callEvent('close');
        };
        ws.onerror = (event)=>{
            this.callEvent('error',event);
        };
    }
    sendIndex(index){
        this.index = index;
        if( this.ws ){
            this.ws.send(`sectionid=${index}`);
        }
    }
    send(msg){
        if( this.ws ){
            this.ws.send(msg);
        }
    }    
    disconnect(){
         if( this.ws ){
             this.callEvent('refuse');
             this.ws.close();
         }        
    }
    addEventListener(cb){
        this.cbs.push(cb);
    }
    removeEventListener(cb){
        for(let i=0;i<this.cbs.length;i++){
            if(this.cbs[i]===cb){
                this.cbs.splice(i,1);
                break;
            }
        }
    }
    callEvent(msg,data){
        for(let i=0;i<this.cbs.length;i++){
            this.cbs[i](msg,data);
        }
    }
};

var gd = gd?gd:new LinkDevic();
export default gd;