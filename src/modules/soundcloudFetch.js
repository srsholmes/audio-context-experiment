const CLIENT_ID = '9c470b57005415330972a0b5cca327e2';

export default function soundcloudFetch(url) {
	let getStreamUrl = (url) => {
		return fetch(`http://api.soundcloud.com/resolve.json?url=${url}&client_id=${CLIENT_ID}`)
	  	.then(res => res.json())
	  	.then(data => `${data.stream_url}?client_id=${CLIENT_ID}`);
	};

	let getData = (url) => {
		return fetch(url).then(res => res.arrayBuffer());
	};

	return getStreamUrl(url).then(getData);
}