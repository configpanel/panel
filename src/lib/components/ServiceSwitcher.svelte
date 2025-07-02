<script lang="ts">
	import type { Service } from '$lib/types';
	import * as DropdownMenu from '$ui/dropdown-menu/index.js';
	import * as Sidebar from '$ui/sidebar/index.js';
	import { useSidebar } from '$ui/sidebar/index.js';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { MonitorCog } from 'lucide-svelte';

	// This should be `Component` after @lucide/svelte updates types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { services, selected }: { services: Service[]; selected: string } = $props();
	const sidebar = useSidebar();
	let activeServiceHost = $derived(decodeURIComponent(selected.split('-')[0]));
	let activeServiceId = $derived(decodeURIComponent(selected.split('-')[1]));

	let activeService = $derived(
		services.find((s) => s.id === activeServiceId && s.host === activeServiceHost) as Service
	);
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<div
							class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
						>
							{#if activeService?.icon}
								<img src={activeService.icon} alt="" class="size-4 rounded-md" />
							{:else}
								<MonitorCog class="size-4 shrink-0" />
							{/if}
						</div>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">
								{activeService.name}
							</span>
							<span class="truncate text-xs">{activeService.host}</span>
						</div>
						<ChevronsUpDownIcon class="ml-auto" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				align="start"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				sideOffset={4}
			>
				<DropdownMenu.Label class="text-muted-foreground text-xs">Services</DropdownMenu.Label>
				{#each services as service, index}
					<DropdownMenu.Item onSelect={() => (activeService = service)} class="gap-2 p-2">
						<div class="flex size-6 items-center justify-center rounded-md border">
							{#if service?.icon}
								<img src={activeService.icon} alt="" class="size-3.5 shrink-0 rounded-md" />
							{:else}
								<MonitorCog class="size-3.5 shrink-0" />
							{/if}
						</div>
						{service.name}
						<DropdownMenu.Shortcut>⌘{index + 1}</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
				{/each}
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="gap-2 p-2">
					<div class="flex size-6 items-center justify-center rounded-md border bg-transparent">
						<PlusIcon class="size-4" />
					</div>
					<div class="text-muted-foreground font-medium">Add a new service</div>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
