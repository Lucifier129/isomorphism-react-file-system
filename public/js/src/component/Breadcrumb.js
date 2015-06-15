import React, {Component, PropTypes} from 'react'
export default class Breadcrumb extends Component {
	parsePath() {
		let path = this.props.path
		if (typeof path === 'string') {
			path = path.trim().split(/[\/\\]+/)
		}
		let max = path.length - 1
		let list = path.map((name, index, list) => {
			if (!name) {
				return null
			}
			let className
			let href = 'javascript:;'
			if (index === max) {
				className = 'active'
			} else {
				href = list.slice(0, index + 1).join('/')
			}
			return (
				<li className={className} key={href}>
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