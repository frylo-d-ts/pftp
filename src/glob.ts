import { globSync } from "glob";

export function listNestedDirs(absPathToRootFolder: string) {
	return globSync("**/", { cwd: absPathToRootFolder, realpath: true });
}
