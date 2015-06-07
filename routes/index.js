import express from 'express'

let router = express.Router()
let ok = {
	meta: {
		state: 0,
		message: 'ok'
	},
	data: null
}

router.post('/', (res, req) => {
	let body = res.body
	
})


export default router