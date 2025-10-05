<script lang="ts">
	import ComponentBase from '$lib/components/ComponentBase.svelte';
	import type { TextItem } from '$lib/types';

	let { item, navigateTo }: { item: TextItem; navigateTo: (url: string) => void } = $props();

	import DOMPurify from 'dompurify';
	import { marked } from 'marked';

	function html(md: string) {
		return DOMPurify.sanitize(marked.parse(md, { gfm: true }) as string, {
			FORBID_ATTR: ['style', 'class']
		})
			.split('href=')
			.map((text, i) => {
				if (i === 0) return text;
				const end = text.charAt(0);
				const [url, ...rest] = text.slice(1).split(end);
				const absolute = url.includes(':') || url.includes('//');

				const currentUrl = new URL('https://' + window.location.hash.slice(1));
				const relative = '#' + new URL('/' + url, currentUrl).toString().slice(8);

				return (
					end +
					(absolute ? url : relative) +
					end +
					(absolute ? ' class="external" ' : ` class="internal" data-targetid="${url}"`) +
					rest.join(end)
				);
			})
			.join('href=');
	}
</script>

<ComponentBase>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class={[
			'prose prose-neutral dark:prose-invert size-full max-w-none',
			'prose-code:before:content-none prose-code:after:content-none',
			'prose-code:bg-card prose-code:p-1 prose-code:pb-0.5 prose-code:rounded',
			'prose-pre:bg-card',
			'prose-headings:my-2',
			'prose-li:my-0'
		]}
		onclick={(ev) => {
			const { target } = ev;
			if (!(target instanceof HTMLAnchorElement) || !target.classList.contains('internal')) return;
			ev.preventDefault();

			navigateTo(target.getAttribute('data-targetid') || '');
		}}
	>
		{@html html(item.text)}
	</div>
</ComponentBase>
