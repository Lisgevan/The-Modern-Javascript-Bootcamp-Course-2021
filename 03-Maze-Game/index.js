//get access to objects from Matter library by destructuring them
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const cellsHorizontal = 4;
const cellsVertical = 10;
const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = window.innerWidth / cellsHorizontal;
const unitLengthY = window.innerHeight / cellsVertical;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
	element: document.body,
	engine: engine,
	options: {
		wireframes: false,
		width,
		height,
	},
});
Render.run(render);
Runner.run(Runner.create(), engine);

//walls
const walls = [
	Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
	Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
	Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
	Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }),
];

World.add(world, walls);

// ==> Maze generation <==

// const grid = Array(3)
// 	.fill(null)
//  .map( () => Array( 3 ).fill( false ) );//create an array with 3 items and each item to be an array of 3 items with the value of false

//shuffle array function
const shuffle = arr => {
	let counter = arr.length;
	while (counter > 0) {
		const index = Math.floor(Math.random() * counter);
		counter--;
		const temp = arr[counter];
		arr[counter] = arr[index];
		arr[index] = temp;
	}
	return arr;
};

//grid array
const grid = Array(cellsVertical)
	.fill(null)
	.map(() => Array(cellsHorizontal).fill(false));
//vertical walls
const verticals = Array(cellsVertical)
	.fill(null)
	.map(() => Array(cellsHorizontal - 1).fill(false));
//horizontal walls
const horizontals = Array(cellsVertical - 1)
	.fill(null)
	.map(() => Array(cellsHorizontal).fill(false));

//pick  random cell
const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const stepThroughCell = (row, column) => {
	//If I have visited the cell at [row, column], then return
	if (grid[row][column]) {
		return;
	}

	//Mark this cell as being visited
	grid[row][column] = true;

	//Assemble randomly-ordered list of neighbors
	const neighbors = shuffle([
		[row - 1, column, "up"], //above
		[row, column + 1, "right"], //right
		[row + 1, column, "down"], //bottom
		[row, column - 1, "left"], //left
	]);

	//For each neighbor...
	for (let neighbor of neighbors) {
		const [nextRow, nextColumn, direction] = neighbor;

		//...see if that neighbor is out of bounds
		if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
			continue;
		}

		//...see if we have visited that neighbor, continue to next one
		if (grid[nextRow][nextColumn]) {
			continue;
		}

		//...remove a wall from either horizontals or verticals
		if (direction === "left") {
			verticals[row][column - 1] = true;
		} else if (direction === "right") {
			verticals[row][column] = true;
		} else if (direction === "up") {
			horizontals[row - 1][column] = true;
		} else if (direction === "down") {
			horizontals[row][column] = true;
		}
		stepThroughCell(nextRow, nextColumn);
	}

	//...visit that next cell
	//code here
};

stepThroughCell(startRow, startColumn);

//Drawing of the maze in the MatterJS world
//horizontal walls
horizontals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) {
			return;
		}

		const wall = Bodies.rectangle(
			columnIndex * unitLengthX + unitLengthX / 2, //calculate x axis distance to the center of wall
			rowIndex * unitLengthY + unitLengthY, //calculate y axis distance
			unitLengthX, //width of wall
			10, //height of wall
			{
				label: "wall",
				isStatic: true,
			}
		);
		World.add(world, wall);
	});
});
//vertical walls(repeating the above process)
verticals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) {
			return;
		}

		const wall = Bodies.rectangle(
			columnIndex * unitLengthX + unitLengthX, //calculate x axis distance
			rowIndex * unitLengthY + unitLengthY / 2, //calculate y axis distance to the center of wall
			10, //width of wall
			unitLengthY, //height of wall
			{
				label: "wall",
				isStatic: true,
			}
		);
		World.add(world, wall);
	});
});

//Placing starting and ending points
//ending point
const goal = Bodies.rectangle(
	width - unitLengthX / 2,
	height - unitLengthY / 2,
	(unitLengthX * 60) / 100,
	(unitLengthY * 60) / 100,
	{
		isStatic: true,
		render: { fillStyle: "green" },
		label: "goal",
	}
);
World.add(world, goal);

//starting point
const ballRadious = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadious, {
	render: { fillStyle: "red" },
	label: "ball",
});
World.add(world, ball);

document.addEventListener("keydown", event => {
	const { x, y } = ball.velocity;
	if (event.code === "KeyW" || event.code === "ArrowUp") {
		Body.setVelocity(ball, { x, y: y - 5 });
	}
	if (event.code === "KeyD" || event.code === "ArrowRight") {
		Body.setVelocity(ball, { x: x + 5, y });
	}
	if (event.code === "KeyS" || event.code === "ArrowDown") {
		Body.setVelocity(ball, { x, y: y + 5 });
	}
	if (event.code === "KeyA" || event.code === "ArrowLeft") {
		Body.setVelocity(ball, { x: x - 5, y });
	}
});

//Win condition
Events.on(engine, "collisionStart", event => {
	event.pairs.forEach(collision => {
		const labels = ["ball", "goal"];
		if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
			document.querySelector(".winner").classList.remove("hidden");
			world.gravity.y = 1;
			world.bodies.forEach(body => {
				if (body.label === "wall") {
					Body.setStatic(body, false);
				}
			});
		}
	});
});
