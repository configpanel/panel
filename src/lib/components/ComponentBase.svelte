<script lang="ts">
	let { children = undefined } = $props();
</script>

<div>
	{@render children?.()}
</div>
