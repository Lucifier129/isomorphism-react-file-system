import React from 'react'
import Icon from './Icon'

export default class Download extends React.Component {
	render() {
		return <Icon {...this.props} type="icon-file-download" name="Download" />
	}
}