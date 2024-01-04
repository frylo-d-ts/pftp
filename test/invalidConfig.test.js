const process = require('process');
const { deploy } = require('../lib/index.js');
const { credentials } = require('./credentials.js');

async function main() {
	await deploy({
		...credentials,
		progress: 'invalid',
	});
}

main()
	.then(() => process.exit())
	.catch((error) => console.error(error));
