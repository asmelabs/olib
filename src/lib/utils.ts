import { KEY_REGEX } from "./regexes";

export function parseKey(key: string): string {
	if (KEY_REGEX.test(key)) {
		return key.split("/")[2] ?? key;
	}

	return key;
}
