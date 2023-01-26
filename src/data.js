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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const fse = require('fs-extra');
class Data {
    constructor() {
        this.statusFile = './results/status.json';
        console.log(__dirname);
        this.verifyStatusFile();
    }
    updateStatus(value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.verifyStatusFile();
                let content = yield this.getContent();
                if (content[value.userName]) {
                    let numOfSuccess = content[value.userName].numOfSuccess;
                    numOfSuccess++;
                    content[value.userName].numOfSuccess = numOfSuccess;
                }
                else {
                    content[value.userName] = {
                        "name": value.userName,
                        "numOfSuccess": 1
                    };
                }
                this.saveToFile(content, this.statusFile);
            }
            catch (error) {
                console.log(`updateStatus ERORR - ${error}`);
            }
        });
    }
    getContent() {
        return __awaiter(this, void 0, void 0, function* () {
            // let filePath = this.statusFile;
            // Get content of the internalPass file
            // Return empty JSON {} if file does not exist or it's content can't be parsed
            let parsedJson = JSON.parse('{}');
            try {
                // specifying (utf8) encoding forces readFileSync to return string
                const dataStr = fs_1.default.readFileSync(this.statusFile, 'utf8');
                // Convert file content from string to JSON and back to string
                if (dataStr !== "" && dataStr !== "[]") {
                    parsedJson = JSON.parse(dataStr);
                }
            }
            catch (error) {
                console.log(`getContent: ${error}`);
            }
            return parsedJson;
        });
    }
    saveToFile(data, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            // Return 0 on success, 1 on failure.
            let status = 0;
            try {
                fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 4));
            }
            catch (error) {
                console.log(`saveToFile: ${error}`);
                status = 1;
            }
            return status;
        });
    }
    getSortedData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let statusContnet = yield this.getContent();
                //sort
                let sortedData = (yield this.sort(statusContnet)) || [];
                return sortedData;
            }
            catch (error) {
            }
        });
    }
    sort(jsonData) {
        return __awaiter(this, void 0, void 0, function* () {
            //Conver to Array and sort
            try {
                const arr = Object.keys(jsonData).map((key) => [key, jsonData[key]]);
                arr.sort(this.sortBySuccess);
                return arr;
            }
            catch (error) {
                console.log(`Sort ${error}`);
            }
        });
    }
    sortBySuccess(a, b) {
        try {
            let key = "numOfSuccess";
            return (b[1][key]) - (a[1][key]);
        }
        catch (error) {
            console.log(`sortBySuccess ${error}`);
            return -1;
        }
    }
    verifyStatusFile() {
        return __awaiter(this, void 0, void 0, function* () {
            this.statusFile = this.statusFile;
            try {
                yield fse.ensureFile(this.statusFile);
                console.log('success!');
            }
            catch (error) {
                console.log(`verifyStatusFile ERORR - ${error}`);
            }
        });
    }
}
exports.default = Data;
//# sourceMappingURL=data.js.map