const exp = module.exports; 

//=============================================================================================================
exp.createSubtitleField = (imported = false) => {
	//let numSubEntries = (document.querySelectorAll('subtitle-entry')).length;
	//let subtitleFieldsNum = allSubtitleFields.length;

	let newSub = document.createElement('div')
	newSub.classList.add('col-12', 'subtitle-entry', 'menu-section');
	//newSub.id = `subtitle-entry-${numSubEntries}`;

	newSub.innerHTML = `
		<div class='col-12'>
			<div class='row'>
				<div class='col-2'>
					<p>Start Time</p>
				</div>
				<div class='col-2'>
					<button class='sub-start-btn'>Get Start Time</button>
				</div>
				<div class='col-8'>
					<ul class='sub-time sub-start-inputs'>
						<li><input class='sub-time-input sub-hour' type='text' maxlength='2' value='00'> :</li>
						<li><input class='sub-time-input sub-min'type='text' maxlength='2' value='00'> :</li>
						<li><input class='sub-time-input sub-sec'type='text' maxlength='2' value='00'> :</li>
						<li><input class='sub-time-input sub-ms' type='text' maxlength='3'value='000'></li>
						<li class='sub-raw sub-raw-start'>0</li>
					</ul>
				</div>
			<div class='row'>
		</div>
		
		<div class='col-12'>
			<div class='row'>
				<div class='col-2'>
					<p>End Time</p>
				</div>
				<div class='col-2'>
					<button class='sub-end-btn'>Get End Time</button>
				</div>
				<div class='col-8'>
					<ul class='sub-time sub-end-inputs'>
						<li><input class='sub-time-input sub-hour' type='text' maxlength='2' value='00'> :</li>
						<li><input class='sub-time-input sub-min'type='text' maxlength='2' value='00'> :</li>
						<li><input class='sub-time-input sub-sec'type='text' maxlength='2' value='00'> :</li>
						<li><input class='sub-time-input sub-ms' type='text' maxlength='3' value='000'></li>
						<li class='sub-raw sub-raw-end'>0</li>
					</ul>
				</div>
			</div>
		</div>
		<div class='col-12'>
			<textarea class='sub-text'></textarea>
		</div>
		<div class='col-12'>
			<button class='sub-update-btn'>Update Caption</button>
			<button class='sub-remove-btn'>Remove Caption</button>
		</div>

	`

	inputFormatter(newSub)

	let subStartTimeBtn = newSub.querySelector('.sub-start-btn');
	let subEndTimeBtn = newSub.querySelector('.sub-end-btn');

	let subStartContainer = newSub.querySelector('.sub-start-inputs')
	let subEndContainer = newSub.querySelector('.sub-end-inputs')

	subStartTimeBtn.onclick = (evt) => {
		insertCurrentTime(subStartContainer);
		generateSubtitleCues();
	}

	subEndTimeBtn.onclick = (evt) => {
		insertCurrentTime(subEndContainer);
		generateSubtitleCues();
	}

	let updateSubtitle = newSub.querySelector('.sub-update-btn');
	updateSubtitle.onclick = (evt) => {
		updateSubTime(newSub);
		generateSubtitleCues();
	}

	let removeSubtitle = newSub.querySelector('.sub-remove-btn');
	removeSubtitle.onclick = (evt) => {
		newSub.parentNode.removeChild(newSub);
		generateSubtitleCues();
	}


	let allSubtitlesField = document.querySelector('.all-subtitles-container')
	allSubtitlesField.appendChild(newSub)

	if(imported === true) {
		generateSubtitleCues();
	}

	return newSub;

}
//=============================================================================================================

const generateSubtitleCues = () => {
	console.log('generateSubtitles...')
	let newSubtitles = []
	let subtitleElements = document.querySelectorAll('.subtitle-entry')
	subtitleElements.forEach( (entry) => {

		let newEntry = {
			start: entry.querySelector('.sub-raw-start').innerHTML,
			end: entry.querySelector('.sub-raw-end').innerHTML,
			text: entry.querySelector('.sub-text').value
		}

		newSubtitles.push(newEntry)

	})

	window.videoPlayer.addSubtitleCues(newSubtitles);
}


//=============================================================================================================
const inputFormatter = (parent) => {
	let subTimeInputs = parent.querySelectorAll('.sub-time-input')
	subTimeInputs.forEach( (input) => {
		input.onchange = () => {
			let newInput = input.value.replace(/[^\d]/g, '')
			if(parseInt(newInput) < 10 && newInput.length < 2) {
				newInput = `0${newInput}`
			}
			input.value = newInput;
		}
	})
}
//=============================================================================================================

const updateSubTime = (container) => {
	let start = container.querySelector('.sub-start-inputs')
	let end = container.querySelector('.sub-end-inputs')
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

	startTime.raw.innerHTML = parseInt((startTime.hour.value * 60) * 60) + parseInt(startTime.min.value * 60) + parseInt(startTime.sec.value) + Number(`0.${startTime.ms.value}`) 
	endTime.raw.innerHTML = parseInt((endTime.hour.value * 60) * 60) + parseInt(endTime.min.value * 60) + parseInt(endTime.sec.value) + Number(`0.${endTime.ms.value}`) 
}	

//=============================================================================================================
const insertCurrentTime = (container) => {
	let fields = {
		ms: container.querySelector('.sub-ms'),
		sec: container.querySelector('.sub-sec'),
		min: container.querySelector('.sub-min'),
		hour: container.querySelector('.sub-hour'),
		raw: container.querySelector('.sub-raw')
	}

	let time = window.videoPlayer.getTime();

	fields.ms.value = time.ms;
	fields.sec.value = time.sec;
	fields.min.value = time.min;
	fields.hour.value = time.hour;
	fields.raw.innerHTML = String(time.raw)
}
//=============================================================================================================

//=============================================================================================================
const insertAfter = (el, referenceNode) => {
	referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}
//=============================================================================================================



