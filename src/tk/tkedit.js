import React, {Component} from 'react';
import TkFrame from './tkframe';
import toHtmlDocument from './tkconv';

/**
 * 编辑节点
 * 属性:
 * topics 当前页包含的题的数组
 * current 当前要编辑的题，在topics中的索引
 * section 当前章节ID
 * onTopic 切换题事件
 * messageBar 错误条
 */
class TkEdit extends Component{
    constructor(props){
        super(props);
        this.state={};
    }
    save(){
        this.body.handleUpload();
        this.answer.handleUpload();
        this.analysis.handleUpload();
        this.tag.handleUpload();
    }
    /**
     * 如果内容发生了改变,见tkframe.handleUpload
     */
    handleSave(type,updateData){
        let topic = this.props.topics[this.props.current];
        if(updateData.mode==='html'){
            switch(type){
                case 1: //题目
                    topic.state = updateData.state;
                    topic.seat_body = updateData.seat_body;
                    topic.body = updateData.body;
                    break;
                case 2: //解答
                    topic.seat_answer = updateData.seat_answer;
                    topic.answer = updateData.answer;                
                    break;
                case 3: //分析
                    topic.seat_analysis = updateData.seat_analysis;
                    topic.analysis = updateData.analysis;                                
                    break;
                case 4: //知识点
                    topic.seat_tag = updateData.seat_tag;
                    topic.tag = updateData.tag;
                    break;                
            }
        }else if(updateData.mode==='markd'){
            switch(type){
                case 1: //题目
                    topic.state = updateData.state;
                    topic.seat_body = updateData.seat_body;
                    topic.markd_body = updateData.markd_body;
                    break;
                case 2: //解答
                    topic.seat_answer = updateData.seat_answer;
                    topic.markd_answer = updateData.markd_answer;
                    break;
                case 3: //分析
                    topic.seat_analysis = updateData.seat_analysis;
                    topic.markd_analysis = updateData.markd_analysis;                
                    break;
                case 4: //知识点
                    topic.seat_tag = updateData.seat_tag;
                    topic.markd_tag = updateData.markd_tag;                
                    break;                
            }
        }
    }
    render(){
        let topic = this.props.topics[this.props.current];
        let titleFrame = (topic&&topic.topic_image)?<TkFrame title='原题' 
                visible={true}
                content={topic.topic_image} source={topic.topic_image} tid={topic.rowid} type={0}/>:undefined;
        return <div>
                {topic?[titleFrame,
				<TkFrame title='题目' messageBar={this.props.messageBar}
					seat = {topic.seat_body}
					source = {toHtmlDocument(topic.topic_body)}
					content={toHtmlDocument(topic.body)}
					markd={topic.markd_body}
					answer={topic.topic_answer}
					type={1}
					qid={topic.rowid}
                    onSave={this.handleSave.bind(this,1)}
                    ref={(iframe)=>{this.body = iframe}}
					topicsType={topic.state}/>,
				<TkFrame title='解答' 
					seat = {topic.seat_answer}
					source = {toHtmlDocument(topic.topic_answer)}
					content={toHtmlDocument(topic.answer)} 
					markd={topic.markd_answer}
					messageBar={this.props.messageBar}
					qid={topic.rowid}
                    onSave={this.handleSave.bind(this,2)}
                    ref={(iframe)=>{this.answer = iframe}}
					type={2}/>,
				<TkFrame title='分析' 
					seat = {topic.seat_analysis}
					source = {toHtmlDocument(topic.topic_analysis)}
					content={toHtmlDocument(topic.analysis)}
					markd={topic.markd_analysis}
					messageBar={this.props.messageBar} 
					qid={topic.rowid}
                    onSave={this.handleSave.bind(this,3)}
                    ref={(iframe)=>{this.analysis = iframe}}
					type={3}/>,
				<TkFrame title='知识点' 
					seat = {topic.seat_tag}
					source = {toHtmlDocument(topic.topic_tag)}
					content={toHtmlDocument(topic.tag)}
					markd={topic.markd_tag}
					messageBar={this.props.messageBar}
					qid={topic.rowid}
                    onSave={this.handleSave.bind(this,4)}
                    ref={(iframe)=>{this.tag = iframe}}
					type={4}/>]:undefined}     
            </div>;
    }
};

export default TkEdit;