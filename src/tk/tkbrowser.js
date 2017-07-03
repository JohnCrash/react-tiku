import React, {Component} from 'react';
import TkFrame from './tkframe';
import toHtmlDocument from './tkconv';

/**
 * 浏览题库
 */
class TkBrowser extends Component{
    constructor(){
        super();
    }
    render(){
        return <div>
            {this.props.topics.map((item)=>{
                return <TkFrame title='题目' messageBar={this.props.messageBar}
                    browser = {true}
                    seat = {item.seat_body}
                    source = {toHtmlDocument(item.topic_body)}
                    content={toHtmlDocument(item.body)}
                    markd={item.markd_body}
                    answer={item.answer}
                    type={1}
                    qid={item.qid}
                    topicsType={item.state} />;
                })}
        </div>;
    }
};

export default TkBrowser;