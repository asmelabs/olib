import type {
	CoverKeyType,
	CoverResource,
	CoverSize,
} from "../schemas/cover-schema";

class UrlBuilder {
	private readonly baseUrl = "https://covers.openlibrary.org";

	private _key: string | number;
	private _keyType: CoverKeyType = "id";
	private _size: CoverSize = "M";
	private _resource: CoverResource;

	static create(resource: CoverResource, key: string | number): UrlBuilder {
		return new UrlBuilder(resource, key);
	}

	private constructor(resource: CoverResource, key: string | number) {
		this._resource = resource;
		this._key = key;
	}

	type(keyType: CoverKeyType): UrlBuilder {
		this._keyType = keyType;
		return this;
	}

	size(size: CoverSize): UrlBuilder {
		this._size = size;
		return this;
	}

	build(): string | null {
		if (!this._key) {
			console.error("Key is required");
			return null;
		}

		return `${this.baseUrl}/${this._resource}/${this._keyType}/${this._key}-${this._size}.jpg`;
	}
}

export class CoverModule {
	static create(): CoverModule {
		return new CoverModule();
	}

	private constructor() {}

	author(key: string | number): UrlBuilder {
		return UrlBuilder.create("a", key);
	}

	book(key: string | number): UrlBuilder {
		return UrlBuilder.create("b", key);
	}
}
