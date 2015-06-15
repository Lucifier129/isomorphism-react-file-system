import React from 'react'
import Icon from './Icon'

export default class File extends React.Component {
	render() {
		return <Icon {...this.props} type="icon-insert-drive-file" name="File" />
	}
}