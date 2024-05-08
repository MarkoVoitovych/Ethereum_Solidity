const ganache = require('ganache');
const { describe, it } = require('mocha');
const { Web3 } = require('web3');
const assert = require('assert');

const web3 = new Web3(ganache.provider());

// class Car {
// 	park() {
// 		return 'stopped';
// 	}

// 	drive() {
// 		return 'vroom';
// 	}
// }
// let car

// beforeEach(() => {
// 	car = new Car();
// })

// describe('Car', () => {
// 	it('can park', () => {
// 		assert.equal(car.park(), 'stopped')
// 	});

// 	it('can drive', () => {
// 		assert.equal(car.drive(), 'vroom')
// })
// })