import React from 'react'

export default class DropdownMenu extends React.Component {
	constructor() {
		super()
		this.onOuterClick = (e) => {
			let menu = React.findDOMNode(this.refs.dropdownMenu)
			if (!menu.contains(e.target)) {
				this.props.close()
			}
		}
	}
	addOuterClick() {
		this.removeOuterClick()
		document.addEventListener('click', this.onOuterClick, false)
	}
	removeOuterClick() {
		document.removeEventListener('click', this.onOuterClick, false)
	}
	componentDidMount() {
		this.isDidMount = true
	}
	componentWillUnmount() {
		this.removeOuterClick()
	}
	render() {
		if (this.isDidMount) {
			this.props.onOpening ? this.addOuterClick() : this.removeOuterClick()
		}
		let texts = this.props.texts
		return (<ul ref="dropdownMenu" className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
					<li>
						<a href="javascript:void(0)"><span className="icon icon-loop margin-right-half"></span>{texts[0]}</a>
					</li>
					<li>
						<a href="javascript:void(0)"><span className="icon icon-replay margin-right-half"></span>{texts[1]}</a>
					</li>
					<li>
						<a href="javascript:void(0)"><span className="icon icon-shuffle margin-right-half"></span>{texts[2]}</a>
					</li>
				</ul>)
	}
}