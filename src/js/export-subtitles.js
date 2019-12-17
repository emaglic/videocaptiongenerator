import { saveAs } from 'file-saver';

const exp = module.exports; 

exp.exportSubtitles = (subType) => {
	
	let exportedForVTT = [];
	let exportedForJSON = [];

	let allSubtitles = document.querySelectorAll('.subtitle-entry')
	allSubtitles.forEach( (subtitle, index) => {
		let start = subtitle.querySelector('.sub-start-inputs')
		let end = subtitle.querySelector('.sub-end-inputs')
		let startTime = {
			hour: start.querySelector('.sub-hour').value,
			min: start.querySelector('.sub-min').value,
			sec: start.querySelector('.sub-sec').value,
			ms: start.querySelector('.sub-ms').value
		}
		let endTime = {
			hour: end.querySelector('.sub-hour').value,
			min: end.querySelector('.sub-min').value,
			sec: end.querySelector('.sub-sec').value,
			ms: end.querySelector('.sub-ms').value
		}

		let text = subtitle.querySelector('.sub-text').value;

		let msDivider = subType === 'vtt' ? '.' : ','

		let expObj = {
			index: index,
			start: `${startTime.hour}:${startTime.min}:${startTime.sec}${msDivider}${startTime.ms}`,
			end: `${endTime.hour}:${endTime.min}:${endTime.sec}${msDivider}${endTime.ms}`,
			text: text
		}

		let expJSON = {
			index: index,
			start: startTime,
			end: endTime,
			text: text
		}

		exportedForJSON.push(expJSON);
		exportedForVTT.push(expObj);
	})

	
	if(subType === 'vtt' || subType === 'srt') {
		exportSubtitleText(subType, exportedForVTT)
	} else {
		exportJSON(exportedForJSON)
	}

}

const exportJSON = (json) => {
	json = JSON.stringify(json)
	let saveJSON = new Blob([json], {type: "application/json"} );
	saveAs(saveJSON, 'captions.json');
}

const exportSubtitleText = (subType, subtitles) => {
	//json = JSON.stringify(json)
	//let saveJSON = new Blob([json], {type: "application/json"} );
	//saveAs(saveJSON, 'captions.json');

	let plainText = '';
	if(subType === 'vtt') {
		plainText += 'WEBVTT\n\n';
	}

	subtitles.forEach( (subtitle, index) => {
		plainText += String(subtitle.index) + `\n`;
		plainText += `${String(subtitle.start)} --> ${String(subtitle.end)}` + `\n`
		plainText += `${String(subtitle.text)}` + `\n\n`
	})

	let file = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
	saveAs(file, `captions.${subType}`);

	let message = `Remember to save a JSON file if you want to edit your subtitles again later.`
	window.alert(message);

}