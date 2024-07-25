const process = require('process');
const { deploy } = require('../lib/index.js');
const { credentials, folders } = require('./credentials.js');

async function main() {
	await deploy({
		...credentials,
		...folders,

		progress: 'bar',

		excludeRegExp: [
			/^static\//,
			/^_\//,
			/^_next\//,
			/^images\//,
			/^svg\//,
			/^fonts\//,
		],

		includeForceRegExp: [
			/index\.html$/,
		],

		customLftpOptions: {
			logLftpCommand: true,
		},
	});
}

main()
	.then(() => process.exit())
	.catch((error) => console.error(error));
