import express from 'express'
import React from 'react'
import Component from '../public/js/src/index/view'
import Tree from '../lib/tree'
import util from 'util'
import {resolve, relative} from 'path'

let cwd = process.cwd()
let rootTree = new Tree(cwd)

let router = express.Router()
let ok = {
    meta: {
        state: 0,
        message: 'ok'
    },
    data: null
}

let getHtmlByTree = (tree) => {
	let dataString = tree.toRelativeJson(cwd)
	let data = JSON.parse(dataString)
	let component = React.renderToString(React.createElement(Component, {tree: data}))
	return {
		component: component,
		initialData: JSON.stringify({tree: data})
	}
}

router.get('/', (req, res) => {
	let tree = new Tree(cwd)
	tree.readdir().then(() => {
		res.render('index', getHtmlByTree(tree))
	})
})

router.get(/.+/, (req, res, next) => {
	let url = req.url.replace(/^\//, '')
	rootTree.getProgeny(url).then((child) => {
		if (!child) {
			return next()
		}
		if (child.type === 'file') {
			return res.sendFile(child.path)
		}
		return child.readdir().then(() => {
			res.render('index', getHtmlByTree(child))
		})
	})
})

router.post('/', (req, res) => {


})


export default router
