import React from 'react'
import Card01 from '../component/card01'

export default class View extends React.Component {
	render() {
		return <Card01 {...this.props} />
	}
}