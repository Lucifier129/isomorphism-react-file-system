import Tree from '../lib/tree'
var tree = new Tree(process.cwd())

tree.readdir().then(() => {
	return tree.getProgeny('node_modules/express/lib')
	.then((subTree) => subTree.saveTo('./test/readdir.json'))
}).catch((err) => console.log(err))