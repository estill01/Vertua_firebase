const { exec, execSync } = require('child_process')

let config
if (process.env.NODE_ENV === 'production') { 
	config = require('./config.production.js') } 
else { 
	config = require('./config.staging.js')
}

args = '' 
Object.entries(config).forEach((ns) => {
	Object.entries(ns[1]).forEach((arr) => {
		args += `${ns[0]}.${arr[0]}=${arr[1]} `
	})
})

// console.log(args)
// console.log(`firebase functions:config:set ${args}`)
exec(`firebase functions:config:set ${args}`)
