import * as functions from 'firebase-functions'
import Algolia from 'algoliasearch'
import { createNodeHttpRequester } from '@algolia/requester-node-http'
import { union } from 'lodash'

// -------------------------------
// 	Core
// -------------------------------
const AlgoliaSearch = {}
AlgoliaSearch.client = Algolia(
	functions.config().algolia.app_id,
	functions.config().algolia.admin_key,
	{ requester: createNodeHttpRequester() }
)


// -------------------------------
// 	Indexes
// -------------------------------
AlgoliaSearch.index = {}
AlgoliaSearch.index.users = AlgoliaSearch.client.initIndex('users')
AlgoliaSearch.index.users.setSettings({
	searchableAttributes: [
  	'displayName',
		'createdAt',
  	'uid',
	],
	attributesToRetrieve: [
  	'displayName',
		'createdAt',
  	'uid',
		'photoURL',
	],
})

AlgoliaSearch.index.projects = AlgoliaSearch.client.initIndex('projects')
AlgoliaSearch.index.projects.setSettings({
	searchableAttributes: [
  	'name',
  	'description',
		'creator',
		'createdAt',
		'uid',
	],
	attributesToRetrieve: [
  	'name',
  	'description',
		'creator',
		'createdAt',
		'uid',
	],

})

// -------------------------------
// 	Utils
// -------------------------------
AlgoliaSearch.addDocToIndex = async (doc, index) => {
	doc.objectID = doc.uid

	console.log("[AlgoliaSearch.addDocToIndex]")
	console.log("index arg: ", index)
	console.log("using index:", AlgoliaSearch.index[index].indexName)
	console.log("doc:", doc)

	try {
		let result = await AlgoliaSearch.index[index].saveObject(doc)
		console.log("result: ", result)
		return result
	}
	catch (err) { throw new Error(err) }
}

AlgoliaSearch.removeIdFromIndex = async (id, index) => {
	console.log("[AlgoliaSearch.removeIDFromIndex]")
	console.log("id: ", id)
	try {
		let result = await AlgoliaSearch.index[index].deleteObject(id)
		return result
	}
	catch (err) { throw new Error(err) }
}

export default AlgoliaSearch
