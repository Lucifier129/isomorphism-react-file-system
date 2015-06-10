import React from 'react'
import CardActionDefault from './CardActionDefault'
import actions from '../actions/tree'

export default class Card01 extends React.Component {
	render() {
		let tree = this.props.tree
		return (<div className="col-lg-3 col-md-4 col-sm-6" key={tree.path}>
					<div className="card card-blue lineBreak">
						<div className="card-main">
							<div className="card-inner">
								<p className="card-heading text-blue">{tree.name}</p>
								<p>type: {tree.type}</p>
								<p>path: {tree.path}</p>
							</div>
							<CardActionDefault tree={tree} del={actions.del} />
						</div>
					</div>
				</div>)
	}
}