class Timer {
	constructor(durationInput, startButton, pauseButton) {
		this.durationInput = durationInput;
		this.startButton = startButton;
		this.pauseButton = pauseButton;

		this.startButton.addEventListener("click", this.start);
		this.pauseButton.addEventListener("click", this.pause);
	}
	//declare start with arrow function so that "this" will refer to he class and not the window
	start = () => {
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
		} else {
			this.timeRemaining = this.timeRemaining - 1;
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

const durationInput = document.querySelector("#duration");
const startButton = document.querySelector("#start");
const pauseButton = document.querySelector("#pause");

const timer = new Timer(durationInput, startButton, pauseButton);
