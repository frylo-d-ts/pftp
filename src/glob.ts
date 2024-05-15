import { globSync } from "glob";

export function listNestedDirs(
	absPathToRootFolder: string,
	excludeRegExp: RegExp[]
) {
	const fullList = globSync("**/", {
		cwd: absPathToRootFolder,
		realpath: true,
	});

	const excludeRegExpEgrep = excludeRegExp.map(
		(regExp) => new RegExp(regExp.source.replace(/\\\/$/, "(\\/|$)"))
	);

	const result = fullList.filter((folderName) => {
		const isExcluded = excludeRegExpEgrep.some((regExp) =>
			regExp.test(folderName)
		);

		return !isExcluded;
	});

	return result.filter((path) => path !== ".");
}
