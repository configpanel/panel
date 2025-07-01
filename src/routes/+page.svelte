<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Service from '$lib/components/Service.svelte';
	import type { Service as ServiceType } from '$lib/types';
	import { MonitorCog } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let services: ServiceType[] = $state([]);

	onMount(() => {
		services = JSON.parse(localStorage.getItem('configpanel.org-services') ?? '[]');
	});
</script>

<svelte:head>
	<title>Welcome | ConfigPanel</title>
</svelte:head>

<div class="text-foreground bg-background absolute z-1000 flex h-lvh w-lvw flex-col px-2">
	<main class="flex grow flex-col items-center justify-center gap-6">
		<MonitorCog class="size-12" />

		<h1 class="mb-1 text-center text-2xl">Welcome!</h1>

		{#if services.length === 0}
			<p class="text-center text-sm">
				It looks like you aren't logged into a panel yet.
				<br />
				You can add your first server connection by clicking the button below.
			</p>
		{/if}

		<div
			class="border-muted flex max-h-70 w-full max-w-sm flex-col space-y-2 overflow-x-auto rounded-lg border"
		>
			{#each services as service}
				<Service {service} />
			{/each}
			<Service />
		</div>
	</main>
	<Footer />
</div>
