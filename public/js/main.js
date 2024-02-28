(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('rasterVis', ['exports'], factory) :
  (factory((global.rasterVis = global.rasterVis || {})));
}(this, function (exports) { 'use strict';

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  /** Used for built-in method references. */
  var arrayProto = Array.prototype;

  /** Built-in value references. */
  var splice = arrayProto.splice;

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  function listCacheSet(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `ListCache`.
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype['delete'] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;

  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */
  function stackClear() {
    this.__data__ = new ListCache;
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function stackDelete(key) {
    var data = this.__data__,
        result = data['delete'](key);

    this.size = data.size;
    return result;
  }

  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function stackGet(key) {
    return this.__data__.get(key);
  }

  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function stackHas(key) {
    return this.__data__.has(key);
  }

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Built-in value references. */
  var Symbol = root.Symbol;

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto$1.toString;

  /** Built-in value references. */
  var symToStringTag$1 = Symbol ? Symbol.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty$1.call(value, symToStringTag$1),
        tag = value[symToStringTag$1];

    try {
      value[symToStringTag$1] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }

  /** Used for built-in method references. */
  var objectProto$2 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$2.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString$1.call(value);
  }

  var nullTag = '[object Null]';
  var undefinedTag = '[object Undefined]';
  /** Built-in value references. */
  var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag && symToStringTag in Object(value))
      ? getRawTag(value)
      : objectToString(value);
  }

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  var asyncTag = '[object AsyncFunction]';
  var funcTag = '[object Function]';
  var genTag = '[object GeneratorFunction]';
  var proxyTag = '[object Proxy]';
  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }

  /** Used to detect overreaching core-js shims. */
  var coreJsData = root['__core-js_shared__'];

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? ('Symbol(src)_1.' + uid) : '';
  }());

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && (maskSrcKey in func);
  }

  /** Used for built-in method references. */
  var funcProto$1 = Function.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$1 = funcProto$1.toString;

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString$1.call(func);
      } catch (e) {}
      try {
        return (func + '');
      } catch (e) {}
    }
    return '';
  }

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used for built-in method references. */
  var funcProto = Function.prototype;
  var objectProto = Object.prototype;
  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }

  /* Built-in method references that are verified to be native. */
  var Map = getNative(root, 'Map');

  /* Built-in method references that are verified to be native. */
  var nativeCreate = getNative(Object, 'create');

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used for built-in method references. */
  var objectProto$3 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
  }

  /** Used for built-in method references. */
  var objectProto$4 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$3.call(data, key);
  }

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
    return this;
  }

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `Hash`.
  Hash.prototype.clear = hashClear;
  Hash.prototype['delete'] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash': new Hash,
      'map': new (Map || ListCache),
      'string': new Hash
    };
  }

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value;
    return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
      ? (value !== '__proto__')
      : (value === null);
  }

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key)
      ? data[typeof key == 'string' ? 'string' : 'hash']
      : data.map;
  }

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete(key) {
    var result = getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  function mapCacheSet(key, value) {
    var data = getMapData(this, key),
        size = data.size;

    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `MapCache`.
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype['delete'] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /**
   * Sets the stack `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
      var pairs = data.__data__;
      if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }

  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }

  // Add methods to `Stack`.
  Stack.prototype.clear = stackClear;
  Stack.prototype['delete'] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;

  var defineProperty = (function() {
    try {
      var func = getNative(Object, 'defineProperty');
      func({}, '', {});
      return func;
    } catch (e) {}
  }());

  /**
   * The base implementation of `assignValue` and `assignMergeValue` without
   * value checks.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function baseAssignValue(object, key, value) {
    if (key == '__proto__' && defineProperty) {
      defineProperty(object, key, {
        'configurable': true,
        'enumerable': true,
        'value': value,
        'writable': true
      });
    } else {
      object[key] = value;
    }
  }

  /**
   * This function is like `assignValue` except that it doesn't assign
   * `undefined` values.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignMergeValue(object, key, value) {
    if ((value !== undefined && !eq(object[key], value)) ||
        (value === undefined && !(key in object))) {
      baseAssignValue(object, key, value);
    }
  }

  /**
   * Creates a base function for methods like `_.forIn` and `_.forOwn`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1,
          iterable = Object(object),
          props = keysFunc(object),
          length = props.length;

      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }

  /**
   * The base implementation of `baseForOwn` which iterates over `object`
   * properties returned by `keysFunc` and invokes `iteratee` for each property.
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */
  var baseFor = createBaseFor();

  /** Detect free variable `exports`. */
  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Built-in value references. */
  var Buffer = moduleExports ? root.Buffer : undefined;
  var allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;
  /**
   * Creates a clone of  `buffer`.
   *
   * @private
   * @param {Buffer} buffer The buffer to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Buffer} Returns the cloned buffer.
   */
  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length,
        result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

    buffer.copy(result);
    return result;
  }

  /** Built-in value references. */
  var Uint8Array$1 = root.Uint8Array;

  /**
   * Creates a clone of `arrayBuffer`.
   *
   * @private
   * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
   * @returns {ArrayBuffer} Returns the cloned array buffer.
   */
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array$1(result).set(new Uint8Array$1(arrayBuffer));
    return result;
  }

  /**
   * Creates a clone of `typedArray`.
   *
   * @private
   * @param {Object} typedArray The typed array to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned typed array.
   */
  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }

  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */
  function copyArray(source, array) {
    var index = -1,
        length = source.length;

    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }

  /** Built-in value references. */
  var objectCreate = Object.create;

  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} proto The object to inherit from.
   * @returns {Object} Returns the new object.
   */
  var baseCreate = (function() {
    function object() {}
    return function(proto) {
      if (!isObject(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object.prototype = proto;
      var result = new object;
      object.prototype = undefined;
      return result;
    };
  }());

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  /** Built-in value references. */
  var getPrototype = overArg(Object.getPrototypeOf, Object);

  /** Used for built-in method references. */
  var objectProto$5 = Object.prototype;

  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */
  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$5;

    return value === proto;
  }

  /**
   * Initializes an object clone.
   *
   * @private
   * @param {Object} object The object to clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneObject(object) {
    return (typeof object.constructor == 'function' && !isPrototype(object))
      ? baseCreate(getPrototype(object))
      : {};
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]';

  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */
  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag;
  }

  /** Used for built-in method references. */
  var objectProto$6 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

  /** Built-in value references. */
  var propertyIsEnumerable = objectProto$6.propertyIsEnumerable;

  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty$4.call(value, 'callee') &&
      !propertyIsEnumerable.call(value, 'callee');
  };

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */
  function isLength(value) {
    return typeof value == 'number' &&
      value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }

  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }

  /**
   * This method is like `_.isArrayLike` except that it also checks if `value`
   * is an object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array-like object,
   *  else `false`.
   * @example
   *
   * _.isArrayLikeObject([1, 2, 3]);
   * // => true
   *
   * _.isArrayLikeObject(document.body.children);
   * // => true
   *
   * _.isArrayLikeObject('abc');
   * // => false
   *
   * _.isArrayLikeObject(_.noop);
   * // => false
   */
  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }

  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */
  function stubFalse() {
    return false;
  }

  /** Detect free variable `exports`. */
  var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

  /** Built-in value references. */
  var Buffer$1 = moduleExports$1 ? root.Buffer : undefined;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : undefined;

  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */
  var isBuffer = nativeIsBuffer || stubFalse;

  /** `Object#toString` result references. */
  var objectTag = '[object Object]';

  /** Used for built-in method references. */
  var funcProto$2 = Function.prototype;
  var objectProto$7 = Object.prototype;
  /** Used to resolve the decompiled source of functions. */
  var funcToString$2 = funcProto$2.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

  /** Used to infer the `Object` constructor. */
  var objectCtorString = funcToString$2.call(Object);

  /**
   * Checks if `value` is a plain object, that is, an object created by the
   * `Object` constructor or one with a `[[Prototype]]` of `null`.
   *
   * @static
   * @memberOf _
   * @since 0.8.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * _.isPlainObject(new Foo);
   * // => false
   *
   * _.isPlainObject([1, 2, 3]);
   * // => false
   *
   * _.isPlainObject({ 'x': 0, 'y': 0 });
   * // => true
   *
   * _.isPlainObject(Object.create(null));
   * // => true
   */
  function isPlainObject(value) {
    if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
      return false;
    }
    var proto = getPrototype(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty$5.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor &&
      funcToString$2.call(Ctor) == objectCtorString;
  }

  var argsTag$1 = '[object Arguments]';
  var arrayTag = '[object Array]';
  var boolTag = '[object Boolean]';
  var dateTag = '[object Date]';
  var errorTag = '[object Error]';
  var funcTag$1 = '[object Function]';
  var mapTag = '[object Map]';
  var numberTag = '[object Number]';
  var objectTag$1 = '[object Object]';
  var regexpTag = '[object RegExp]';
  var setTag = '[object Set]';
  var stringTag = '[object String]';
  var weakMapTag = '[object WeakMap]';
  var arrayBufferTag = '[object ArrayBuffer]';
  var dataViewTag = '[object DataView]';
  var float32Tag = '[object Float32Array]';
  var float64Tag = '[object Float64Array]';
  var int8Tag = '[object Int8Array]';
  var int16Tag = '[object Int16Array]';
  var int32Tag = '[object Int32Array]';
  var uint8Tag = '[object Uint8Array]';
  var uint8ClampedTag = '[object Uint8ClampedArray]';
  var uint16Tag = '[object Uint16Array]';
  var uint32Tag = '[object Uint32Array]';
  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] =
  typedArrayTags[setTag] = typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] = false;

  /**
   * The base implementation of `_.isTypedArray` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   */
  function baseIsTypedArray(value) {
    return isObjectLike(value) &&
      isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  /** Detect free variable `exports`. */
  var freeExports$2 = typeof exports == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule$2 = freeExports$2 && typeof module == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports$2 && freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule$2 && freeModule$2.require && freeModule$2.require('util').types;

      if (types) {
        return types;
      }

      // Legacy `process.binding('util')` for Node.js < 10.
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());

  /* Node.js helper references. */
  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

  /**
   * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function safeGet(object, key) {
    if (key === 'constructor' && typeof object[key] === 'function') {
      return;
    }

    if (key == '__proto__') {
      return;
    }

    return object[key];
  }

  /** Used for built-in method references. */
  var objectProto$8 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

  /**
   * Assigns `value` to `key` of `object` if the existing value is not equivalent
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty$6.call(object, key) && eq(objValue, value)) ||
        (value === undefined && !(key in object))) {
      baseAssignValue(object, key, value);
    }
  }

  /**
   * Copies properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Array} props The property identifiers to copy.
   * @param {Object} [object={}] The object to copy properties to.
   * @param {Function} [customizer] The function to customize copied values.
   * @returns {Object} Returns `object`.
   */
  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});

    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];

      var newValue = customizer
        ? customizer(object[key], source[key], key, object, source)
        : undefined;

      if (newValue === undefined) {
        newValue = source[key];
      }
      if (isNew) {
        baseAssignValue(object, key, newValue);
      } else {
        assignValue(object, key, newValue);
      }
    }
    return object;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER$1 = 9007199254740991;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER$1 : length;

    return !!length &&
      (type == 'number' ||
        (type != 'symbol' && reIsUint.test(value))) &&
          (value > -1 && value % 1 == 0 && value < length);
  }

  /** Used for built-in method references. */
  var objectProto$9 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray(value),
        isArg = !isArr && isArguments(value),
        isBuff = !isArr && !isArg && isBuffer(value),
        isType = !isArr && !isArg && !isBuff && isTypedArray(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? baseTimes(value.length, String) : [],
        length = result.length;

    for (var key in value) {
      if ((inherited || hasOwnProperty$7.call(value, key)) &&
          !(skipIndexes && (
             // Safari 9 has enumerable `arguments.length` in strict mode.
             key == 'length' ||
             // Node.js 0.10 has enumerable non-index properties on buffers.
             (isBuff && (key == 'offset' || key == 'parent')) ||
             // PhantomJS 2 has enumerable non-index properties on typed arrays.
             (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
             // Skip index properties.
             isIndex(key, length)
          ))) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * This function is like
   * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * except that it includes inherited enumerable properties.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function nativeKeysIn(object) {
    var result = [];
    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }
    return result;
  }

  /** Used for built-in method references. */
  var objectProto$10 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$8 = objectProto$10.hasOwnProperty;

  /**
   * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeysIn(object) {
    if (!isObject(object)) {
      return nativeKeysIn(object);
    }
    var isProto = isPrototype(object),
        result = [];

    for (var key in object) {
      if (!(key == 'constructor' && (isProto || !hasOwnProperty$8.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * Creates an array of the own and inherited enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keysIn(new Foo);
   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
   */
  function keysIn(object) {
    return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
  }

  /**
   * Converts `value` to a plain object flattening inherited enumerable string
   * keyed properties of `value` to own properties of the plain object.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {Object} Returns the converted plain object.
   * @example
   *
   * function Foo() {
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.assign({ 'a': 1 }, new Foo);
   * // => { 'a': 1, 'b': 2 }
   *
   * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
   * // => { 'a': 1, 'b': 2, 'c': 3 }
   */
  function toPlainObject(value) {
    return copyObject(value, keysIn(value));
  }

  /**
   * A specialized version of `baseMerge` for arrays and objects which performs
   * deep merges and tracks traversed objects enabling objects with circular
   * references to be merged.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {string} key The key of the value to merge.
   * @param {number} srcIndex The index of `source`.
   * @param {Function} mergeFunc The function to merge values.
   * @param {Function} [customizer] The function to customize assigned values.
   * @param {Object} [stack] Tracks traversed source values and their merged
   *  counterparts.
   */
  function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
    var objValue = safeGet(object, key),
        srcValue = safeGet(source, key),
        stacked = stack.get(srcValue);

    if (stacked) {
      assignMergeValue(object, key, stacked);
      return;
    }
    var newValue = customizer
      ? customizer(objValue, srcValue, (key + ''), object, source, stack)
      : undefined;

    var isCommon = newValue === undefined;

    if (isCommon) {
      var isArr = isArray(srcValue),
          isBuff = !isArr && isBuffer(srcValue),
          isTyped = !isArr && !isBuff && isTypedArray(srcValue);

      newValue = srcValue;
      if (isArr || isBuff || isTyped) {
        if (isArray(objValue)) {
          newValue = objValue;
        }
        else if (isArrayLikeObject(objValue)) {
          newValue = copyArray(objValue);
        }
        else if (isBuff) {
          isCommon = false;
          newValue = cloneBuffer(srcValue, true);
        }
        else if (isTyped) {
          isCommon = false;
          newValue = cloneTypedArray(srcValue, true);
        }
        else {
          newValue = [];
        }
      }
      else if (isPlainObject(srcValue) || isArguments(srcValue)) {
        newValue = objValue;
        if (isArguments(objValue)) {
          newValue = toPlainObject(objValue);
        }
        else if (!isObject(objValue) || isFunction(objValue)) {
          newValue = initCloneObject(srcValue);
        }
      }
      else {
        isCommon = false;
      }
    }
    if (isCommon) {
      // Recursively merge objects and arrays (susceptible to call stack limits).
      stack.set(srcValue, newValue);
      mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
      stack['delete'](srcValue);
    }
    assignMergeValue(object, key, newValue);
  }

  /**
   * The base implementation of `_.merge` without support for multiple sources.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {number} srcIndex The index of `source`.
   * @param {Function} [customizer] The function to customize merged values.
   * @param {Object} [stack] Tracks traversed source values and their merged
   *  counterparts.
   */
  function baseMerge(object, source, srcIndex, customizer, stack) {
    if (object === source) {
      return;
    }
    baseFor(source, function(srcValue, key) {
      stack || (stack = new Stack);
      if (isObject(srcValue)) {
        baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
      }
      else {
        var newValue = customizer
          ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
          : undefined;

        if (newValue === undefined) {
          newValue = srcValue;
        }
        assignMergeValue(object, key, newValue);
      }
    }, keysIn);
  }

  /**
   * This method returns the first argument it receives.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'a': 1 };
   *
   * console.log(_.identity(object) === object);
   * // => true
   */
  function identity(value) {
    return value;
  }

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax = Math.max;

  /**
   * A specialized version of `baseRest` which transforms the rest array.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @param {Function} transform The rest array transform.
   * @returns {Function} Returns the new function.
   */
  function overRest(func, start, transform) {
    start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
    return function() {
      var args = arguments,
          index = -1,
          length = nativeMax(args.length - start, 0),
          array = Array(length);

      while (++index < length) {
        array[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = transform(array);
      return apply(func, this, otherArgs);
    };
  }

  /**
   * Creates a function that returns `value`.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {*} value The value to return from the new function.
   * @returns {Function} Returns the new constant function.
   * @example
   *
   * var objects = _.times(2, _.constant({ 'a': 1 }));
   *
   * console.log(objects);
   * // => [{ 'a': 1 }, { 'a': 1 }]
   *
   * console.log(objects[0] === objects[1]);
   * // => true
   */
  function constant(value) {
    return function() {
      return value;
    };
  }

  /**
   * The base implementation of `setToString` without support for hot loop shorting.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var baseSetToString = !defineProperty ? identity : function(func, string) {
    return defineProperty(func, 'toString', {
      'configurable': true,
      'enumerable': false,
      'value': constant(string),
      'writable': true
    });
  };

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 800;
  var HOT_SPAN = 16;
  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeNow = Date.now;

  /**
   * Creates a function that'll short out and invoke `identity` instead
   * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
   * milliseconds.
   *
   * @private
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new shortable function.
   */
  function shortOut(func) {
    var count = 0,
        lastCalled = 0;

    return function() {
      var stamp = nativeNow(),
          remaining = HOT_SPAN - (stamp - lastCalled);

      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func.apply(undefined, arguments);
    };
  }

  /**
   * Sets the `toString` method of `func` to return `string`.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var setToString = shortOut(baseSetToString);

  /**
   * The base implementation of `_.rest` which doesn't validate or coerce arguments.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   */
  function baseRest(func, start) {
    return setToString(overRest(func, start, identity), func + '');
  }

  /**
   * Checks if the given arguments are from an iteratee call.
   *
   * @private
   * @param {*} value The potential iteratee value argument.
   * @param {*} index The potential iteratee index or key argument.
   * @param {*} object The potential iteratee object argument.
   * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
   *  else `false`.
   */
  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }
    var type = typeof index;
    if (type == 'number'
          ? (isArrayLike(object) && isIndex(index, object.length))
          : (type == 'string' && index in object)
        ) {
      return eq(object[index], value);
    }
    return false;
  }

  /**
   * Creates a function like `_.assign`.
   *
   * @private
   * @param {Function} assigner The function to assign values.
   * @returns {Function} Returns the new assigner function.
   */
  function createAssigner(assigner) {
    return baseRest(function(object, sources) {
      var index = -1,
          length = sources.length,
          customizer = length > 1 ? sources[length - 1] : undefined,
          guard = length > 2 ? sources[2] : undefined;

      customizer = (assigner.length > 3 && typeof customizer == 'function')
        ? (length--, customizer)
        : undefined;

      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        customizer = length < 3 ? undefined : customizer;
        length = 1;
      }
      object = Object(object);
      while (++index < length) {
        var source = sources[index];
        if (source) {
          assigner(object, source, index, customizer);
        }
      }
      return object;
    });
  }

  /**
   * This method is like `_.assign` except that it recursively merges own and
   * inherited enumerable string keyed properties of source objects into the
   * destination object. Source properties that resolve to `undefined` are
   * skipped if a destination value exists. Array and plain object properties
   * are merged recursively. Other objects and value types are overridden by
   * assignment. Source objects are applied from left to right. Subsequent
   * sources overwrite property assignments of previous sources.
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @since 0.5.0
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @example
   *
   * var object = {
   *   'a': [{ 'b': 2 }, { 'd': 4 }]
   * };
   *
   * var other = {
   *   'a': [{ 'c': 3 }, { 'e': 5 }]
   * };
   *
   * _.merge(object, other);
   * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
   */
  var merge = createAssigner(function(object, source, srcIndex) {
    baseMerge(object, source, srcIndex);
  });

  var slice = [].slice;

  var noabort = {};

  function Queue(size) {
    if (!(size >= 1)) throw new Error;
    this._size = size;
    this._call =
    this._error = null;
    this._tasks = [];
    this._data = [];
    this._waiting =
    this._active =
    this._ended =
    this._start = 0; // inside a synchronous task callback?
  }

  Queue.prototype = queue.prototype = {
    constructor: Queue,
    defer: function(callback) {
      if (typeof callback !== "function" || this._call) throw new Error;
      if (this._error != null) return this;
      var t = slice.call(arguments, 1);
      t.push(callback);
      ++this._waiting, this._tasks.push(t);
      poke(this);
      return this;
    },
    abort: function() {
      if (this._error == null) abort(this, new Error("abort"));
      return this;
    },
    await: function(callback) {
      if (typeof callback !== "function" || this._call) throw new Error;
      this._call = function(error, results) { callback.apply(null, [error].concat(results)); };
      maybeNotify(this);
      return this;
    },
    awaitAll: function(callback) {
      if (typeof callback !== "function" || this._call) throw new Error;
      this._call = callback;
      maybeNotify(this);
      return this;
    }
  };

  function poke(q) {
    if (!q._start) try { start(q); } // let the current task complete
    catch (e) { if (q._tasks[q._ended + q._active - 1]) abort(q, e); } // task errored synchronously
  }

  function start(q) {
    while (q._start = q._waiting && q._active < q._size) {
      var i = q._ended + q._active,
          t = q._tasks[i],
          j = t.length - 1,
          c = t[j];
      t[j] = end(q, i);
      --q._waiting, ++q._active;
      t = c.apply(null, t);
      if (!q._tasks[i]) continue; // task finished synchronously
      q._tasks[i] = t || noabort;
    }
  }

  function end(q, i) {
    return function(e, r) {
      if (!q._tasks[i]) return; // ignore multiple callbacks
      --q._active, ++q._ended;
      q._tasks[i] = null;
      if (q._error != null) return; // ignore secondary errors
      if (e != null) {
        abort(q, e);
      } else {
        q._data[i] = r;
        if (q._waiting) poke(q);
        else maybeNotify(q);
      }
    };
  }

  function abort(q, e) {
    var i = q._tasks.length, t;
    q._error = e; // ignore active callbacks
    q._data = undefined; // allow gc
    q._waiting = NaN; // prevent starting

    while (--i >= 0) {
      if (t = q._tasks[i]) {
        q._tasks[i] = null;
        if (t.abort) try { t.abort(); }
        catch (e) { /* ignore */ }
      }
    }

    q._active = NaN; // allow notification
    maybeNotify(q);
  }

  function maybeNotify(q) {
    if (!q._active && q._call) q._call(q._error, q._data);
  }

  function queue(concurrency) {
    return new Queue(arguments.length ? +concurrency : Infinity);
  }

  function loading (isLoading, neuronName) {
    if (!isLoading) {
      d3.selectAll('#chart svg').attr('display', 'none');
      d3.select('#chart')
        .append('text')
          .attr('class', 'loading')
          .html('Loading... ' + neuronName);
    } else {
      d3.select('.loading').remove();
      d3.selectAll('#chart svg').attr('display', '');
    }
  }

  // const urlSearchParams = new URLSearchParams(window.location.search)
  // const queryParams = Object.fromEntries(urlSearchParams.entries())

  function parseQuery$1(queryString) {
    const ind = queryString.indexOf('?');
    if (ind < 0) return {};
    const query = {};
    const pairs = queryString.slice(ind + 1).split('&');
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
  }

  // Important to do it this way because it is difficult to handle special characters (especially #) by using URLSearchParams or window.location.search
  const queryParams$1 = parseQuery$1(window.location.href);

  const sendMessageToParent = (x, { parentOrigin }) => {
    const parentOrOpenerWindow = queryParams$1.useOpener === '1' ? window.opener : window.parent;
    // if no parent, this will post to itself
    parentOrOpenerWindow.postMessage(x, parentOrigin);
  };

  // const urlSearchParams = new URLSearchParams(window.location.search)
  // const queryParams = Object.fromEntries(urlSearchParams.entries())

  function parseQuery(queryString) {
    const ind = queryString.indexOf('?');
    if (ind < 0) return {};
    const query = {};
    const pairs = queryString.slice(ind + 1).split('&');
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
  }

  // Important to do it this way because it is difficult to handle special characters (especially #) by using URLSearchParams or window.location.search
  const queryParams = parseQuery(window.location.href);

  const pendingRequests = {};

  const handleFigurlResponse = (msg) => {
    const requestId = msg.requestId;
    const response = msg.response;
    if (requestId in pendingRequests) {
      pendingRequests[requestId].onResponse(response);
      delete pendingRequests[requestId];
    }
  };

  let initalizationData = undefined;
  const _initializationCallbacks = [];
  window.addEventListener('message', (e) => {
    if (initalizationData) return;
    const msg = e.data;
    if (msg.type === 'initializeFigure') {
      initalizationData = {
        parentOrigin: msg.parentOrigin,
        figureId: msg.figureId,
        s: msg.s,
      };
      _initializationCallbacks.forEach((cb) => {
        cb();
      });
    }
  });

  const onInitialized = (callback) => {
    if (initalizationData) {
      callback();
    } else {
      _initializationCallbacks.push(callback);
    }
  };

  const waitForInitialization = () => {
    return new Promise((resolve, reject) => {
      const figureId = queryParams.figureId;
      const parentOrigin = queryParams.parentOrigin;
      const s = queryParams.s || '';
      if (figureId !== undefined && parentOrigin !== undefined) {
        resolve({ parentOrigin, figureId, s });
      } else {
        onInitialized(() => {
          if (!initalizationData) throw Error('unexpected');
          resolve({
            parentOrigin: initalizationData.parentOrigin,
            figureId: initalizationData.figureId,
            s: initalizationData.s,
          });
        });
      }
    });
  };

  const sendRequestToParent = (request) => {
    return new Promise((resolve, reject) => {
      waitForInitialization().then(({ figureId, parentOrigin }) => {
        const requestId = randomAlphaString(10);
        let completed = false;
        pendingRequests[requestId] = {
          onResponse: (response) => {
            if (completed) return;
            completed = true;
            resolve(response);
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (err) => {
            if (completed) return;
            completed = true;
            reject(err);
          },
        };
        const msg = {
          type: 'figurlRequest',
          figureId,
          requestId,
          request,
        };
        sendMessageToParent(msg, { parentOrigin });
      })
      .catch((err) => {
        reject(err);
      });
    });
  };

  const randomAlphaString = (num_chars) => {
    if (!num_chars) {
      throw Error('randomAlphaString: num_chars needs to be a positive integer.');
    }
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < num_chars; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deserializeReturnValue = (x) => {
    if (!x) return x;
    else if (typeof x === 'object') {
      if (Array.isArray(x)) {
        return x.map((a) => deserializeReturnValue(a));
      } else if (x._type === 'ndarray') {
        const shape = x.shape;
        const dtype = x.dtype;
        const data_b64 = x.data_b64;
        const dataBuffer = _base64ToArrayBuffer(data_b64);
        switch (dtype) {
          case 'float32':
            return applyShape(new Float32Array(dataBuffer), shape);
          case 'int32':
            return applyShape(new Int32Array(dataBuffer), shape);
          case 'int16':
            return applyShape(new Int16Array(dataBuffer), shape);
          case 'int8':
            return applyShape(new Int8Array(dataBuffer), shape);
          case 'uint32':
            return applyShape(new Uint32Array(dataBuffer), shape);
          case 'uint16':
            return applyShape(new Uint16Array(dataBuffer), shape);
          case 'uint8':
            return applyShape(new Uint8Array(dataBuffer), shape);
          default:
            throw Error(`Datatype not yet implemented for ndarray: ${dtype}`);
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ret = {};
        for (const k in x) {
          ret[k] = deserializeReturnValue(x[k]);
        }
        return ret;
      }
    } else return x;
  };

  const applyShape = (
    x,
    shape
  ) => {
    if (shape.length === 1) {
      if (shape[0] !== x.length) throw Error('Unexpected length of array');
      return Array.from(x);
    } else if (shape.length === 2) {
      const n1 = shape[0];
      const n2 = shape[1];
      if (n1 * n2 !== x.length) throw Error('Unexpected length of array');
      const ret = [];
      for (let i1 = 0; i1 < n1; i1++) {
        ret.push(Array.from(x.slice(i1 * n2, (i1 + 1) * n2)));
      }
      return ret;
    } else if (shape.length === 3) {
      const n1 = shape[0];
      const n2 = shape[1];
      const n3 = shape[2];
      if (n1 * n2 * n3 !== x.length) throw Error('Unexpected length of array');
      const ret = [];
      for (let i1 = 0; i1 < n1; i1++) {
        const A = [];
        for (let i2 = 0; i2 < n2; i2++) {
          A.push(Array.from(x.slice(i1 * n2 * n3 + i2 * n3, i1 * n2 * n3 + (i2 + 1) * n3)));
        }
        ret.push(A);
      }
      return ret;
    } else if (shape.length === 4) {
      const n1 = shape[0];
      const n2 = shape[1];
      const n3 = shape[2];
      const n4 = shape[3];
      if (n1 * n2 * n3 * n4 !== x.length) throw Error('Unexpected length of array');
      const ret = [];
      for (let i1 = 0; i1 < n1; i1++) {
        const A = [];
        for (let i2 = 0; i2 < n2; i2++) {
          const B = [];
          for (let i3 = 0; i3 < n3; i3++) {
            B.push(
              Array.from(
                x.slice(i1 * n2 * n3 * n4 + i2 * n3 * n4 + i3 * n4, i1 * n2 * n3 * n4 + i2 * n3 * n4 + (i3 + 1) * n4)
              )
            );
          }
          A.push(B);
        }
        ret.push(A);
      }
      return ret;
    } else if (shape.length === 5) {
      const n1 = shape[0];
      const n2 = shape[1];
      const n3 = shape[2];
      const n4 = shape[3];
      const n5 = shape[4];
      if (n1 * n2 * n3 * n4 * n5 !== x.length) throw Error('Unexpected length of array');
      const request = [];
      for (let i1 = 0; i1 < n1; i1++) {
        const A = [];
        for (let i2 = 0; i2 < n2; i2++) {
          const B = [];
          for (let i3 = 0; i3 < n3; i3++) {
            const C = [];
            for (let i4 = 0; i4 < n4; i4++) {
              C.push(
                Array.from(
                  x.slice(
                    i1 * n2 * n3 * n4 * n5 + i2 * n3 * n4 * n5 + i3 * n4 * n5 + i4 * n5,
                    i1 * n2 * n3 * n4 * n5 + i2 * n3 * n4 * n5 + i3 * n4 * n5 + (i4 + 1) * n5
                  )
                )
              );
            }
            B.push(C);
          }
          A.push(B);
        }
        ret.push(A);
      }
      return ret;
    } else {
      throw Error('Not yet implemented');
    }
  };

  const _base64ToArrayBuffer = (base64) => {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const getFigureData = () => {
    return new Promise((resolve, reject) => {
      const request = {
        type: 'getFigureData',
        figurlProtocolVersion: 'p1'
      };
      sendRequestToParent(request).then(response => {
        resolve(deserializeReturnValue(response.figureData));
      }).catch((err) => {
        reject(err);
      })
    })
  };

  const getFileData = (
    uri,
    responseType,
    onProgress,
    o = {}
  ) => {
    let responseType2
    if (responseType === 'json-deserialized') {
      responseType2 = 'json'
    }
    else {
      responseType2 = responseType
    }
    const request = {
      type: 'getFileData',
      uri,
      responseType: responseType2,
      figurlProtocolVersion: 'p1'
    };
    if (o.startByte !== undefined) {
      request.startByte = o.startByte;
      request.endByte = o.endByte;
    }
    progressListeners[uri] = ({ loaded, total }) => {
      onProgress({ loaded, total });
    };
    return new Promise((resolve, reject) => {
      sendRequestToParent(request).then(response => {
        if (!isGetFileDataResponse(response)) throw Error('Invalid response to getFigureData');
        if (response.errorMessage) {
          throw Error(`Error getting file data for ${uri}: ${response.errorMessage}`);
        }
        if (responseType === 'json-deserialized') {
          resolve(deserializeReturnValue(response.fileData));
        }
        else {
          resolve(response.fileData);
        }
      })
      .catch((err) => {
        reject(err);
      })
    })
  };

  // export const storeFileData = async (fileData, o = {}) => {
  //   const request = {
  //     type: 'storeFile',
  //     fileData,
  //     figurlProtocolVersion: 'p1'
  //   };
  //   const response = await sendRequestToParent(request);
  //   if (!isStoreFileResponse(response)) throw Error('Invalid response to storeFile');
  //   if (response.error) {
  //     throw Error(`Error storing file data: ${response.error}`);
  //   }
  //   if (response.uri === undefined) {
  //     throw Error('Unexpected response.uri is undefined');
  //   }
  //   return response.uri;
  // };

  // export const storeGithubFileData = async (o) => {
  //   const request = {
  //     type: 'storeGithubFile',
  //     fileData: o.fileData,
  //     uri: o.uri,
  //     figurlProtocolVersion: 'p1'
  //   };
  //   const response = await sendRequestToParent(request);
  //   if (!isStoreGithubFileResponse(response)) throw Error('Invalid response to storeFile');
  //   if (response.error) {
  //     throw Error(`Error storing file data: ${response.error}`);
  //   }
  // };

  const progressListeners = {};

  const handleFileDownloadProgress = ({
    uri,
    loaded,
    total,
  }) => {
    const x = progressListeners[uri];
    if (x) {
      x({ loaded, total });
    }
  };

  // import { handleReportUrlStateChange } from './SetupUrlState';

  // const urlSearchParams = new URLSearchParams(window.location.search)
  // const queryParams = Object.fromEntries(urlSearchParams.entries())

  const handleSetCurrentUser = (o) => {
    console.warn('Not implemented: handleSetCurrentUser', o);
  };

  function parseQuery$2(queryString) {
    const ind = queryString.indexOf('?');
    if (ind < 0) return {};
    const query = {};
    const pairs = queryString.slice(ind + 1).split('&');
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
  }

  // Important to do it this way because it is difficult to handle special characters (especially #) by using URLSearchParams or window.location.search
  const queryParams$2 = parseQuery$2(window.location.href);

  // if (!queryParams.parentOrigin) {
  //     // self-contained bundle
  //     const s = document.createElement("script");
  //     s.setAttribute("src", "figurlData.js");
  //     document.body.appendChild(s);
  // }

  const startListeningToParent = () => {
    window.addEventListener('message', (e) => {
      const msg = e.data;
      if (!msg) return;
      const messageToChildTypes = ['figurlResponse', 'setCurrentUser', 'fileDownloadProgress', 'reportUrlStateChange']
      const messageToParentTypes = ['figurlRequest']
      if (messageToChildTypes.includes(msg.type)) {
        if (msg.type === 'figurlResponse') {
          handleFigurlResponse(msg);
        } else if (msg.type === 'setCurrentUser') {
          handleSetCurrentUser({
            userId: msg.userId,
            googleIdToken: msg.googleIdToken,
          });
        } else if (msg.type === 'fileDownloadProgress') {
          handleFileDownloadProgress({
            uri: msg.uri,
            loaded: msg.loaded,
            total: msg.total,
          });
        } else if (msg.type === 'reportUrlStateChange') {
          console.warn('Not supported: reportUrlStateChange')
          // handleReportUrlStateChange(msg.state);
        }
      } else if (messageToParentTypes.includes(msg.type)) {
        // this is relevant for standalone (self-contained) figures
        if (queryParams$2.parentOrigin) {
          console.warn('Got message to parent even though parentOrigin is defined');
          return;
        }
        if (msg.type === 'figurlRequest') {
          const req = msg.request;
          if (req.type === 'getFigureData') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const figureData = (window).figurlData.figure;
            const resp = {
              type: 'getFigureData',
              figureData,
            };
            const msg2 = {
              type: 'figurlResponse',
              requestId: msg.requestId,
              response: resp,
            };
            window.postMessage(msg2, '*');
          } else if (req.type === 'getFileData') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fileData = (window).figurlData.uri[req.uri];
            const resp = {
              type: 'getFileData',
              fileData,
            };
            const msg2 = {
              type: 'figurlResponse',
              requestId: msg.requestId,
              response: resp,
            };
            window.postMessage(msg2, '*');
          }
        }
      } else {
        console.warn('Unhandled message from parent', e);
      }
    });
  };

  let figurlObjectLoadState = "not-loaded";

  function fetchFigurlObject() {
    return new Promise((resolve, reject) => {
      getFigureData().then((data) => {
        resolve(data)
      }).catch((err) => {
        reject(err)
      });
    });
  }

  function getFigurlObject(callback) {
    // check if this window is the top-level window
    if (window === window.parent) {
      // this is the top-level window, so it is not being embedded in an iframe
      callback(null, null);
      return
    }

    if (figurlObjectLoadState === "loading") {
      setTimeout(() => {
        getFigurlObject(callback);
      }, 10);
    } else if (figurlObjectLoadState === "loaded") {
      callback(null, window.figurlObject);
    } else if (figurlObjectLoadState === "error") {
      callback("Error loading figurlObject", null);
    } else {
      figurlObjectLoadState = "loading";
      // fetch("figurl_data.json")
      // .then((response) => response.json())
      fetchFigurlObject()
        .then((figurlObject) => {
          window.figurlObject = figurlObject;
          figurlObjectLoadState = "loaded";
          callback(null, figurlObject);
        })
        .catch((error) => {
          figurlObjectLoadState = "error";
          callback(error, null);
        });
    }
  }

  function loadTrialInfo(callback) {
    getFigurlObject((err, figurlObject) => {
      if (figurlObject) {
        callback(null, figurlObject.objects["trialInfo"]);
      } else {
        fetch("DATA/" + "trialInfo.json")
          .then((response) => response.json())
          .then((trialInfo) => {
            callback(null, trialInfo);
          })
          .catch((error) => {
            callback(error, null);
          });
      }
    });
  }

  function loadSessionTrialData(sessionName, callback) {
    getFigurlObject((err, figurlObject) => {
      if (figurlObject) {
        callback(null, figurlObject.objects[sessionName + "_TrialInfo"]);
      } else {
        fetch("DATA/" + sessionName + "_TrialInfo.json")
          .then((response) => response.json())
          .then((trialData) => {
            callback(null, trialData);
          })
          .catch((error) => {
            callback(error, null);
          });
      }
    });
  }

  function loadNeuronData(neuronName, callback) {
    getFigurlObject((err, figurlObject) => {
      if (figurlObject) {
        callback(null, figurlObject.objects["Neuron_" + neuronName]);
      } else {
        fetch("DATA/Neuron_" + neuronName + ".json")
          .then((response) => response.json())
          .then((neuron) => {
            callback(null, neuron);
          })
          .catch((error) => {
            callback(error, null);
          });
      }
    });
  }

  startListeningToParent();

  function rasterDataManger() {
    let neuronName = '';
    let sessionName = '';
    let brainArea = '';
    let Subject = '';
    let timeDomain = [];
    let factorList = [];
    let trialEvents = [];
    let neuronList = [];
    let includeBrainAreas = [];
    let rasterData = {};
    let spikeInfo = {};
    let sessionInfo = {};
    let showSpikes = true;
    let showSmoothingLines = true;
    let lineSmoothness = 20;
    let curFactor = 'trial_id';
    let curEvent = 'start_time';
    let interactionFactor = '';
    let isLoaded = false;
    let dispatch = d3.dispatch('dataReady');
    let dataManager = {};
    let colorScale = d3.scale.ordinal().domain(['Spike']).range(['black']);

    dataManager.loadRasterData = function () {
      isLoaded = false;
      loadTrialInfo((error, trialInfo) => {
        factorList = trialInfo.experimentalFactor;
        trialEvents = trialInfo.timePeriods;
        neuronList = trialInfo.neurons;
        includeBrainAreas = d3.map(neuronList,  function(d) { return d.brainArea; }).keys();

        if (neuronName === '') {
          neuronName = neuronList.length ? neuronList[0].name : neuronList.name;
        };

        loading(isLoaded, neuronName);

        let neuronInfo = neuronList.length ? neuronList.filter(function (d) {
          return d.name === neuronName;})[0] : neuronList;

        sessionName = neuronInfo.sessionName;
        Subject = neuronInfo.subjectName;

        queue()
          .defer(loadSessionTrialData, sessionName)
          .defer(loadNeuronData, neuronName)
          .await(function (error, sI, neuron) {
            spikeInfo = neuron.Spikes;
            brainArea = neuron.Brain_Area;
            sessionInfo = sI;
            isLoaded = true;
            loading(isLoaded);

            if (interactionFactor.length > 0) {
              let factorLevels = d3.set(sessionInfo.map(function (s) {
                return s[interactionFactor];
              })).values();

              let interactingFactorType = factorList.filter(function (d) {
                return d.value === interactionFactor;
              })
              .map(function (d) {return d.factorType;})[0].toUpperCase();

              factorLevels = factorLevels
                .filter(function (k) {return k.key !== 'null';});

              (interactingFactorType === 'CONTINUOUS') ? factorLevels.sort(d3.ascending()) :
                factorLevels.sort();

              colorScale = d3.scale.ordinal()
                .domain(factorLevels)
                .range(['#e41a1c', '#377eb8', '#66a61e', '#984ea3', '#ff7f00']);
            }

            dataManager.sortRasterData();
            dataManager.changeEvent();
            dispatch.dataReady();

          });
      });

    };

    dataManager.changeEvent = function () {
      let minTime = d3.min(sessionInfo, function (s) { return s.start_time - s[curEvent]; });

      let maxTime = d3.max(sessionInfo, function (s) { return s.end_time - s[curEvent]; });

      timeDomain = [minTime, maxTime];
    };

    dataManager.sortRasterData = function () {
      rasterData = merge(sessionInfo, spikeInfo);
      let factorType = factorList.filter(function (d) {return d.value === curFactor;})
                                 .map(function (d) {return d.factorType;})[0].toUpperCase();

      // Nest and Sort Data
      if (factorType !== 'CONTINUOUS') {
        rasterData = d3.nest()
          .key(function (d) { return d[curFactor] + '_' + sessionName;}) // nests data by selected factor
          .sortKeys(function (a, b) {
            // Sort ordinal keys
            if (factorType === 'ORDINAL') return d3.descending(+a[curFactor], +b[curFactor]);
          })
          .sortValues(function (a, b) {
            // If interaction factor is specified, then sort by that as well
            if (interactionFactor.length > 0) {
              return d3.descending(a[interactionFactor], b[interactionFactor]);
            } else {
              // else sort by trial id
              return d3.descending(+a.trial_id, +b.trial_id);
            };
          })
          .entries(rasterData);
      } else {
        rasterData = d3.nest()
          .key(function (d) {return d[''] + '_' + sessionName;}) // nests data by selected factor
            .sortValues(function (a, b) { // sorts values on factor if continuous
              return d3.descending(+a[curFactor], +b[curFactor]);
            })
          .entries(rasterData);
      }
    };

    dataManager.neuronName  = function (value) {
      if (!arguments.length) return neuronName;
      neuronName = value;
      dataManager.loadRasterData();
      return dataManager;
    };

    dataManager.brainArea  = function (value) {
      if (!arguments.length) return brainArea;
      brainArea = value;
      return dataManager;
    };

    dataManager.sessionName  = function (value) {
      if (!arguments.length) return sessionName;
      sessionName = value;
      return dataManager;
    };

    dataManager.interactionFactor  = function (value) {
      if (!arguments.length) return interactionFactor;
      interactionFactor = value;
      return dataManager;
    };

    dataManager.rasterData  = function (value) {
      if (!arguments.length) return rasterData;
      rasterData = value;
      return dataManager;
    };

    dataManager.showSpikes  = function (value) {
      if (!arguments.length) return showSpikes;
      showSpikes = value;
      if (isLoaded) dispatch.dataReady();
      return dataManager;
    };

    dataManager.showSmoothingLines = function (value) {
      if (!arguments.length) return showSmoothingLines;
      showSmoothingLines = value;
      if (isLoaded) dispatch.dataReady();
      return dataManager;
    };

    dataManager.lineSmoothness = function (value) {
      if (!arguments.length) return lineSmoothness;
      lineSmoothness = value;
      if (isLoaded) dispatch.dataReady();
      return dataManager;
    };

    dataManager.curFactor = function (value) {
      if (!arguments.length) return curFactor;
      curFactor = value;
      if (isLoaded) dataManager.sortRasterData(); dispatch.dataReady();
      return dataManager;
    };

    dataManager.curEvent = function (value) {
      if (!arguments.length) return curEvent;
      curEvent = value;
      if (isLoaded) dataManager.changeEvent(); dispatch.dataReady();
      return dataManager;
    };

    dataManager.timeDomain = function (value) {
      if (!arguments.length) return timeDomain;
      timeDomain = value;
      return dataManager;
    };

    dataManager.factorList = function (value) {
      if (!arguments.length) return factorList;
      factorList = value;
      return dataManager;
    };

    dataManager.trialEvents = function (value) {
      if (!arguments.length) return trialEvents;
      trialEvents = value;
      return dataManager;
    };

    dataManager.neuronList = function (value) {
      if (!arguments.length) return neuronList;
      neuronList = value;
      return dataManager;
    };

    dataManager.colorScale = function (value) {
      if (!arguments.length) return colorScale;
      colorScale = value;
      return dataManager;
    };

    dataManager.includeBrainAreas = function (value) {
      if (!arguments.length) return includeBrainAreas;
      includeBrainAreas = value;
      if (isLoaded) dispatch.dataReady();
      return dataManager;
    };

    d3.rebind(dataManager, dispatch, 'on');

    return dataManager;

  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /** Built-in value references. */
  var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

  /**
   * Checks if `value` is a flattenable `arguments` object or array.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
   */
  function isFlattenable(value) {
    return isArray(value) || isArguments(value) ||
      !!(spreadableSymbol && value && value[spreadableSymbol]);
  }

  /**
   * The base implementation of `_.flatten` with support for restricting flattening.
   *
   * @private
   * @param {Array} array The array to flatten.
   * @param {number} depth The maximum recursion depth.
   * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
   * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
   * @param {Array} [result=[]] The initial result value.
   * @returns {Array} Returns the new flattened array.
   */
  function baseFlatten(array, depth, predicate, isStrict, result) {
    var index = -1,
        length = array.length;

    predicate || (predicate = isFlattenable);
    result || (result = []);

    while (++index < length) {
      var value = array[index];
      if (depth > 0 && predicate(value)) {
        if (depth > 1) {
          // Recursively flatten arrays (susceptible to call stack limits).
          baseFlatten(value, depth - 1, predicate, isStrict, result);
        } else {
          arrayPush(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }
    return result;
  }

  /**
   * Flattens `array` a single level deep.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to flatten.
   * @returns {Array} Returns the new flattened array.
   * @example
   *
   * _.flatten([1, [2, [3, [4]], 5]]);
   * // => [1, 2, [3, [4]], 5]
   */
  function flatten(array) {
    var length = array == null ? 0 : array.length;
    return length ? baseFlatten(array, 1) : [];
  }

  // Draws spikes as circles
  function drawSpikes (selection, sessionInfo, timeScale, yScale, curEvent, interactionFactor, colorScale) {

    let circleRadius = yScale.rangeBand() / 2;

    // Reshape to spike time, trial position.
    // Adjust spike time relative to current trial event
    let data = sessionInfo.map(function (trial, ind) {
      if (!Array.isArray(trial.spikes)) { return []; };

      return trial.spikes.map(function (spike) {
        return [spike - trial[curEvent], ind];
      });
    });

    let factorLevel = sessionInfo.map(function (d) {return d[interactionFactor];});

    // Flatten
    data = flatten(data);

    let circles = selection.selectAll('circle').data(data);
    circles.enter()
      .append('circle')
      .style('opacity', 1E-5);
    circles.exit()
      .transition()
        .duration(1000)
        .style('opacity', 1E-5).remove();

    circles
    .transition()
      .duration(1000)
      .attr('cx', function (d) {
        return timeScale(d[0]);
      })
      .attr('fill', function (d) {
        let factorName = (factorLevel[d[1]] === undefined) ? 'Spike' : factorLevel[d[1]];
        return colorScale(factorName);
      })
      .style('opacity', 1)
      .attr('r', circleRadius)
      .attr('cy', function (d) { return yScale(d[1]) + circleRadius; });
  }

  /* Draws each trial event (e.g. saccade, cue period, reward) from the beginning to
    end (e.g. saccade start, saccade finish) as an area. */

  function drawTrialEvents (selection, sessionInfo, trialEvents, curEvent, timeScale, yScale) {

    let eventArea = selection.selectAll('path.eventArea').data(trialEvents, function (d) {return d.label;});

    /* Reformat data for area chart. Duplicate data twice in order to draw
    straight vertical edges at the beginning and end of trials */
    let dupData = duplicateData(sessionInfo);

    // Plot area corresponding to trial events
    eventArea.enter()
      .append('path')
        .attr('class', 'eventArea')
        .attr('id', function (d) {return d.label;})
        .attr('opacity', 1E-6)
        .attr('fill', function (d) {return d.color;});

    eventArea.exit().remove();

    eventArea
      .transition()
        .duration(1000)
        .ease('linear')
        .attr('opacity', 0.90)
        .attr('d', function (t) {
          return AreaFun(dupData, t, timeScale, yScale, curEvent);
        });
  }

  function AreaFun(values, trialEvents, timeScale, yScale, curEvent) {
    // Setup helper line function
    let area = d3.svg.area()
      .defined(function (d) {
        return d[trialEvents.startID] != null && d[trialEvents.endID] != null && d[curEvent] != null;
      }) // if null, suppress line drawing
      .x0(function (d) {
        return timeScale(d[trialEvents.startID] - d[curEvent]);
      })
      .x1(function (d) {
        return timeScale(d[trialEvents.endID] - d[curEvent]);
      })
      .y(function (d, i) {
        // Draws straight line down for each trial on the corners.
        if (i % 2 == 0) { // Alternate top and bottom
          return yScale(d.sortInd); // Top of the trial
        } else {
          return yScale(d.sortInd) + yScale.rangeBand(); // bottom of the trial
        }
      })
      .interpolate('linear');
    return area(values);
  }

  function duplicateData(data) {
    // Duplicate data so that it appears twice aka 11223344
    let valuesInd = d3.range(data.length);
    let newValues = data.concat(data);
    valuesInd = valuesInd.concat(valuesInd);
    newValues.forEach(function (d, i) {
      d.sortInd = valuesInd[i];
    });

    newValues.sort(function (a, b) {
      return d3.descending(a.sortInd, b.sortInd);
    });

    return newValues;
  }

  function kernelDensityEstimator (kernel, x) {
    return function (sample) {
      return x.map(function (x) {
        return [x, d3.sum(sample, function (v) { return kernel(x - v); })];
      });
    };
  }

  function gaussianKernel (bandwidth) {
    return function (spikeTime) {
      return Math.exp((spikeTime * spikeTime) / (-2 * bandwidth * bandwidth))
        / (bandwidth * Math.sqrt(2 * Math.PI));
    };
  }

  function drawSmoothingLine (selection, data, timeScale, yScale, lineSmoothness, curEvent, interactionFactor, colorScale) {
    // Nest by interaction factor
    let spikes = d3.nest()
      .key(function (d) {
        return d[interactionFactor];
      })
      .entries(data.filter(function (d) {
        return d.start_time != null &&
               d.isIncluded === 'Included';
      })); // Don't include trials with no start time or excluded

    spikes = spikes.filter(function (k) {return k.key !== 'null';});

    // Compute kernel density estimate
    let timeRange = d3.range(d3.min(timeScale.domain()), d3.max(timeScale.domain()));
    let kde = kernelDensityEstimator(gaussianKernel(lineSmoothness), timeRange);

    spikes.forEach(function (factor) {

      let kdeByTrial = factor.values.map(function (trial) {
        if (trial.spikes[0] !== undefined) {
          return kde(
            trial.spikes.map(function (spike) { return spike - trial[curEvent];})
          );
        } else if (trial.start_time !== null) {
          return kde(0);
        }
      });

      let y = kdeByTrial.map(function (trial) {
        if (trial !== undefined) {
          return trial.map(function (e) { return e[1]; });
        };
      });

      factor.values = timeRange.map(function (time, ind) {
        return [
          time,
          1000 * d3.mean(y.map(function (row) {
            if (row != undefined) return row[ind];
          })),
        ];

      });

    });

    // max value of density estimate
    let maxKDE = d3.max(spikes.map(function (d) {
      return d3.max(d.values, function (e) {
        return e[1];
      });
    }));

    let kdeScale = d3.scale.linear()
        .domain([0, maxKDE])
        .range([yScale.range()[0] + yScale.rangeBand(), 0]);

    let kdeG = selection.selectAll('g.kde').data(spikes, function (d) {return d.key;});

    kdeG.enter()
      .append('g')
        .attr('class', 'kde');
    kdeG.exit()
      .remove();

    let line = d3.svg.line()
      .x(function (d) {return timeScale(d[0]);})
      .y(function (d) {return kdeScale(d[1]);});

    let kdeLine = kdeG.selectAll('path.kdeLine').data(function (d) {return [d];});

    kdeLine.enter()
      .append('path')
        .attr('class', 'kdeLine');
    kdeLine
      .transition()
        .duration(1000)
      .attr('d', function (d) {return line(d.values);})
      .attr('stroke', function (d) {
        let factorName = (d.key === 'undefined') ? 'Spike' : d.key;
        return colorScale(factorName);
      });

    kdeLine.exit()
      .remove();

    return maxKDE;

  }

  let toolTip = d3.select('body').selectAll('div#tooltip').data([{}]);
  toolTip.enter()
    .append('div')
      .attr('id', 'tooltip')
      .style('opacity', 1e-6);

  function drawMouseBox (selection, data, timeScale, yScale, curEvent, width) {
    // Append invisible box for mouseover
    let mouseBox = selection.selectAll('rect.trialBox').data(data);

    mouseBox.exit()
      .remove();
    mouseBox.enter()
      .append('rect')
        .attr('class', 'trialBox');
    mouseBox
      .attr('x', function (d) {
        if (d.start_time !== null) {
          return timeScale(d.start_time - d[curEvent]);
        } else {
          return 0;
        }
      })
      .attr('y', function (d, i) { return yScale(i); })
      .attr('width', function (d) {
        if (d.start_time !== null) {
          return (timeScale(d.end_time - d[curEvent])) - (timeScale(d.start_time - d[curEvent]));
        } else {
          return width;
        }
      })
      .attr('height', yScale.rangeBand())
      .attr('opacity', '1e-9')
      .on('mouseover', mouseBoxOver)
      .on('mouseout', mouseBoxOut);
  }

  function mouseBoxOver(d) {
    // Pop up tooltip
    toolTip
      .style('opacity', 1)
      .style('left', (d3.event.pageX + 10) + 'px')
      .style('top', (d3.event.pageY + 10) + 'px')
      .html(function () {
        var table = '<b>Trial ' + d.trial_id + '</b><br>' + '<table>';
        var varName = '';
        for (varName in d) {
          var isValid = (varName != 'trial_id') & (varName != 'spikes')
            & (varName != 'sortInd');
          if (isValid) {
            table += '<tr><td>' + varName + ':' + '</td><td><b>' + d[varName]
            + '</b></td></tr>';
          }
        }

        table +=  '</table>';
        return table;
      });

    d3.select(this)
      .attr('stroke', 'black')
      .attr('fill', 'white')
      .attr('opacity', 1)
      .attr('fill-opacity', 1e-9);
  }

  function mouseBoxOut(d) {
    // Hide tooltip
    toolTip
      .style('opacity', 1e-9);
    d3.select(this)
      .attr('opacity', 1e-9);
  }

  // Replaces underscores with blanks and 'plus' with '+'
  function fixDimNames (dimName) {
    let pat1 = /plus/;
    let pat2 = /_/g;
    let pat3 = /minus/;
    let fixedName = dimName.replace(pat1, '+').replace(pat2, ' ').replace(pat3, '-');
    return fixedName;
  }

  // Append average start time for event label position
  function findAverageStartTime (data, trialEvents, curEvent) {
    trialEvents.forEach(function (period, ind) {
      let avgTime = d3.mean(data, function (trial) {
        if (trial[curEvent] !== null && trial[period.startID] !== null) {
          return trial[period.startID] - trial[curEvent];
        }

      });

      period.labelPosition = avgTime;
    });
  }

  function eventMarkers (selection, data, trialEvents, timeScale, curEvent, innerHeight) {

    const labelWidth = 45;
    const labelHeight = 33;

    findAverageStartTime(data, trialEvents, curEvent);

    // Add labels corresponding to trial events
    let eventLabel = selection.selectAll('.eventLabel').data(trialEvents, function (d) {return d.label;});

    eventLabel.enter()
      .append('foreignObject')
        .attr('class', 'eventLabel')
        .attr('id', function (d) {return d.label;})
        .attr('width', labelWidth)
        .attr('height', 33)
        .style('color', function (d) {return d.color;})
        .html(function (d) {return '<div>▲<br>' + d.label + '</div>'; });

    eventLabel
      .attr('x', function (d) {
        return timeScale(d.labelPosition) - (labelWidth / 2);
      })
      .attr('y', innerHeight + 16);
  }

  function rasterChart () {
    // Defaults
    let margin = { top: 50, right: 50, bottom: 50, left: 50 };
    let outerWidth = 960;
    let outerHeight = 500;
    let timeDomain = [];
    let timeScale = d3.scale.linear();
    let yScale = d3.scale.ordinal();
    let curEvent = '';
    let trialEvents = [];
    let lineSmoothness = 20;
    let interactionFactor = '';
    let curFactor = '';
    let showSpikes = true;
    let showSmoothingLines = true;
    let innerHeight;
    let innerWidth;
    let colorScale = d3.scale.ordinal().domain(['Spike']).range(['black']);

    function chart(selection) {
      selection.each(function (data) {

        // Allow height and width to be determined by data
        if (typeof outerHeight === 'function') {
          innerHeight = outerHeight(data) - margin.top - margin.bottom;
        } else {
          innerHeight = outerHeight - margin.top - margin.bottom;
        };

        if (typeof outerWidth === 'function') {
          innerWidth = outerWidth(data) - margin.left - margin.right;
        } else {
          innerWidth = outerWidth - margin.left - margin.right;
        }

        let svg = d3.select(this).selectAll('svg').data([data], function (d) { return d.key; });

        // Initialize the chart, set up drawing layers
        let enterG = svg.enter()
          .append('svg')
            .append('g');
        enterG
          .append('rect')
            .attr('class', 'backgroundLayer');
        svg.select('rect.backgroundLayer')
            .attr('width', innerWidth)
            .attr('height', innerHeight)
            .attr('opacity', 0.1)
            .attr('fill', '#aaa');
        enterG
          .append('g')
            .attr('class', 'trialEvents');
        enterG
          .append('g')
            .attr('class', 'spikes');
        enterG
          .append('g')
            .attr('class', 'smoothLine');
        enterG
          .append('g')
            .attr('class', 'trialBox');
        enterG
          .append('g')
            .attr('class', 'timeAxis');
        enterG
          .append('g')
            .attr('class', 'yAxis');
        enterG
          .append('g')
            .attr('class', 'eventMarker');

        // Fix title names
        let s = data.key.split('_');
        if (s[0] === 'undefined') {
          s[0] = '';
        } else {
          s[0] = ': ' + s[0];
        };

        let title = enterG
          .append('text')
          .attr('class', 'title')
          .attr('font-size', 16)
          .attr('x', 0)
          .attr('y', 0)
          .attr('dy', -8);
        svg.select('text.title')
          .text(fixDimNames(curFactor) + s[0]);

        // Update svg size, drawing area, and scales
        svg
          .attr('width', innerWidth + margin.left + margin.right)
          .attr('height', innerHeight + margin.top + margin.bottom);
        svg.select('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        timeScale
          .domain(timeDomain)
          .range([0, innerWidth]);
        yScale
          .domain(d3.range(0, data.values.length))
          .rangeBands([innerHeight, 0]);

        // Draw the chart
        let spikesG = svg.select('g.spikes');
        let trialEventsG = svg.select('g.trialEvents');
        let trialBoxG = svg.select('g.trialBox');
        let smoothLineG = svg.select('g.smoothLine');
        let eventMarkerG = svg.select('g.eventMarker');

        showSpikes ? drawSpikes(spikesG, data.values, timeScale, yScale, curEvent, interactionFactor, colorScale) : spikesG.selectAll('circle').remove();
        drawTrialEvents(trialEventsG, data.values, trialEvents, curEvent, timeScale, yScale);
        drawMouseBox(trialBoxG, data.values, timeScale, yScale, curEvent, innerWidth);
        let maxKDE = showSmoothingLines ? drawSmoothingLine(smoothLineG, data.values, timeScale, yScale, lineSmoothness, curEvent, interactionFactor, colorScale) : d3.selectAll('path.kdeLine').remove();
        eventMarkers(eventMarkerG, data.values, trialEvents, timeScale, curEvent, innerHeight);

        // Draw the time axis
        let timeAxisG = svg.select('g.timeAxis');
        let timeAxis = d3.svg.axis()
          .scale(timeScale)
          .orient('bottom')
          .ticks(7)
          .tickSize(0)
          .tickFormat(d3.format('4d'));
        timeAxisG
          .attr('transform', 'translate(0,' + innerHeight + ')')
          .call(timeAxis);

        // Draw smoothing axis if showing smoothing line
        let yAxisG = svg.select('g.yAxis');
        if (showSmoothingLines) {
          yAxisG.attr('display', '');
          let smoothScale = d3.scale.linear()
            .domain([0, maxKDE]) // assuming in milliseconds
            .range([innerHeight, 0]);
          let yAxis = d3.svg.axis()
            .scale(smoothScale)
            .orient('left')
            .tickValues([0, maxKDE])
            .tickSize(0);
          yAxisG.call(yAxis);
        } else {
          // hide axis
          yAxisG.attr('display', 'none');
        }

      });

    };

    chart.width = function (value) {
      if (!arguments.length) return outerWidth;
      outerWidth = value;
      return chart;
    };

    chart.height = function (value) {
      if (!arguments.length) return outerHeight;
      outerHeight = value;
      return chart;
    };

    chart.margin = function (value) {
      if (!arguments.length) return margin;
      margin = value;
      return chart;
    };

    chart.timeDomain = function (value) {
      if (!arguments.length) return timeDomain;
      timeDomain = value;
      return chart;
    };

    chart.curEvent = function (value) {
      if (!arguments.length) return curEvent;
      curEvent = value;
      return chart;
    };

    chart.curFactor = function (value) {
      if (!arguments.length) return curFactor;
      curFactor = value;
      return chart;
    };

    chart.interactionFactor = function (value) {
      if (!arguments.length) return interactionFactor;
      interactionFactor = value;
      return chart;
    };

    chart.trialEvents = function (value) {
      if (!arguments.length) return trialEvents;
      trialEvents = value;
      return chart;
    };

    chart.lineSmoothness = function (value) {
      if (!arguments.length) return lineSmoothness;
      lineSmoothness = value;
      return chart;
    };

    chart.showSmoothingLines = function (value) {
      if (!arguments.length) return showSmoothingLines;
      showSmoothingLines = value;
      return chart;
    };

    chart.showSpikes = function (value) {
      if (!arguments.length) return showSpikes;
      showSpikes = value;
      return chart;
    };

    chart.colorScale = function (value) {
      if (!arguments.length) return colorScale;
      colorScale = value;
      return chart;
    };

    return chart;

  }

  let rasterView = rasterChart();

  function createDropdown() {
    let key;
    let displayName;
    let options;
    let dispatch = d3.dispatch('click');

    function _createDropdown(selection) {
      selection.each(function (data) {
        let menu = d3.select(this).selectAll('ul').selectAll('li').data(options,
          function (d) { return d[key]; });

        displayName = (typeof displayName === 'undefined') ? key : displayName;

        menu.enter()
          .append('li')
            .attr('id', function (d) {
              return d[key];
            })
            .attr('role', 'presentation')
            .append('a')
              .attr('role', 'menuitem')
              .attr('tabindex', -1)
              .text(function (d) {
                return d[displayName];
              });

        menu.on('click', dispatch.click);

        menu.exit().remove();

        let curText = options.filter(function (d) {return d[key] === data;})
          .map(function (d) { return d[displayName]; })[0];

        d3.select(this).selectAll('button')
          .text(curText)
          .append('span')
          .attr('class', 'caret');
      });

    }

    _createDropdown.key = function (value) {
      if (!arguments.length) return key;
      key = value;
      return _createDropdown;
    };

    _createDropdown.options = function (value) {
      if (!arguments.length) return options;
      options = value;
      return _createDropdown;
    };

    _createDropdown.displayName = function (value) {
      if (!arguments.length) return displayName;
      displayName = value;
      return _createDropdown;
    };

    d3.rebind(_createDropdown, dispatch, 'on');

    return _createDropdown;

  }

  var factorDropdown = createDropdown()
    .key('value')
    .displayName('name');

  factorDropdown.on('click', function () {
    var curFactor = d3.select(this).data()[0];
    rasterData.curFactor(curFactor.value);
  });

  let eventDropdown = createDropdown()
    .key('startID')
    .displayName('name');

  eventDropdown.on('click', function () {
    let curEvent = d3.select(this).data()[0];
    rasterData.curEvent(curEvent.startID);
  });

  function createSlider () {

    let stepSize;
    let domain;
    let maxStepInd;
    let units;
    let curValue;
    let minValue;
    let maxValue;
    let running = false;
    let delay = 200;
    let dispatch = d3.dispatch('sliderChange', 'start', 'stop');

    function _createSlider(selection) {
      selection.each(function (value) {
        let input = d3.select(this).selectAll('input');
        let output = d3.select(this).selectAll('output');
        stepSize = stepSize || d3.round(domain[1] - domain[0], 4);
        maxStepInd = domain.length - 1;
        curValue = value;
        minValue = d3.min(domain);
        maxValue = d3.max(domain);

        input.property('min', minValue);
        input.property('max', maxValue);
        input.property('step', stepSize);
        input.property('value', value);
        input.on('input', function () {
          output.text(this.value + ' ' + units);
        });

        input.on('change', function () {
          dispatch.sliderChange(+this.value);
        });

        output.text(value + ' ' + units);
      });
    };

    _createSlider.stepSize = function (value) {
      if (!arguments.length) return stepSize;
      stepSize = value;
      return _createSlider;
    };

    _createSlider.running = function (value) {
      if (!arguments.length) return running;
      running = value;
      return _createSlider;
    };

    _createSlider.delay = function (value) {
      if (!arguments.length) return delay;
      delay = value;
      return _createSlider;
    };

    _createSlider.domain = function (value) {
      if (!arguments.length) return domain;
      domain = value;
      return _createSlider;
    };

    _createSlider.units = function (value) {
      if (!arguments.length) return units;
      units = value;
      return _createSlider;
    };

    _createSlider.maxStepInd = function (value) {
      if (!arguments.length) return maxStepInd;
      maxStepInd = value;
      return _createSlider;
    };

    _createSlider.curValue = function (value) {
      if (!arguments.length) return curValue;
      curValue = value;
      return _createSlider;
    };

    _createSlider.play = function () {
      running = true;
      dispatch.start();

      let t = setInterval(step, delay);

      function step() {
        if (curValue < maxValue && running) {
          curValue += stepSize;
          dispatch.sliderChange(curValue);
        } else {
          dispatch.stop();
          running = false;
          clearInterval(t);
        }
      }
    };

    _createSlider.stop = function () {
      running = false;
      dispatch.stop();
    };

    _createSlider.reset = function () {
      running = false;
      dispatch.sliderChange(minValue);
      dispatch.stop();
    };

    d3.rebind(_createSlider, dispatch, 'on');

    return _createSlider;

  }

  let smoothingSlider = createSlider();

  smoothingSlider
    .domain([5, 1000])
    .stepSize(5)
    .units('ms');

  smoothingSlider.on('sliderChange', function (bandwidth) {
    rasterData.lineSmoothness(bandwidth);
  });

  /* If showing spikes, set to reasonable height so spikes are visible, else
     pick the normal height of the plot if it's small or a value that can fit
     several plots on the screen.
  */
  function chartHeight (data) {
    const spikeDiameter = 4;
    const noSpikesHeight = 250;
    let heightMargin = rasterView.margin().top + rasterView.margin().bottom;
    let withSpikesHeight = (data.values.length * spikeDiameter) + heightMargin;

    return rasterData.showSpikes() ? withSpikesHeight : d3.min([noSpikesHeight, withSpikesHeight]);
  }

  function createList () {
    let key = '';
    let curSelected = '';
    let dispatch = d3.dispatch('click');

    function _createList(selection) {
      selection.each(function (data) {
        if (data.length === undefined || data.length === 0) {
          if (data[key] !== undefined) {
            data = [data];
          } else return;
        }

        let options = d3.select(this).select('select').selectAll('option')
          .data(data, function (d) {
            return d[key];
          });

        options.enter()
          .append('option')
          .text(function (d) {return d[key];});

        options.exit().remove();
        options.property('selected', false);
        options.filter(function (d) {return d[key] === curSelected;}).property('selected', true);
        options.on('click', function (d) { return dispatch.click(d[key]); });

      });
    }

    _createList.key = function (value) {
      if (!arguments.length) return key;
      key = value;
      return _createList;
    };

    _createList.curSelected = function (value) {
      if (!arguments.length) return curSelected;
      curSelected = value;
      return _createList;
    };

    d3.rebind(_createList, dispatch, 'on');

    return _createList;
  }

  let neuronList = createList();

  neuronList.key('name');

  neuronList.on('click', function (d) {
    rasterData.neuronName(d);
  });

  function createSearch () {
    let fuseOptions = {};
    let key = '';
    let dispatch = d3.dispatch('click');
    let guessIndex = 0;
    let guesses;
    const MAX_GUESSES = 10;

    function _createSearchBox(selection) {
      selection.each(function (data) {
        let fuseSearch = new Fuse(data, fuseOptions);

        selection.select('input').on('input', function () {
          let curInput = d3.select(this).property('value');
          if (curInput.length < 2) {
            selection.classed('open', false);
            guessIndex = 0;
            return;
          }
          guesses = fuseSearch.search(curInput);

          guesses = guesses.filter(function (g) {return g.score < 0.05;});

          if (guesses.length > MAX_GUESSES) guesses = guesses.slice(0, MAX_GUESSES);

          let guessList = selection.select('ul').selectAll('li').data(guesses.map(function (d) {return d.item[key];}), String);

          guessList.enter()
            .append('li')
              .append('a')
              .attr('role', 'menuitem')
              .attr('tabindex', -1)
              .text(function (d) {return d;});

          guessList.selectAll('a').on('click', function (d) {
            selection.select('input').property('value', '');
            dispatch.click(d);
          });

          guessList.exit().remove();

          selection.classed('open', guesses.length > 0 & curInput.length > 2);

          d3.select(this).on('keydown', function () {
            let li = selection.select('ul').selectAll('li');
            switch (d3.event.keyCode) {
              case 38: // up
                guessIndex = (guessIndex > 0) ? guessIndex - 1 : 0;
                li.classed('active', false);
                li.filter(function (d, ind) {
                  return ind === guessIndex;
                }).classed('active', true);
                break;
              case 40: // down
                li.classed('active', false);
                li.filter(function (d, ind) {
                  return ind === guessIndex;
                }).classed('active', true);
                guessIndex = (guessIndex < guesses.length - 1) ? guessIndex + 1 : guesses.length - 1;
                break;
              case 13: // enter
                selection.classed('open', false);
                selection.select('input').property('value', '');
                dispatch.click(selection.select('ul').selectAll('.active').data()[0]);
                break;
            }

          });
        });
      });
    }

    _createSearchBox.fuseOptions = function (value) {
      if (!arguments.length) return fuseOptions;
      fuseOptions = value;
      return _createSearchBox;
    };

    _createSearchBox.fuseOptions = function (value) {
      if (!arguments.length) return fuseOptions;
      fuseOptions = value;
      return _createSearchBox;
    };

    _createSearchBox.key = function (value) {
      if (!arguments.length) return key;
      key = value;
      return _createSearchBox;
    };

    d3.rebind(_createSearchBox, dispatch, 'on');
    return _createSearchBox;
  }

  let neuronSearch = createSearch();

  const fuseOptions$1 = {
    threshold: 0.4,
    shouldSort: true,
    include: ['score'],
    location: 1,
    keys: ['name', 'brainArea'],
  };

  neuronSearch.on('click', function (d) {
    rasterData.neuronName(d);
  });

  neuronSearch
    .fuseOptions(fuseOptions$1)
    .key('name');

  let showLinesCheckbox = d3.select('#showLines input');

  showLinesCheckbox.on('change', function () {
    rasterData.showSmoothingLines(this.checked);
  });

  let showSpikesCheckbox = d3.select('#showRaster input');

  showSpikesCheckbox.on('change', function () {
    rasterData.showSpikes(this.checked);
  });

  function createBrainAreaCheckboxes() {
    let dispatch = d3.dispatch('change');

    function _createCheckbox(selection) {
      selection.each(function (data) {
        if (data.length === undefined || data.length === 0) {
          return;
        }

        let checkboxes = d3.select(this).selectAll('.checkbox').data(data);
        var checkboxEnter = checkboxes.enter()
          .append('div')
          .attr('class', 'checkbox');
        checkboxEnter
          .append('input')
          .attr('id', function (brainArea) {return brainArea;})
          .attr('checked', 'checked')
          .attr('type', 'checkbox')
          .attr('class', 'form-check-input');
        checkboxEnter
          .append('label').html(function (brainArea) {
            return brainArea;
          })
          .attr('class', 'form-check-label');

        checkboxes.select('input').on('change', function (d) {
          dispatch.change();
        });
      });
    }

    d3.rebind(_createCheckbox, dispatch, 'on');

    return _createCheckbox;
  }

  let brainAreaCheckboxes = createBrainAreaCheckboxes();

  brainAreaCheckboxes.on('change', function () {
    var choices = [];
    d3.selectAll('.checkbox').each(function (d) {
      let cb = d3.select(this).select('input');
      if (cb.property('checked')) {
        choices.push(cb.property('id'));
      }
    });

    rasterData.includeBrainAreas(choices);
  });

  function legendView(scale) {
    const CIRCLE_RADIUS = 7.5;
    let margin = { top: 10, right: 10, bottom: 10, left: 10 };
    let outerWidth = document.getElementById('legend').offsetWidth;
    let outerHeight = (scale.domain().length * CIRCLE_RADIUS * 3)
      + margin.top + margin.bottom + CIRCLE_RADIUS;
    let innerHeight = outerHeight - margin.top - margin.bottom;
    let innerWidth = outerWidth - margin.left - margin.right;
    let legendID = d3.select('#filterNav').select('#legend');
    let legend = d3.legend.color()
      .shape('circle')
      .shapeRadius(CIRCLE_RADIUS)
      .shapePadding(CIRCLE_RADIUS)
      .title('Legend')
      .scale(scale);
    let svg = legendID.selectAll('svg').data([{}]);
    svg.enter()
      .append('svg')
        .append('g');
    svg
      .attr('width', innerWidth + margin.left + margin.right)
      .attr('height', innerHeight + margin.top + margin.bottom);
    svg.select('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg.select('g').call(legend);

  }

  let rasterData = rasterDataManger();
  rasterData.on('dataReady', function () {
    d3.select('span#NeuronName')
      .text('Neuron ' + rasterData.brainArea() + ' ' + rasterData.neuronName());
    let chartWidth = document.getElementById('chart').offsetWidth;
    rasterView
      .width(chartWidth)
      .height(chartHeight)
      .timeDomain(rasterData.timeDomain())
      .trialEvents(rasterData.trialEvents())
      .lineSmoothness(rasterData.lineSmoothness())
      .showSmoothingLines(rasterData.showSmoothingLines())
      .showSpikes(rasterData.showSpikes())
      .curEvent(rasterData.curEvent())
      .curFactor(rasterData.curFactor())
      .interactionFactor(rasterData.interactionFactor())
      .colorScale(rasterData.colorScale());

    legendView(rasterData.colorScale());

    let multiples = d3.select('#chart').selectAll('div.row')
      .data(rasterData.rasterData(), function (d) {return d.key;});

    multiples.enter()
      .append('div')
        .attr('class', 'row')
        .attr('id', function (d) {return d.key;});

    multiples.exit().remove();
    multiples.call(rasterView);

    // UI
    factorDropdown.options(rasterData.factorList());
    eventDropdown.options(rasterData.trialEvents());

    neuronList.curSelected(rasterData.neuronName());
    d3.select('#FactorSortMenu').datum(rasterData.curFactor()).call(factorDropdown);
    d3.select('#EventMenu').datum(rasterData.curEvent()).call(eventDropdown);
    d3.select('#LineSmoothSliderPanel').datum(rasterData.lineSmoothness()).call(smoothingSlider);
    d3.select('#NeuronMenu').datum(rasterData.neuronList().filter(
      function (d) {return rasterData.includeBrainAreas().includes(d.brainArea);})
     ).call(neuronList);
    d3.select('#NeuronSearch').datum(rasterData.neuronList()).call(neuronSearch);
    d3.select('#NeuronFilter').datum(rasterData.includeBrainAreas()).call(brainAreaCheckboxes);

    showLinesCheckbox.property('checked', rasterData.showSmoothingLines());
    showSpikesCheckbox.property('checked', rasterData.showSpikes());
  });

  function download (svgInfo, filename) {
    window.URL = (window.URL || window.webkitURL);
    var blob = new Blob(svgInfo.source, {type: 'text\/xml'});
    var url = window.URL.createObjectURL(blob);
    var body = document.body;
    var a = document.createElement('a');

    body.appendChild(a);
    a.setAttribute('download', filename + '.svg');
    a.setAttribute('href', url);
    a.style.display = 'none';
    a.click();
    a.parentNode.removeChild(a);

    setTimeout(function() {
      window.URL.revokeObjectURL(url);
    }, 10);
  }

  var prefix = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
  };

  function setInlineStyles (svg) {

    // add empty svg element
    var emptySvg = window.document.createElementNS(prefix.svg, 'svg');
    window.document.body.appendChild(emptySvg);
    var emptySvgDeclarationComputed = window.getComputedStyle(emptySvg);

    // hardcode computed css styles inside svg
    var allElements = traverse(svg);
    var i = allElements.length;
    while (i--) {
      explicitlySetStyle(allElements[i]);
    }

    emptySvg.parentNode.removeChild(emptySvg);

    function explicitlySetStyle(element) {
      var cSSStyleDeclarationComputed = window.getComputedStyle(element);
      var i;
      var len;
      var key;
      var value;
      var computedStyleStr = '';

      for (i = 0, len = cSSStyleDeclarationComputed.length; i < len; i++) {
        key = cSSStyleDeclarationComputed[i];
        value = cSSStyleDeclarationComputed.getPropertyValue(key);
        if (value !== emptySvgDeclarationComputed.getPropertyValue(key)) {
          // Don't set computed style of width and height. Makes SVG elmements disappear.
          if ((key !== 'height') && (key !== 'width')) {
            computedStyleStr += key + ':' + value + ';';
          }

        }
      }

      element.setAttribute('style', computedStyleStr);
    }

    function traverse(obj) {
      var tree = [];
      tree.push(obj);
      visit(obj);
      function visit(node) {
        if (node && node.hasChildNodes()) {
          var child = node.firstChild;
          while (child) {
            if (child.nodeType === 1 && child.nodeName != 'SCRIPT') {
              tree.push(child);
              visit(child);
            }

            child = child.nextSibling;
          }
        }
      }

      return tree;
    }
  }

  function preprocess (svg) {
    svg.setAttribute('version', '1.1');

    // removing attributes so they aren't doubled up
    svg.removeAttribute('xmlns');
    svg.removeAttribute('xlink');

    // These are needed for the svg
    if (!svg.hasAttributeNS(prefix.xmlns, 'xmlns')) {
      svg.setAttributeNS(prefix.xmlns, 'xmlns', prefix.svg);
    }

    if (!svg.hasAttributeNS(prefix.xmlns, 'xmlns:xlink')) {
      svg.setAttributeNS(prefix.xmlns, 'xmlns:xlink', prefix.xlink);
    }

    setInlineStyles(svg);

    var xmls = new XMLSerializer();
    var source = xmls.serializeToString(svg);
    var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
    var rect = svg.getBoundingClientRect();
    var svgInfo = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      class: svg.getAttribute('class'),
      id: svg.getAttribute('id'),
      childElementCount: svg.childElementCount,
      source: [doctype + source],
    };

    return svgInfo;
  }

  function save(svgElement, config) {
    if (svgElement.nodeName !== 'svg' || svgElement.nodeType !== 1) {
      throw 'Need an svg element input';
    }

    var config = config || {};
    var svgInfo = preprocess(svgElement, config);
    var defaultFileName = getDefaultFileName(svgInfo);
    var filename = config.filename || defaultFileName;
    var svgInfo = preprocess(svgElement);
    download(svgInfo, filename);
  }

  function getDefaultFileName(svgInfo) {
    var defaultFileName = 'untitled';
    if (svgInfo.id) {
      defaultFileName = svgInfo.id;
    } else if (svgInfo.class) {
      defaultFileName = svgInfo.class;
    } else if (window.document.title) {
      defaultFileName = window.document.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    }

    return defaultFileName;
  }

  let exportButton = d3.select('button#export');

  exportButton
    .on('click', function () {
      let svg = d3.selectAll('#chart').selectAll('svg')[0];
      let levelNames = rasterData.rasterData().map(function (d) {return d.key;});
      let curFactor = rasterData.curFactor();
      let curEvent = rasterData.curEvent();
      let neuronName = rasterData.neuronName();

      svg.forEach(function (s, i) {
        let saveName = neuronName + '_' +
                       curEvent + '_' +
                       curFactor + '_' +
                       levelNames[i];
        save(s, { filename: saveName });
      });

    });

  let permalinkBox = d3.select('#permalink');
  let permalinkButton = d3.select('button#link');
  permalinkButton
    .on('click', function () {
      permalinkBox
        .style('display', 'block');

      let linkString = window.location.origin + window.location.pathname + '?' +
        'neuronName=' + rasterData.neuronName() +
        '&curFactor=' + rasterData.curFactor() +
        '&curEvent=' + rasterData.curEvent() +
        '&showSmoothingLines=' + rasterData.showSmoothingLines() +
        '&lineSmoothness=' + rasterData.lineSmoothness() +
        '&showSpikes=' + rasterData.showSpikes() +
        '&interactionFactor=' + rasterData.interactionFactor();
      permalinkBox.selectAll('textarea').html(linkString);
      permalinkBox.selectAll('.bookmark').attr('href', linkString);
    });

  permalinkBox.selectAll('.close')
    .on('click', function () {
      permalinkBox.style('display', 'none');
    });

  // Set up help overlay
  let overlay = d3.select('#overlay');
  let helpButton = d3.select('button#help-button');
  overlay.selectAll('.close')
    .on('click', function() {
      overlay.style('display', 'none');
    });

  helpButton
    .on('click', function() {
      overlay
        .style('display', 'block');
    });

  function init(passedParams) {

    let showSpikes = (passedParams.showSpikes === undefined) ?
      true : (passedParams.showSpikes === 'true');
    let showSmoothingLines = (passedParams.showSmoothingLines === undefined) ?
      true : (passedParams.showSmoothingLines === 'true');
    let lineSmoothness = (passedParams.lineSmoothness || 20);
    let curFactor = passedParams.curFactor || 'trial_id';
    let curEvent = passedParams.curEvent || 'start_time';
    let interactionFactor = passedParams.interactionFactor || '';
    let neuronName = passedParams.neuronName || '';

    rasterData
      .showSpikes(showSpikes)
      .showSmoothingLines(showSmoothingLines)
      .lineSmoothness(lineSmoothness)
      .curFactor(curFactor)
      .curEvent(curEvent)
      .interactionFactor(interactionFactor)
      .neuronName(neuronName);

  }

  exports.init = init;

  Object.defineProperty(exports, '__esModule', { value: true });

}));