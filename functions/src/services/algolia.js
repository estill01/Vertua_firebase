import * as functions from 'firebase-functions'
import Algolia from 'algoliasearch'
import { createNodeHttpRequester } from '@algolia/requester-node-http'

// -------------------------------
// 	Core
// -------------------------------
const AlgoliaSearch = {}
AlgoliaSearch.client = Algolia(
//const client = Algolia(
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
	]
})

AlgoliaSearch.index.projects = AlgoliaSearch.client.initIndex('projects')
AlgoliaSearch.index.projects.setSettings({
	searchableAttributes: [
  	'name',
  	'description',
		'creator',
		'createdAt',
		'uid',
	]
})

async function _buildDocFromFirebaseRecord(record, searchIndex) {

	console.log("[_buildDocFromFirebaseRecord] START")
	
	const doc = {}
	const settings = await AlgoliaSearch.index[searchIndex].getSettings()
	const attrsArr = settings.searchableAttributes
	attrsArr.forEach((attr) => { 
		let arr = Object.values(record._fieldsProto[attr]) // array
		if (arr.length > 0 && arr.length < 2) { doc[attr] = arr[0] }
		else { doc[attr] = arr }
	})

	// _fieldsProto<Map<Map>> = {
	// 	key: { type: value },
	// 	key: { type: value },
	// }

	doc.objectID = record._fieldsProto.uid.stringValue

	// console.log("[_buildDocFromFirebaseRecord] record._fieldsProto:", record._fieldsProto)
	// console.log("[_buildDocFromFirebaseRecord] record._fieldsProto.uid:", record._fieldsProto.uid)
	// console.log("[_buildDocFromFirebaseRecord] settings:", settings)
	// console.log("[_buildDocFromFirebaseRecord] attrsArr:", attrsArr)
	// console.log("[_buildDocFromFirebaseRecord] doc: ", doc)
	// console.log("[_buildDocFromFirebaseRecord] doc.objectID: ", doc.objectID)

	console.log("[_buildDocFromFirebaseRecord] END")

	return doc
}

// -------------------------------
// 	Utils
// -------------------------------
AlgoliaSearch.addDocToIndex = async (doc, index) => {
	console.log("[addDocToIndex] START")
	console.log("[addDocToIndex] Using index:", AlgoliaSearch.index[index].indexName)
	console.log("[addDocToIndex] doc._fieldsProto:", doc._fieldsProto)
	console.log("[addDocToIndex] doc._fieldsProto.uid:", doc._fieldsProto.uid)
	console.log("[addDocToIndex] doc._fieldsProto.uid.stringValue:", doc._fieldsProto.uid.stringValue)

	doc = await _buildDocFromFirebaseRecord(doc,index)

	try {
		let result = await AlgoliaSearch.index[index].saveObject(doc)
		console.log("[addDocToIndex] result: ", result)
		console.log("[addDocToIndex] END")
	} 
	catch (err) {
		console.error(err)
		throw new Error("[AlgoliaSearch.addDocToIndex] ")
	}

	return result
}

AlgoliaSearch.removeIDFromIndex = async (id, index) => {
// async function removeIDFromIndex(id, index) {
	// TODO search to see if that id is in index?
	try {
		let result = await AlgoliaSearch.index[index].deleteObject(id)
	}
	catch (err) {
		console.error(err)
		throw new Error("[AlgoliaSearch.removeIDFromIndex]")
	}

	return result
	//return AlgoliaSearch.index[index].deleteObject(id)
}


export default AlgoliaSearch
