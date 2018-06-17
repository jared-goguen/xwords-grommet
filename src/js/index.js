import 'whatwg-fetch';
import { polyfill as promisePolyfill } from 'es6-promise';

import React from 'react';
import ReactDOM from 'react-dom';

import '../scss/index.scss';
import '../scss/logo.scss';
import '../scss/puzzle.scss';

import App from './App';

promisePolyfill();

const element = document.getElementById('content');
ReactDOM.render(<App />, element);

document.body.classList.remove('loading');
