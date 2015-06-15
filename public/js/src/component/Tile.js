import React from 'react'
import Icon from './icons/index'

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
					<ul className="nav nav-list pull-right">{iconList.map((icon, index) => <li key={index}>{icon}</li>)}</ul>
				</div>)
	}
	tileSide() {
		let props = this.props
		let className = ['avatar', 'avatar-sm']
		let target = props.type === 'file' ? '_blank' : '_self'
		let path = props.path
		let icon
		switch (props.type) {
			case '文件类型':
				icon = <Icon.Cloud href={path} target={target} />
				className.push('avatar-blue')
				break
			case 'directory':
				icon = <Icon.Folder href={path} target={target} />
				className.push('avatar-red')
				break
			case 'file':
				icon = <Icon.File href={path} target={target} />
				className.push('avatar-alt')
				break
		}
		return (<div className="pull-left tile-side">
					<div className={className.join(' ')}>{icon}</div>
				</div>)
	}
	render() {
		let props = this.props
		let target = props.type === 'file' ? '_blank' : '_self'
		return (<div className="tile">
					{this.tileSide()}
					{this.tileAction()}
					<div className="tile-inner">
						<a className="text-overflow doc-name" href={props.path} target={target}>{props.name}</a>
						<span className="text-overflow doc-type">{props.mime || props.type}</span>
						<span className="text-overflow doc-time">{props.lastModifyTime}</span>
					</div>
				</div>)
	}
}

Tile.defaultProps = {
	lastModifyTime: '--'
}

Tile.PropTypes = {
	name: React.PropTypes.string.isRequired,
	type: React.PropTypes.string.isRequired,
	lastModifyTime: React.PropTypes.string
}