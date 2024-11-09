<script lang="ts">
  import type { Snippet } from 'svelte';
	let { children, title }: { children: Snippet, title: string } = $props();
</script>

<main class="prose dark:prose-invert">
	<h1>{title}</h1>
	{@render children()}
</main>
