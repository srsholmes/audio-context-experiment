require('babelify/polyfill');
import 'whatwg-fetch';

import status from './modules/status';
import json from './modules/json';

let React = require('react');

//Needed for React Developer Tools
window.React = React;

import { App } from './components';

React.render(<App/>, document.querySelector('div[app]'));

const CLIENT_ID = `9c470b57005415330972a0b5cca327e2`;

SC.initialize({
  client_id: CLIENT_ID
});

let d = document;
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let play = d.querySelector('.play');
let stop = d.querySelector('.stop');
let canvas = d.getElementById('canvas');
let context = canvas.getContext("2d");

let analyser;
let bin;
let source;


let getStreamUrl = (url) => {
	let apiURL = `http://api.soundcloud.com/resolve.json?url=${url}&client_id=${CLIENT_ID}`;
	return fetch(apiURL)
  .then(status)
  .then(json)
  .then((data) => { 
  	let streamURL = `${data.stream_url}?client_id=${CLIENT_ID}`;
  	return streamURL
  });
};

let streamURL = getStreamUrl('https://soundcloud.com/matzelu/summer-is-comming');


let getData = (url) => {
  source = audioCtx.createBufferSource();
  source.start(0);
  play.setAttribute('disabled', 'disabled');
  let req = new Request(url);
  fetch(req).then((res) => {
    res.arrayBuffer().then((buffer) => {
      audioCtx.decodeAudioData(buffer, (decodedData) => {
        source.buffer = decodedData;
        source.connect(audioCtx.destination); 
        analyse();  
      });
    });
  });
};

//Anaylse that shit
let analyse = () => {
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  let dataArray = new Uint8Array(128);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  let sampleAudioStream = function() {
    analyser.getByteFrequencyData(dataArray);
    let total = 0;
    for (let i = 0; i < 80; i++) {
        total += dataArray[i];
    }
    dataArray.volume = total;
  };
  setInterval(sampleAudioStream, 20);

  //Canvas visual stuff
  let draw = () => {
    for(bin = 0; bin < dataArray.length; bin ++) {
        let val = dataArray[bin];
        let red = val;
        let green = 255 - val;
        let blue = val / 2; 
        context.fillStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
        context.fillRect(bin * 2, 0, 2, 200);
    }          
  };
  setInterval(draw, 20);
}

play.onclick = () => {
  streamURL
	.then((url) => getData(url));
}

stop.onclick = () => {
  source.stop(0);
  play.removeAttribute('disabled');
}