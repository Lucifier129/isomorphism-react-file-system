import Tree from '../lib/tree'
var tree = new Tree(process.cwd(), 'root')

tree.readdir().then(() => tree.saveTo('./test/readdir.json')).catch((err) => console.log(err))