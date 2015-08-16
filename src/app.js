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
let track_url =`https://soundcloud.com/heldeepradio/oliver-heldens-heldeep-radio-034`;
let track_url_02 = `https://soundcloud.com/hardwell/armin-van-buuren-ping-pong-hardwell-remix-download`;

SC.initialize({
  client_id: CLIENT_ID
});

var getStreamUrl = (url) => {
	var apiURL = `http://api.soundcloud.com/resolve.json?url=${url}&client_id=${CLIENT_ID}`;
	return fetch(apiURL)
  .then(status)
  .then(json)
  .then((data) => { 
  	console.log(data);
  	return data.stream_url
  });
};

let soundCloudAudio = () => {
	// let streamURL = "http://api.soundcloud.com/tracks/293/stream?client_id=9c470b57005415330972a0b5cca327e2";
	let streamURL2 = getStreamUrl('https://soundcloud.com/matzelu/summer-is-comming');
	// let streamURL3 = "https://api.soundcloud.com/tracks/218176109/stream?client_id=9c470b57005415330972a0b5cca327e2";

	let audio;
	let analyser;
	let audioCtx = new AudioContext();
	let xhr = new XMLHttpRequest();
	let player = document.getElementById('player'); 

	streamURL2.then((streamURL) => {
		streamURL = `${streamURL}?client_id=${CLIENT_ID}`;
		xhr.open('GET', streamURL, true);
		xhr.responseType = 'arraybuffer';
		xhr.onload = function() {
			console.log('xhr loooad');
	    audio = audioCtx.createBufferSource();
	    audioCtx.decodeAudioData(xhr.response, (buffer) => {
	      audio.buffer = buffer;
	      audio.connect(audioCtx.destination);
	      audio.start();

	      //Anaylse that shit
	      analyser = audioCtx.createAnalyser();
	      analyser.fftSize = 256;
	      let dataArray = new Uint8Array(128); // Uint8Array should be the same length as the frequencyBinCount 
	      audio.connect(analyser);
	      analyser.connect(audioCtx.destination);

	      let sampleAudioStream = function() {
	          analyser.getByteFrequencyData(dataArray);
	          // calculate an overall volume value
	          var total = 0;
	          for (var i = 0; i < 80; i++) { // get the volume from the first 80 bins, else it gets too loud with treble
	              total += dataArray[i];
	          }
	          dataArray.volume = total;
	         	// console.log(dataArray);
	      };
	      setInterval(sampleAudioStream, 20);

	      let bin;
	      let canvas = document.getElementById('canvas');
	      let context = canvas.getContext("2d");

        let draw = function() {
        	console.log(audio);
        	var bin;
            for(bin = 0; bin < dataArray.length; bin ++) {
            	console.log(audio);
                // do something with each value. Here's a simple example
                var val = dataArray[bin];
                var red = val;
                var green = 255 - val;
                var blue = val / 2; 
                context.fillStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
                context.fillRect(bin * 2, 0, 2, 200);
            }          
        };
          setInterval(draw, 20);

	    });
		};
		xhr.send();
	});	
}();
