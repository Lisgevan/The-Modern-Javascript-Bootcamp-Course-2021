class Timer {
	constructor(durationInput, startButton, pauseButton, callbacks) {
		this.durationInput = durationInput;
		this.startButton = startButton;
		this.pauseButton = pauseButton;
		//if statement to make callbacks optional
		if (callbacks) {
			this.onStart = callbacks.onStart;
			this.onTick = callbacks.onTick;
			this.onComplete = callbacks.onComplete;
		}

		this.startButton.addEventListener("click", this.start);
		this.pauseButton.addEventListener("click", this.pause);
	}
	//declare start with arrow function so that "this" will refer to he class and not the window
	start = () => {
		if (this.onStart) {
			this.onStart();
		}
		//call tick manual to start immediately
		this.tick();
		//then run tick() every second
		this.interval = setInterval(this.tick, 1000);
	};

	pause = () => {
		clearInterval(this.interval);
	};

	tick = () => {
		if (this.timeRemaining <= 0) {
			this.pause();
			if (this.onComplete) {
				this.onComplete();
			}
		} else {
			this.timeRemaining = this.timeRemaining - 1;
			if (this.onTick) {
				this.onTick();
			}
		}
	};
	//"getter method" get a value and make a variable with the name of the function, we call it as 'this.functionName'
	get timeRemaining() {
		return parseFloat(durationInput.value);
	}
	//"setter method" set a value to the variable with the name of the function, we call it as 'this.functionName'
	set timeRemaining(time) {
		this.durationInput.value = time;
	}
}
