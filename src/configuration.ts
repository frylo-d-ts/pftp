import { z } from "zod";

export const CredentialsSchema = z.object({
	host: z.string(),
	port: z.number(),
	protocol: z.enum(["ftp", "sftp", "ssh"]),

	username: z.string(),
	password: z.string(),
});
export type Credentials = z.infer<typeof CredentialsSchema>;

export const CustomLftpOptionsSchema = z.object({
	lftpCommand: z.string().optional().default("lftp"),
	logLftpCommand: z.boolean().optional().default(false),

	beforeOpen: z
		.string()
		.optional()
		.default(
			"set net:timeout 5; set net:max-retries 3; set net:reconnect-interval-multiplier 1; set net:reconnect-interval-base 5"
		),
	openCommandOptions: z.string().optional().default(""),

	beforeMirror: z.string().optional().default(""),
	mirrorCommandOptions: z
		.string()
		.optional()
		.default(
			"--reverse --delete --only-newer --verbose=2 --ignore-time --parallel=10"
		),

	enableSsl: z.boolean().optional().default(false),
});
export type CustomLftpOptions = z.infer<typeof CustomLftpOptionsSchema>;

export const ConfigurationSchema = z
	.object({
		localFolder: z.string(),
		remoteFolder: z.string(),

		customLftpOptions: CustomLftpOptionsSchema.optional(),

		excludeRegExp: z
			.array(z.instanceof(RegExp))
			.optional()
			.default([]),

		progress: z.enum(["bar", "logs"]),
	})
	.merge(CredentialsSchema);
export type Configuration = z.infer<typeof ConfigurationSchema> & {
	/** Array of RegExp's in [Egrep](https://www.gnu.org/software/findutils/manual/html_node/find_html/posix_002degrep-regular-expression-syntax.html) format. */
	excludeRegExp: z.infer<typeof ConfigurationSchema>["excludeRegExp"];
};
