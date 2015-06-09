import React from 'react'
import Card01 from '../component/card01'

export default class View extends React.Component {
	breadcrumb() {
		let tree = this.props.tree
		let src = tree.path.split(/[\/\\{2}]/)
		let max = src.length - 1
		let items = src.map((name, index, list) => {
			let isMax = index === max
			let className = isMax ? 'active' : ''
			let href = !isMax ? list.slice(0, index + 1).join('/') : 'javascript:;'
			return (
				<li className={className}>
					<a href={href} >{name}</a>
				</li>
				)
		})
		return items
	}
	card() {
		let children = this.props.tree.children
		let results = children.map((child) => {
			return <Card01 tree={child} key={child.path} />
		})
		return results
	}
	render() {
		return (
			<div>
				<ul className="breadcrumb">{this.breadcrumb()}</ul>
				<div>{this.card()}</div>
			</div>
			)
	}
}