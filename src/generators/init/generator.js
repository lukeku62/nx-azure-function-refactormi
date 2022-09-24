"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.azureFunctionInitSchematic = exports.azureFunctionInitGenerator = void 0;
var devkit_1 = require("@nrwl/devkit");
var path_1 = require("path");
var versions_1 = require("../../versions");
function updateAzureProjectConfiguration(host, options) {
    var projectConfiguration = (0, devkit_1.readProjectConfiguration)(host, options.projectName);
    if (projectConfiguration.targets == null) {
        projectConfiguration.targets = {};
    }
    projectConfiguration.targets['serve'] = {
        executor: '@nx-azure-function:serve',
        options: {
            buildTarget: 'build'
        }
    };
    if (projectConfiguration.targets['build'] != null) {
        if (projectConfiguration.targets['build'].options != null) {
            projectConfiguration.targets['build'].options.generatePackageJson = true;
            if (projectConfiguration.targets['build'].options.assets == null) {
                projectConfiguration.targets['build'].options.assets = [];
            }
            projectConfiguration.targets['build'].options.assets = __spreadArray(__spreadArray([], projectConfiguration.targets['build'].options.assets, true), [
                (0, path_1.join)('apps', options.projectName, 'src', '.funcignore'),
                (0, path_1.join)('apps', options.projectName, 'src', 'local.settings.json'),
                (0, path_1.join)('apps', options.projectName, 'src', 'host.json'),
            ], false);
            projectConfiguration.targets['build'].options.assets = projectConfiguration.targets['build'].options.assets.filter(
            // @ts-ignore
            function (asset, i) { return projectConfiguration.targets['build'].options.assets.indexOf(asset) === i; });
        }
    }
    (0, devkit_1.updateProjectConfiguration)(host, options.projectName, projectConfiguration);
}
function azureFunctionInitGenerator(host, options) {
    return __awaiter(this, void 0, void 0, function () {
        var installTask;
        return __generator(this, function (_a) {
            installTask = (0, devkit_1.addDependenciesToPackageJson)(host, {
                '@azure/functions': versions_1.AZURE_FUNCTIONS_VERSION
            }, {
                'azure-functions-core-tools': versions_1.AZURE_FUNCTIONS_CORE_TOOLS_VERSION
            });
            updateAzureProjectConfiguration(host, options);
            (0, devkit_1.generateFiles)(host, (0, path_1.join)(__dirname, 'files'), (0, path_1.join)('apps', options.projectName, 'src'), {});
            return [2 /*return*/, installTask];
        });
    });
}
exports.azureFunctionInitGenerator = azureFunctionInitGenerator;
exports["default"] = azureFunctionInitGenerator;
exports.azureFunctionInitSchematic = (0, devkit_1.convertNxGenerator)(azureFunctionInitGenerator);
