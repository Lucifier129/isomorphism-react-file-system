import React from 'react'
import Tile from '../component/Tile'
import Breadcrumb from '../component/Breadcrumb'

export default class View extends React.Component {
	render() {
		let tree = this.props.tree
		return (<div>
			<Breadcrumb path={tree.path} />
			<div className="tile-wrap">
			<Tile name="文件名" type="文件类型" lastModifyTime="最后修改时间" />
			{
				tree.children.map((child) => {
					return <Tile {...child} key={child.path} />
				})
			}
			</div>
			</div>)
	}
}

View.PropTypes = {
	tree: React.PropTypes.object.isRequired
}