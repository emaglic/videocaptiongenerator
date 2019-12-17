import { loadJSON } from './import-json'

const exp = module.exports; 

exp.getVideoInput = () => {
	let videoSrcInput = document.querySelector('.video-src-input');
	console.log('videoSrcInput.files: ', videoSrcInput.files)
	
	let file = videoSrcInput.files[0];
	var type = file.type;
	let canPlay = window.videoPlayer.element.canPlayType(type)
	if(canPlay === '') canPlay = false
	let isError = canPlay === false;

	if(isError) return;

	var fileURL = URL.createObjectURL(file);
	window.videoPlayer.load(fileURL, 'video');
}

exp.getJSONInput = () => {
	let jsonSrcInput = document.querySelector('.json-src-input')
	let file = jsonSrcInput.files[0]
	if(file.type !== 'application/json') {
		console.error('Invalid File Type: This must be a JSON file');
		window.alert('Invalid File Type: This must be a JSON file');
		return;
	}
	var fileURL = URL.createObjectURL(file);
	loadJSON(fileURL);
}

exp.getSubInput = () => {
	let subSrcInput = document.querySelector('.sub-src-input');
	let file = subSrcInput.files[0]
	console.log('file: ', file);
	let type = file.name.split('.')
	type = type[type.length -1]
	if(type !== 'vtt') {
		console.error('Invalid File Type: This must be a vtt file');
		window.alert('Invalid File Type: This must be a vtt file');
		return;
	}
	var fileURL = URL.createObjectURL(file);
	window.videoPlayer.load(fileURL, 'subtitle');
}