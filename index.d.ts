type DefinitionOptions<Attributes extends Readonly<Array<string>>> = {
	name: string;
	attributes: Attributes;
};

type ObservedAttributes = Readonly<Array<string>>;

type AttributeStore<Attributes extends Readonly<Array<string>>> = Record<
	Attributes[number] | (string & {}),
	string | null
>;

type DefinitionCallback<Attributes extends Readonly<Array<string>>> = (props: {
	root: HTMLElement;
	attributes: AttributeStore<Attributes>;
	$: QueryFn;
	$$: QueryAllFn;
}) => void;

type QueryFn = <
	Q extends keyof HTMLElementTagNameMap,
	V extends typeof HTMLElement | undefined = undefined,
>(
	query: Q,
	validator?: V
) => V extends typeof HTMLElement ? InstanceType<V> : HTMLElementTagNameMap[Q];

type QueryAllFn = <
	Q extends keyof HTMLElementTagNameMap,
	V extends typeof HTMLElement | undefined = undefined,
>(
	query: Q,
	validator?: V
) => V extends typeof HTMLElement
	? NodeListOf<InstanceType<V>>
	: NodeListOf<HTMLElementTagNameMap[Q]>;
