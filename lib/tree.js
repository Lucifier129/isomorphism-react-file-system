import fs from 'fs'
import {join, resolve, isAbsolute, basename, extname, dirname, sep} from 'path'

/**
 * 获取目录下的所有文件
 * @param {string} path
 * @return {promise} resolve files || reject error
 */
let readdir = (path) => {
	return new Promise((resolve, reject) => {
		fs.readdir(path, (err, files) => {
			err ? reject(err) : resolve(files)
		})
	})
}

/**
* 将data写入文件
* @param {string} path 路径
* @param {data} data
* @return {promise} resolve path || reject error
*/
let writeFile = (path, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            err ? reject(err) : resolve(path)
        })
    })
}

/**
* 读取文件数据
* @param {string} path 路径
* @return {promise} resolve data || reject error
*/
let readFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            err ? reject(err) : resolve(data)
        })
    })
}

/**
* 判断path是否存在
* @param {string} path 路径
* @return {promise} resolve exists
*/
let exists = (path) => {
    return new Promise((resolve) => fs.exists(path, resolve))
}

/**
* 删除文件
* @param {string} path 路径
* @return {promise} resolve path || reject error
*/
let unlink = (path) => {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            err ? reject(err) : resolve(path)
        })
    })
}


/**
* 重命名文件或文件夹
* @param {string} oldName
* @param {string} newName
* @return {promise} resolve newName || reject error
*/
let rename = (oldName, newName) => {
    return new Promise((resolve, reject) => {
        fs.rename(oldName, newName, (err) => {
            err ? reject(err) : resolve(newName)
        })
    })
}

/**
* 获取文件属性
* @param {string} path
* @return {promise} resolve stats || reject error
*/
let stat = (path) => {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            err ? reject(err) : resolve(stats)
        })
    })
}


/**
* 创建单个文件夹
* @param {string} path
* @return {promise} resolve path || reject error
*/
let mkdir = (path) => {
    return new Promise((resolve, reject) => {
        exists(path).then((exists) => {
            if (!exists) {
                return false
            }
            return stat(path).then((stats) => stats.isDirectory())
        }).then((exists) => {
            if (exists) {
                return resolve(path)
            }
            fs.mkdir(path, (err) => {
                err ? reject(err) : resolve(path)
            })
        }).catch(reject)
    })
}


/**
* 创建链式文件夹
* @param {string} path
* @return {promise} resolve path || reject error
*/
let mkdirs = (path) => {
    let promise = Promise.resolve(path)
    let src = path.split(sep)
    let max = src.length - 1
    let index = 0
    while (index <= max) {
    	let subPath = ['/'].concat(src.slice(0, ++index))
        promise = promise.then(() => mkdir(join(...subPath)))
    }
    return promise
}

/**
* 复制文件
*/
let copy = (srcPath, destPath) => {
    return readFile(srcPath).then((data) => writeFile(destPath, data))
}

/**
* 复制文件夹
*/
let copyDir = (srcPath, destPath) => {
    return mkdirs(destPath)
    .then(() => {
        return readdir(srcPath)
        .then((files) => {
            let promises = files.map((file) => {
                return stat(join(srcPath, file))
            })
            return Promise.all(promises)
            .then((statsList) => {
                let promises = statsList.map((stats, index) => {
                    let targetPath = join(destPath, files[index])
                    let sourcePath = join(srcPath, files[index])
                    if (stats.isDirectory()) {
                        return mkdirs(targetPath).then(() => copyDir(sourcePath, targetPath))
                    } else {
                        return copy(sourcePath, targetPath)
                    }
                })
                return Promise.all(promises)
            })
        })
    })
}


/**
* 删除文件夹
* @param {string} path
* @return {promise} resolve path || reject error
*/
let rmdir = (path) => {
    return new Promise((resolve, reject) => {
        readdir(path).then((files) => {
            if (!files.length) {
                return
            }
            let pathList = files.map((filename) => join(path, filename))
            return Promise.all(pathList.map(stat))
            .then((statsList) => {
                let promiseList = statsList.map((stats, index) => {
                    return stats.isDirectory() ? rmdir(pathList[index]) : unlink(pathList[index])
                })
                return Promise.all(promiseList)
            })
        })
        .then(() => {
            fs.rmdir(path, (err) => {
                err ? reject(err) : resolve(path)
            })
        }).catch(reject)
    })
}

class Meta {
    define(prop, descriptor) {
        if (typeof prop === 'object') {
            Object.defineProperties(this, prop)
        } else {
            Object.defineProperty(this, prop, descriptor)
        }
        return this
    }
    proxyPromise(promiseName, createPromise, ...args) {
        let prop = promiseName + '$$'
        let promise = this[prop]
        if (promise) {
            return promise
        }
        promise = createPromise(...args)
        promise.then(() => delete this[prop])
        this.define(prop, {
            value: promise,
            enumerable: false,
            writable: false
        })
        return promise
    }
    json() {
        return JSON.stringify(this)
    }
}


class Document extends Meta {
    constructor(path) {
        super(path)
        this.path = path
        this.name = basename(path)
    }
    get dirname() {
        return dirname(this.path)
    }
    get extname() {
        return extname(this.path)
    }
    exists() {
        return exists(this.path)
    }
    stat() {
        return stat(this.path)
    }
    rename(newName) {
        return rename(this.path, this.path.replace(basename(this.path), newName))
    }
    saveTo(path) {
        if (isAbsolute(path)) {
            return writeFile(path, this.json())
        }
        return writeFile(resolve(this.path, path), this.json())
    }
}

class File extends Document {
    constructor(path) {
        super(path)
        this.type = 'file'
    }
    read() {
        return this.proxyPromise('read', readFile, this.path)
    }
    write(data = '') {
        return this.proxyPromise('write', writeFile, data)
    }
    empty() {
        return this.write()
    }
    remove() {
        return this.proxyPromise('remove', unlink, this.path)
    }
    copyTo(path) {
        path = resolve(this.dirname, path)
        return this.proxyPromise('copyTo', copy, this.path, path)
    }
}


class Directory extends Document {
    constructor(path) {
        super(path)
        this.type = 'directory'
    }
    remove() {
        return this.proxyPromise('remove', rmdir, this.path)
    }
    empty() {
        return this.remove().then(() => mkdirs(this.path))
    }
    copyTo(path) {
        path = resolve(this.dirname, path)
        return this.proxyPromise('copyTo' + path, copyDir, this.path, path)
    }
    readdir() {
        return this.proxyPromise('readdir', () => {
            return readdir(this.path)
            .then((files) => {
                if (files.length === 0) {
                    this.children = []
                    return this
                }
                let filePaths = []
                let list = files.map((file) => {
                    let filePath = join(this.path, file)
                    filePaths.push(filePath)
                    return stat(filePath)
                })
                return Promise.all(list).then((statsList) => {
                    this.children = statsList.map((stats, index) => {
                        return stats.isDirectory() ?
                        new Directory(filePaths[index]) :
                        new File(filePaths[index])
                    })
                    return this
                })
            })
        })
    }
    readdirs() {
        return this.proxyPromise('readdirs', () => {
            return this.readdir()
            .then(() => {
                let list = []
                this.children.forEach((child) => {
                    if (child.type === 'directory') {
                        list.push(child.readdirs())
                    }
                })
                return Promise.all(list)
            })
            .then(() => this)
        })
    }
    search(name) {
        for (let child of this.children) {
            if (child.name === name) {
                return child
            }
        }
    }
    getChild(name) {
        return this.proxyPromise('getChild' + name, () => {
            if (this.children) {
                return Promise.resolve(this.search(name))
            }
            return this.readdir().then(() => this.search(name))
        })
    }
    getProgeny(path) {
        path = resolve(this.path, path).replace(this.path, '')
        return this.proxyPromise('getProgeny' + path, () => {
            let names = path.split(sep)
            let promise = Promise.resolve(this)
            while (names.length) {
                let name = names.shift()
                if (!name) {
                    continue
                }
                promise = promise.then((directory) => directory.getChild(name))
            }
            return promise
        })
    }
    addFile(filename, data = '') {
        let path = resolve(this.path, filename)
        return this.proxyPromise('addFile' + path, () => {
            return this.addDir(dirname(path))
            .then(() => writeFile(path, data))
        }, data)
    }
    removeFile(filename) {
        return this.proxyPromise('removeFile' + filename, () => {
            return this.getProgeny(filename)
            .then((file) => file && file.remove())
        })
    }
    addDir(dirname) {
        return this.proxyPromise('addDir' + dirname, () => mkdirs(resolve(this.path, dirname)))
    }
    removeDir(dirname) {
        return this.proxyPromise('removeDir' + dirname, () => {
            return this.getProgeny(dirname)
            .then((directory) => directory && directory.remove())
        })
    }
}

export default Directory