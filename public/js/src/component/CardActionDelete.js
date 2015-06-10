import React from 'react'

export default class CardActionDelete extends React.Component {
	cancel() {
		this.props.off()
	}
	confirm() {
		this.props.action()
	}
	render() {
		return (<div className="card-action" key={this.props.key}>
					<ul className="nav nav-list pull-left">
						<li onClick={this.confirm.bind(this)}>
							<a href="javascript:void(0)"><span className="icon icon-check text-blue"></span>&nbsp;<span className="text-blue">OK</span></a>
						</li>
						<li onClick={this.cancel.bind(this)}>
							<a data-dismiss="tile" href="javascript:void(0)"><span className="icon icon-close"></span>&nbsp;Cancel</a>
						</li>
					</ul>
				</div>)
	}
}