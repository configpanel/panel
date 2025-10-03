<script lang="ts">
	import NavUser from './NavUser.svelte';
	import ServiceSwitcher from './ServiceSwitcher.svelte';
	import * as Sidebar from '$ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import type {
		Panel,
		Service,
		NavGroup as NavGroupType,
		NavLink as NavLinkType
	} from '$lib/types';
	import NavLink from '$lib/components/NavLink.svelte';
	import NavGroup from '$lib/components/NavGroup.svelte';

	interface Props extends ComponentProps<typeof Sidebar.Root> {
		services?: Service[];
		selected: string;
		active: string;
		panel: Panel;
		navigateTo: (id: string) => void;
	}

	let {
		services = [],
		selected,
		panel,
		ref = $bindable(null),
		collapsible = 'icon',
		active,
		navigateTo,
		...restProps
	}: Props = $props();

	const groups = panel.nav.filter(
		(group) => (group as { url?: string }).url === undefined
	) as NavGroupType[];
	const navLinks = panel.nav.filter(
		(group) => (group as { url?: string }).url !== undefined
	) as NavLinkType[];
</script>

<Sidebar.Root {collapsible} {...restProps} class="select-none">
	<Sidebar.Header>
		<ServiceSwitcher {services} {selected} />
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.Menu>
				<NavLink {...panel.home} id="" {active} {navigateTo} />
				{#each navLinks as link}
					<NavLink {...link} {active} {navigateTo} />
				{/each}
			</Sidebar.Menu>
		</Sidebar.Group>
		{#each groups as group}
			<NavGroup {...group} {active} {navigateTo} />
		{/each}
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={panel.user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
