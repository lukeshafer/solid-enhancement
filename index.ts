import { createRoot } from 'solid-js';
import { type SetStoreFunction, createStore } from 'solid-js/store';

export function defineElement(options: string, callback: DefinitionCallback<[]>): void;
export function defineElement<Attributes extends readonly string[]>(
	options: DefinitionOptions<Attributes>,
	callback: DefinitionCallback<Attributes>
): void;
export function defineElement<Attributes extends readonly string[] = []>(
	options: string | DefinitionOptions<Attributes>,
	callback: DefinitionCallback<Attributes>
) {
	throwIfNotInBrowser();

  // @ts-expect-error
	const { name: element_name, attributes: attribute_names } = parseOptions(options);

	customElements.define(
		element_name,
		class extends HTMLElement {
			private __setAttributeStore: SetStoreFunction<AttributeStore<Attributes>> | null = null;
			connectedCallback() {
				const root = this;

				createRoot(() => {
					const [attributesStore, setAttributesStore] = createStore<
						AttributeStore<Attributes>
					>({} as AttributeStore<Attributes>);
					this.__setAttributeStore = setAttributesStore;
					const attributes = new Proxy(attributesStore, {
						get(_, prop: keyof AttributeStore<Attributes>) {
							return attributesStore[prop] || root.getAttribute(prop);
						},
					});

					const $ = createSelector(root);
					const $$ = createMultiSelector(root);

					callback({ root, attributes, $, $$ });
				});
			}

			static get observedAttributes() {
				return attribute_names;
			}

			attributeChangedCallback(name: Attributes[number], oldValue: string, newValue: string) {
        // @ts-expect-error
				if (oldValue !== newValue) this.__setAttributeStore?.(name, newValue);
			}
		}
	);
}

function parseOptions(options: string): DefinitionOptions<[]>;
function parseOptions<A extends readonly string[]>(
	options: DefinitionOptions<A>
): DefinitionOptions<A>;
function parseOptions<A extends readonly string[] = []>(options: string | DefinitionOptions<A>) {
	if (typeof options === 'string') {
		return {
			name: options,
			attributes: [],
		};
	}

	return options;
}

function throwIfNotInBrowser() {
	if (!globalThis.window) throw new Error('Global Window is not defined in this environment.');
	if (!window.customElements)
		throw new Error('Custom Elements are not supported in this environment.');
}

function createSelector(node: ParentNode) {
	return $;

	function $<Selector extends keyof HTMLElementTagNameMap | (string & {})>(
		selector: Selector
	): Selector extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[Selector] : Element;
	function $<
		Selector extends keyof HTMLElementTagNameMap | (string & {}),
		Validator extends typeof HTMLElement,
	>(selector: Selector, validator: Validator): InstanceType<Validator>;
	function $<
		Selector extends keyof HTMLElementTagNameMap | (string & {}),
		Validator extends typeof HTMLElement,
	>(selectors: Selector, validator?: Validator) {
		const value = node.querySelector(selectors);
		if (!value) throw new Error('Invalid query');
		if (validator) {
			if (!(value instanceof validator))
				throw new Error(`Expected ${validator.name}, found ${value}`);
		}
		return value;
	}
}

function createMultiSelector(node: ParentNode) {
	return $$;

	function $$<Selector extends keyof HTMLElementTagNameMap | (string & {})>(
		selector: Selector
	): Selector extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[Selector] : Element;
	function $$<
		Selector extends keyof HTMLElementTagNameMap | (string & {}),
		Validator extends typeof HTMLElement,
	>(selector: Selector, validator: Validator): InstanceType<Validator>;
	function $$<
		Selector extends keyof HTMLElementTagNameMap | (string & {}),
		Validator extends typeof HTMLElement,
	>(selectors: Selector, validator?: Validator) {
		const list = node.querySelectorAll(selectors);

		if (validator) {
			list.forEach(item => {
				if (!(item instanceof validator))
					throw new Error(`Expected ${validator.name}, found ${item}`);
			});
		}

		return list;
	}
}

type DefinitionOptions<Attributes extends Readonly<Array<string>>> = {
	name: string;
	attributes: Attributes;
};

type AttributeStore<Attributes extends Readonly<Array<string>>> = Record<
	Attributes[number] | (string & {}),
	string | null
>;

type DefinitionCallback<Attributes extends Readonly<Array<string>>> = (
	props: DefinitionCallbackProps<Attributes>
) => void;

type DefinitionCallbackProps<Attributes extends Readonly<Array<string>>> = {
	root: HTMLElement;
	attributes: AttributeStore<Attributes>;
	$: ReturnType<typeof createSelector>;
	$$: ReturnType<typeof createMultiSelector>;
};
