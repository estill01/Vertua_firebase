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

// async function _buildDocFromFirebaseRecord(record, searchIndex) {
// 	console.log("[_buildDocFromFirebaseRecord] START")
// 	// console.log("doc: ", doc)
// 	
// 	// _fieldsProto<Map<Map>> = {
// 	// 	key: { type: value },
// 	// 	key: { type: value },
// 	// }
//
// 	throw new Error("TEMPORARY -- Need to revamp '_buildDocFromFirebaseRecord'")
//
// 	// -- TEMPORAR --
// 	// const doc = {}
// 	// const settings = await AlgoliaSearch.index[searchIndex].getSettings()
// 	// const attrsArr = union(settings.searchableAttributes, settings.attributesToRetrieve)
//   //
// 	// attrsArr.forEach((attr) => { 
// 	// 	let arr = Object.values(record._fieldsProto[attr]) 
// 	// 	if (arr.length > 0 && arr.length < 2) { doc[attr] = arr[0] }
// 	// 	else { doc[attr] = arr }
// 	// })
//   //
// 	// doc.objectID = record._fieldsProto.uid.stringValue
//   //
// 	// console.log("[_buildDocFromFirebaseRecord] END")
//   //
// 	// return doc
// }

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

// TODO Not working.
AlgoliaSearch.removeIdFromIndex = async (id, index) => {
	console.log("[AlgoliaSearch.removeIDFromIndex]")
	console.log("id: ", id)
	// id should be objectID ; so if it's not working maybe that's why.
	try {
		let result = await AlgoliaSearch.index[index].deleteObject(id)
		return result
	}
	catch (err) { throw new Error(err) }
}

export default AlgoliaSearch
