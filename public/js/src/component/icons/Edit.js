import React from 'react'
import Icon from './Icon'

export default class Edit extends React.Component {
	render() {
		return <Icon {...this.props} type="icon-mode-edit" name="Edit" />
	}
}