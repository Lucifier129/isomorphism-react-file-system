import React from 'react'

export default class Card01 extends React.Component {
	constructor() {
		super()
		this.state = {
			open: false
		}
	}
	toggle() {
		this.setState({
			open: !this.state.open
		})
	}
	close() {
		if (this.state.open) {
			this.setState({
				open: false
			})
		}
	}
	render() {
		return (
			<div className="col-lg-3 col-md-4 col-sm-6">
				<div className="card card-blue lineBreak">
					<div className="card-main">
						<div className="card-inner">
							<p className="card-heading text-blue">{this.props.title}</p>
							{this.props.texts.map((text) => <p>text</p>)}
						</div>
						<div className="card-action">
							<ul className="nav nav-list pull-left">
								<li>
									<a href="javascript:void(0)"><span className="access-hide">Add</span><span className="icon icon-add"></span></a>
								</li>
								<li>
									<a href="javascript:void(0)"><span className="access-hide">Delete</span><span className="icon icon-delete"></span></a>
	                        	</li>
	                        	<li className={"dropdown " + (this.state.open ? 'open' : '')} onClick={this.toggle.bind(this)}>
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
	                    </div>
	                </div>
	            </div>
	        </div>)
	}
}