const durationInput = document.querySelector("#duration");
const startButton = document.querySelector("#start");
const pauseButton = document.querySelector("#pause");
const circle = document.querySelector("circle");

const perimeter = circle.getAttribute("r") * 2 * Math.PI;
circle.setAttribute("stroke-dasharray", perimeter);

let currentOffset = 0;
const timer = new Timer(durationInput, startButton, pauseButton, {
	//callback functions to check when the timer started, when it is ticking, when it is complete
	// we will be using them to change the web page instead of putting the code in the our class
	onStart() {
		console.log("Timer started");
	},
	onTick() {
		circle.setAttribute("stroke-dashoffset", currentOffset);
		currentOffset -= 50;
	},
	onComplete() {
		console.log("Timer completed");
	},
});
