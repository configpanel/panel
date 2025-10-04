<script lang="ts">
	import ComponentBase from '$lib/components/ComponentBase.svelte';
	import type { TextItem } from '$lib/types';

	let { item }: { item: TextItem } = $props();
	// TODO: Markdown parsing
</script>

<ComponentBase>
	{item.text}
</ComponentBase>
