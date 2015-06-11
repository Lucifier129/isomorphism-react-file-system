import React from 'react'
import OuterClick from './OuterClick'

export default class Modal extends React.Component {
	comfirm() {
		this.props.action(true)
		this.cancel()
	}
	cancel() {
		this.refs.OuterClick.hide()
	}
	render() {
		return (<OuterClick ref="OuterClick" className="modal" show={this.props.show}>
					<div class="modal-dialog modal-xs">
						<div class="modal-content">
							<div class="modal-heading">
								<a class="modal-close" data-dismiss="modal" onClick={this.cancel.bind(this)}>×</a>
								<h2 class="modal-title">{this.props.title}</h2>
							</div>
							<div class="modal-inner">
								<p><strong>{this.props.children}</strong></p>
							</div>
							<div class="modal-footer">
								<p class="text-right">
									<button class="btn btn-flat btn-alt" data-dismiss="modal" type="button" onClick={this.cancel.bind(this)}>Close</button>
									<button class="btn btn-flat btn-alt" data-dismiss="modal" type="button" onClick={this.comfirm.bind(this)}>OK</button>
								</p>
							</div>
						</div>
					</div>
			</OuterClick>)
	}
}

Modal.defaultProps = {
	action: new Function(),
	show: false
}

Modal.propTypes = {
	show: React.PropTypes.boolean,
	action: React.PropTypes.function
}