var swizzle = require('../');
var a = require('assert');

var slice = Array.prototype.slice;

var toArray = function(args) {
	return slice.call(args);
};

describe('swizzle', function(){

	it('should function if called with function and an array', function(){
		function t (a, b, c) { return [a, b, c]; }
		var t2 = swizzle(t, [2, 1, 0]);

		a.deepEqual(t2(1, 2, 3), [3, 2, 1]);
	});

	it('should function if assigned to Function.prototype', function(){
		Function.prototype.swizzle = swizzle;

		function t (a, b, c) { return [a, b, c]; }
		var t2 = t.swizzle([2, 1, 0]);

		a.deepEqual(t2(1, 2, 3), [3, 2, 1]);

		delete Function.prototype.swizzle;
	});

	it('should allow parameters to be repeated', function(){
		function t (a, b, c) { return [a, b, c]; }
		var t2 = swizzle(t, [0, 1, 1]);

		a.deepEqual(t2(1, 2, 3), [1, 2, 2]);
	});

	it('should allow out-of-bound parameters', function(){
		function t (a, b, c) { return [a, b, c]; }
		var t2 = swizzle(t, [0, -1, 4]);

		a.deepEqual(t2(1, 2, 3), [1, undefined, undefined]);
	});

	it('should allow fewer parameters than the function arity', function(){
		function t (a, b, c) { return [a, b, c]; }
		var t2 = swizzle(t, [1, 0]);

		a.deepEqual(t2(1, 2, 3), [2, 1, 3]);
	});

	it('should allow more parameters than the function arity', function(){
		function t (a, b, c) { return [a, b, c]; }
		var t2 = swizzle(t, [1, 2, 0, 3]);

		a.deepEqual(t2(1, 2, 3), [2, 3, 1]);
	});

	it('should work with constructor functions', function(){
		function t (a, b, c) { this.a = a; this.b = b; this.c = c; }
		t.prototype = { d: 'foo' };

		var t2 = swizzle(t, [2, 1, 0]);

		var o = new t2(1, 2, 3);
		a.deepEqual(o, { a: 3, b: 2, c: 1 });
		a.equal(o.d, 'foo');
	});

});