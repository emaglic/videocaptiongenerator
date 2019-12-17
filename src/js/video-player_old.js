const exp = module.exports; 

export default class ebVideoPlayer {
	constructor(opts) {
		this.src = opts.src || '';
		this.element = opts.element || document.querySelector('video');
		this.element.setAttribute("controls", "true");
		this.element.setAttribute("muted", "false");
	}

	load(src) {
		this.element.src = src;
	}
}

