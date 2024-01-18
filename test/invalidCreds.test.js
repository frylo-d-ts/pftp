const process = require('process');
const { deploy } = require('../lib/index.js');
const { credentials, folders } = require('./credentials.js');

async function main() {
	await deploy({
		...credentials,
		...folders,

		username: 'no-such-user-exists',

		progress: 'bar',
	});
}

main()
	.then(() => process.exit())
	.catch((error) => console.error(error));
