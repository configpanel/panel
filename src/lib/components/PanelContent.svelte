<script lang="ts">
	import PanelContentItem from '$lib/components/PanelContentItem.svelte';
	import type { Content } from '$lib/types';

	let { content }: { content: Content } = $props();
</script>

<h1 class="mb-2 text-4xl font-extrabold">
	{content.title}
</h1>

{#if content.content}
	{#each content.content as item}
		<PanelContentItem {item} />
	{/each}
{/if}
