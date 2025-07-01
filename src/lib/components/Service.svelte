<script lang="ts">
	import type { Service } from '$lib/types';
	import { ChevronRight, MonitorCog, Plus } from 'lucide-svelte';

	export let service: Service | undefined = undefined;
	let add = service === undefined;
</script>

<a
	class="mb-0 flex h-14 w-full items-center p-2 {add ? '' : 'border-b'}"
	href={add ? '/login' : ''}
>
	<div class="flex size-10 items-center justify-center rounded-md border">
		{#if add}
			<Plus />
		{:else if service?.icon}
			<img src={service.icon} alt="" class="size-6 rounded-md" />
		{:else}
			<MonitorCog />
		{/if}
	</div>
	<div
		class="flex grow flex-col justify-center overflow-hidden px-2 text-ellipsis whitespace-nowrap"
	>
		{#if add}
			<p class="overflow-hidden text-sm font-semibold text-ellipsis">Add a new panel</p>
		{:else}
			<p class="overflow-hidden text-sm font-semibold text-ellipsis">{service?.name}</p>
			<p class="text-muted-foreground overflow-hidden text-xs text-ellipsis">
				{service?.user}@{service?.id} /
				{service?.host}
			</p>
		{/if}
	</div>
	<div class="flex size-8 items-center justify-center">
		<ChevronRight />
	</div>
</a>
