import { createSubtitleField } from './subtitle-field'

const exp = module.exports; 

exp.loadJSON = (src) => {

	return fetch(src)
	.then( (response) => {
		return response.json();
	})
	.then( (json) => {
		exp.addSubtitles(json);
		return json;
	})
}

exp.addSubtitles = (json) => {
	console.log(json)
	json.forEach( (item, index) => {
		let newSub = createSubtitleField(true);

		let start = newSub.querySelector('.sub-start-inputs')
		let end = newSub.querySelector('.sub-end-inputs')
		let startTime = {
			hour: start.querySelector('.sub-hour'),
			min: start.querySelector('.sub-min'),
			sec: start.querySelector('.sub-sec'),
			ms: start.querySelector('.sub-ms'),
			raw: start.querySelector('.sub-raw')
		}
		let endTime = {
			hour: end.querySelector('.sub-hour'),
			min: end.querySelector('.sub-min'),
			sec: end.querySelector('.sub-sec'),
			ms: end.querySelector('.sub-ms'),
			raw: end.querySelector('.sub-raw')
		}

		let text = newSub.querySelector('.sub-text');

		startTime.hour.value = item.start.hour;
		startTime.min.value = item.start.min;
		startTime.sec.value = item.start.sec;
		startTime.ms.value = item.start.ms;
		startTime.raw.innerHTML = parseInt((item.start.hour * 60) * 60) + parseInt(item.start.min * 60) + parseInt(item.start.sec) + Number(`0.${item.start.ms}`) 
		
		endTime.hour.value = item.end.hour;
		endTime.min.value = item.end.min;
		endTime.sec.value = item.end.sec;
		endTime.ms.value = item.end.ms;
		endTime.raw.innerHTML = parseInt((item.end.hour * 60) * 60) + parseInt(item.end.min * 60) + parseInt(item.end.sec) + parseInt(`0.${item.end.ms}`) 

		text.value = item.text;

	})
}