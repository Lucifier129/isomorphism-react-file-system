import React, {Component, PropTypes} from 'react'

export default class Icon extends Component {
	render() {
		let {name, type} = this.props
		let other = Object.assign({}, this.props)
		//如此难看，是因为bable-loader不给力，还不支持{name, type, ...other} = this.props
		delete other.name
		delete other.type
		return (<a target={this.props.target}{...other}>
					<span className="access-hide">{name}</span>
					<span className={['icon', type].join(' ')}></span>
				</a>)
	}
}

Icon.defaultProps = {
	name: 'Icon',
	href: 'javascript:;',
	target: '_self'
}

Icon.propTypes = {
	type: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired
}