//get access to objects from Matter library by destructuring them
const { Engine, Render, Runner, World, Bodies } = Matter;

const cells = 3;
const width = 600;
const height = 600;

const engine = Engine.create();
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
	Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
	Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
	Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
	Bodies.rectangle(width, height / 2, 40, height, { isStatic: true }),
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
