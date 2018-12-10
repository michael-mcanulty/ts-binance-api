"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Entry {
    isDirectory() {
        return (this.mode & 61440) === 16384;
    }
    constructor(basePath, mode, mtime, relativePath, size) {
        this.basePath = basePath;
        this.mode = mode;
        this.mtime = mtime;
        this.relativePath = relativePath;
        this.size = size;
    }
}
exports.Entry = Entry;
//# sourceMappingURL=Entry.js.map