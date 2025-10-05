<script lang="ts">
	import Footer from '$c/Footer.svelte';
	import Service from '$c/Service.svelte';
	import type { Content, NavLink, Panel, Service as ServiceType } from '$lib/types';
	import { AlertCircle, MonitorCog } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import AppSidebar from '$lib/components/AppSidebar.svelte';
	import * as Breadcrumb from '$ui/breadcrumb';
	import { Separator } from '$ui/separator';
	import * as Sidebar from '$ui/sidebar';
	import * as Alert from '$ui/alert';
	import { pushState } from '$app/navigation';
	import PanelContent from '$lib/components/PanelContent.svelte';
	import Loading from '$lib/components/Loading.svelte';

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
	let content: Content | undefined = $state(undefined);
	let contentError: string | undefined = $state(undefined);

	function flatLink(link: NavLink, group?: string, parent?: NavLink): NavLink[] {
		const outLinks: NavLink[] = [];
		if (link.url) {
			const newLink = { ...link };
			if (group) newLink._group = group;
			if (parent) newLink._parent = parent;
			outLinks.push(newLink);
		}
		if (link.children) {
			for (const child of link.children) {
				outLinks.push(
					...flatLink(
						child,
						group ?? (link.url ? undefined : link.title),
						link.url ? { ...link } : undefined
					)
				);
			}
		}
		return outLinks;
	}

	$effect((async () => {
		if (!mounted || !activeService) return;

		const response = await fetch(activeService.endpoint, {
			credentials: activeService.noCredentials === true ? 'omit' : 'include'
		});
		try {
			panel = (await response.json()) as Panel;
			if (typeof panel !== 'object') {
				panel = undefined;
				throw new Error('');
			}
		} catch {
			alert('You have been logged out of this service. Please delete it and log in again.');
			window.location.href = '/';
			return;
		}

		panel._urls = [];
		panel._urls.push({ ...panel.home });
		panel.nav.forEach((item) => {
			panel?._urls.push(...flatLink(item as NavLink));
		});

		navigate(path);
	}) as () => void);

	onMount(() => {
		services = JSON.parse(localStorage.getItem('configpanel.org-services') ?? '[]');
		navigate(path);
		mounted = true;
	});

	function navigateTo(id: string) {
		if (path === id) return;
		pushState(`#${serviceId}${id === '' ? '' : '/' + id}`, {});
		path = id;
		navigate(id);
	}

	let current: NavLink = $state({ id: '', title: '', url: '' });

	async function navigate(id: string) {
		if (!panel) return;
		content = undefined;
		contentError = undefined;

		let url: NavLink;
		if (id === '') {
			url = panel.home;
		} else {
			const link = panel._urls.find((u) => u.id === id);
			if (!link) return;

			url = link;
		}

		current = url;

		const response = await fetch(new URL(url.url, activeService?.endpoint), {
			credentials: activeService?.noCredentials === true ? 'omit' : 'include'
		});
		try {
			content = (await response.json()) as Content;
			if (typeof content !== 'object') {
				content = undefined;
				throw new Error('The server returned an invalid response.');
			}
		} catch (e) {
			contentError = (e as Error).message;
			return;
		}
	}
</script>

<svelte:head>
	<title>
		{serviceSelected && mounted && panel ? activeService.name : 'Welcome'}
		| ConfigPanel
	</title>
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
		<AppSidebar {services} selected={serviceId} {panel} active={path} {navigateTo} />
		<Sidebar.Inset>
			<header
				class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear select-none group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
			>
				<div class="flex items-center gap-2 px-4">
					<Sidebar.Trigger class="-ml-1" />
					<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
					<Breadcrumb.Root>
						<Breadcrumb.List>
							{#if current._group}
								<Breadcrumb.Item class="hidden md:block">
									<Breadcrumb.Link class="pointer-events-none">
										{current._group}
									</Breadcrumb.Link>
								</Breadcrumb.Item>
								<Breadcrumb.Separator class="hidden md:block" />
							{/if}

							{#if current._parent}
								<Breadcrumb.Item class="hidden md:block">
									<Breadcrumb.Link
										onclick={() => navigateTo(current._parent?.id ?? '')}
										class="cursor-pointer"
									>
										{current._parent.title}
									</Breadcrumb.Link>
								</Breadcrumb.Item>
								<Breadcrumb.Separator class="hidden md:block" />
							{/if}

							<Breadcrumb.Item>
								<Breadcrumb.Page>{current.title}</Breadcrumb.Page>
							</Breadcrumb.Item>
						</Breadcrumb.List>
					</Breadcrumb.Root>
				</div>
			</header>
			<main
				class="flex min-h-[calc(100vh-4rem)] flex-col gap-2 px-8 transition-[width,height] ease-linear"
			>
				{#if content}
					<PanelContent {content} {navigateTo} />
				{:else if contentError}
					<Alert.Root variant="destructive">
						<AlertCircle />
						<Alert.Title>Error while loading the page:</Alert.Title>
						<Alert.Description>{contentError}</Alert.Description>
					</Alert.Root>
				{:else}
					<div class="flex w-full grow items-center justify-center">
						<Loading />
					</div>
				{/if}
			</main>
		</Sidebar.Inset>
	</Sidebar.Provider>
{/if}
