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
		console.log("ticked");
	};
}

const durationInput = document.querySelector("#duration");
const startButton = document.querySelector("#start");
const pauseButton = document.querySelector("#pause");

const timer = new Timer(durationInput, startButton, pauseButton);
