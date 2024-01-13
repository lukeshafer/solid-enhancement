export declare function defineElement(options: string, callback: DefinitionCallback<[]>): void;
export declare function defineElement<Attributes extends readonly string[]>(options: DefinitionOptions<Attributes>, callback: DefinitionCallback<Attributes>): void;
declare function createSelector(node: ParentNode): {
    <Selector extends keyof HTMLElementTagNameMap | (string & {})>(selector: Selector): Selector extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[Selector] : Element;
    <Selector_1 extends keyof HTMLElementTagNameMap | (string & {}), Validator extends {
        new (): HTMLElement;
        prototype: HTMLElement;
    }>(selector: Selector_1, validator: Validator): InstanceType<Validator>;
};
declare function createMultiSelector(node: ParentNode): {
    <Selector extends keyof HTMLElementTagNameMap | (string & {})>(selector: Selector): Selector extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[Selector] : Element;
    <Selector_1 extends keyof HTMLElementTagNameMap | (string & {}), Validator extends {
        new (): HTMLElement;
        prototype: HTMLElement;
    }>(selector: Selector_1, validator: Validator): InstanceType<Validator>;
};
type DefinitionOptions<Attributes extends Readonly<Array<string>>> = {
    name: string;
    attributes: Attributes;
};
type AttributeStore<Attributes extends Readonly<Array<string>>> = Record<Attributes[number] | (string & {}), string | null>;
type DefinitionCallback<Attributes extends Readonly<Array<string>>> = (props: DefinitionCallbackProps<Attributes>) => void;
type DefinitionCallbackProps<Attributes extends Readonly<Array<string>>> = {
    root: HTMLElement;
    attributes: AttributeStore<Attributes>;
    $: ReturnType<typeof createSelector>;
    $$: ReturnType<typeof createMultiSelector>;
};
export {};
