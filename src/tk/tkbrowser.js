import React, {Component} from 'react';
import TkFrame from './tkframe';
import toHtmlDocument from './tkconv';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
    marginLeft:0,
    marginRight:0,
    minWidth:36,
    margin: 0,
};
/**
 * 浏览题库
 */
class TkBrowser extends Component{
    constructor(props){
        super(props);
        this.state={
            current:props.current
        };
    }
    bound(i){
        if(i<1)return 1;
        if(i>this.props.count)return this.props.count;
        return i;
    }
    handlePrev(){
        let i = this.bound(this.state.current-1);
        this.setState({current:i});
        this.props.onPage(i);
    }
    handleNext(){
        let i = this.bound(this.state.current+1);
        this.setState({current:i});
        this.props.onPage(i);
    }
    handleIndex(i){
        this.setState({current:i});
        this.props.onPage(i);
    }
    render(){
        let pageButton;
        let i = 0;
        if(this.props.count){
            pageButton = [];
            pageButton.push(<RaisedButton label={'<'} style={style} onTouchTap={this.handlePrev.bind(this)}/>);
            for(let i=1;i<this.props.count+1;i++)
                pageButton.push(<RaisedButton label={i} secondary={i==this.state.current} style={style}  onTouchTap={this.handleIndex.bind(this,i)}/>);
            pageButton.push(<RaisedButton label={'>'} style={style}  onTouchTap={this.handleNext.bind(this)}/>);
        }
        return <div><div style={{textAlign:"center"}}>{pageButton}</div>
            <div>
            {this.props.topics.map((item)=>{
                return <TkFrame title='' messageBar={this.props.messageBar}
                    browser = {true}
                    index={i++}
                    seat = {item.seat_body}
                    source = {toHtmlDocument(item.topic_body)}
                    content={toHtmlDocument(item.body)}
                    markd={item.markd_body}
                    answer={item.answer}
                    type={1}
                    qid={item.rowid}
                    topicsType={item.state}
                    onEdit={this.props.onEdit} />;
                })}
            </div>
            <div style={{textAlign:"center"}}>{pageButton}</div>
        </div>;
    }
};

export default TkBrowser;