import React, {Component, PropTypes} from 'react'
export default class Breadcrumb extends Component {
	parsePath() {
		let path = this.props.path
		if (typeof path === 'string') {
			path = path.trim().split(/[\/\\{2}]/)
		}
		let max = path.length - 1
		let href = ''
		let list = path.map((name, index, list) => {
			let className
			href += '/' + name
			if (index === max) {
				className = 'active'
				href = 'javascript:;'
			}
			return (
				<li className={className}>
					<a href={href} >{name || 'Home'}</a>
				</li>
				)
		})
		return list
	}
	render() {
		return <ul className="breadcrumb">{this.parsePath()}</ul>
	}
}

Breadcrumb.propTypes = {
	path: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired
}