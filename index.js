import { createRoot } from 'solid-js';
import { createStore } from 'solid-js/store';
export function defineElement(options, callback) {
    throwIfNotInBrowser();
    // @ts-expect-error
    const { name: element_name, attributes: attribute_names } = parseOptions(options);
    customElements.define(element_name, class extends HTMLElement {
        constructor() {
            super(...arguments);
            this.__setAttributeStore = null;
        }
        connectedCallback() {
            const root = this;
            createRoot(() => {
                const [attributesStore, setAttributesStore] = createStore({});
                this.__setAttributeStore = setAttributesStore;
                const attributes = new Proxy(attributesStore, {
                    get(_, prop) {
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
        attributeChangedCallback(name, oldValue, newValue) {
            // @ts-expect-error
            if (oldValue !== newValue)
                this.__setAttributeStore?.(name, newValue);
        }
    });
}
function parseOptions(options) {
    if (typeof options === 'string') {
        return {
            name: options,
            attributes: [],
        };
    }
    return options;
}
function throwIfNotInBrowser() {
    if (!globalThis.window)
        throw new Error('Global Window is not defined in this environment.');
    if (!window.customElements)
        throw new Error('Custom Elements are not supported in this environment.');
}
function createSelector(node) {
    return $;
    function $(selectors, validator) {
        const value = node.querySelector(selectors);
        if (!value)
            throw new Error('Invalid query');
        if (validator) {
            if (!(value instanceof validator))
                throw new Error(`Expected ${validator.name}, found ${value}`);
        }
        return value;
    }
}
function createMultiSelector(node) {
    return $$;
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
