import express from 'express'
import React from 'react'
import Component from '../public/js/src/index/view'
import Tree from '../lib/tree'
import util from 'util'
import {resolve, relative} from 'path'

let cwd = process.cwd()

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
	}).catch((err) => {
		console.log(err)
		res.send(util.inspect(err))
	})
})

router.get(/.+/, (req, res, next) => {
	let url = decodeURI(req.url.replace(/^\//, ''))
	new Tree(cwd).getProgeny(url).then((child) => {
		if (!child) {
			return next()
		}
		if (child.type === 'file') {
			return res.sendFile(child.path)
		}
		return child.readdir().then(() => {
			res.render('index', getHtmlByTree(child))
		})
	}).catch((err) => {
		console.log(err)
		res.send(util.inspect(err))
	})
})

router.delete('/tree', (req, res) => {
	let rootTree = new Tree(cwd)
	let body = req.body
	rootTree.getProgeny('.' + body.path)
	.then((progeny) => progeny.remove())
	.then(() =>  body.root === '/' ? new Tree(cwd) : rootTree.getProgeny('.' + body.root))
	.then((target) => target.readdir())
	.then((target) => res.json(target.toRelativeJson(cwd)))
	.catch((err) => {
		console.log(err)
		res.send(util.inspect(err))
	})
})


export default router
