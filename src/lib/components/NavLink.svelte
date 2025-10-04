<script lang="ts">
	import type { NavLink as NavLinkType } from '$lib/types';
	import * as Sidebar from '$ui/sidebar';
	import * as Collapsible from '$ui/collapsible';
	import Icon from '$lib/components/Icon.svelte';
	import { ChevronRightIcon } from 'lucide-svelte';
	import NavLink from '$lib/components/NavLink.svelte';

	interface Props extends NavLinkType {
		active: string;
		navigateTo: (id: string) => void;
	}
	let { title, children, active, icon, id, navigateTo }: Props = $props();

	let hasActive = $state(active === id);
	// svelte-ignore state_referenced_locally (this is intentional!)
	if (children && !hasActive) {
		hasActive = children.some((child) => child.id === active);
	}
</script>

{#snippet button()}
	<Sidebar.MenuButton
		tooltipContent={title}
		class="w-full cursor-pointer {active === id ? 'bg-sidebar-border hover:bg-sidebar-border' : ''}"
		onclick={() => navigateTo(id)}
	>
		{#if icon}
			<Icon id={icon} />
		{/if}
		<span class="grow">{title}</span>
		{#if children}
			<ChevronRightIcon
				class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
			/>
		{/if}
	</Sidebar.MenuButton>
{/snippet}

{#if children}
	<Collapsible.Root open={hasActive} class="group/collapsible">
		<Sidebar.MenuItem>
			<Collapsible.Trigger class="w-full">
				{@render button()}
			</Collapsible.Trigger>
		</Sidebar.MenuItem>
		<Collapsible.Content>
			<Sidebar.MenuSub>
				{#each children as child}
					<NavLink {...child} {active} {navigateTo} />
				{/each}
			</Sidebar.MenuSub>
		</Collapsible.Content>
	</Collapsible.Root>
{:else}
	<Sidebar.MenuItem>
		{@render button()}
	</Sidebar.MenuItem>
{/if}
