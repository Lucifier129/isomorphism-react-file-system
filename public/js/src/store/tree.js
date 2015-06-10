export default class Store {
	constructor(tree) {
		Object.assign(this, tree)
	}
	getChild(name) {
		if (!Array.isArray(this.children) || !this.children.length) {
			return null
		}
		for (let child of this.children) {
			if (child.name === name) {
				return child
			}
		}
		return null
	}
	getProgeny(path = '') {
		let names = path.split(/\/\\{2}/).filter((name) => !!name)
		let child
		while (names.length) {
			child = this.getChild(names.shift())
			if (child === null) {
				return child
			}
		}
		return child
	}
	removeChild(name) {
		if (!Array.isArray(this.children) || !this.children.length) {
			return
		}
		for (let i = 0, len = this.children.length; i < len; i += 1) {
			let child = this.children[i]
			if (child.name === name) {
				this.children.splice(i, 1)
			}
		}
	}
	removeProgeny(path = '') {
		let names = path.split(/\/\\{2}/).filter((name) => !!name)
		let parent = this.getProgeny(names.slice(0, names.length - 1).join('/'))
		if (parent) {
			new Store(parent).removeChild(names[names.length - 1])
		}
	}
	addChild(child) {
		if (this.type !== 'directory') {
			return
		}
		this.children.push(child)
	}
	addProgeny(path, progeny) {
		let parent = this.getProgeny(path)
		if (parent) {
			new Store(parent).addChild(progeny)
		}
	}
}