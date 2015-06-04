import fs from 'fs'
import {join, resolve, basename, sep} from 'path'

/**
 * 处理promise数组
 * @param {array<promise>} promiseList
 * @return {promise} reslove数组value的promise对象
 */
let handlePromiseList = (promiseList) => {
	if (!Array.isArray(promiseList)) {
		throw new Error(promiseList + ' is not Array type')
	}
	let len = promiseList.length
	if (len === 0) {
		return Promise.resolve([])
	} else if (len === 1) {
		return promiseList[0].then((result) => [result])
	} else if (len > 1) {
		return Promise.all(promiseList)
	}
}

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
            return handlePromiseList(pathList.map(stat))
            .then((statsList) => {
                let promiseList = statsList.map((stats, index) => {
                    return stats.isDirectory() ? rmdir(pathList[index]) : unlink(pathList[index])
                })
                return handlePromiseList(promiseList)
            })
        })
        .then(() => {
            fs.rmdir(path, (err) => {
                err ? reject(err) : resolve(path)
            })
        }).catch(reject)
    })
}

/**
* 根据path判断是文件还是文件夹类型
* @param {string} path
* @return {string} directory || file
*/
let isDir = (path) => {
    return stat(path).then((stats) => stats.isDirectory())
}


class Tree {

	/**
	* @param {string} path 路径
	* @param {string} name 名称
	* @param {string} [type] 类型
	*/
	constructor(path, type = 'directory') {
		Object.assign(this, {path, type})
        this.name = basename(path)
	}
    dirOnly(methodName = '') {
        if (this.type !== 'directory') {
            return Promise.reject(new Error(this.path + ' is not a directory. Error on Tree#' + methodName))
        } else {
            return Promise.resolve(this)
        }
    }
	readdir() {
        return this.dirOnly('readdir')
        .then(() => readdir(this.path))
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
			return handlePromiseList(list).then((statsList) => {
				this.children = statsList.map((stats, index) => {
					let type = stats.isDirectory() ? 'directory' : 'file'
					return new Tree(filePaths[index], type)
				})
				return this
			})
		})
	}
	readdirs() {
        return this.dirOnly('readdirs')
		.then(() => this.readdir())
        .then(() => {
			let list = []
			this.children.forEach((child) => {
				if (child.type === 'directory') {
					list.push(child.readdirs())
				}
			})
			return handlePromiseList(list)
		})
	}
    getChild(name) {
        return this.dirOnly('getChild')
        .then(() => {
            if (this.children) {
                for (let child of this.children) {
                    if (child.name === name) {
                        return Promise.resolve(child)
                    }
                }
                return Promise.reject(name + ' not found by Tree#getChild')
            }
            return this.readdir().then(() => this.getChild(name))
        })
    }
    getProgeny(path = '') {
        if (typeof path !== 'string' || !path) {
            return Promise.reject('Tree#getProgeny need a relative path, not ' + path)
        }
        path = resolve(this.path, path).replace(this.path, '')
        return this.dirOnly('getProgeny')
        .then(() => {
            let names = path.split(sep)
            let promise = Promise.resolve(this)
            while (names.length) {
                let name = names.shift()
                if (!name) {
                    continue
                }
                promise = promise.then((tree) => tree.getChild(name))
            }
            return promise
        })
    }
    stringify() {
        return JSON.stringify(this)
    }
    saveTo(path) {
        return writeFile(path, this.stringify())
    }
    readFile(path) {
        return this.type === 'file' ? readFile(this.path) : readFile(resolve(this.path, path))
    }
    addFile(path, data = '') {
        return this.dirOnly('addFile')
        then(() => writeFile(resolve(this.path, path), data))
    }
}


export default Tree