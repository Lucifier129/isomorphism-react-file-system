#!/usr/bin/env node
var child_process = require('child_process')
var path = require('path')
var cwd = process
var babel = path.resolve(__dirname, './node_modules/babel/bin/babel-node')
var www = path.resolve(__dirname, './bin/www')
var command = ['node', babel, www].join(' ')

var child = child_process.exec(command, function(err) {
	console.log(err ? err : 'done')
})

child.on('error', function(err) {
	console.log(err)
})

child.on('exit', function(data) {
	console.log('exit', data)
})

child.on('close', function(data) {
	console.log('close', data)
})

child.stdout.on('data', function(data) {
	console.log('stdout', data)
})

child.stderr.on('data', function(data) {
	console.log('stderr', data)
})