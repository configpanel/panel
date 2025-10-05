<script lang="ts">
	import PanelContentItem from '$lib/components/PanelContentItem.svelte';
	import type { Content } from '$lib/types';

	let { content, navigateTo }: { content: Content; navigateTo: (url: string) => void } = $props();
</script>

<h1 class="mb-2 text-4xl font-extrabold">
	{content.title}
</h1>

{#if content.content}
	{#each content.content as item}
		<PanelContentItem {item} {navigateTo} />
	{/each}
{/if}
