<script lang="ts">
	import ComponentText from '$lib/components/ComponentText.svelte';
	import type { ContentItem } from '$lib/types';

	let { item, navigateTo }: { item: ContentItem; navigateTo: (url: string) => void } = $props();
</script>

{#if item.type === 'text'}
	<ComponentText {item} {navigateTo} />
{/if}
