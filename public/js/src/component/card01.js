import React from 'react'

export default class Card01 extends React.Component {
	constructor() {
		super()
		this.state = {
			open: false,
			onDelete: false
		}
	}
	open() {
		let onOuterClick = (e) => {
			let menu = React.findDOMNode(this.refs.dropdown)
			if (!menu.contains(e.target)) {
				this.close()
			}
		}
		document.addEventListener('click', onOuterClick, false)
		this.onOuterClick = onOuterClick
		this.setState({
			open: true
		})
	}
	close() {
		document.removeEventListener('click', this.onOuterClick, false)
		this.setState({
			open: false
		})
	}
	toggle() {
		this.state.open ? this.close() : this.open()
	}
	onDelete() {
		this.setState({
			onDelete: true
		})
	}
	cancelDelete() {
		this.setState({
			onDelete: false
		})
	}
	confirmDelete() {
		this.cancelDelete()
	}
	cardActionOnDelete() {
		return (<div className="card-action" key={this.props.key + 'cardActionOnDelete'}>
					<ul className="nav nav-list pull-left">
						<li onClick={this.confirmDelete.bind(this)}>
							<a href="javascript:void(0)"><span className="icon icon-check text-blue"></span>&nbsp;<span className="text-blue">OK</span></a>
						</li>
						<li onClick={this.cancelDelete.bind(this)}>
							<a data-dismiss="tile" href="javascript:void(0)"><span className="icon icon-close"></span>&nbsp;Cancel</a>
						</li>
					</ul>
				</div>)
	}
	cardActionOnDefault() {
		let tree = this.props.tree
		return (<div className="card-action" key={this.props.key + 'cardActionOnDefault'}>
					<ul className="nav nav-list pull-left">
						<li>
							<a href={tree.path} target={tree.type === 'directory' ? '_self' : '_blank'}><span className="access-hide">Add</span><span className="icon icon-add"></span></a>
						</li>
						<li onClick={this.onDelete.bind(this)}>
							<a href="javascript:void(0)"><span className="access-hide">Delete</span><span className="icon icon-delete"></span></a>
						</li>
						<li ref="dropdown" className={"dropdown " + (this.state.open ? 'open' : '')} onClick={this.toggle.bind(this)}>
							<a className="dropdown-toggle" data-toggle="dropdown"><span className="access-hide">Edit</span><span className="icon icon-settings"></span></a>
							<ul className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
								<li>
									<a href="javascript:void(0)"><span className="icon icon-loop margin-right-half"></span>&nbsp;Lorem Ipsum</a>
								</li>
								<li>
									<a href="javascript:void(0)"><span className="icon icon-replay margin-right-half"></span>&nbsp;Consectetur Adipiscing</a>
								</li>
								<li>
									<a href="javascript:void(0)"><span className="icon icon-shuffle margin-right-half"></span>&nbsp;Sed Ornare</a>
								</li>
							</ul>
						</li>
					</ul>
				</div>)
	}
	render() {
		let tree = this.props.tree
		let cardAction = this.state.onDelete ? this.cardActionOnDelete() : this.cardActionOnDefault()
		return (
			<div className="col-lg-3 col-md-4 col-sm-6" key={this.props.key}>
				<div className="card card-blue lineBreak">
					<div className="card-main">
						<div className="card-inner">
							<p className="card-heading text-blue">{tree.name}</p>
							<p>type: {tree.type}</p>
							<p>path: {tree.path}</p>
						</div>
						{cardAction}
					</div>
				</div>
			</div>)
	}
}