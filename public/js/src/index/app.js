import React from 'react'
import View from './view'

class App {
	constructor(View) {
		this.View = View
		this.render(this.getInitialData())
	}
	getInitialData() {
		let initialDataDOM = document.getElementById('initialData')
		let initialData = JSON.parse(initialDataDOM.innerHTML)
		initialDataDOM.parentNode.removeChild(initialDataDOM)
		return initialData
	}
	render(data) {
		React.render(<View {...data} />, document.getElementById('container'))
	}
}

new App(View)