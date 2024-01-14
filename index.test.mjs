// @ts-check
import { test, suite, expect } from 'vitest';

import { defineElement } from './index.js';
import { createEffect, createRoot, createSignal } from 'solid-js';

suite('defineElement', () => {
	test('updates text', () => {
		document.body.innerHTML = '<hello-world></hello-world>';
		defineElement('hello-world', ({ root }) => (root.textContent = 'Hello World'));

		expect(document.body.innerHTML).toBe('<hello-world>Hello World</hello-world>');
	});

	test('counter increments', () => {
		document.body.innerHTML = `<test-counter>
    <button name="increment">Increment</button>
    <button name="decrement">Increment</button>
    <output>0</output>
  </test-counter>`;

		defineElement('test-counter', ({ root }) => {
			const output = root.querySelector('output');
			if (!output) throw new Error('Output is not defined');
			const [count, setCount] = createSignal(Number(output.textContent) || 0);
			createEffect(() => (output.textContent = String(count())));

			/** @type {HTMLButtonElement | null} */
			const inc_button = root.querySelector('button[name=increment]');
			if (!inc_button) throw new Error('Increment Button is not defined');
			inc_button.onclick = () => setCount(c => c + 1);

			/** @type {HTMLButtonElement | null} */
			const dec_button = root.querySelector('button[name=decrement]');
			if (!dec_button) throw new Error('Decrement Button is not defined');
			dec_button.onclick = () => setCount(c => c - 1);
		});

		/** @type {HTMLButtonElement | null} */
		const inc_button = document.querySelector('test-counter button[name=increment]');
		/** @type {HTMLButtonElement | null} */
		const dec_button = document.querySelector('test-counter button[name=decrement]');
		/** @type {HTMLOutputElement | null} */
		const output = document.querySelector('test-counter output');

		inc_button?.click();
		expect(output?.textContent).toBe('1');
		inc_button?.click();
		expect(output?.textContent).toBe('2');
		dec_button?.click();
		expect(output?.textContent).toBe('1');
	});

	test('declared attributes are reactive', () => {
		document.body.innerHTML = '<reactive-attributes value="hello"></reactive-attributes>';

		defineElement(
			{
				name: 'reactive-attributes',
				attributes: /** @type {const} */ (['value']),
			},
			({ root, attributes }) => {
				createEffect(() => {
					root.textContent = attributes.value || '';
				});
			}
		);

		const el = document.querySelector('reactive-attributes');
		expect(el?.textContent).toBe('hello');
		el?.setAttribute('value', 'world');
		expect(el?.textContent).toBe('world');
	});

	test('$ queries children of root', () => {
		document.body.innerHTML = `
    <query-tester>
      <div>Find me</div>
    </query-tester>
`;

		defineElement('query-tester', ({ root, $ }) => {
			$('div').textContent = 'Found';
		});

		expect(document.querySelector('query-tester div')?.textContent).toBe('Found');
	});

	test('$ will throw if not found', () => {
		document.body.innerHTML = `
    <query-tester-two>
      <div>Find me</div>
    </query-tester-two>
`;

		defineElement('query-tester-two', ({ root, $ }) => {
			try {
				expect.unreachable();
				const p = $('p');
			} catch {}
		});
	});
});
