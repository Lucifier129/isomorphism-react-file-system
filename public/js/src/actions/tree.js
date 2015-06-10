import dispatcher from '../lib/dispatcher'
export default {
	del(path) {
		dispatcher.dispatch({
			type: 'del',
			path: path
		})
	}
}