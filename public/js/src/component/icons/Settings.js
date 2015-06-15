import React from 'react'
import Icon from './Icon'

export default class Settings extends React.Component {
	render() {
		return <Icon {...this.props} type="icon-settings" name="Settings" />
	}
}