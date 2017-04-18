import React, { Component } from 'react';
import {render} from 'react-dom';

import logo from './logo.svg';
import './App.css';
import TkEditor from './tk/tkeditor.js';

//import {Router, useRouterHistory} from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import injectTapEventPlugin from 'react-tap-event-plugin';
import {Tabs, Tab} from 'material-ui/Tabs';
import Slider from 'material-ui/Slider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

// Helpers for debugging
window.React = React;
//window.Perf = require('react-addons-perf');

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

function handleActive(tab) {
  alert(`A tab with this route property ${tab.props['data-route']} was activated.`);
}

class App extends Component {
  render() {
    return (
		<MuiThemeProvider>
			<TkEditor />
		</MuiThemeProvider>
    );
  }
}

export default App;
