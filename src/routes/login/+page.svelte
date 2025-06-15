<script lang="ts">
	import { pushState } from '$app/navigation';
	import { Button } from '$ui/button';
	import { Input } from '$ui/input';
	import { Label } from '$ui/label';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import type { InitialConfig } from '$lib/types';

	const id = $props.id();

	let iconHeader: HTMLImageElement;
	let nameHeader: HTMLHeadingElement;
	let domainForm: HTMLFormElement;
	let domainFormInput: HTMLInputElement;
	let domainFormSubmit: HTMLButtonElement;

	function fullUrl(url: string) {
		if (!url.includes('/')) {
			url = url + '/api/configpanel';
		}

		if (!url.startsWith('http://') && !url.startsWith('https://')) {
			url = 'https://' + url;
		}

		if (!url.endsWith('/')) {
			url = url + '.json';
		}

		return new URL(url);
	}

	async function domainTest(url: string) {
		domainFormInput.disabled = true;
		domainFormSubmit.disabled = true;

		let parsedUrl: URL;
		try {
			parsedUrl = fullUrl(url);
		} catch {
			toast.error('Invalid URL or domain');

			domainFormInput.disabled = false;
			domainFormSubmit.disabled = false;
			return;
		}

		const apiUrl = parsedUrl.toString();
		const request = fetch(apiUrl);
		toast.promise(request, {
			loading: 'Checking domain...',
			error: 'Server unreachable',
			description: `(${parsedUrl.host})`
		});

		request.catch(() => {
			domainFormInput.disabled = false;
			domainFormSubmit.disabled = false;
		});
		const response = await request;
		if (!response.ok) {
			domainFormInput.disabled = false;
			domainFormSubmit.disabled = false;
			return;
		}

		let json: InitialConfig;
		try {
			json = await response.json();
		} catch {
			toast.error('Invalid response from server');

			domainFormInput.disabled = false;
			domainFormSubmit.disabled = false;
			return;
		}

		if (!json?.configpanel || json?.configpanel !== 1) {
			toast.error('Invalid response from server');

			domainFormInput.disabled = false;
			domainFormSubmit.disabled = false;
			return;
		}

		toast.success('Valid endpoint found');
		nameHeader.textContent = document.title = 'Log in to ' + (json.name || parsedUrl.hostname);
		if (json.icon) iconHeader.src = new URL(json.icon, parsedUrl).toString();
	}

	onMount(() => {
		domainFormInput = document.getElementById(`url-${id}`) as HTMLInputElement;
		domainFormSubmit = document.getElementById(`submit-domain-${id}`) as HTMLButtonElement;

		const params = new URLSearchParams(window.location.hash.slice(1));
		if (params.has('url')) {
			domainFormInput.value = decodeURIComponent(params.get('url') || '');
			domainTest(domainFormInput.value);
		}

		domainForm.addEventListener('submit', (ev) => {
			ev.preventDefault();
			ev.stopPropagation();

			pushState('#url=' + encodeURIComponent(domainFormInput.value), {});

			domainTest(domainFormInput.value);
		});
	});
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="text-foreground bg-background flex h-lvh w-lvw flex-col">
	<main class="flex grow flex-col items-center justify-center gap-6">
		<img
			src="https://avatars.githubusercontent.com/u/186395034?s=48&v=4"
			alt="Icon"
			class="border-input size-12 rounded-(--radius) border text-transparent"
			bind:this={iconHeader}
		/>
		<h1 class="text-center text-2xl" bind:this={nameHeader}>Login</h1>

		<form class="flex w-full max-w-sm flex-col space-y-2" bind:this={domainForm}>
			<Label for="url-{id}">Domain or URL</Label>
			<div class="flex w-full items-center space-x-2">
				<Input type="text" id="url-{id}" placeholder="demo.configpanel.org" required />
				<Button type="submit" id="submit-domain-{id}">Check</Button>
			</div>
		</form>
	</main>
	<footer class="flex items-center justify-center gap-4 p-2 text-center text-sm">
		<p>ConfigPanel</p>
		<p>
			<a href="https://github.com/configpanel/panel" target="blank" class="underline">
				source code
			</a>
		</p>
		<p>
			<a href="https://docs.configpanel.org/" target="blank" class="underline">documentation</a>
		</p>
		<p>
			<a href="https://ko-fi.com/Le0_X8" target="blank" class="underline">donate &lt;3</a>
		</p>
	</footer>
</div>
