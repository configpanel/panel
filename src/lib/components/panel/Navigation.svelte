<script lang="ts">
	import '$lib/style.css';
	import Icon from '$c/Icon.svelte';
  import { ModeWatcher } from 'mode-watcher';
	import type { NavGroup } from '$lib/types.js';
	import * as Sheet from '$shadcn/sheet/index.js';
	import { Menu } from 'lucide-svelte';

	export let nav: NavGroup[];
	export let logo: string = '/favicon.png';
	export let title: string = 'ConfigPanel';
	export let baseUrl: string = '/';
</script>

<ModeWatcher />

<nav
	class="fixed flex h-12 w-full items-center gap-2 border-white bg-slate-950 p-2 font-sans text-xl font-medium text-white dark:border-b dark:bg-transparent dark:backdrop-blur-lg"
>
	<a class="flex h-full grow items-center gap-2" href={baseUrl}>
		<img class="h-full" src={logo} alt={title} />
		<h1>{title}</h1>
	</a>
	<Sheet.Root>
		<Sheet.Trigger><Menu class="mr-1" /></Sheet.Trigger>
		<Sheet.Content class="overflow-y-auto">
			<Sheet.Title
				><header class="flex h-12 items-center gap-2">
					<img src={logo} alt={title} class="h-full" />
					<h1 class="text-xl font-medium">{title}</h1>
				</header></Sheet.Title
			>
			<hr class="mb-2 mt-4" />
			<ul>
				{#each nav as { title, icon, items }, i}
					<li class={(i !== nav.length - 1 ? 'mb-2 border-b pb-4' : '') + ''}>
						{#if items.length === 1}
							<header class="mt-4 w-full">
								<a href={baseUrl + items[0].url} class="flex w-full items-center gap-2 hover:underline transition">
									{#if icon}
										<span class="scale-75"><Icon {icon} /></span>
									{:else}
										<span class="scale-75"><div class="size-6"></div></span>
									{/if}
									<h2>{title}</h2>
								</a>
							</header>
						{:else}
							<header
								class="flex w-full items-center justify-center gap-1 text-sm uppercase opacity-25"
							>
								{#if icon}<span class="scale-[0.6]"><Icon {icon} /></span>{/if}
								<h2>{title}</h2>
							</header>
							<ul>
								{#each items as { title, url, icon }, j}
									<li>
										<a href={baseUrl + url} class="flex h-full w-full items-center gap-2 hover:underline transition">
											{#if icon}
												<span class="scale-75"><Icon {icon} /></span>
											{:else}
												<span class="scale-75"><div class="size-6"></div></span>
											{/if}
											<h3>{title}</h3>
										</a>
									</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			</ul>
		</Sheet.Content>
	</Sheet.Root>
</nav>
