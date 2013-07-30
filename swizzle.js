(function (root, factory) {
		'use strict';

		if (typeof exports === 'object') {
			module.exports = factory();
		} else if (typeof define === 'function' && define.amd) {
			define(factory);
		} else {
			root.swizzle = factory();
		}
	}(this, function () {
		'use strict';

		var slice = Array.prototype.slice,
		    call = Function.prototype.call,
		    toString = Object.prototype.toString;

		var toArray = function () { return call.apply(slice, arguments); };

		function theTypeOf (thing) {
			var type = toString.call(thing);
			return type.toLowerCase().match(/^\[object (.+)\]$/)[1];
		}

		function makeParameters (numberOfArgs) {
			var letters = [];
			for ( var i = 1; i <= numberOfArgs; i++ ) letters.push("arg" + i);
			return letters;
		}

		function fillOutPositions (newOrder, fnLength) {
			if (newOrder.length < fnLength) {
				for (var i = newOrder.length; i < fnLength; i++) {
					newOrder[i] = i;
				}
			}
		}

		function reorderArguments (newOrder) {
			return function (oldArgs) {
				var theArgs = toArray(oldArgs);
				var newArgs = [];

				for ( var i = 0; i < theArgs.length; i++ ) {
					if (i < newOrder.length) {
						newArgs[i] = theArgs[newOrder[i]];
					} else {
						newArgs[i] = theArgs[i];
					}
				}

				return newArgs;
			};
		}

		function makeSwizzledFunction (fn, argPositions) {
			fillOutPositions(argPositions, fn.length);
			var newLength = Math.max.apply(Math, argPositions) + 1;
			var paramList = makeParameters(newLength);
			var argReorder = reorderArguments(argPositions);

			var functionCode = 'return false || function ';
			functionCode += fn.name + '(';
			functionCode += paramList.join(', ') + ') {\n';
			functionCode += 'return fn.apply(this, reorder(arguments));\n';
			functionCode += '};'

			var wrappedFn = Function("fn", "reorder", functionCode)(fn, argReorder);
			wrappedFn.prototype = fn.prototype;

			return wrappedFn;
		}

		function swizzle(fn, newArgPositions) {
			var fnType = theTypeOf(fn);

			if (fnType === 'array') {
				newArgPositions = fn;
			}

			if (fnType !== 'function' && theTypeOf(this) === 'function') {
				fn = this;
			}

			return makeSwizzledFunction(fn, newArgPositions);
		}

		return swizzle;
}));