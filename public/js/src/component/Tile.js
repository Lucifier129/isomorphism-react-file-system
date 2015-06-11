import React from 'react'
import Icon from './icon/index'

export default class Tile extends React.Component {
	tileAction() {
		let type = this.props.type
		let iconList = []
		if (type === '文件类型') {
			iconList.push(<Icon.Add onClick={this.props.add} />)
		} else {
			iconList.push(<Icon.Download onClick={this.props.download} />)
		}
		iconList.push(<Icon.Delete onClick={this.props.delete} />)
		iconList.push(<Icon.Settings onClick={this.props.settings} />)
		return (<div className="tile-action tile-action-show">
					<ul className="nav nav-list pull-right">{iconList.map((icon) => <li>{icon}</li>)}</ul>
				</div>)
	}
	tileSide() {
		let className = ['avatar', 'avatar-sm']
		let icon
		switch (this.props.type) {
			case '文件类型':
				icon = <Icon.Cloud />
				className.push('avatar-blue')
				break
			case 'directory':
				icon = <Icon.Folder />
				className.push('avatar-red')
				break
			case 'file':
				icon = <Icon.File />
				className.push('avatar-alt')
				break
		}
		return (<div className="pull-left tile-side">
					<div className={className.join(' ')}>{icon}</div>
				</div>)
	}
	render() {
		return (<div className="tile">
					{this.tileSide()}
					{this.tileAction()}
					<div className="tile-inner">
						<span className="text-overflow doc-name">{this.props.name}</span>
						<span className="text-overflow doc-type">{this.props.type}</span>
						<span className="text-overflow doc-time">{this.props.lastModifyTime}</span>
					</div>
				</div>)
	}
}

Tile.defaultProps = {
	name: '文件名',
	type: '文件类型',
	lastModifyTime: '最后修改时间'
}

Tile.PropTypes = {
	name: React.PropTypes.string,
	type: React.PropTypes.string,
	lastModifyTime: React.PropTypes.string
}