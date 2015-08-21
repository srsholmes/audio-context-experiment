require('babelify/polyfill');
import 'whatwg-fetch';

import status from './modules/status';
import json from './modules/json';
import soundcloudFetch from './modules/soundcloudFetch';

let React = require('react');

//Needed for React Developer Tools
window.React = React;

import { App } from './components';

React.render(<App/>, document.querySelector('div[app]'));

const CLIENT_ID = `9c470b57005415330972a0b5cca327e2`;


let d = document;
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let play = d.querySelector('.play');
let stop = d.querySelector('.stop');
let canvas = d.getElementById('canvas');
let context = canvas.getContext("2d");

let analyser;
let bin;

// //Anaylse that shit
let analyse = (dest, source) => {
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  let dataArray = new Uint8Array(128);
  console.log(source);
  console.log(dest);
  source.connect(analyser);
  analyser.connect(dest);

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
  soundcloudFetch('https://soundcloud.com/matzelu/summer-is-comming', CLIENT_ID, audioCtx)
  .then((dest, source) => {
    //do stuff in here.
    console.log('resolved');
    console.log(dest, source);
    analyse(dest, source);
  });
}

stop.onclick = () => {
  source.stop(0);
  play.removeAttribute('disabled');
}