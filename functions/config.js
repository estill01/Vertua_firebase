const config = require('dotenv').config().parsed
const { exec, execSync } = require('child_process')

console.log("---- ENV VARS ----")
console.log(config)
console.log(process.env.NODE_ENV)

args = '' 
Object.entries(config).forEach((arr) => {
	args += `${process.env.NODE_ENV}.${arr[0].toLowerCase()}=${arr[1]} `
})

// console.log(args)
exec(`firebase functions:config:set ${args}`)

// run this before building (optionally)
// config.js (?)
//

// copy stage specific env vars to base env file in npm script
// load env vars
// populate fireabse.config vars


