'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var developer_console_1 = require("@atxmtx/developer-console");
var address_1 = require("address");
var uuid_1 = require("uuid");
var query_string_1 = __importDefault(require("query-string"));
var wildcard_1 = __importDefault(require("wildcard"));
var Metrics = /** @class */ (function () {
    function Metrics(trackingID, options) {
        if (options === void 0) { options = {}; }
        var _a, _b;
        this.options = { commandCategory: 'Package Command' };
        this.title = '@atxmtx/metrics';
        this.options = __assign(__assign({}, this.options), options);
        if (((_a = this.options.consentSetting) === null || _a === void 0 ? void 0 : _a.length) && atom.config.get(this.options.consentSetting) !== true) {
            developer_console_1.log(this.title + ": No consent given by the user, aborting tracking");
            return;
        }
        this.trackingID = trackingID;
        this.clientID = this.getClientID();
        if (!this.options.muted) {
            this.listen();
        }
        if ((_b = this.options.commandAction) === null || _b === void 0 ? void 0 : _b.length) {
            this.commandListener(this.options.commandAction);
        }
    }
    Metrics.prototype.listen = function () {
        developer_console_1.log(this.title + ": Adding event listener");
        global.addEventListener(this.title, this.handler.bind(this));
    };
    Metrics.prototype.mute = function () {
        developer_console_1.log(this.title + ": Removing event listener");
        global.removeEventListener(this.title, this.handler.bind(this));
    };
    Metrics.prototype.event = function (payload) {
        var customEvent = new CustomEvent(this.title, {
            detail: payload
        });
        developer_console_1.log(this.title + ": Dispatching event to Google Analytics", payload);
        global.dispatchEvent(customEvent);
    };
    Metrics.prototype.handler = function (event) {
        if (!event.detail.category || !event.detail.action) {
            throw 'Event Tracking requires category and action';
        }
        var _a = event.detail, category = _a.category, action = _a.action, label = _a.label, value = _a.value;
        var defaultParams = this.defaultParams();
        var urlParams = __assign(__assign({}, this.defaultParams()), { ec: category.trim(), ea: action.trim() });
        if (label && label.trim().length) {
            urlParams['el'] = label.trim();
        }
        if (value && value.trim().length) {
            urlParams['ev'] = value.trim();
        }
        if (this.options.cacheBuster) {
            urlParams['z'] = Date.now();
        }
        this.sendEvent(urlParams);
    };
    Metrics.prototype.commandListener = function (commands) {
        var _this = this;
        var filteredCommands = this.getCommands(commands);
        developer_console_1.log(this.title + ": Adding event listener for commands:", filteredCommands);
        filteredCommands.map(function (command) {
            global.addEventListener(command, function () {
                _this.event({
                    category: _this.options.commandCategory,
                    action: command
                });
            });
        });
    };
    Metrics.prototype.sendEvent = function (urlParams) {
        return __awaiter(this, void 0, void 0, function () {
            var urlParamsEncoded, requestURL, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        urlParamsEncoded = query_string_1.default.stringify(urlParams);
                        requestURL = "https://www.google-analytics.com/collect?" + urlParamsEncoded;
                        developer_console_1.log(this.title + ": Sending request to " + requestURL);
                        return [4 /*yield*/, global.fetch(requestURL, {
                                method: 'POST'
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Metrics.prototype.defaultParams = function () {
        return {
            aip: '1',
            cid: this.clientID,
            ds: 'app',
            t: 'event',
            tid: this.trackingID,
            // @ts-ignore
            ua: atom.getAppName() + " v" + atom.getVersion() + " (" + atom.getReleaseChannel() + ")",
            v: '1',
            // @ts-ignore
            vp: atom.getWindowDimensions().width + "x" + atom.getWindowDimensions().height
        };
    };
    Metrics.prototype.getCommands = function (commands) {
        commands = typeof commands === 'string' ? [commands] : commands;
        // @ts-ignore
        var registeredCommands = Object.keys(atom.commands.registeredCommands);
        var filteredCommands = [];
        commands.forEach(function (command) {
            var filtered = wildcard_1.default(command, registeredCommands);
            filteredCommands.push.apply(filteredCommands, filtered);
        });
        return filteredCommands;
    };
    Metrics.prototype.getMacAddress = function () {
        var macAddress = address_1.mac(function (error, data) { return error ? null : data.toString(); });
        if (macAddress !== null)
            developer_console_1.log(this.title + ": Detected MAC address '" + macAddress + "'");
        return macAddress;
    };
    Metrics.prototype.getClientID = function () {
        var macAddress = this.getMacAddress();
        var clientID = macAddress
            ? crypto_1.createHash('sha1')
                .update(macAddress, 'utf8')
                .digest('hex')
                .toString()
            : uuid_1.v4();
        if (macAddress) {
            developer_console_1.log(this.title + ": Created client ID '" + clientID + "' from MAC address");
        }
        else {
            developer_console_1.log(this.title + ": Created client ID '" + clientID + "' from UUID");
        }
        return clientID;
    };
    return Metrics;
}());
exports.default = Metrics;
//# sourceMappingURL=index.js.map