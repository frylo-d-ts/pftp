const process = require('process');
const { deploy } = require('../lib/index.js');
const { credentials, folders } = require('./credentials.js');

async function main() {
	await deploy({
		...credentials,
		...folders,

		progress: "bar",

		customLftpOptions: {
			lftpCommand: "lftp-invalid",
		},
	});
}

main()
	.then(() => process.exit())
	.catch((error) => console.error(error));
