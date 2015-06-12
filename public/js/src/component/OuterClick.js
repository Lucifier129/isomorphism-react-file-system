import React, {Component, PropTypes} from 'react'

export default class OuterClick extends Component {
	constructor() {
		super()
		this.state = {
			show: false
		}
		this.onOuterClick = (e) => {
			let menu = React.findDOMNode(this.refs.wrapper)
			if (!menu.contains(e.target)) {
				this.hide()
			}
		}
	}
	addOuterClick() {
		document.addEventListener('click', this.onOuterClick, false)
	}
	removeOuterClick() {
		document.removeEventListener('click', this.onOuterClick, false)
	}
	componentWillUnmount() {
		this.removeOuterClick()
	}
	show() {
		this.addOuterClick()
		this.setState({
			show: true
		})
	}
	hide() {
		this.removeOuterClick()
		this.setState({
			show: false
		})
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.hasOwnproperty(show)) {
			this.setState({
				show: nextProps.show
			})
		}
	}
	render() {
		let display = this.state.show ? 'block' : 'none'
		return (<div ref="wrapper" style={{display: display}} {...this.props} onClick={(e) => e.stopPropagation()}>{this.props.children}</div>)
	}
}

OuterClick.PropTypes = {
	className: PropTypes.string
}