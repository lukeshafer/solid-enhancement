// @ts-check
import { createRoot } from 'solid-js';
import { createStore } from 'solid-js/store';

/**
 * @overload
 * @param {string} options
 * @param {DefinitionCallback<[]>} callback
 * @returns void
 */
/**
 * @template {Readonly<Array<string>>} [Attributes=[]]
 * @overload
 * @param {DefinitionOptions<Attributes>} options
 * @param {DefinitionCallback<Attributes>} callback
 * @returns void
 */
/**
 * @template {Readonly<Array<string>>} Attributes
 * @param {string | DefinitionOptions<Attributes>} options
 * @param {DefinitionCallback<Attributes>} callback
 **/
export function defineElement(options, callback) {
	throwIfNotInBrowser();

	const { name: element_name, attributes: attribute_names } = parseOptions(options);

	customElements.define(
		element_name,
		class extends HTMLElement {
			/** @type {import('solid-js/store').SetStoreFunction<AttributeStore<Attributes>> | null} */
			__setAttributeStore = null;
			connectedCallback() {
				const root = this;

				createRoot(() => {
					const [attributesStore, setAttributesStore] = createStore(
						/** @type {AttributeStore<Attributes>} */ ({})
					);
					this.__setAttributeStore = setAttributesStore;
					const attributes = new Proxy(attributesStore, {
						/** @param {string} prop */
						get(_, prop) {
							return attributesStore[prop] || root.getAttribute(prop);
						},
					});

					const { $, $$ } = createSelectorFunctions(root);

					callback({ root, attributes, $, $$ });
				});
			}

			static get observedAttributes() {
				return attribute_names;
			}

			/**
			 * @param {string} name
			 * @param {string} oldValue
			 * @param {string} newValue
			 */
			attributeChangedCallback(name, oldValue, newValue) {
				if (oldValue !== newValue) this.__setAttributeStore?.(name, newValue);
			}
		}
	);
}

/**
 * @overload
 * @param {string} options
 * @returns {DefinitionOptions<[]>}
 **/
/**
 * @template {Readonly<Array<string>>} [Attributes=[]]
 * @overload
 * @param {DefinitionOptions<Attributes>} options
 * @returns {DefinitionOptions<Attributes>}
 **/
/**
 * @template {Readonly<Array<string>>} [Attributes=[]]
 * @param {string | DefinitionOptions<Attributes>} options
 * @returns {DefinitionOptions<Attributes>}
 **/
function parseOptions(options) {
	if (typeof options === 'string') {
		return {
			name: options,
			// @ts-ignore
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

/**
 * @param {ParentNode} node
 */
function createSelectorFunctions(node) {
	return { $, $$ };

	/** @type {QueryFn} */
	function $(selectors, validator) {
		const value = node.querySelector(selectors);
		if (!value) throw new Error('Invalid query');
		if (validator) {
			if (!(value instanceof validator))
				throw new Error(`Expected ${validator.name}, found ${value}`);
		}
		return value;
	}

	/** @type {QueryAllFn} */
	function $$(selectors, validator) {
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
