//import * as url from '../images'
import '../css/main.scss'

import createVideoPlayer  from './video-player';
import { createSubtitleField } from './subtitle-field'
import { exportSubtitles } from './export-subtitles'
//import { loadJSON } from './import-json'
import { getVideoInput, getSubInput, getJSONInput } from './import-files'

window.onload = function() {

	let videoMain = document.querySelector('.video-main');

	window.videoPlayer = new createVideoPlayer({parent: '.video-main', playbackRate: 1 });

	let videoImportBtn = document.querySelector('.video-src-btn')
	let videoSrcInput = document.querySelector('.video-src-input')

	//videoSrcInput.value = 'test/captions.mp4'

	let subImportBtn = document.querySelector('.sub-src-btn');
	let subSrcInput = document.querySelector('.sub-src-input');
	
	//subSrcInput.value = 'test/captions.vtt'

	let jsonImportBtn = document.querySelector('.json-src-btn')
	let jsonSrcInput = document.querySelector('.json-src-input')

	//jsonSrcInput.value = 'test/captions.json'

	videoImportBtn.onclick = () => {
		console.log('videoSrcInput Clicked...')
		getVideoInput();
	}

	subImportBtn.onclick = () => {
		console.log('subSrcInput Clicked...')
		getSubInput();
		//let subSrcInput = document.querySelector('.sub-src-input');
		//window.videoPlayer.load(String(`./videos/${subSrcInput.value}`), 'subtitle');
	}

	jsonImportBtn.onclick = () => {
		getJSONInput();
		//let jsonSrcInput = document.querySelector('.json-src-input')
		//loadJSON(String(`./videos/${jsonSrcInput.value}`));
	}


	let addNewSubtitleBtn = document.querySelector('.add-new-subtitle');
	addNewSubtitleBtn.onclick = () => {
		createSubtitleField();
	}

	let exportSRTSubtitlesBtn = document.querySelector('.export-srt-subtitles');
	exportSRTSubtitlesBtn.onclick = () => {
		exportSubtitles('srt');
	}

	let exportVTTSubtitlesBtn = document.querySelector('.export-vtt-subtitles');
	exportVTTSubtitlesBtn.onclick = () => {
		exportSubtitles('vtt');
	}

	let exportJSONBtn = document.querySelector('.export-json');
	exportJSONBtn.onclick = () => {
		exportSubtitles('json');
	}
}




