import status from './status';
import json from './json';

export default function soundcloudFetch(url, CLIENT_ID, audioCtx) {
	console.log('fetching data...');
	return new Promise(function(resolve, reject) {
		let source;

		let getStreamUrl = (url) => {
			console.log('getting streamURL...');
			let apiURL = `http://api.soundcloud.com/resolve.json?url=${url}&client_id=${CLIENT_ID}`;
			return fetch(apiURL)
		  .then(status)
		  .then(json)
		  .then((data) => { 
		  	let streamURL = `${data.stream_url}?client_id=${CLIENT_ID}`;
		  	return streamURL
		  });
		};

		let getData = (url) => {
			console.log(`getting soundcloud data from ${url}...`);
		  source = audioCtx.createBufferSource();
		 	source.start(0);
		  let req = new Request(url);
		  fetch(req).then((res) => {
		    res.arrayBuffer().then((buffer) => {
		      audioCtx.decodeAudioData(buffer, (decodedData) => {
		        source.buffer = decodedData;
		        source.connect(audioCtx.destination); 
		        console.log('audio connected from soundcloudFetch');
		        console.log(typeof(audioCtx.destination));
		        console.log(typeof(source));
						var data = Object.assign({}, audioCtx.destination, source);
						console.log(data);
		        resolve(data);
		      });
		    });
		  });
		};

		getStreamUrl(url)
		.then((url) => getData(url));
	});
}