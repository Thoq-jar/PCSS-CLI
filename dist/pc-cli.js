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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
System.register("aqua.std", [], function (exports_1, context_1) {
    "use strict";
    var colors, styles, fn, imprt, nline, print, printc, string;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            // @ts-ignore
            exports_1("colors", colors = { reset: "\x1b[0m", red: "\x1b[31m", yellow: "\x1b[33m", blue: "\x1b[34m", green: "\x1b[32m", cyan: "\x1b[36m", magenta: "\x1b[35m", white: "\x1b[37m", black: "\x1b[30m", normal: "\x1b[39m", });
            exports_1("styles", styles = { bold: "\x1b[1m", underline: "\x1b[4m", reverse: "\x1b[7m", normal: "\x1b[22m", });
            exports_1("fn", fn = function (func) { return func; });
            exports_1("imprt", imprt = fn(function (modulePath) { return context_1.import(modulePath); }));
            exports_1("nline", nline = fn(function () { return console.log(""); }));
            exports_1("print", print = fn(function (msg) { return console.log("".concat(msg)); }));
            exports_1("printc", printc = fn(function (style, color, msg) { return console.log("".concat(style).concat(color).concat(msg).concat(colors.reset)); }));
            exports_1("string", string = fn(function (value) { return value.toString(); }));
        }
    };
});
System.register("main", ["node:fs", "node:path", "node:https", "node:process", "node:child_process", "aqua.std"], function (exports_2, context_2) {
    "use strict";
    var fs, path, https, node_process_1, node_child_process_1, std, pcssUrl, commands, newUsage;
    var __moduleName = context_2 && context_2.id;
    function getNpmVersion() {
        try {
            return node_child_process_1.execSync('npm -v').toString().trim() + ' npm';
        }
        catch (error) {
            console.error('Error fetching npm version:', error);
            return 'unknown';
        }
    }
    function about() {
        return __awaiter(this, void 0, void 0, function () {
            var info, logo;
            return __generator(this, function (_a) {
                info = [
                    '\n',
                    'PCSS CLI: v1.0.0',
                    "Node: ".concat(process.version),
                    "Package manager: ".concat(getNpmVersion()),
                    "Arch: ".concat(process.arch),
                    "Platform: ".concat(process.platform),
                    'Help: ',
                    "Enter one of these: ".concat(commands.toString()),
                    'Type "pcss version" to show this message',
                ];
                logo = "\n.______     ______     _______.     _______.     ______  __       __  \n|   _  \\   /      |   /       |    /       |    /      ||  |     |  | \n|  |_)  | |  ,----'  |   (----`   |   (----`   |  ,----'|  |     |  | \n|   ___/  |  |        \\   \\        \\   \\       |  |     |  |     |  | \n|  |      |  `----.----)   |   .----)   |      |  `----.|  `----.|  | \n| _|       \\______|_______/    |_______/        \\______||_______||__| \n";
                std.printc(std.styles.normal, std.colors.magenta, logo);
                info.forEach(function (sentence) { return std.printc(std.styles.normal, std.colors.blue, sentence); });
                return [2 /*return*/];
            });
        });
    }
    function downloadFile(url, dest) {
        return new Promise(function (resolve, reject) {
            var file = fs.createWriteStream(dest);
            https.get(url, function (response) {
                if (response.statusCode !== 200) {
                    reject(new Error("Failed to get '".concat(url, "' (").concat(response.statusCode, ")")));
                    return;
                }
                response.pipe(file);
                file.on('finish', function () {
                    file.close(resolve);
                });
            }).on('error', function (err) {
                fs.unlink(dest, function () { return reject(err); });
            });
        });
    }
    function createIndexHtml(filePath) {
        var htmlContent = "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>PCSS Starter</title>\n    <script src=\"./.pcss/pcss.min.js\"></script>\n</head>\n<body>\n    <h1>PCSS Starter template</h1>\n</body>\n</html>";
        fs.writeFileSync(filePath, htmlContent);
    }
    function main() {
        return __awaiter(this, void 0, void 0, function () {
            var command, projectName, projectDir, pcssDir, pcssFilePath, indexHtmlPath, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = node_process_1.argv[2];
                        projectName = node_process_1.argv[3];
                        if (command === 'version' ||
                            command === 'about' ||
                            command === 'info' ||
                            command === 'help') {
                            about().then(function () { return process.exit(0); });
                        }
                        else if (command === 'new' && !projectName) {
                            std.printc(std.styles.bold, std.colors.red, newUsage);
                            process.exit(1);
                        }
                        else {
                            std.printc(std.styles.bold, std.colors.red, "Unknown command/usage: ".concat(command, ", for help type \"pcss help\""));
                            process.exit(1);
                        }
                        projectDir = path.join(__dirname, projectName);
                        pcssDir = path.join(projectDir, '.pcss');
                        pcssFilePath = path.join(pcssDir, 'pcss.min.js');
                        indexHtmlPath = path.join(projectDir, 'index.html');
                        if (!fs.existsSync(projectDir)) {
                            fs.mkdirSync(projectDir);
                        }
                        if (!fs.existsSync(pcssDir)) {
                            fs.mkdirSync(pcssDir);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, downloadFile(pcssUrl, pcssFilePath)];
                    case 2:
                        _a.sent();
                        createIndexHtml(indexHtmlPath);
                        console.log("Files downloaded and index.html created successfully in ".concat(projectName, "."));
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error:', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    return {
        setters: [
            function (fs_1) {
                fs = fs_1;
            },
            function (path_1) {
                path = path_1;
            },
            function (https_1) {
                https = https_1;
            },
            function (node_process_1_1) {
                node_process_1 = node_process_1_1;
            },
            function (node_child_process_1_1) {
                node_child_process_1 = node_child_process_1_1;
            },
            function (std_1) {
                std = std_1;
            }
        ],
        execute: function () {
            pcssUrl = 'https://raw.githubusercontent.com/Thoq-jar/PCSS/master/.pcss/pcss.min.js';
            commands = ['version', 'about', 'info', 'help', 'new'];
            newUsage = "Usage: pcss new { project name }";
            main().then(function () { });
        }
    };
});
