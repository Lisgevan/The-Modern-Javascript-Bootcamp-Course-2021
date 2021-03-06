// //Writing tests from scratch
// const assert = require( "assert" );
// const { forEach, map } = require("./index");

// //helper function for tests
// const test = (desc, fn) => {
// 	console.log("===>", desc);
// 	try {
// 		fn();
// 	} catch (err) {
// 		console.log(err.message);
// 	}
// };

// //test for 'forEach'
// test("The forEach function", () => {
// 	let sum = 0;
// 	forEach([1, 2, 3], value => {
// 		sum += value;
// 	});

// 	assert.strictEqual(sum, 6, "Expected foEach to sum the array");
// });

// //test for 'map'
// test("The map function", () => {
// 	const result = map([1, 2, 3], value => {
// 		return value * 2;
// 	});
// 	// //first way
// 	// assert.strictEqual(result[0], 2);
// 	// assert.strictEqual(result[1], 4);
// 	// assert.strictEqual(result[2], 6);

// 	//second way
// 	assert.deepStrictEqual(result, [2, 4, 7]);
// });

//Writing tests with 'Mocha' test framework
const assert = require("assert");
const { forEach, map } = require("./index");

//test for 'forEach'
it("The forEach function", () => {
	let sum = 0;
	forEach([1, 2, 3], value => {
		sum += value;
	});

	assert.strictEqual(sum, 6, "Expected foEach to sum the array");
});

//test for 'map'
it("The map function", () => {
	const result = map([1, 2, 3], value => {
		return value * 2;
	});
	// //first way
	// assert.strictEqual(result[0], 2);
	// assert.strictEqual(result[1], 4);
	// assert.strictEqual(result[2], 6);

	//second way
	assert.deepStrictEqual(result, [2, 4, 6]);
});
