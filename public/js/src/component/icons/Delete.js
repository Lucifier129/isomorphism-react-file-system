import React from 'react'
import Icon from './Icon'

export default class Delete extends React.Component {
	render() {
		return <Icon {...this.props} type="icon-delete" name="Delete" />
	}
}