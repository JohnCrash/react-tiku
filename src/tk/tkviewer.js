import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TkParser from './tkparser';
import 'whatwg-fetch'

var topic = '<div><h2>Hello</h2> <RaisedButton label="Primary"></RaisedButton> <h2>World</h2> </div>'
//var topic = '<dd>                                 <span class="special-style"><p>若式子<span class="math" id="MathJax-Element-1-Frame" role="textbox" aria-readonly="true"><nobr><span style="width:2.35em;" class="dI pS"><span style="height:0;width:2.33em;" class="dI pR"><span style="top:-2.17em;" class="pA"><span style="height:0;width:2.23em;margin-right:.12em;margin-left:.12em;" class="dI pR"><span style="top:-3.43em;left:50%;margin-left:-.25em;" class="pA"><span style class="pS fM">1</span><span style="height:2.75em;" class="dI w0 pS"></span></span><span style="top:-3.12em;left:50%;margin-left:-1.05em;" class="pA"><span style="height:0;width:2.11em;" class="dI pR"><span style="top:-2.75em;left:.83em;" class="pA"><span class="pS"><span style class="pS fM">−</span><span style="font-style:italic;" class="pS fI">k</span></span><span style="height:2.75em;" class="dI w0 pS"></span></span><span style="top:-4.56em;left:.83em;" class="pA"><span style="height:0;width:1.27em;" class="dI pR"><span style="top:-4em;left:-.08em;" class="pA fM">−<span style="height:4em;" class="dI w0 pS"></span></span><span style="top:-4em;left:.58em;" class="pA fM">−<span style="height:4em;" class="dI w0 pS"></span></span><span style="top:-4em;left:.24em;" class="pA fM">−<span style="height:4em;" class="dI w0 pS"></span></span></span><span style="height:4em;" class="dI w0 pS"></span></span><span style="top:-4.02em;" class="pA"><span style class="pS fM">√</span><span style="height:4em;" class="dI w0 pS"></span></span></span><span style="height:4em;" class="dI w0 pS"></span></span><span style="top:-1.3em;" class="pA"><span style="border-left-width:2.23em;border-left-style:solid;border-left-color:initial;width:0;height:1.25px;vertical-align:0;" class="dI oH pS"></span><span style="height:1.08em;" class="dI w0 pS"></span></span></span><span style="height:2.17em;" class="dI w0 pS"></span></span></span><span style="height:2.57em;vertical-align:-1.14em;border-style:initial;border-color:initial;" class="dI oH w0 pS"></span></span></nobr></span>有意义<span class="math" id="MathJax-Element-2-Frame" role="textbox" aria-readonly="true"><nobr><span style="width:.27em;" class="dI pS"><span style="height:0;width:.25em;" class="dI pR"><span style="top:-2.75em;" class="pA"><span style class="pS fM">,</span><span style="height:2.75em;" class="dI w0 pS"></span></span></span><span style="height:.48em;vertical-align:-.28em;border-style:initial;border-color:initial;" class="dI oH w0 pS"></span></span></nobr></span>则函数<span class="math" id="MathJax-Element-3-Frame" role="textbox" aria-readonly="true"><nobr><span style="width:4.44em;" class="dI pS"><span style="height:0;width:4.42em;" class="dI pR"><span style="top:-2.75em;" class="pA"><span class="pS"><span style="font-style:italic;" class="pS fI">y<span style="height:1px;" class="dI oH w0 pS"></span></span><span style="padding-left:.28em;" class="pS fM">=</span><span style="font-style:italic;padding-left:.28em;" class="pS fI">k</span><span style="font-style:italic;" class="pS fI">x</span><span style="padding-left:.22em;" class="pS fM">+</span><span style="padding-left:.22em;" class="pS fM">1</span></span><span style="height:2.75em;" class="dI w0 pS"></span></span></span><span style="height:1.07em;vertical-align:-.29em;border-style:initial;border-color:initial;" class="dI oH w0 pS"></span></span></nobr></span>和<span class="math" id="MathJax-Element-4-Frame" role="textbox" aria-readonly="true"><nobr><span style="width:4.44em;" class="dI pS"><span style="height:0;width:4.42em;" class="dI pR"><span style="top:-2.75em;" class="pA"><span class="pS"><span style="font-style:italic;" class="pS fI">y<span style="height:1px;" class="dI oH w0 pS"></span></span><span style="padding-left:.28em;" class="pS fM">=</span><span style="padding-left:.28em;" class="pS"><span style="height:0;width:2.54em;margin-right:.12em;margin-left:.12em;" class="dI pR"><span style="top:-3.43em;left:50%;margin-left:-1.21em;" class="pA"><span class="pS"><span style="height:0;width:.91em;" class="dI pR"><span style="top:-2.5em;" class="pA"><span style="font-style:italic;" class="pS fI">k</span><span style="height:2.5em;" class="dI w0 pS"></span></span><span style="top:-2.67em;left:.5em;" class="pA"><span style="font-size:70.7%;" class="pS fM">2</span><span style="height:2.25em;" class="dI w0 pS"></span></span></span><span style="padding-left:.22em;" class="pS fM">−</span><span style="padding-left:.22em;" class="pS fM">1</span></span><span style="height:2.75em;" class="dI w0 pS"></span></span><span style="top:-1.81em;left:50%;margin-left:-.29em;" class="pA"><span style="font-style:italic;" class="pS fI">x</span><span style="height:2.5em;" class="dI w0 pS"></span></span><span style="top:-1.3em;" class="pA"><span style="border-left-width:2.54em;border-left-style:solid;border-left-color:initial;width:0;height:1.25px;vertical-align:0;" class="dI oH pS"></span><span style="height:1.08em;" class="dI w0 pS"></span></span></span></span></span><span style="height:2.75em;" class="dI w0 pS"></span></span></span><span style="height:2.43em;vertical-align:-.78em;border-style:initial;border-color:initial;" class="dI oH w0 pS"></span></span></nobr></span>的图象可能是<span class="math" id="MathJax-Element-5-Frame" role="textbox" aria-readonly="true"><nobr><span style="width:.85em;" class="dI pS"><span style="height:0;width:.83em;" class="dI pR"><span style="top:-2.75em;" class="pA"><span class="pS"><span style class="pS fM">()</span></span><span style="height:2.75em;" class="dI w0 pS"></span></span></span><span style="height:1.17em;vertical-align:-.33em;border-style:initial;border-color:initial;" class="dI oH w0 pS"></span></span></nobr></span></p><br><p option="A">A. <img src="topics/2f387e8a8a6c3cad9ceed84ff039ed70/images/8b0d42ea231d263629418450a04afa86.jpg"></p><p option="B">B. <img src="topics/2f387e8a8a6c3cad9ceed84ff039ed70/images/fbc6aebc234643b40addd8fc0d44d4fb.jpg"></p><p option="C">C. <img src="topics/2f387e8a8a6c3cad9ceed84ff039ed70/images/cdf4cd6594d788108169afb357e0c2e5.jpg"></p><p option="D">D. <img src="topics/2f387e8a8a6c3cad9ceed84ff039ed70/images/ef70dedbe1f70cafa04b2df3aa3873c1.jpg"></p></span>                                               </dd>'

class TkViewer extends Component{
	constructor(){
		super();
	}
	render(){
		return (<div>
			<br/>
			{TkParser.htmlElement(this.props.content,[RaisedButton])}
		</div>);
	}
};

export default TkViewer;
