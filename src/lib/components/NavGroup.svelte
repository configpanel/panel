<script lang="ts">
	import NavLink from '$lib/components/NavLink.svelte';
	import type { NavGroup } from '$lib/types';
	import * as Sidebar from '$ui/sidebar/index.js';

	interface Props extends NavGroup {
		active: string;
		navigateTo: (id: string) => void;
	}
	let { title, children, active, navigateTo }: Props = $props();
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>{title}</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each children as link}
			<NavLink {...link} {active} {navigateTo} />
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
