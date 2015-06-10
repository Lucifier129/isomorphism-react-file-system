import React from 'react'
import DropdownMenu from './DropdownMenu'
import CardActionDelete from './CardActionDelete'

export default class CardActionDefault extends React.Component {
	constructor(){
		super()
		this.state = {
			onOpening: false,
			onDelete: false
		}
	}
	onDelete() {
		this.setState({
			onDelete: true
		})
	}
	offDelete() {
		this.setState({
			onDelete: false
		})
	}
	onToggle() {
		this.setState({
			onOpening: !this.state.onOpening
		})
	}
	render() {
		let tree = this.props.tree
		let texts = ['abc', 'def', 'ghi']
		if (this.state.onDelete) {
			return <CardActionDelete action={() => this.props.del(tree.path)} off={this.offDelete.bind(this)} key={tree.path + 'onDelete'} />
		}
		let className = this.state.onOpening ? 'dropdown open' : 'dropdown'
		return (<div className="card-action" key={tree.path + ' onDefault'}>
					<ul className="nav nav-list pull-left">
						<li>
							<a href={tree.path} target={tree.type === 'directory' ? '_self' : '_blank'}><span className="access-hide">Add</span><span className="icon icon-add"></span></a>
						</li>
						<li onClick={this.onDelete.bind(this)}>
							<a href="javascript:void(0)"><span className="access-hide">Delete</span><span className="icon icon-delete"></span></a>
						</li>
						<li className={className} onClick={this.onToggle.bind(this)}>
							<a className="dropdown-toggle" data-toggle="dropdown"><span className="access-hide">Edit</span><span className="icon icon-settings"></span></a>
							<DropdownMenu onOpening={this.state.onOpening} close={this.onToggle.bind(this)} texts={texts} />
						</li>
					</ul>
				</div>)
	}
}