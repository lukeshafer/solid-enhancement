export type DefinitionOptions<Attributes extends Readonly<Array<string>>> = {
    name: string;
    attributes: Attributes;
};
export type AttributeStore<Attributes extends Readonly<Array<string>>> = Record<Attributes[number] | (string & {}), string | null>;
export type DefinitionCallback<Attributes extends Readonly<Array<string>>> = (props: DefinitionCallbackProps<Attributes>) => void;
type DefinitionCallbackProps<Attributes extends Readonly<Array<string>>> = {
    root: HTMLElement;
    attributes: AttributeStore<Attributes>;
    $: QueryFn;
    $$: QueryAllFn;
};
export type QueryFn = <Q extends keyof HTMLElementTagNameMap, V extends typeof HTMLElement | undefined = undefined>(query: Q, validator?: V) => V extends typeof HTMLElement ? InstanceType<V> : HTMLElementTagNameMap[Q];
export type QueryAllFn = <Q extends keyof HTMLElementTagNameMap | (string & {}), V extends typeof HTMLElement | undefined = undefined>(query: Q, validator?: V) => V extends typeof HTMLElement ? NodeListOf<InstanceType<V>> : NodeListOf<HTMLElementTagNameMap[Q]>;
export {};
