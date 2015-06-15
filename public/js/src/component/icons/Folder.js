import React from 'react'
import Icon from './Icon'

export default class Folder extends React.Component {
	render() {
		return <Icon {...this.props} type="icon-folder" name="Folder" />
	}
}