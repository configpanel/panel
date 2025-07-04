<script lang="ts">
	import Footer from '$c/Footer.svelte';
	import Service from '$c/Service.svelte';
	import type { Panel, Service as ServiceType } from '$lib/types';
	import { MonitorCog } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import AppSidebar from '$lib/components/AppSidebar.svelte';
	import * as Breadcrumb from '$ui/breadcrumb';
	import { Separator } from '$ui/separator';
	import * as Sidebar from '$ui/sidebar';

	let services: ServiceType[] = $state([]);
	let serviceId: string = $derived(page.url.hash.slice(1).split('/')[0]);
	let serviceSelected = $derived(serviceId.length > 0);
	let path: string = $derived(page.url.hash.split('/').slice(1).join('/'));
	let mounted = $state(false);
	let activeServiceHost = $derived(decodeURIComponent(serviceId.split('-')[0]));
	let activeServiceId = $derived(decodeURIComponent(serviceId.split('-')[1]));
	let activeService: ServiceType | undefined = $derived(
		services.find((s) => s.id === activeServiceId && s.host === activeServiceHost) as ServiceType
	);
	let panel: Panel | undefined = $state(undefined);

	$effect((async () => {
		if (!mounted || !activeService) return;

		const response = await fetch(activeService.endpoint, {
			credentials: activeService.noCredentials === true ? 'omit' : 'include'
		});
		panel = (await response.json()) as Panel;
	}) as () => void);

	onMount(() => {
		services = JSON.parse(localStorage.getItem('configpanel.org-services') ?? '[]');
		mounted = true;
	});
</script>

<svelte:head>
	<title>Welcome | ConfigPanel</title>
</svelte:head>

{#if !serviceSelected && mounted}
	<div class="text-foreground bg-background absolute z-49 flex h-lvh w-lvw flex-col px-2">
		<main class="flex grow flex-col items-center justify-center gap-6">
			<MonitorCog class="size-12" />

			<h1 class="mb-1 text-center text-2xl">Welcome!</h1>

			{#if services.length === 0}
				<p class="text-center text-sm">
					It looks like you aren't logged into a service yet.
					<br />
					You can add your first server connection by clicking the button below.
				</p>
			{/if}

			<div
				class="flex max-h-78 w-full max-w-sm flex-col space-y-2 overflow-x-auto rounded-lg border"
			>
				{#each services as service}
					<Service {service} />
				{/each}
				<Service />
			</div>
		</main>
		<Footer />
	</div>
{/if}
{#if serviceSelected && mounted && panel}
	<Sidebar.Provider>
		<AppSidebar {services} selected={serviceId} {panel} />
		<Sidebar.Inset>
			<header
				class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear select-none group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
			>
				<div class="flex items-center gap-2 px-4">
					<Sidebar.Trigger class="-ml-1" />
					<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
					<Breadcrumb.Root>
						<Breadcrumb.List>
							<Breadcrumb.Item class="hidden md:block">
								<Breadcrumb.Link href="#">Building Your Application</Breadcrumb.Link>
							</Breadcrumb.Item>
							<Breadcrumb.Separator class="hidden md:block" />
							<Breadcrumb.Item>
								<Breadcrumb.Page>Data Fetching</Breadcrumb.Page>
							</Breadcrumb.Item>
						</Breadcrumb.List>
					</Breadcrumb.Root>
				</div>
			</header>
		</Sidebar.Inset>
	</Sidebar.Provider>
{/if}
