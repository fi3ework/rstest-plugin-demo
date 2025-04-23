// `__import` should be inject from vm outside.
const __import = (request) => { return import(request); }
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

/******/ var __webpack_modules__ = ({

/***/ "./node_modules/.pnpm/add@2.0.6/node_modules/add/index.js":
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
  "use strict";

  // AMD
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
  // CommonJS
  else {}
})(this, function () {
  "use strict";

  // The minimum machine rounding error
  var Epsilon = Math.pow(2, -53)
    , EpsilonReciprocal = (1 / Epsilon)
      /// The smallest positive number that can be represented
    , Eta = Math.pow(2, -1074)
      // limitB is a constant used in the transform function
    , limitB = 0.5 * EpsilonReciprocal * Eta

  /**
  * S. M. RUMP, T. OGITA AND S. OISHI
  * http://www.ti3.tu-harburg.de/paper/rump/RuOgOi07I.pdf
  */

  // Page 8
  // x is result, y is error
  // third is so the array is allocated for 4 spaces
  // it speeds up transform
  function fastTwoSum(a, b) {
    var x = a + b
      , q = x - a
      , y = b - q

    return [x, y, null]
  }

  // Page 12
  // p = q + p'
  // sigma is a power of 2 greater than or equal to |p|
  function extractScalar(sigma, p) {
    var q = (sigma + p) - sigma
      , pPrime = p - q

    return [q, pPrime]
  }

  // Page 12
  function extractVector(sigma, p) {
    var tau = 0.0
      , extracted
      , i = 0
      , ii = p.length
      , pPrime = new Array(ii)

    for(; i<ii; ++i) {
      extracted = extractScalar(sigma, p[i])
      pPrime[i] = extracted[1]
      tau += extracted[0]
    }

    return [tau, pPrime]
  }

  // Finds the immediate power of 2 that is larger than p
  //// in a fast way
  function nextPowerTwo (p) {
    var q = EpsilonReciprocal * p
      , L = Math.abs((q + p) - q)

    if(L === 0)
      return Math.abs(p)

    return L
  }

  // Helper, gets the maximum of the absolute values of an array
  function maxAbs(arr) {
    var i = 0
      , ii = arr.length
      , best = -1

    for(; i<ii; ++i) {
      if(Math.abs(arr[i]) > best) {
        best = arr[i]
      }
    }

    return best
  }

  function transform (p) {
    var mu = maxAbs(p)
      , M
      , sigmaPrime
      , tPrime
      , t
      , tau
      , sigma
      , extracted
      , res

        // Not part of the original paper, here for optimization
      , temp
      , bigPow
      , limitA
      , twoToTheM

    if(mu === 0) {
      return [0, 0, p, 0]
    }

    M = nextPowerTwo(p.length + 2)
    twoToTheM = Math.pow(2, M)
    bigPow = 2 * twoToTheM // equiv to Math.pow(2, 2 * M), faster
    sigmaPrime = twoToTheM * nextPowerTwo(mu)
    tPrime = 0

    do {
      t = tPrime
      sigma = sigmaPrime
      extracted = extractVector(sigma, p)
      tau = extracted[0]
      tPrime = t + tau
      p = extracted[1]

      if(tPrime === 0) {
        return transform(p)
      }

      temp = Epsilon * sigma
      sigmaPrime = twoToTheM * temp
      limitA = bigPow * temp
    }
    while( Math.abs(tPrime) < limitA && sigma > limitB )

    // res already allocated for 4
    res = fastTwoSum(t, tau)
    res[2] = p

    return res
  }

  function dumbSum(p) {
    var i, ii, sum = 0.0
    for(i=0, ii=p.length; i<ii; ++i) {
      sum += p[i]
    }
    return sum
  }

  function accSum(p) {

    // Zero length array, or all values are zeros
    if(p.length === 0 || maxAbs(p) === 0) {
      return 0
    }

    var tfmd = transform(p)

    return tfmd[0] + (tfmd[1] +dumbSum(tfmd[2]))
  }


  // exports
  accSum.dumbSum = dumbSum;
  accSum.fastTwoSum = fastTwoSum;
  accSum.nextPowerTwo = nextPowerTwo;
  return accSum;
});



/***/ }),

/***/ "./src/index.js":
/***/ ((module, __unused_webpack___webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
const __filename = '/Users/fi3ework/OSS/rstest-plugin-demo/src/index.js'
const __dirname = '/Users/fi3ework/OSS/rstest-plugin-demo/src'
// before loader:
// rstest.mock('add', async () => {
//   const originalModule = await import('lodash/capitalize.js')
//   const __output = originalModule.default
//   return __output
// })
//
let resolveMock = undefined;
const mockPromise = new Promise((_resolve)=>{
    resolveMock = _resolve;
});
__webpack_require__.rstest_register_module(/*require.resolve*/("./node_modules/.pnpm/add@2.0.6/node_modules/add/index.js"), async ()=>{
    const originalModule = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, "lodash-es/capitalize.js"));
    const __output = originalModule.default;
    return __output;
}, resolveMock);
await mockPromise;
// -------------------------------------------
let resolveMock2 = undefined;
const mockPromise2 = new Promise((_resolve)=>{
    resolveMock2 = _resolve;
});
__webpack_require__.rstest_register_module('ok', async ()=>{
    const originalModule = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, "radashi"));
    const __output = originalModule.title;
    return __output;
}, resolveMock2);
await mockPromise2;
// ESM
const cap = await Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, "./node_modules/.pnpm/add@2.0.6/node_modules/add/index.js", 23));
const capWithSuffix = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, "./src/use-lodash.js"));
const title = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, "ok"));
const titleWithSuffix = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, "./src/use-external.js"));
console.log('🟢', cap.default('ok'));
console.log('🟢', capWithSuffix.default('ok'));
console.log('🟢', title('hello world.'));
console.log('🟢', titleWithSuffix.default('hello world.'));
// CJS


__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ "./src/use-external.js":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const __filename = '/Users/fi3ework/OSS/rstest-plugin-demo/src/use-external.js'
const __dirname = '/Users/fi3ework/OSS/rstest-plugin-demo/src'
// before loader:
// import cap from 'lodash'
const title = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, "ok"));
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    return title(...args) + ' --- use-external';
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ "./src/use-lodash.js":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const __filename = '/Users/fi3ework/OSS/rstest-plugin-demo/src/use-lodash.js'
const __dirname = '/Users/fi3ework/OSS/rstest-plugin-demo/src'
// before loader:
// import cap from 'lodash'
const cap = (await Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, "./node_modules/.pnpm/add@2.0.6/node_modules/add/index.js", 23))).default;
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    return cap(...args) + ' --- use-lodash';
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ "lodash-es/capitalize.js":
/***/ ((module) => {

module.exports = __import("lodash-es/capitalize.js");;

/***/ }),

/***/ "ok":
/***/ ((module) => {

module.exports = __import("ok");;

/***/ }),

/***/ "radashi":
/***/ ((module) => {

module.exports = __import("radashi");;

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/async module */
/******/ (() => {
/******/ 	var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 	var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 	var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 	var resolveQueue = (queue) => {
/******/ 		if(queue && queue.d < 1) {
/******/ 			queue.d = 1;
/******/ 			queue.forEach((fn) => (fn.r--));
/******/ 			queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 		}
/******/ 	}
/******/ 	var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 		if(dep !== null && typeof dep === "object") {
/******/ 			if(dep[webpackQueues]) return dep;
/******/ 			if(dep.then) {
/******/ 				var queue = [];
/******/ 				queue.d = 0;
/******/ 				dep.then((r) => {
/******/ 					obj[webpackExports] = r;
/******/ 					resolveQueue(queue);
/******/ 				}, (e) => {
/******/ 					obj[webpackError] = e;
/******/ 					resolveQueue(queue);
/******/ 				});
/******/ 				var obj = {};
/******/ 				obj[webpackQueues] = (fn) => (fn(queue));
/******/ 				return obj;
/******/ 			}
/******/ 		}
/******/ 		var ret = {};
/******/ 		ret[webpackQueues] = x => {};
/******/ 		ret[webpackExports] = dep;
/******/ 		return ret;
/******/ 	}));
/******/ 	__webpack_require__.a = (module, body, hasAwait) => {
/******/ 		var queue;
/******/ 		hasAwait && ((queue = []).d = -1);
/******/ 		var depQueues = new Set();
/******/ 		var exports = module.exports;
/******/ 		var currentDeps;
/******/ 		var outerResolve;
/******/ 		var reject;
/******/ 		var promise = new Promise((resolve, rej) => {
/******/ 			reject = rej;
/******/ 			outerResolve = resolve;
/******/ 		});
/******/ 		promise[webpackExports] = exports;
/******/ 		promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 		module.exports = promise;
/******/ 		body((deps) => {
/******/ 			currentDeps = wrapDeps(deps);
/******/ 			var fn;
/******/ 			var getResult = () => (currentDeps.map((d) => {
/******/ 				if(d[webpackError]) throw d[webpackError];
/******/ 				return d[webpackExports];
/******/ 			}))
/******/ 			var promise = new Promise((resolve) => {
/******/ 				fn = () => (resolve(getResult));
/******/ 				fn.r = 0;
/******/ 				var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 				currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 			});
/******/ 			return fn.r ? promise : getResult();
/******/ 		}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 		queue && queue.d < 0 && (queue.d = 0);
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/create fake namespace object */
/******/ (() => {
/******/ 	var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 	var leafPrototypes;
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 16: return value when it's Promise-like
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = this(value);
/******/ 		if(mode & 8) return value;
/******/ 		if(typeof value === 'object' && value) {
/******/ 			if((mode & 4) && value.__esModule) return value;
/******/ 			if((mode & 16) && typeof value.then === 'function') return value;
/******/ 		}
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		var def = {};
/******/ 		leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 		for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 			Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 		}
/******/ 		def['default'] = () => (value);
/******/ 		__webpack_require__.d(ns, def);
/******/ 		return ns;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/rstest runtime */
/******/ (() => {
/******/ 	
/******/ 	            // __webpack_require__.rstest_import = async function(modPath, mod) {
/******/ 	            //   if (!mod) {
/******/ 	            //       // external module
/******/ 	            //       return __import(request) // injected to vm
/******/ 	            //     } else {
/******/ 	            //       // bundled module
/******/ 	            //       const resolvedMod = await mod;
/******/ 	            //       return resolvedMod
/******/ 	            //     }
/******/ 	            // };
/******/ 	            if (typeof __webpack_module_cache__ !== 'undefined') {
/******/ 	              __webpack_require__.c = __webpack_module_cache__;
/******/ 	            }
/******/ 	            __webpack_require__.rstest_register_module = async (id, modFactory, resolveMod) => {
/******/ 	              const mod = await modFactory();
/******/ 	              __webpack_require__.c[id] = { exports: mod } 
/******/ 	              resolveMod()
/******/ 	            };
/******/ 	            __webpack_require__.with_rstest = async function(id, modFactory, resolveMod) {
/******/ 	              const mocked = __webpack_require__.mocked[id]
/******/ 	              return mocked
/******/ 	            };
/******/ 	            // __webpack_require__.rstest_import = function(moduleId) {
/******/ 	            //   // TODO: here use vm injected import function
/******/ 	            //   return import(moduleId);
/******/ 	            // };
/******/ 	          
/******/ })();
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module used 'module' so it can't be inlined
/******/ var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 
