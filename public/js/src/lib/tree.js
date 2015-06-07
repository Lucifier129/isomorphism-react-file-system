import request from 'superagent'

const sep = /[\/\\{2}]/

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
    fetch(type, url, data = null) {
    	return new Promise((resolve, reject) => {
    		request[type](url).send(data)
    		.end((err, res) => {
    			err ? reject(err) : resolve(res)
    		})
    	})
    }
    get handler() {
		return '/tree'
	}
    post(data = null) {
    	return this.fetch('post', this.handler, data)
    }
    get(data = null) {
    	return this.fetch('get', this.handler, data)
    }
    patch(data = null) {
    	return this.fetch('patch', this.handler, data)
    }
    del(data = null) {
    	return this.fetch('del', this.handler, data)
    }
    put(data = null) {
    	return this.fetch('put', this.handler, data)
    }
}

class Document extends Meta {
	constructor(path, name) {
		super()
		this.path = path
		this.name = name
	}
	empty() {
		return this.proxyPromise('empty', () => this.post({
			path: this.path,
			action: 'empty'
		}))
	}
	remove() {
		return this.proxyPromise('remove', () => this.delete({
			path: this.path
		}))
	}
	copyTo(path) {
		return this.proxyPromise('copyTo' + path, () => this.post({
			path: this.path,
			action: 'copyTo',
			destPath: path
		}))
	}
	rename(newName) {
		return this.proxyPromise('rename' + newName, () => this.patch({
			path: this.path,
			action: 'rename',
			newName: newName
		}))
	}
}


class File extends Document {
	constructor(path, name) {
		super(path, name)
		this.type = 'file'
	}
	read() {
		return this.proxyPromise('read', () => this.post({
			path: this.path,
			action: 'read'
		}))
	}
	write(data) {
		if (!data) {
			return Promise.resolve()
		}
		return this.proxyPromise('write' + data, () => this.put({
			path: this.path,
			action: 'write',
			data: data
		}))
	}
}

class Directory extends Document {
	constructor(path, name) {
		super(path, name)
		this.type = 'directory'
	}
	readdir() {
		return this.proxyPromise('readdir', () => this.post({
			path: this.path,
			action: 'readdir'
		}))
	}
	readdirs() {
		return this.proxyPromise('readdirs', () => this.post({
			path: this.path,
			action: 'readdirs'
		}))
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
    			return Pormise.resolve(this.search(name))
    		}
    		return this.readdir().then(() => this.search(name))
    	})
    }
    getProgeny(path) {
        path = path.replace(/^\.[\\\/]/, '')
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
    	return this.proxyPromise('addFile' + filename, () => this.post({
    		path: this.path,
    		action: 'addFile',
    		filename: filename,
    		data: data
    	}))
    }
    removeFile(filename) {
    	return this.proxyPromise('removeFile' + filename, () => this.post({
    		path: this.path,
    		action: 'removeFile',
    		filename: filename
    	}))
    }
    addDir(dirname) {
    	return this.proxyPromise('addDir' + dirname, () => this.post({
    		path: this.path,
    		action: 'addDir',
    		dirname: dirname
    	}))
    }
    removeDir(dirname) {
    	return this.proxyPromise('removeDir' + dirname, () => this.post({
    		path: this.path,
    		action: 'removeDir',
    		dirname: dirname
    	}))
    }
}

export default Directory