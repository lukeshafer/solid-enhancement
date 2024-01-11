/**
 * @overload
 * @param {string} options
 * @param {import('./types').DefinitionCallback<[]>} callback
 * @returns void
 */
export function defineElement(options: string, callback: import('./types').DefinitionCallback<[]>): any;
/**
 * @template {Readonly<Array<string>>} [Attributes=[]]
 * @overload
 * @param {import('./types').DefinitionOptions<Attributes>} options
 * @param {import('./types').DefinitionCallback<Attributes>} callback
 * @returns void
 */
export function defineElement<Attributes extends readonly string[] = []>(options: import("./types").DefinitionOptions<Attributes>, callback: import("./types").DefinitionCallback<Attributes>): any;
