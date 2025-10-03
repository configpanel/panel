<script lang="ts">
	import * as lucideIconsImported from 'lucide-svelte';
	import * as simpleIconsImported from '@icons-pack/svelte-simple-icons';
	let { id, ...restProps }: { id: string } = $props();

	const lucideIcons = lucideIconsImported as unknown as Record<string, any>;
	const simpleIcons = simpleIconsImported as unknown as Record<string, any>;

	const iconSource = id.includes(':') ? id.split(':')[0] : 'lucide';

	id = id.includes(':') ? id.split(':')[1] : id;

	function capitalize(str: string): string {
		return str
			.split('-')
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join('');
	}

	const lucideId = capitalize(id);
	const simpleIconsId = 'Si' + capitalize(id);
</script>

{#if iconSource === 'lucide' && lucideIcons[lucideId]}
	{@const Icon = lucideIcons[lucideId]}
	<Icon {...restProps} />
{/if}

{#if iconSource === 'logo' && simpleIcons[simpleIconsId]}
	{@const Icon = simpleIcons[simpleIconsId]}
	<Icon {...restProps} title="" />
{/if}
