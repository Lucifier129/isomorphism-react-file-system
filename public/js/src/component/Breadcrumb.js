import React from 'react'
export default class Breadcrumb extends React.Component {
	parsePath() {
		let path = this.props.path.trim()
		let src = path.split(/[\/\\{2}]/)
		let max = src.length - 1
		let href = ''
		let list = src.map((name, index, list) => {
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
	path: React.PropTypes.string
}