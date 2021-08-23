//get access to objects from Matter library by destructuring them
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const cells = 10;
const width = 600;
const height = 600;

const unitLength = width / cells;

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
const grid = Array(cells)
	.fill(null)
	.map(() => Array(cells).fill(false));
//vertical walls
const verticals = Array(cells)
	.fill(null)
	.map(() => Array(cells - 1).fill(false));
//horizontal walls
const horizontals = Array(cells - 1)
	.fill(null)
	.map(() => Array(cells).fill(false));

//pick  random cell
const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

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
		if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) {
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
			columnIndex * unitLength + unitLength / 2, //calculate x axis distance to the center of wall
			rowIndex * unitLength + unitLength, //calculate y axis distance
			unitLength, //width of wall
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
			columnIndex * unitLength + unitLength, //calculate x axis distance
			rowIndex * unitLength + unitLength / 2, //calculate y axis distance to the center of wall
			10, //width of wall
			unitLength, //height of wall
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
	width - unitLength / 2,
	height - unitLength / 2,
	(unitLength * 60) / 100,
	(unitLength * 60) / 100,
	{
		isStatic: true,
		render: { fillStyle: "green" },
		label: "goal",
	}
);
World.add(world, goal);

//starting point
const ball = Bodies.circle(unitLength / 2, unitLength / 2, unitLength * 0.2, {
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
			world.gravity.y = 1;
			world.bodies.forEach(body => {
				if (body.label === "wall") {
					Body.setStatic(body, false);
				}
			});
		}
	});
});
