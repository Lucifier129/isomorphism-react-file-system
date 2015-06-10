import React from 'react'
import View from './view'
import Store from '../store/tree'
import dispatcher from '../lib/dispatcher'
import request from 'superagent'

class App {
	constructor(View, Store) {
		let data = this.getInitialData()
		this.Store = Store
		this.store = new Store(data.tree)
		this.View = View
	}
	init() {
		this.render()
		this.register()
	}
	fetch(url = '/tree', options = {}) {
		Object.assign({
			method: 'get',
			data: null
		}, options)
		return new Promise((resolve, reject) => {
			request[options.method](url)
			.send(options.data)
			.end((err, res) => {
				if (err) {
					return reject(err)
				}
				resolve(res.body)
			})
		}).then(JSON.parse)
	}
	post(data) {
		return this.fetch('/tree', {
			method: 'post',
			data: data
		})
	}
	del(data) {
		return this.fetch('/tree', {
			method: 'del',
			data: data
		})
	}
	getInitialData() {
		let initialDataDOM = document.getElementById('initialData')
		let initialData = JSON.parse(initialDataDOM.innerHTML)
		initialDataDOM.parentNode.removeChild(initialDataDOM)
		return initialData
	}
	register() {
		dispatcher.register((action) => {
			switch (action.type) {
				case 'del':
					this.store.removeProgeny(action.path)
					this.render()
					this.del({
						root: this.store.path || '/',
						path: action.path
					}).then((tree) => {
						console.log(tree)
						this.store = new this.Store(tree)
						this.render()
					})
					break
			}
		})
	}
	render() {
		React.render(<View tree={this.store} />, document.getElementById('container'))
	}
}

new App(View, Store).init()