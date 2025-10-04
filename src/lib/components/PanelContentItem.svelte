<script lang="ts">
	import ComponentText from '$lib/components/ComponentText.svelte';
	import type { ContentItem } from '$lib/types';

	let { item }: { item: ContentItem } = $props();
</script>

{#if item.type === 'text'}
	<ComponentText {item} />
{/if}
