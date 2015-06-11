import React from 'react'
import Card01 from '../component/card01'

export default class View extends React.Component {
	breadcrumb() {
		let tree = this.props.tree
		let src = tree.path.split(/[\/\\{2}]/).filter((name) => !!name)
		src.unshift('Home')
		let max = src.length - 1
		let items = src.map((name, index, list) => {
			let isMax = index === max
			let className = ''
			let href = '/'
			if (isMax) {
				className = 'active'
				href = 'javascript:;'
			} else if (index > 0) {
				href = '/' + list.slice(1, index + 1).join('/')
			}
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
		let results = children.map((child, index) => {
			return <Card01 ref={'card' + index} tree={child} />
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