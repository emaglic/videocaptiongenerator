import '../css/video-player.scss'
import {TweenMax, Power2, TimelineLite} from 'gsap';

const exp = module.exports;

export default class ebVideoPlayer {
	constructor(opts) {

		if(!opts) {
			console.log('You must provide an opts object with params')
			return;
		}

		if(!opts.parent) {
			console.error('You must provide a parent property containing the element you wish to add the player to.')
			return;
		}

		if(typeof opts.parent === 'string' ) {
			this.parent = document.querySelector(opts.parent)
			if(!this.parent) {
				console.error('Error: Could not find specified parent element')
				return;
			}
		} else if(typeof opts.parent === 'object') {
			this.parent = opts.parent;
		} else {
			console.error('Error: Could not find specified parent element')
			return;
		}

		this.container = document.createElement('div')
		this.container.classList.add('video-container')

		this.container.innerHTML = `
		<div class='video-overlay'>
			<div class='video-click'></div>
			<div class='video-top-controls'>
				<div class='video-ctrls-rewind15s video-top-controls-default' style='background-image:url("./images/player-rewind15s.png")'></div>
				<div class='video-ctrls-forward15s video-top-controls-default' style='background-image:url("./images/player-forward15s.png")'></div>
				<div class='video-ctrls-playback-speed'>
					<div class='video-ctrls-speed-icon' style='background-image:url("./images/player-timer.png")'></div>
					<div class='video-ctrls-speed-down' style='background-image:url("./images/player-minus.png")'></div>
					<div class='video-ctrls-speed-up' style='background-image:url("./images/player-plus.png")'></div>
				</div>
			</div>
			<div class='video-bottom-controls'>
				<div class='ctrls-progress'>
					<progress value='0' max='100'></progress>
				</div>
				<div class='ctrls-container'>
					<ul class='ctrls-ul'>
						<li class='ctrls-play' style='background-image:url("./images/player-play.png")'></li>
						<li class='ctrls-mute' style='background-image:url("./images/player-unmute.png")'></li>
						<li class='ctrls-time'></li>
						<li class='ctrls-expand' style='background-image:url("./images/player-expand.png")'></li>
					</ul>
				</div>
			</div>
		</div>
		<video class='video-player' autoplay crossorigin="anonymous"></video>
		`

		// Setup Vars
		///////////////////////////////////////////////////////////////////////////////////////////////////

		this.playbackRate = opts.playbackRate || 1;

		// Main Element
		//===================================================================================
		let videoOverlay = this.container.querySelector('.video-overlay');
		//===================================================================================
		
		// Video Element
		//===================================================================================
		this.element = this.container.querySelector('video');
		//===================================================================================

		// Video Caption Track
		//===================================================================================
		this.subtitles = opts.subtitles || '';
		//===================================================================================

		// Top Control Elements
		//===================================================================================
		let videoClick = this.container.querySelector('.video-click')
		let rewind15s = this.container.querySelector('.video-ctrls-rewind15s')
		let forward15s = this.container.querySelector('.video-ctrls-forward15s')
		let resetSpeed = this.container.querySelector('.video-ctrls-speed-icon')
		let speedDown = this.container.querySelector('.video-ctrls-speed-down')
		let speedUp = this.container.querySelector('.video-ctrls-speed-up')
		//===================================================================================

		// Bottom Control Elements
		//===================================================================================
		let bottomControls = this.container.querySelector('.video-bottom-controls')
		let progress = this.container.querySelector('progress')
		let play = this.container.querySelector('.ctrls-play')
		let mute = this.container.querySelector('.ctrls-mute')
		let expand = this.container.querySelector('.ctrls-expand')
		let ctrlsTime = this.container.querySelector('.ctrls-time')
		//===================================================================================

		///////////////////////////////////////////////////////////////////////////////////////////////////

		// VIDEO OVERLAY STUFF
		///////////////////////////////////////////////////////////////////////////////////////////////////

		// For Overlay mousemove
		//===================================================================================
		videoOverlay.onmousemove = () => {

			//Anytime the cursor is over the videoOverlay set the focus to it.		
			videoOverlay.focus();

			TweenLite.killTweensOf(videoOverlay);
			videoOverlay.style.cursor = 'auto';

			TweenLite.to(videoOverlay, 0.25, {delay:0, opacity:1, ease:Power2.easeOut, onComplete:function() {
				videoOverlay.style.cursor = 'auto';

				TweenLite.to(videoOverlay, 0.5, {delay:3, opacity:0, ease:Power2.easeOut, onComplete:function() {
					videoOverlay.style.cursor = 'none';
				}});

			}});
		} // END - videoOverlay.onmousemove
		//===================================================================================

		// For Overlay mouseout 
		//===================================================================================
		videoOverlay.onmouseout = () => {
			TweenLite.killTweensOf(videoOverlay);
			videoOverlay.style.cursor = 'auto';
			TweenLite.to(videoOverlay, 0.5, {delay:0, opacity:0, ease:Power2.easeOut})
		} // END - videoOverlay.onmouseout
		//===================================================================================

		// For The Clickable Video Area Play/Pause
		//===================================================================================
		videoClick.onclick = () => {
			if(this.element.paused) {
				this.element.play()
			} else {
				this.element.pause();
			}
		}
		//===================================================================================

		// Adjust Video Playback Speed 
		//===================================================================================
		resetSpeed.onclick = () => {
			this.playbackRate = 1;
			this.element.playbackRate = this.playbackRate;
		}
		
		speedDown.onclick = () => {
			this.playbackRate -= 0.1;
			if(this.playbackRate < 0.1) {
				this.playbackRate = 0.1;
			}
			this.element.playbackRate = this.playbackRate;
		}
		
		speedUp.onclick = () => {
			this.playbackRate += 0.1;
			this.element.playbackRate = this.playbackRate;
		}
		//===================================================================================

		// Rewind Video By 15 Seconds (-15)
		//===================================================================================
		rewind15s.onclick = () => {
			this.element.currentTime -= 10;
		} // END - rewind15s.onclick
		//===================================================================================

		// Fast-Forward Video By 15 Seconds (+15)
		//===================================================================================
		forward15s.onclick = () => {
			this.element.currentTime += 10;
		} // END - forward15s.onclick
		//===================================================================================

		// END - VIDEO OVERLAY STUFF
		///////////////////////////////////////////////////////////////////////////////////////////////////

		//BOTTOM CONTROLS
		///////////////////////////////////////////////////////////////////////////////////////////////////

		// Add Default (empty) Click For Bottom Controls
		// Note: This Stops the Rewind15s and Forward15s Buttons From Conflicting With Bottom Controls
		//===================================================================================
		bottomControls.onclick = (evt) => {
			evt.preventDefault;
		} // END - bottomControls.onclick
		//===================================================================================
		
		// For the Progress Bar
		//===================================================================================
		progress.onclick = (evt) => {
			let progressPos = progress.getBoundingClientRect();
			//let clickPos = (evt.pageX - progressPos.left)
			let clickPercent = ((evt.pageX - progressPos.left) / progressPos.width);
			
			let videoGotoTime = this.element.duration * clickPercent

			this.element.currentTime = videoGotoTime;

		}
		//===================================================================================

		// For Bottom Play Button Click
		//===================================================================================
		play.onclick = () => {
			if(this.element.paused) {
				this.element.play()
			} else {
				this.element.pause();
			}
		}// END - play.onclick
		//===================================================================================

		// For Mute Button Click 
		//===================================================================================
		mute.onclick = () => {
			if(this.element.muted) {
				this.element.muted = false;
			} else {
				this.element.muted = true;
			}
		} // END - mute.onclick
		//===================================================================================

		 expand.onclick = () => {
		 	this.element.classList.toggle('fullscreen')
		 	this.toggleFullscreen(this.container);
		 }

		///////////////////////////////////////////////////////////////////////////////////////////////////
		// END - BOTTOM CONTROLS

		// VIDEO "EVENT-LISTENERS"
		///////////////////////////////////////////////////////////////////////////////////////////////////

		//Add Progress Max
		//===================================================================================
		this.element.onloadedmetadata = (evt) => {
			progress.setAttribute('max', this.element.duration)
		} // End - this.element.onloadedmetadata
		//===================================================================================

		// Listen for Volume Change (For Mute/Unmute)
		//===================================================================================
		this.element.onvolumechange = (evt) => {
			if(this.element.muted) {
				mute.style.backgroundImage=`url("./images/player-mute.png")`;
			} else {
				mute.style.backgroundImage=`url("./images/player-unmute.png")`;
			}
		} // End - this.element.onvolumechange
		//===================================================================================

		// For Play Button
		//===================================================================================
		this.element.onplay = (evt) => {
			this.element.playbackRate = this.playbackRate;
			play.style.backgroundImage = `url('./images/player-pause.png')`;
			videoClick.style.backgroundImage = `url('./images/player-pause-large.png')`;

		} // End - this.element.onplay
		//===================================================================================

		// For Pause Button
		//===================================================================================
		this.element.onpause = (evt) => {
			play.style.backgroundImage = `url('./images/player-play.png')`;
			videoClick.style.backgroundImage = `url('./images/player-play-large.png')`;
		} // End - this.element.onpause
		//===================================================================================

		// Updates the Current Time In Video
		//===================================================================================
		this.element.ontimeupdate = (evt) => {

			progress.value = this.element.currentTime;

			let current = {
				ms: ((this.element.currentTime - Math.floor(this.element.currentTime)).toFixed(3))*1000,
				sec: parseInt(this.element.currentTime % 60),
				min: parseInt((this.element.currentTime / 60) % 60),
				hour: parseInt(((this.element.currentTime / 60) / 60) % 60),
			}

			let dur = {
				ms: ((this.element.duration - Math.floor(this.element.duration)).toFixed(3))*1000,
				sec:  parseInt(this.element.duration % 60),
				min: parseInt((this.element.duration / 60) % 60),
				hour: parseInt(((this.element.duration / 60) / 60) % 60)
			}
			
			if(current.ms < 10) {
				current.ms = '00' + current.ms;
			} else if(current.ms < 100) {
				current.ms = '0' + current.ms;
			}
			current.sec0 = (current.sec < 10) ? '0' : '';
			current.min0 = (current.min < 10) ? '0' : '';
			current.hour0 = (current.hour < 10) ? '0' : '';
			current.displayTime = String(current.hour0 + current.hour + ':' + current.min0 + current.min + ':' + current.sec0 + current.sec)

			if(dur.ms < 10) {
				dur.ms = '00' + dur.ms;
			} else if(dur.ms < 100) {
				dur.ms = '0' + dur.ms;
			}
			dur.sec0 = (dur.sec < 10) ? '0' : '';
			dur.min0 = (dur.min < 10) ? '0' : '';
			dur.hour0 = (dur.hour < 10) ? '0' : '';
			dur.displayTime = String(dur.hour0 + dur.hour + ':' + dur.min0 + dur.min + ':' + dur.sec0 + dur.sec)

			ctrlsTime.innerHTML = `<small>${current.displayTime} / ${dur.displayTime}</small>`

		} // End - this.element.ontimeupdate
		//===================================================================================

		this.element.onended = (evt) => {
			//Do Something When The Video Ends
		}

		///////////////////////////////////////////////////////////////////////////////////////////////////
		// END - VIDEO "EVENT-LISTENERS"

		//Add Player to Page
		this.parent.appendChild(this.container);

		//RETURN THIS
		///////////////////////////////////////////////////////////////////////////////////////////////////
		return this;
		///////////////////////////////////////////////////////////////////////////////////////////////////
	}

	// Load New Video Src or Track
	//===================================================================================
	load(src, type = 'video') {
		if(type === 'video') {
			this.removePrevSubtitles();
			this.element.src = src || '';
		} else if(type === 'subtitle') {
			
			this.removePrevSubtitles();
			let track = document.createElement("track");
		   	track.kind = "subtitles";
		   	track.label = "English";
		   	track.srclang = "en";
		   	track.src = src;
		   	this.element.appendChild(track);
		   	track.addEventListener("load", () => {
		      	track.mode = "showing";
		    	this.element.textTracks[this.element.textTracks.length - 1].mode = "showing"; // thanks Firefox
		   	});
		}
	}
	//===================================================================================

	//===================================================================================
	addSubtitleCues(cues) {
		this.removePrevSubtitles();
		let type = 'subtitles';
		let language = 'English';
		let abv = 'en';
		let track = this.element.addTextTrack(type, language, abv);
		track.mode = 'showing';
		cues.forEach( (cue) => {
			track.addCue(new VTTCue(cue.start, cue.end, cue.text));
		})
	}
	//===================================================================================

	// Remove Subtitle Tracks
	//===================================================================================
	removePrevSubtitles() {
		// Oddly, there's no way to remove a track from a video, so hide them instead
		for (let i = 0; i < this.element.textTracks.length; i++) {
			this.element.textTracks[i].mode = "hidden";
		}
	}
	//===================================================================================

	// Returns video current time hour, min, sec, ms
	//===================================================================================
	getTime() {

		let currentTime = {
			ms: ((this.element.currentTime - Math.floor(this.element.currentTime)).toFixed(3))*1000,
			sec: parseInt(this.element.currentTime % 60),
			min: parseInt((this.element.currentTime / 60) % 60),
			hour: parseInt(((this.element.currentTime / 60) / 60) % 60),
			raw: this.element.currentTime.toFixed(3)
		}

		if(currentTime.ms < 10) {
			currentTime.ms = '00' + currentTime.ms;
		} else if(currentTime.ms < 100) {
			currentTime.ms = '0' + currentTime.ms;
		}
		currentTime.sec = (currentTime.sec < 10) ? '0' + currentTime.sec : currentTime.sec;
		currentTime.min = (currentTime.min < 10) ? '0' + currentTime.min : currentTime.min;
		currentTime.hour = (currentTime.hour < 10) ? '0' + currentTime.hour : currentTime.hour; 

		return currentTime;
	}
	//===================================================================================

	// Attempt to Toggle Fullscreen On/Off
	//===================================================================================
	toggleFullscreen (element) {

		console.log('toggle fullscreen')

		let isFullscreen = this.checkFullscreen();

		if(document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled) {
			if(isFullscreen === false) {
				if (element.requestFullscreen) {
			    	element.requestFullscreen();
			    } else if (element.webkitRequestFullscreen) {
			        element.webkitRequestFullscreen();
			  	}
			    else if(element.mozRequestFullScreen) {
			        element.mozRequestFullScreen();
			    } else {
			  		console.error('Fullscreen Error.')
			  		return;
			  	}
		  	} else if (isFullscreen === true) {
		  		if (document.exitFullscreen) {
			    	document.exitFullscreen();
			    } else if (document.webkitExitFullscreen) {
			        document.webkitExitFullscreen();
			  	}
			    else if(document.mozCancelFullScreen) {
			       	document.mozCancelFullScreen();
			    } else {
			  		console.error('Remove Fullscreen Error.')
			  		return;
			  	}
		  	}
	  	} else {
	  		console.error('Fullscreen Not Available')
	  		return;
	  	}

	} 
	//===================================================================================

	// Detect If Player is In Fullscreen Mode
	//===================================================================================
	checkFullscreen() {
		
		let isFullscreen = null;

		var w = window;
		var s = window.screen;
		var d = window.document;

		var d_width = d.documentElement.clientWidth || 0;
	    var d_height = d.documentElement.clientHeight || 0;
	    var w_width = w.innerWidth || 0; /* Inner, instead of outer, for IE9 */
	    var w_height = w.outerHeight || 0;
	    var s_width = s.width || 0;
	    var s_height = s.height || 0;
	    if ((w_width === s_width && w_height === s_height) || (d_width === s_width && d_height === s_height)) {
	      document.body.classList.add('fullscreen');
	      isFullscreen = true;
	    }
	    else {
	      document.body.classList.remove('fullscreen');
	      isFullscreen = false;
	    }
	    
	    return isFullscreen;
	}
	//===================================================================================
}

