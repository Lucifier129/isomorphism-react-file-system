import Tree from '../lib/tree'
import path from 'path'
var tree = new Tree(process.cwd())

// tree.readdir().then(() => {
// 	return tree.getProgeny('node_modules/express/lib/router/index.js')
// 	.then((index) => {
// 		return tree.getProgeny('test')
// 		.then((test) => {
// 			return test.addFile('test_addFile.json', tree.json())
// 		})
// 	})
// }).catch((err) => console.log(err))

// tree.addFile('test/tree1.json')


tree.readdir()
.then(() => tree.saveTo('./test/tree.json'))