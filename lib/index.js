import os from 'os';
import fs from 'fs';
import child from 'child_process';
import { promisify } from 'util';
import path, { sep } from 'path';
import crypto from 'crypto';
import require$$0 from 'worker_threads';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function _console(type) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (atom === null || atom === void 0 ? void 0 : atom.inDevMode()) {
        return (_a = (global).console)[type].apply(_a, args);
    }
}
function log() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return _console.apply(void 0, __spreadArrays(['log'], args));
}

var DEFAULT_RESOLV_FILE = '/etc/resolv.conf';

function getInterfaceName() {
  var val = 'eth';
  var platform = os.platform();
  if (platform === 'darwin') {
    val = 'en';
  } else if (platform === 'win32') {
    val = null;
  }
  return val;
}

function getIfconfigCMD() {
  if (os.platform() === 'win32') {
    return 'ipconfig/all';
  }
  return '/sbin/ifconfig';
}

/**
 * Get all addresses.
 *
 * @param {String} [interfaceName] interface name, default is 'eth' on linux, 'en' on mac os.
 * @param {Function(err, addr)} callback
 *  - {Object} addr {
 *    - {String} ip
 *    - {String} ipv6
 *    - {String} mac
 *  }
 */
function address(interfaceName, callback) {
  if (typeof interfaceName === 'function') {
    callback = interfaceName;
    interfaceName = null;
  }

  var addr = {
    ip: address.ip(interfaceName),
    ipv6: address.ipv6(interfaceName),
    mac: null
  };
  address.mac(interfaceName, function (err, mac) {
    if (mac) {
      addr.mac = mac;
    }
    callback(err, addr);
  });
}

address.interface = function (family, name) {
  var interfaces = os.networkInterfaces();
  var noName = !name;
  name = name || getInterfaceName();
  family = family || 'IPv4';
  for (var i = -1; i < 8; i++) {
    var interfaceName = name + (i >= 0 ? i : ''); // support 'lo' and 'lo0'
    var items = interfaces[interfaceName];
    if (items) {
      for (var j = 0; j < items.length; j++) {
        var item = items[j];
        if (item.family === family) {
          return item;
        }
      }
    }
  }

  if (noName) {
    // filter 127.0.0.1, get the first ip
    for (var k in interfaces) {
      var items = interfaces[k];
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.family === family && item.address !== '127.0.0.1') {
          return item;
        }
      }
    }
  }
  return;
};

/**
 * Get current machine IPv4
 *
 * @param {String} [interfaceName] interface name, default is 'eth' on linux, 'en' on mac os.
 * @return {String} IP address
 */
address.ip = function (interfaceName) {
  var item = address.interface('IPv4', interfaceName);
  return item && item.address;
};

/**
 * Get current machine IPv6
 *
 * @param {String} [interfaceName] interface name, default is 'eth' on linux, 'en' on mac os.
 * @return {String} IP address
 */
address.ipv6 = function (interfaceName) {
  var item = address.interface('IPv6', interfaceName);
  return item && item.address;
};

// osx start line 'en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500'
// linux start line 'eth0      Link encap:Ethernet  HWaddr 00:16:3E:00:0A:29  '
var MAC_OSX_START_LINE = /^(\w+)\:\s+flags=/;
var MAC_LINUX_START_LINE = /^(\w+)\s{2,}link encap:\w+/i;

// ether 78:ca:39:b0:e6:7d
// HWaddr 00:16:3E:00:0A:29
var MAC_RE = address.MAC_RE = /(?:ether|HWaddr)\s+((?:[a-z0-9]{2}\:){5}[a-z0-9]{2})/i;

// osx: inet 192.168.2.104 netmask 0xffffff00 broadcast 192.168.2.255
// linux: inet addr:10.125.5.202  Bcast:10.125.15.255  Mask:255.255.240.0
var MAC_IP_RE = address.MAC_IP_RE = /inet\s(?:addr\:)?(\d+\.\d+\.\d+\.\d+)/;

function getMAC(content, interfaceName, matchIP) {
  var lines = content.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trimRight();
    var m = MAC_OSX_START_LINE.exec(line) || MAC_LINUX_START_LINE.exec(line);
    if (!m) {
      continue;
    }

    // check interface name
    var name = m[1];
    if (name.indexOf(interfaceName) !== 0) {
      continue;
    }

    var ip = null;
    var mac = null;
    var match = MAC_RE.exec(line);
    if (match) {
      mac = match[1];
    }

    i++;
    while (true) {
      line = lines[i];
      if (!line || MAC_OSX_START_LINE.exec(line) || MAC_LINUX_START_LINE.exec(line)) {
        i--;
        break; // hit next interface, handle next interface
      }
      if (!mac) {
        match = MAC_RE.exec(line);
        if (match) {
          mac = match[1];
        }
      }

      if (!ip) {
        match = MAC_IP_RE.exec(line);
        if (match) {
          ip = match[1];
        }
      }

      i++;
    }

    if (ip === matchIP) {
      return mac;
    }
  }
}

/**
 * Get current machine MAC address
 *
 * @param {String} [interfaceName] interface name, default is 'eth' on linux, 'en' on mac os.
 * @param {Function(err, address)} callback
 */
address.mac = function (interfaceName, callback) {
  if (typeof interfaceName === 'function') {
    callback = interfaceName;
    interfaceName = null;
  }
  interfaceName = interfaceName || getInterfaceName();
  var item = address.interface('IPv4', interfaceName);
  if (!item) {
    return callback();
  }

  // https://github.com/nodejs/node/issues/13581
  // bug in node 7.x and <= 8.4.0
  if (!process.env.CI && (item.mac === 'ff:00:00:00:00:00' || item.mac === '00:00:00:00:00:00')) {
    // wrong address, ignore it
    item.mac = '';
  }

  if (item.mac) {
    return callback(null, item.mac);
  }

  child.exec(getIfconfigCMD(), {timeout: 5000}, function (err, stdout, stderr) {
    if (err || !stdout) {
      return callback(err);
    }

    var mac = getMAC(stdout || '', interfaceName, item.address);
    callback(null, mac);
  });
};

// nameserver 172.24.102.254
var DNS_SERVER_RE = /^nameserver\s+(\d+\.\d+\.\d+\.\d+)$/i;

/**
 * Get DNS servers.
 *
 * @param {String} [filepath] resolv config file path. default is '/etc/resolv.conf'.
 * @param {Function(err, servers)} callback
 */
address.dns = function (filepath, callback) {
  if (typeof filepath === 'function') {
    callback = filepath;
    filepath = null;
  }
  filepath = filepath || DEFAULT_RESOLV_FILE;
  fs.readFile(filepath, 'utf8', function (err, content) {
    if (err) {
      return callback(err);
    }
    var servers = [];
    content = content || '';
    var lines = content.split('\n');
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      var m = DNS_SERVER_RE.exec(line);
      if (m) {
        servers.push(m[1]);
      }
    }

    callback(null, servers);
  });
};

var address_1 = address;

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

function validate(uuid) {
  return typeof uuid === 'string' && REGEX.test(uuid);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

function parse(uuid) {
  if (!validate(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
function v35 (name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = parse(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return stringify(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

function v4(options, buf, offset) {
  options = options || {};
  const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return stringify(rnds);
}

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return crypto.createHash('sha1').update(bytes).digest();
}

const v5 = v35('v5', 0x50, sha1);

const callsites = () => {
	const _prepareStackTrace = Error.prepareStackTrace;
	Error.prepareStackTrace = (_, stack) => stack;
	const stack = new Error().stack.slice(1);
	Error.prepareStackTrace = _prepareStackTrace;
	return stack;
};

var callsites_1 = callsites;
// TODO: Remove this for the next major release
var _default = callsites;
callsites_1.default = _default;

var callerCallsite = ({depth = 0} = {}) => {
	const callers = [];
	const callerFileSet = new Set();

	for (const callsite of callsites_1()) {
		const fileName = callsite.getFileName();
		const hasReceiver = callsite.getTypeName() !== null && fileName !== null;

		if (!callerFileSet.has(fileName)) {
			callerFileSet.add(fileName);
			callers.unshift(callsite);
		}

		if (hasReceiver) {
			return callers[depth];
		}
	}
};

function _process (v, mod) {
  var i;
  var r;

  if (typeof mod === 'function') {
    r = mod(v);
    if (r !== undefined) {
      v = r;
    }
  } else if (Array.isArray(mod)) {
    for (i = 0; i < mod.length; i++) {
      r = mod[i](v);
      if (r !== undefined) {
        v = r;
      }
    }
  }

  return v
}

function parseKey (key, val) {
  // detect negative index notation
  if (key[0] === '-' && Array.isArray(val) && /^-\d+$/.test(key)) {
    return val.length + parseInt(key, 10)
  }
  return key
}

function isIndex (k) {
  return /^\d+$/.test(k)
}

function isObject (val) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

function isArrayOrObject (val) {
  return Object(val) === val
}

function isEmptyObject (val) {
  return Object.keys(val).length === 0
}

var blacklist = ['__proto__', 'prototype', 'constructor'];
var blacklistFilter = function (part) { return blacklist.indexOf(part) === -1 };

function parsePath (path, sep) {
  if (path.indexOf('[') >= 0) {
    path = path.replace(/\[/g, sep).replace(/]/g, '');
  }

  var parts = path.split(sep);

  var check = parts.filter(blacklistFilter);

  if (check.length !== parts.length) {
    throw Error('Refusing to update blacklisted property ' + path)
  }

  return parts
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

function DotObject (separator, override, useArray, useBrackets) {
  if (!(this instanceof DotObject)) {
    return new DotObject(separator, override, useArray, useBrackets)
  }

  if (typeof override === 'undefined') override = false;
  if (typeof useArray === 'undefined') useArray = true;
  if (typeof useBrackets === 'undefined') useBrackets = true;
  this.separator = separator || '.';
  this.override = override;
  this.useArray = useArray;
  this.useBrackets = useBrackets;
  this.keepArray = false;

  // contains touched arrays
  this.cleanup = [];
}

var dotDefault = new DotObject('.', false, true, true);
function wrap (method) {
  return function () {
    return dotDefault[method].apply(dotDefault, arguments)
  }
}

DotObject.prototype._fill = function (a, obj, v, mod) {
  var k = a.shift();

  if (a.length > 0) {
    obj[k] = obj[k] || (this.useArray && isIndex(a[0]) ? [] : {});

    if (!isArrayOrObject(obj[k])) {
      if (this.override) {
        obj[k] = {};
      } else {
        if (!(isArrayOrObject(v) && isEmptyObject(v))) {
          throw new Error(
            'Trying to redefine `' + k + '` which is a ' + typeof obj[k]
          )
        }

        return
      }
    }

    this._fill(a, obj[k], v, mod);
  } else {
    if (!this.override && isArrayOrObject(obj[k]) && !isEmptyObject(obj[k])) {
      if (!(isArrayOrObject(v) && isEmptyObject(v))) {
        throw new Error("Trying to redefine non-empty obj['" + k + "']")
      }

      return
    }

    obj[k] = _process(v, mod);
  }
};

/**
 *
 * Converts an object with dotted-key/value pairs to it's expanded version
 *
 * Optionally transformed by a set of modifiers.
 *
 * Usage:
 *
 *   var row = {
 *     'nr': 200,
 *     'doc.name': '  My Document  '
 *   }
 *
 *   var mods = {
 *     'doc.name': [_s.trim, _s.underscored]
 *   }
 *
 *   dot.object(row, mods)
 *
 * @param {Object} obj
 * @param {Object} mods
 */
DotObject.prototype.object = function (obj, mods) {
  var self = this;

  Object.keys(obj).forEach(function (k) {
    var mod = mods === undefined ? null : mods[k];
    // normalize array notation.
    var ok = parsePath(k, self.separator).join(self.separator);

    if (ok.indexOf(self.separator) !== -1) {
      self._fill(ok.split(self.separator), obj, obj[k], mod);
      delete obj[k];
    } else {
      obj[k] = _process(obj[k], mod);
    }
  });

  return obj
};

/**
 * @param {String} path dotted path
 * @param {String} v value to be set
 * @param {Object} obj object to be modified
 * @param {Function|Array} mod optional modifier
 */
DotObject.prototype.str = function (path, v, obj, mod) {
  var ok = parsePath(path, this.separator).join(this.separator);

  if (path.indexOf(this.separator) !== -1) {
    this._fill(ok.split(this.separator), obj, v, mod);
  } else {
    obj[path] = _process(v, mod);
  }

  return obj
};

/**
 *
 * Pick a value from an object using dot notation.
 *
 * Optionally remove the value
 *
 * @param {String} path
 * @param {Object} obj
 * @param {Boolean} remove
 */
DotObject.prototype.pick = function (path, obj, remove, reindexArray) {
  var i;
  var keys;
  var val;
  var key;
  var cp;

  keys = parsePath(path, this.separator);
  for (i = 0; i < keys.length; i++) {
    key = parseKey(keys[i], obj);
    if (obj && typeof obj === 'object' && key in obj) {
      if (i === keys.length - 1) {
        if (remove) {
          val = obj[key];
          if (reindexArray && Array.isArray(obj)) {
            obj.splice(key, 1);
          } else {
            delete obj[key];
          }
          if (Array.isArray(obj)) {
            cp = keys.slice(0, -1).join('.');
            if (this.cleanup.indexOf(cp) === -1) {
              this.cleanup.push(cp);
            }
          }
          return val
        } else {
          return obj[key]
        }
      } else {
        obj = obj[key];
      }
    } else {
      return undefined
    }
  }
  if (remove && Array.isArray(obj)) {
    obj = obj.filter(function (n) {
      return n !== undefined
    });
  }
  return obj
};
/**
 *
 * Delete value from an object using dot notation.
 *
 * @param {String} path
 * @param {Object} obj
 * @return {any} The removed value
 */
DotObject.prototype.delete = function (path, obj) {
  return this.remove(path, obj, true)
};

/**
 *
 * Remove value from an object using dot notation.
 *
 * Will remove multiple items if path is an array.
 * In this case array indexes will be retained until all
 * removals have been processed.
 *
 * Use dot.delete() to automatically  re-index arrays.
 *
 * @param {String|Array<String>} path
 * @param {Object} obj
 * @param {Boolean} reindexArray
 * @return {any} The removed value
 */
DotObject.prototype.remove = function (path, obj, reindexArray) {
  var i;

  this.cleanup = [];
  if (Array.isArray(path)) {
    for (i = 0; i < path.length; i++) {
      this.pick(path[i], obj, true, reindexArray);
    }
    if (!reindexArray) {
      this._cleanup(obj);
    }
    return obj
  } else {
    return this.pick(path, obj, true, reindexArray)
  }
};

DotObject.prototype._cleanup = function (obj) {
  var ret;
  var i;
  var keys;
  var root;
  if (this.cleanup.length) {
    for (i = 0; i < this.cleanup.length; i++) {
      keys = this.cleanup[i].split('.');
      root = keys.splice(0, -1).join('.');
      ret = root ? this.pick(root, obj) : obj;
      ret = ret[keys[0]].filter(function (v) {
        return v !== undefined
      });
      this.set(this.cleanup[i], ret, obj);
    }
    this.cleanup = [];
  }
};

/**
 * Alias method  for `dot.remove`
 *
 * Note: this is not an alias for dot.delete()
 *
 * @param {String|Array<String>} path
 * @param {Object} obj
 * @param {Boolean} reindexArray
 * @return {any} The removed value
 */
DotObject.prototype.del = DotObject.prototype.remove;

/**
 *
 * Move a property from one place to the other.
 *
 * If the source path does not exist (undefined)
 * the target property will not be set.
 *
 * @param {String} source
 * @param {String} target
 * @param {Object} obj
 * @param {Function|Array} mods
 * @param {Boolean} merge
 */
DotObject.prototype.move = function (source, target, obj, mods, merge) {
  if (typeof mods === 'function' || Array.isArray(mods)) {
    this.set(target, _process(this.pick(source, obj, true), mods), obj, merge);
  } else {
    merge = mods;
    this.set(target, this.pick(source, obj, true), obj, merge);
  }

  return obj
};

/**
 *
 * Transfer a property from one object to another object.
 *
 * If the source path does not exist (undefined)
 * the property on the other object will not be set.
 *
 * @param {String} source
 * @param {String} target
 * @param {Object} obj1
 * @param {Object} obj2
 * @param {Function|Array} mods
 * @param {Boolean} merge
 */
DotObject.prototype.transfer = function (
  source,
  target,
  obj1,
  obj2,
  mods,
  merge
) {
  if (typeof mods === 'function' || Array.isArray(mods)) {
    this.set(
      target,
      _process(this.pick(source, obj1, true), mods),
      obj2,
      merge
    );
  } else {
    merge = mods;
    this.set(target, this.pick(source, obj1, true), obj2, merge);
  }

  return obj2
};

/**
 *
 * Copy a property from one object to another object.
 *
 * If the source path does not exist (undefined)
 * the property on the other object will not be set.
 *
 * @param {String} source
 * @param {String} target
 * @param {Object} obj1
 * @param {Object} obj2
 * @param {Function|Array} mods
 * @param {Boolean} merge
 */
DotObject.prototype.copy = function (source, target, obj1, obj2, mods, merge) {
  if (typeof mods === 'function' || Array.isArray(mods)) {
    this.set(
      target,
      _process(
        // clone what is picked
        JSON.parse(JSON.stringify(this.pick(source, obj1, false))),
        mods
      ),
      obj2,
      merge
    );
  } else {
    merge = mods;
    this.set(target, this.pick(source, obj1, false), obj2, merge);
  }

  return obj2
};

/**
 *
 * Set a property on an object using dot notation.
 *
 * @param {String} path
 * @param {any} val
 * @param {Object} obj
 * @param {Boolean} merge
 */
DotObject.prototype.set = function (path, val, obj, merge) {
  var i;
  var k;
  var keys;
  var key;

  // Do not operate if the value is undefined.
  if (typeof val === 'undefined') {
    return obj
  }
  keys = parsePath(path, this.separator);

  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    if (i === keys.length - 1) {
      if (merge && isObject(val) && isObject(obj[key])) {
        for (k in val) {
          if (hasOwnProperty.call(val, k)) {
            obj[key][k] = val[k];
          }
        }
      } else if (merge && Array.isArray(obj[key]) && Array.isArray(val)) {
        for (var j = 0; j < val.length; j++) {
          obj[keys[i]].push(val[j]);
        }
      } else {
        obj[key] = val;
      }
    } else if (
      // force the value to be an object
      !hasOwnProperty.call(obj, key) ||
      (!isObject(obj[key]) && !Array.isArray(obj[key]))
    ) {
      // initialize as array if next key is numeric
      if (/^\d+$/.test(keys[i + 1])) {
        obj[key] = [];
      } else {
        obj[key] = {};
      }
    }
    obj = obj[key];
  }
  return obj
};

/**
 *
 * Transform an object
 *
 * Usage:
 *
 *   var obj = {
 *     "id": 1,
 *    "some": {
 *      "thing": "else"
 *    }
 *   }
 *
 *   var transform = {
 *     "id": "nr",
 *    "some.thing": "name"
 *   }
 *
 *   var tgt = dot.transform(transform, obj)
 *
 * @param {Object} recipe Transform recipe
 * @param {Object} obj Object to be transformed
 * @param {Array} mods modifiers for the target
 */
DotObject.prototype.transform = function (recipe, obj, tgt) {
  obj = obj || {};
  tgt = tgt || {};
  Object.keys(recipe).forEach(
    function (key) {
      this.set(recipe[key], this.pick(key, obj), tgt);
    }.bind(this)
  );
  return tgt
};

/**
 *
 * Convert object to dotted-key/value pair
 *
 * Usage:
 *
 *   var tgt = dot.dot(obj)
 *
 *   or
 *
 *   var tgt = {}
 *   dot.dot(obj, tgt)
 *
 * @param {Object} obj source object
 * @param {Object} tgt target object
 * @param {Array} path path array (internal)
 */
DotObject.prototype.dot = function (obj, tgt, path) {
  tgt = tgt || {};
  path = path || [];
  var isArray = Array.isArray(obj);

  Object.keys(obj).forEach(
    function (key) {
      var index = isArray && this.useBrackets ? '[' + key + ']' : key;
      if (
        isArrayOrObject(obj[key]) &&
        ((isObject(obj[key]) && !isEmptyObject(obj[key])) ||
          (Array.isArray(obj[key]) && !this.keepArray && obj[key].length !== 0))
      ) {
        if (isArray && this.useBrackets) {
          var previousKey = path[path.length - 1] || '';
          return this.dot(
            obj[key],
            tgt,
            path.slice(0, -1).concat(previousKey + index)
          )
        } else {
          return this.dot(obj[key], tgt, path.concat(index))
        }
      } else {
        if (isArray && this.useBrackets) {
          tgt[path.join(this.separator).concat('[' + key + ']')] = obj[key];
        } else {
          tgt[path.concat(index).join(this.separator)] = obj[key];
        }
      }
    }.bind(this)
  );
  return tgt
};

DotObject.pick = wrap('pick');
DotObject.move = wrap('move');
DotObject.transfer = wrap('transfer');
DotObject.transform = wrap('transform');
DotObject.copy = wrap('copy');
DotObject.object = wrap('object');
DotObject.str = wrap('str');
DotObject.set = wrap('set');
DotObject.delete = wrap('delete');
DotObject.del = DotObject.remove = wrap('remove');
DotObject.dot = wrap('dot');
['override', 'overwrite'].forEach(function (prop) {
  Object.defineProperty(DotObject, prop, {
    get: function () {
      return dotDefault.override
    },
    set: function (val) {
      dotDefault.override = !!val;
    }
  });
});
['useArray', 'keepArray', 'useBrackets'].forEach(function (prop) {
  Object.defineProperty(DotObject, prop, {
    get: function () {
      return dotDefault[prop]
    },
    set: function (val) {
      dotDefault[prop] = val;
    }
  });
});

DotObject._process = _process;

var dotObject = DotObject;

const isStream = stream =>
	stream !== null &&
	typeof stream === 'object' &&
	typeof stream.pipe === 'function';

isStream.writable = stream =>
	isStream(stream) &&
	stream.writable !== false &&
	typeof stream._write === 'function' &&
	typeof stream._writableState === 'object';

isStream.readable = stream =>
	isStream(stream) &&
	stream.readable !== false &&
	typeof stream._read === 'function' &&
	typeof stream._readableState === 'object';

isStream.duplex = stream =>
	isStream.writable(stream) &&
	isStream.readable(stream);

isStream.transform = stream =>
	isStream.duplex(stream) &&
	typeof stream._transform === 'function' &&
	typeof stream._transformState === 'object';

var isStream_1 = isStream;

const {Worker} = (() => {
	try {
		return require$$0;
	} catch (_) {
		return {};
	}
})();

let worker; // Lazy
let taskIdCounter = 0;
const tasks = new Map();

const recreateWorkerError = sourceError => {
	const error = new Error(sourceError.message);

	for (const [key, value] of Object.entries(sourceError)) {
		if (key !== 'message') {
			error[key] = value;
		}
	}

	return error;
};

const createWorker = () => {
	worker = new Worker(path.join(__dirname, 'thread.js'));

	worker.on('message', message => {
		const task = tasks.get(message.id);
		tasks.delete(message.id);

		if (tasks.size === 0) {
			worker.unref();
		}

		if (message.error === undefined) {
			task.resolve(message.value);
		} else {
			task.reject(recreateWorkerError(message.error));
		}
	});

	worker.on('error', error => {
		// Any error here is effectively an equivalent of segfault, and have no scope, so we just throw it on callback level
		throw error;
	});
};

const taskWorker = (method, args, transferList) => new Promise((resolve, reject) => {
	const id = taskIdCounter++;
	tasks.set(id, {resolve, reject});

	if (worker === undefined) {
		createWorker();
	}

	worker.ref();
	worker.postMessage({id, method, args}, transferList);
});

const hasha = (input, options = {}) => {
	let outputEncoding = options.encoding || 'hex';

	if (outputEncoding === 'buffer') {
		outputEncoding = undefined;
	}

	const hash = crypto.createHash(options.algorithm || 'sha512');

	const update = buffer => {
		const inputEncoding = typeof buffer === 'string' ? 'utf8' : undefined;
		hash.update(buffer, inputEncoding);
	};

	if (Array.isArray(input)) {
		input.forEach(update);
	} else {
		update(input);
	}

	return hash.digest(outputEncoding);
};

hasha.stream = (options = {}) => {
	let outputEncoding = options.encoding || 'hex';

	if (outputEncoding === 'buffer') {
		outputEncoding = undefined;
	}

	const stream = crypto.createHash(options.algorithm || 'sha512');
	stream.setEncoding(outputEncoding);
	return stream;
};

hasha.fromStream = async (stream, options = {}) => {
	if (!isStream_1(stream)) {
		throw new TypeError('Expected a stream');
	}

	return new Promise((resolve, reject) => {
		// TODO: Use `stream.pipeline` and `stream.finished` when targeting Node.js 10
		stream
			.on('error', reject)
			.pipe(hasha.stream(options))
			.on('error', reject)
			.on('finish', function () {
				resolve(this.read());
			});
	});
};

if (Worker === undefined) {
	hasha.fromFile = async (filePath, options) => hasha.fromStream(fs.createReadStream(filePath), options);
	hasha.async = async (input, options) => hasha(input, options);
} else {
	hasha.fromFile = async (filePath, {algorithm = 'sha512', encoding = 'hex'} = {}) => {
		const hash = await taskWorker('hashFile', [algorithm, filePath]);

		if (encoding === 'buffer') {
			return Buffer.from(hash);
		}

		return Buffer.from(hash).toString(encoding);
	};

	hasha.async = async (input, {algorithm = 'sha512', encoding = 'hex'} = {}) => {
		if (encoding === 'buffer') {
			encoding = undefined;
		}

		const hash = await taskWorker('hash', [algorithm, input]);

		if (encoding === undefined) {
			return Buffer.from(hash);
		}

		return Buffer.from(hash).toString(encoding);
	};
}

hasha.fromFileSync = (filePath, options) => hasha(fs.readFileSync(filePath), options);

var hasha_1 = hasha;

const word = '[a-fA-F\\d:]';
const b = options => options && options.includeBoundaries ?
	`(?:(?<=\\s|^)(?=${word})|(?<=${word})(?=\\s|$))` :
	'';

const v4$1 = '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}';

const v6seg = '[a-fA-F\\d]{1,4}';
const v6 = `
(
(?:${v6seg}:){7}(?:${v6seg}|:)|                                // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6seg}:){6}(?:${v4$1}|:${v6seg}|:)|                         // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6seg}:){5}(?::${v4$1}|(:${v6seg}){1,2}|:)|                 // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6seg}:){4}(?:(:${v6seg}){0,1}:${v4$1}|(:${v6seg}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6seg}:){3}(?:(:${v6seg}){0,2}:${v4$1}|(:${v6seg}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6seg}:){2}(?:(:${v6seg}){0,3}:${v4$1}|(:${v6seg}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6seg}:){1}(?:(:${v6seg}){0,4}:${v4$1}|(:${v6seg}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::((?::${v6seg}){0,5}:${v4$1}|(?::${v6seg}){1,7}|:))           // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(%[0-9a-zA-Z]{1,})?                                           // %eth0            %1
`.replace(/\s*\/\/.*$/gm, '').replace(/\n/g, '').trim();

// Pre-compile only the exact regexes because adding a global flag make regexes stateful
const v46Exact = new RegExp(`(?:^${v4$1}$)|(?:^${v6}$)`);
const v4exact = new RegExp(`^${v4$1}$`);
const v6exact = new RegExp(`^${v6}$`);

const ip = options => options && options.exact ?
	v46Exact :
	new RegExp(`(?:${b(options)}${v4$1}${b(options)})|(?:${b(options)}${v6}${b(options)})`, 'g');

ip.v4 = options => options && options.exact ? v4exact : new RegExp(`${b(options)}${v4$1}${b(options)}`, 'g');
ip.v6 = options => options && options.exact ? v6exact : new RegExp(`${b(options)}${v6}${b(options)}`, 'g');

var ipRegex = ip;

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var strictUriEncode = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);

var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp(token, 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return decodeURIComponent(components.join(''));
	} catch (err) {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	var left = components.slice(0, split);
	var right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
	try {
		return decodeURIComponent(input);
	} catch (err) {
		var tokens = input.match(singleMatcher);

		for (var i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher);
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	var replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD'
	};

	var match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch (err) {
			var result = decode(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	var entries = Object.keys(replaceMap);

	for (var i = 0; i < entries.length; i++) {
		// Replace all decoded components
		var key = entries[i];
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

var decodeUriComponent = function (encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
	}

	try {
		encodedURI = encodedURI.replace(/\+/g, ' ');

		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch (err) {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
};

var splitOnFirst = (string, separator) => {
	if (!(typeof string === 'string' && typeof separator === 'string')) {
		throw new TypeError('Expected the arguments to be of type `string`');
	}

	if (separator === '') {
		return [string];
	}

	const separatorIndex = string.indexOf(separator);

	if (separatorIndex === -1) {
		return [string];
	}

	return [
		string.slice(0, separatorIndex),
		string.slice(separatorIndex + separator.length)
	];
};

var queryString = createCommonjsModule(function (module, exports) {




const isNullOrUndefined = value => value === null || value === undefined;

function encoderForArrayFormat(options) {
	switch (options.arrayFormat) {
		case 'index':
			return key => (result, value) => {
				const index = result.length;

				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, [encode(key, options), '[', index, ']'].join('')];
				}

				return [
					...result,
					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
				];
			};

		case 'bracket':
			return key => (result, value) => {
				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, [encode(key, options), '[]'].join('')];
				}

				return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
			};

		case 'comma':
		case 'separator':
			return key => (result, value) => {
				if (value === null || value === undefined || value.length === 0) {
					return result;
				}

				if (result.length === 0) {
					return [[encode(key, options), '=', encode(value, options)].join('')];
				}

				return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
			};

		default:
			return key => (result, value) => {
				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, encode(key, options)];
				}

				return [...result, [encode(key, options), '=', encode(value, options)].join('')];
			};
	}
}

function parserForArrayFormat(options) {
	let result;

	switch (options.arrayFormat) {
		case 'index':
			return (key, value, accumulator) => {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return (key, value, accumulator) => {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		case 'comma':
		case 'separator':
			return (key, value, accumulator) => {
				const isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
				const isEncodedArray = (typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator));
				value = isEncodedArray ? decode(value, options) : value;
				const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : value === null ? value : decode(value, options);
				accumulator[key] = newValue;
			};

		default:
			return (key, value, accumulator) => {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function validateArrayFormatSeparator(value) {
	if (typeof value !== 'string' || value.length !== 1) {
		throw new TypeError('arrayFormatSeparator must be single character string');
	}
}

function encode(value, options) {
	if (options.encode) {
		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function decode(value, options) {
	if (options.decode) {
		return decodeUriComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	}

	if (typeof input === 'object') {
		return keysSorter(Object.keys(input))
			.sort((a, b) => Number(a) - Number(b))
			.map(key => input[key]);
	}

	return input;
}

function removeHash(input) {
	const hashStart = input.indexOf('#');
	if (hashStart !== -1) {
		input = input.slice(0, hashStart);
	}

	return input;
}

function getHash(url) {
	let hash = '';
	const hashStart = url.indexOf('#');
	if (hashStart !== -1) {
		hash = url.slice(hashStart);
	}

	return hash;
}

function extract(input) {
	input = removeHash(input);
	const queryStart = input.indexOf('?');
	if (queryStart === -1) {
		return '';
	}

	return input.slice(queryStart + 1);
}

function parseValue(value, options) {
	if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
		value = Number(value);
	} else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
		value = value.toLowerCase() === 'true';
	}

	return value;
}

function parse(query, options) {
	options = Object.assign({
		decode: true,
		sort: true,
		arrayFormat: 'none',
		arrayFormatSeparator: ',',
		parseNumbers: false,
		parseBooleans: false
	}, options);

	validateArrayFormatSeparator(options.arrayFormatSeparator);

	const formatter = parserForArrayFormat(options);

	// Create an object with no prototype
	const ret = Object.create(null);

	if (typeof query !== 'string') {
		return ret;
	}

	query = query.trim().replace(/^[?#&]/, '');

	if (!query) {
		return ret;
	}

	for (const param of query.split('&')) {
		let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, ' ') : param, '=');

		// Missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		value = value === undefined ? null : ['comma', 'separator'].includes(options.arrayFormat) ? value : decode(value, options);
		formatter(decode(key, options), value, ret);
	}

	for (const key of Object.keys(ret)) {
		const value = ret[key];
		if (typeof value === 'object' && value !== null) {
			for (const k of Object.keys(value)) {
				value[k] = parseValue(value[k], options);
			}
		} else {
			ret[key] = parseValue(value, options);
		}
	}

	if (options.sort === false) {
		return ret;
	}

	return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
		const value = ret[key];
		if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
			// Sort object keys, not values
			result[key] = keysSorter(value);
		} else {
			result[key] = value;
		}

		return result;
	}, Object.create(null));
}

exports.extract = extract;
exports.parse = parse;

exports.stringify = (object, options) => {
	if (!object) {
		return '';
	}

	options = Object.assign({
		encode: true,
		strict: true,
		arrayFormat: 'none',
		arrayFormatSeparator: ','
	}, options);

	validateArrayFormatSeparator(options.arrayFormatSeparator);

	const shouldFilter = key => (
		(options.skipNull && isNullOrUndefined(object[key])) ||
		(options.skipEmptyString && object[key] === '')
	);

	const formatter = encoderForArrayFormat(options);

	const objectCopy = {};

	for (const key of Object.keys(object)) {
		if (!shouldFilter(key)) {
			objectCopy[key] = object[key];
		}
	}

	const keys = Object.keys(objectCopy);

	if (options.sort !== false) {
		keys.sort(options.sort);
	}

	return keys.map(key => {
		const value = object[key];

		if (value === undefined) {
			return '';
		}

		if (value === null) {
			return encode(key, options);
		}

		if (Array.isArray(value)) {
			return value
				.reduce(formatter(key), [])
				.join('&');
		}

		return encode(key, options) + '=' + encode(value, options);
	}).filter(x => x.length > 0).join('&');
};

exports.parseUrl = (url, options) => {
	options = Object.assign({
		decode: true
	}, options);

	const [url_, hash] = splitOnFirst(url, '#');

	return Object.assign(
		{
			url: url_.split('?')[0] || '',
			query: parse(extract(url), options)
		},
		options && options.parseFragmentIdentifier && hash ? {fragmentIdentifier: decode(hash, options)} : {}
	);
};

exports.stringifyUrl = (object, options) => {
	options = Object.assign({
		encode: true,
		strict: true
	}, options);

	const url = removeHash(object.url).split('?')[0] || '';
	const queryFromUrl = exports.extract(object.url);
	const parsedQueryFromUrl = exports.parse(queryFromUrl, {sort: false});

	const query = Object.assign(parsedQueryFromUrl, object.query);
	let queryString = exports.stringify(query, options);
	if (queryString) {
		queryString = `?${queryString}`;
	}

	let hash = getHash(object.url);
	if (object.fragmentIdentifier) {
		hash = `#${encode(object.fragmentIdentifier, options)}`;
	}

	return `${url}${queryString}${hash}`;
};
});

var getMAC$1 = promisify(address_1.mac);
var title = '@atxm/metrics';
function addCommandListener(eventName, options) {
    return __awaiter(this, void 0, void 0, function () {
        var filteredCommands;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCommands()];
                case 1:
                    filteredCommands = _a.sent();
                    atom.commands.onDidDispatch(function (event) {
                        var command = event.type;
                        if (filteredCommands.includes(command)) {
                            emit(eventName, {
                                category: options.categories['commands'],
                                action: command
                            });
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function addConfigurationListener(eventName, options) {
    return __awaiter(this, void 0, void 0, function () {
        var packageName, configuration;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getPackageName()];
                case 1:
                    packageName = _a.sent();
                    return [4 /*yield*/, getConfiguration()];
                case 2:
                    configuration = _a.sent();
                    configuration.map(function (configKey) {
                        var configName = packageName + "." + configKey;
                        atom.config.onDidChange(configName, function (_a) {
                            var newValue = _a.newValue;
                            var configSchema = atom.config.getSchema(configName);
                            if (configSchema['type'] && (configSchema['type'] === 'string' || configSchema['type'] === 'array')) {
                                return;
                            }
                            emit(eventName, {
                                category: options.categories['configuration'],
                                action: configName,
                                value: String(newValue)
                            });
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function emit(eventName, payload) {
    var customEvent = new CustomEvent(eventName, {
        detail: payload
    });
    log(title + ": Dispatching event", payload);
    window.dispatchEvent(customEvent);
}
function getClientID(randomID) {
    if (randomID === void 0) { randomID = false; }
    return __awaiter(this, void 0, void 0, function () {
        var macAddress, _a, clientID;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!randomID) return [3 /*break*/, 1];
                    _a = null;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, getMAC$1()];
                case 2:
                    _a = (_b.sent()) || null;
                    _b.label = 3;
                case 3:
                    macAddress = _a;
                    clientID = macAddress
                        ? uuidFromString(macAddress)
                        : v4();
                    if (macAddress) {
                        log(title + ": Created client ID '" + clientID + "' from MAC address");
                    }
                    else {
                        log(title + ": Created client ID '" + clientID + "' from UUID");
                    }
                    return [2 /*return*/, clientID];
            }
        });
    });
}
function getCommands() {
    return __awaiter(this, void 0, void 0, function () {
        var packageName, registeredCommands;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getPackageName()];
                case 1:
                    packageName = _a.sent();
                    registeredCommands = Object.keys(atom.commands.registeredCommands);
                    return [2 /*return*/, registeredCommands.filter(function (registeredCommand) { return packageName && registeredCommand.startsWith(packageName + ":"); })];
            }
        });
    });
}
function getIP(options) {
    {
        var ipRegexOptions = {
            exact: true
        };
        return ipRegex(ipRegexOptions).test(options.ipOverride) || ipRegex.v6(ipRegexOptions).test(options.ipOverride)
            ? options.ipOverride
            : '127.0.0.1';
    }
}
function getConfiguration() {
    return __awaiter(this, void 0, void 0, function () {
        var packageName, config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getPackageName()];
                case 1:
                    packageName = _a.sent();
                    config = atom.config.get(packageName);
                    dotObject.keepArray = true;
                    return [2 /*return*/, Object.keys(dotObject.dot(config)) || []];
            }
        });
    });
}
function getNamespace() {
    return uuidFromString('https://www.npmjs.com/package/@atxm/metrics');
}
function getPackageName() {
    return __awaiter(this, void 0, void 0, function () {
        var callerPath, packageDirPaths, intersection, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    callerPath = callerCallsite().getFileName();
                    packageDirPaths = atom.packages.getPackageDirPaths();
                    intersection = packageDirPaths.filter(function (packageDirPath) {
                        return callerPath.startsWith(packageDirPath);
                    });
                    if (!(intersection === null || intersection === void 0 ? void 0 : intersection.length)) return [3 /*break*/, 3];
                    _a = callerPath
                        .replace(intersection[0], '')
                        .split(sep)
                        .filter(function (fragment) { return fragment; })[0];
                    if (_a) return [3 /*break*/, 2];
                    _b = 'pkg.';
                    return [4 /*yield*/, getShortHash(__filename, { length: 8 })];
                case 1:
                    _a = _b + (_d.sent());
                    _d.label = 2;
                case 2: return [2 /*return*/, _a];
                case 3:
                    _c = 'pkg.';
                    return [4 /*yield*/, getShortHash(__filename, { length: 8 })];
                case 4: return [2 /*return*/, _c + (_d.sent())];
            }
        });
    });
}
function getShortHash(inputString, userOptions) {
    if (userOptions === void 0) { userOptions = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = __assign({ algorithm: 'sha256', length: 16 }, userOptions);
                    return [4 /*yield*/, hasha_1.async(inputString, {
                            algorithm: options.algorithm
                        })];
                case 1: return [2 /*return*/, (_a.sent()).substring(0, options.length)];
            }
        });
    });
}
function getUserAgent() {
    return atom.getAppName() + " v" + atom.getVersion() + " (" + atom.getReleaseChannel() + ")";
}
function getWindowDimensions() {
    return atom.getWindowDimensions().width + "x" + atom.getWindowDimensions().height;
}
function isValidConfig(options) {
    var _a;
    if (((_a = options.consentSetting) === null || _a === void 0 ? void 0 : _a.length) && atom.config.get(options.consentSetting) !== true) {
        log(title + ": No consent given by the user, aborting tracking");
        return false;
    }
    if (atom.inDevMode() && options.trackInDevMode !== true) {
        log(title + ": Tracking has not been enabled for Developer Mode, aborting");
        return false;
    }
    if (atom.inSpecMode() && !options.trackInSpecMode !== true) {
        log(title + ": Tracking has not been enabled for Spec Mode, aborting");
        return false;
    }
    return true;
}
function postRequest(baseURL, urlParams, dryRun) {
    if (dryRun === void 0) { dryRun = false; }
    return __awaiter(this, void 0, void 0, function () {
        var urlParamsEncoded, requestURL, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    urlParamsEncoded = queryString.stringify(urlParams);
                    requestURL = baseURL + "?" + urlParamsEncoded;
                    log(title + ": Sending post request to " + requestURL);
                    if (!(dryRun !== true)) return [3 /*break*/, 2];
                    return [4 /*yield*/, window.fetch(requestURL, {
                            method: 'POST'
                        })];
                case 1:
                    response = _a.sent();
                    log(title + ": Fetch response", response);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function uuidFromString(inputString) {
    return v5(inputString, getNamespace());
}

var eventName = uuidFromString(title + ":GoogleAnalytics");
var Analytics = ({
    clientID: '',
    trackingID: '',
    trackerURL: 'https://www.google-analytics.com/collect',
    options: {
        categories: {
            commands: 'Atom Commands',
            configuration: 'Atom Configuration'
        },
        tracking: {
            commands: true,
            configuration: true
        },
        // Anonymization Options
        ipOverride: false,
        randomClientID: false
    },
    init: function (trackingID, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.options = __assign(__assign(__assign({}, this.options), options), { categories: __assign(__assign({}, this.options.categories), options.categories), tracking: __assign(__assign({}, this.options.tracking), options.tracking) });
                        if (!isValidConfig(this.options)) {
                            return [2 /*return*/];
                        }
                        this.trackingID = trackingID;
                        if (!this.options.muted) {
                            this.listen();
                        }
                        if (!this.options.tracking['commands']) return [3 /*break*/, 2];
                        return [4 /*yield*/, addCommandListener(eventName, this.options)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this.options.tracking['configuration']) return [3 /*break*/, 4];
                        return [4 /*yield*/, addConfigurationListener(eventName, this.options)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    listen: function () {
        log(title + ": Adding event listener");
        window.addEventListener(eventName, this.handler.bind(this));
    },
    mute: function () {
        log(title + ": Removing event listener");
        window.removeEventListener(eventName, this.handler.bind(this));
    },
    handler: function (_a) {
        var detail = _a.detail;
        return __awaiter(this, void 0, void 0, function () {
            var category, action, label, value, defaultParams, urlParams;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!detail.category || !detail.action) {
                            throw 'Event Tracking requires category and action';
                        }
                        category = detail.category, action = detail.action, label = detail.label, value = detail.value;
                        return [4 /*yield*/, this.defaultParams()];
                    case 1:
                        defaultParams = _b.sent();
                        urlParams = __assign(__assign({}, defaultParams), { ec: category.trim(), ea: action.trim() });
                        if (label === null || label === void 0 ? void 0 : label.trim().length) {
                            urlParams['el'] = label.trim();
                        }
                        if (value === null || value === void 0 ? void 0 : value.trim().length) {
                            urlParams['ev'] = value.trim();
                        }
                        if (this.options.ipOverride) {
                            urlParams['uip'] = getIP(this.options);
                        }
                        if (this.options.cacheBuster) {
                            urlParams['z'] = Date.now();
                        }
                        postRequest(this.trackerURL, Object.freeze(urlParams), this.options.dryRun);
                        return [2 /*return*/];
                }
            });
        });
    },
    defaultParams: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.clientID.length) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, getClientID(this.randomClientID)];
                    case 1:
                        _a.clientID = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, Object.freeze({
                            aip: 1,
                            cid: this.clientID,
                            ds: 'app',
                            t: 'event',
                            tid: this.trackingID,
                            ua: getUserAgent(),
                            v: 1,
                            vp: getWindowDimensions()
                        })];
                }
            });
        });
    },
    emit: function (payload) {
        emit(eventName, payload);
    }
});

var eventName$1 = uuidFromString(title + ":Matomo");
var Matomo = ({
    clientID: '',
    trackingID: '',
    trackerURL: '',
    options: {
        categories: {
            commands: 'Atom Commands',
            configuration: 'Atom Configuration'
        },
        tracking: {
            commands: true,
            configuration: true
        },
        // Anonymization Options
        randomClientID: false
    },
    init: function (trackerURL, trackingID, options) {
        if (trackingID === void 0) { trackingID = 1; }
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.options = __assign(__assign(__assign({}, this.options), options), { categories: __assign(__assign({}, this.options.categories), options.categories), tracking: __assign(__assign({}, this.options.tracking), options.tracking) });
                        if (!isValidConfig(this.options)) {
                            return [2 /*return*/];
                        }
                        this.trackerURL = trackerURL;
                        this.trackingID = String(trackingID);
                        if (!this.options.muted) {
                            this.listen();
                        }
                        if (!this.options.tracking['commands']) return [3 /*break*/, 2];
                        return [4 /*yield*/, addCommandListener(eventName$1, this.options)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this.options.tracking['configuration']) return [3 /*break*/, 4];
                        return [4 /*yield*/, addConfigurationListener(eventName$1, this.options)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    listen: function () {
        log(title + ": Adding event listener");
        window.addEventListener(eventName$1, this.handler.bind(this));
    },
    mute: function () {
        log(title + ": Removing event listener");
        window.removeEventListener(eventName$1, this.handler.bind(this));
    },
    handler: function (_a) {
        var detail = _a.detail;
        return __awaiter(this, void 0, void 0, function () {
            var category, action, label, value, defaultParams, urlParams;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!detail.category || !detail.action) {
                            throw 'Event Tracking requires category and action';
                        }
                        category = detail.category, action = detail.action, label = detail.label, value = detail.value;
                        return [4 /*yield*/, this.defaultParams()];
                    case 1:
                        defaultParams = _b.sent();
                        urlParams = __assign(__assign({}, defaultParams), { e_c: category.trim(), e_a: action.trim() });
                        if (label === null || label === void 0 ? void 0 : label.trim().length) {
                            urlParams['e_n'] = label.trim();
                        }
                        if (value === null || value === void 0 ? void 0 : value.trim().length) {
                            urlParams['e_v'] = value.trim();
                        }
                        if (this.options.cacheBuster) {
                            urlParams['rand'] = v4();
                        }
                        postRequest(this.trackerURL, Object.freeze(urlParams), this.options.dryRun);
                        return [2 /*return*/];
                }
            });
        });
    },
    defaultParams: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!!this.clientID.length) return [3 /*break*/, 3];
                        _a = this;
                        _b = getShortHash;
                        return [4 /*yield*/, getClientID(this.randomClientID)];
                    case 1: return [4 /*yield*/, _b.apply(void 0, [_c.sent()])];
                    case 2:
                        _a.clientID = _c.sent();
                        _c.label = 3;
                    case 3: return [2 /*return*/, Object.freeze({
                            _id: this.clientID,
                            apiv: 1,
                            idsite: this.trackingID,
                            rec: 1,
                            res: getWindowDimensions(),
                            ua: getUserAgent()
                        })];
                }
            });
        });
    },
    emit: function (payload) {
        emit(eventName$1, payload);
    }
});

export { Analytics, Matomo };
//# sourceMappingURL=index.js.map
