const { Credentials } = require('../lib/index.js');

/** @type {Credentials} */
const credentials = {
	host: "",
	port: 22,
	protocol: "sftp",
	username: "",
	password: "",
};

const folders = {
	localFolder: '',
	remoteFolder: '',
};

module.exports = { credentials, folders };
