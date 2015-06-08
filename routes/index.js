import express from 'express'
import React from 'react'
import Component from '../public/js/src/index/view'
import Tree from '../lib/tree'
import util from 'util'
import {resolve, relative} from 'path'

let cwd = process.cwd()
let tree = new Tree(cwd)

let router = express.Router()
let ok = {
    meta: {
        state: 0,
        message: 'ok'
    },
    data: null
}

let data ={
	title: 'test title',
	texts: ['abcd', 'efgh']
}

router.get('/', (req, res) => {
	res.render('index', {
		component: React.renderToString(React.createElement(Component, data)),
		initialData: JSON.stringify(data)
	})
})

router.get(/.+/, (req, res, next) => {
	let url = req.url.replace(/^\//, '')
	tree.getProgeny(url).then((child) => {
		if (!child) {
			return next()
		}
		if (child.type === 'file') {
			return res.sendFile(child.path)
		}
		let promise = Promise.resolve()
		if (!child.children) {
			promise = child.readdir()
		}
		promise.then(() => res.send(child.toRelativeJson()))
	})
})

router.post('/', (req, res) => {


})


export default router
