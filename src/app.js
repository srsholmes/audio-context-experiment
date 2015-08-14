require('babelify/polyfill');
import 'whatwg-fetch';

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

//from:
//http://stackoverflow.com/questions/10231333/how-to-get-a-stream-from-a-simple-soundcloud-url
//

//This gets the stream url from a normal soundcloud link. 
var getStreamUrl = (url) => {
	var apiURL = `http://api.soundcloud.com/resolve.json?url=${url}&client_id=${CLIENT_ID}`;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', apiURL, true);
	xhr.onload = function(response) {
		var streamURL = JSON.parse(response.currentTarget.response).stream_url;
		var streamURLKey = `${streamURL}?client_id=${CLIENT_ID}`;
		console.log(streamURLKey);
		return streamURLKey;
	};
	xhr.send();
};


let soundCloudAudio = () => {
	let streamURL = "http://api.soundcloud.com/tracks/293/stream?client_id=9c470b57005415330972a0b5cca327e2";
	let streamURL2 = getStreamUrl('https://soundcloud.com/matzelu/summer-is-comming');
	let player = document.getElementById('player');
	let audio;
	let context = new AudioContext();
	var xhr = new XMLHttpRequest();
	xhr.open('GET', streamURL2, true);
	xhr.responseType = 'arraybuffer';
	xhr.onload = function() {
		console.log('loooad');
	    audio = context.createBufferSource();
	    context.decodeAudioData(xhr.response, function(buffer) {
        audio.buffer = buffer;
        audio.connect(context.destination);
        audio.start();
	    });
	};
	xhr.send();
	// player.setAttribute('src', getStreamUrl(url));
	// player.play();

	// let audioCtx = new (window.AudioContext || window.webkitAudioContext);
	// let analyser = audioCtx.createAnalyser();
	// analyser.fftSize = 256;
	// let source = audioCtx.createMediaElementSource(player);
	// source.connect(analyser);
	// analyser.connect(audioCtx.destination);

 //  player.play();

}();

// SC.stream("/tracks/293", function(sound){
// 	// sound.play();
//   soundCloudAudio(sound);
// });

//
// SC.get('/groups/55517/tracks', {limit: 1}, function(tracks){
//   console.log('Latest track: ' + tracks[0].title);
// });

// var SoundCloudAudioSource = function(audioElement) {
//     var player = document.getElementById(audioElement);
//     var self = this;
//     var analyser;
//     var audioCtx = new (window.AudioContext || window.webkitAudioContext); // this is because it's not been standardised accross browsers yet.
//     analyser = audioCtx.createAnalyser();
//     analyser.fftSize = 256; // see - there is that 'fft' thing. 
//     var source = audioCtx.createMediaElementSource(player); // this is where we hook up the <audio> element
//     source.connect(analyser);
//     analyser.connect(audioCtx.destination);
//     var sampleAudioStream = function() {
//     	console.log('sampleAudioStream');
//         // This closure is where the magic happens. Because it gets called with setInterval below, it continuously samples the audio data
//         // and updates the streamData and volume properties. This the SoundCouldAudioSource function can be passed to a visualization routine and 
//         // continue to give real-time data on the audio stream.
//         analyser.getByteFrequencyData(self.streamData);
//         // calculate an overall volume value
//         var total = 0;
//         for (var i = 0; i < 80; i++) { // get the volume from the first 80 bins, else it gets too loud with treble
//             total += self.streamData[i];
//         }
//         self.volume = total;
//     };
//     setInterval(sampleAudioStream, 2000); // 
//     // public properties and methods
//     this.volume = 0;
//     this.streamData = new Uint8Array(128); // This just means we will have 128 "bins" (always half the analyzer.fftsize value), each containing a number between 0 and 255. 
//     this.playStream = function(streamUrl) {
//         // get the input stream from the audio element
//         player.setAttribute('src', streamUrl);
//         player.play();
//     }
// };

// var audioSource = new SoundCloudAudioSource('player');
// var canvasElement = document.getElementById('canvas');
// var context = canvasElement.getContext("2d");

// var draw = function() {
// 	var bin;
//     // you can then access all the frequency and volume data
//     // and use it to draw whatever you like on your canvas
//     for(bin = 0; bin < audioSource.streamData.length; bin ++) {
//         // do something with each value. Here's a simple example
//         var val = audioSource.streamData[bin];
//         var red = val;
//         var green = 255 - val;
//         var blue = val / 2; 
//         context.fillStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
//         context.fillRect(bin * 2, 0, 2, 200);
//         // use lines and shapes to draw to the canvas is various ways. Use your imagination!
//     }
//     requestAnimationFrame(draw);
// };

// audioSource.playStream('https://soundcloud.com/heldeepradio/oliver-heldens-heldeep-radio-034');
// draw();