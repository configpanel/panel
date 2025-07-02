<script lang="ts">
	import { pushState } from '$app/navigation';
	import * as Alert from '$ui/alert';
	import { Button } from '$ui/button';
	import { Input } from '$ui/input';
	import { Label } from '$ui/label';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import type { Context, LoginConfig, LoginField, LoginResponse } from '$lib/types';
	import { ArrowLeft, LockOpen } from 'lucide-svelte';
	import LoginFieldForm from '$lib/components/LoginFieldForm.svelte';
	import Service from '$lib/components/Service.svelte';
	import Footer from '$lib/components/Footer.svelte';

	const id = $props.id();

	let fields: LoginField[] = $state([]);

	let context: Context = {
		baseUrl: new URL('https://configpanel.org/'),
		params: {}
	};
	let config: LoginConfig;
	let parsedUrl: URL;

	let iconHeader: HTMLImageElement;
	let nameHeader: HTMLHeadingElement;
	let hostHeader: HTMLHeadingElement;
	let domainForm: HTMLFormElement;
	let domainFormInput: HTMLInputElement;
	let domainFormSubmit: HTMLButtonElement;
	let loginForm: HTMLFormElement;
	let loginFormSubmit: HTMLButtonElement;

	function fullUrl(url: string) {
		if (!url.includes('/')) {
			url = url + '/api/configpanel';
		}

		if (!url.startsWith('http://') && !url.startsWith('https://')) {
			url = (url.startsWith('localhost:') ? 'http://' : 'https://') + url;
		}

		if (!url.endsWith('/')) {
			url = url + '.json';
		}

		return new URL(url);
	}

	async function domainTest(url: string) {
		domainFormInput.disabled = true;
		domainFormSubmit.disabled = true;

		try {
			parsedUrl = fullUrl(url);
			context.baseUrl = parsedUrl;
		} catch {
			toast.error('Invalid URL or domain');

			domainFormInput.disabled = false;
			domainFormSubmit.disabled = false;
			return;
		}

		const apiUrl = parsedUrl.toString();
		const request = fetch(apiUrl);
		toast.promise(request, {
			loading: 'Connecting to host...',
			error: 'Host unreachable',
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

		let json: LoginConfig;
		try {
			json = await response.json();
		} catch {
			toast.error('Invalid response from host');

			domainFormInput.disabled = false;
			domainFormSubmit.disabled = false;
			return;
		}

		if (!json?.configpanel || json?.configpanel !== 1) {
			toast.error('Invalid response from host');

			domainFormInput.disabled = false;
			domainFormSubmit.disabled = false;
			return;
		}

		let title = 'Log in to ' + (json.name || parsedUrl.hostname);
		nameHeader.textContent = title;
		document.title = title + ' | ConfigPanel';
		hostHeader.textContent = parsedUrl.host;
		if (json.icon) iconHeader.src = new URL(json.icon, parsedUrl).toString();

		config = json;
		fields = json.login.fields;

		domainForm.style.display = 'none';
		loginForm.style.display = 'flex';
	}

	async function login(fields: Record<string, string | number | boolean>) {
		loginFormSubmit.disabled = true;

		const url = new URL(config.login.endpoint, parsedUrl);

		const method = config.login.method?.toUpperCase() ?? 'POST';
		if (method === 'GET')
			Object.keys(fields).forEach((key) => {
				url.searchParams.set(key, fields[key].toString());
			});
		const body = method === 'GET' ? null : JSON.stringify(fields);

		const request = fetch(url, {
			method,
			body,
			headers: {
				...(method === 'GET' ? {} : { 'Content-Type': 'application/json' }),
				Accept: 'application/json'
			},
			credentials: config.credentials === false ? 'omit' : 'include'
		});

		request.catch(() => {
			loginFormSubmit.disabled = false;
		});

		toast.promise(request, {
			loading: 'Logging in...',
			error: 'Login failed',
			description: `(${url.host})`
		});

		const response = await request;
		if (!response.ok) {
			loginFormSubmit.disabled = false;
			return;
		}

		let json: LoginResponse;
		try {
			json = await response.json();
		} catch {
			toast.error('Invalid response from host');
			loginFormSubmit.disabled = false;
			return;
		}

		if (!json.success) {
			toast.error('Login failed');
			loginFormSubmit.disabled = false;
			return;
		}

		toast.success('Login successful');
		localStorage.setItem(
			'configpanel.org-services',
			JSON.stringify(
				[
					...(
						JSON.parse(localStorage.getItem('configpanel.org-services') || '[]') as Service[]
					).filter((service) => service.id !== (json.id ?? parsedUrl.hostname)),
					{
						id: json.id ?? parsedUrl.hostname,
						name: config.name || parsedUrl.hostname,
						host: parsedUrl.host,
						icon: config.icon,
						noCredentials: config.credentials === false ? true : undefined,
						expires: json.expires ?? -1,
						endpoint: new URL(json.endpoint ?? '', parsedUrl).toString(),
						user: json.user ?? json.id ?? parsedUrl.hostname
					}
				].sort((a, b) => a.name.localeCompare(b.name))
			)
		);
		setTimeout(() => {
			window.location.href = `/#${encodeURIComponent(parsedUrl.host)}-${encodeURIComponent(json.id ?? parsedUrl.hostname)}`;
		}, 1000);
	}

	function loginLock(lock: boolean) {
		loginFormSubmit.disabled = lock;
	}

	onMount(async () => {
		domainFormInput = document.getElementById(`url-${id}`) as HTMLInputElement;
		domainFormSubmit = document.getElementById(`submit-domain-${id}`) as HTMLButtonElement;
		loginFormSubmit = document.getElementById(`submit-login-${id}`) as HTMLButtonElement;

		const params = new URLSearchParams(window.location.hash.slice(1));
		context.params = Object.fromEntries(params.entries());
		delete context.params.url;
		if (params.has('url')) {
			domainFormInput.value = decodeURIComponent(params.get('url') || '');
			await domainTest(domainFormInput.value);

			if (params.has('login')) {
				await login(context.params);
			}
		}

		domainForm.addEventListener('submit', (ev) => {
			ev.preventDefault();
			ev.stopPropagation();

			pushState('#url=' + encodeURIComponent(domainFormInput.value), {});

			domainTest(domainFormInput.value);
		});

		loginForm.addEventListener('submit', (ev) => {
			ev.preventDefault();
			ev.stopPropagation();

			login({
				...context.params,
				...(Object.fromEntries(new FormData(loginForm).entries()) as Record<
					string,
					string | number | boolean
				>)
			});
		});
	});
</script>

<svelte:head>
	<title>Log in | ConfigPanel</title>
</svelte:head>

<div class="text-foreground bg-background absolute z-49 flex h-lvh w-lvw flex-col px-2">
	<div class="mt-4">
		<a href="/" class="text-muted-foreground flex items-center justify-center gap-1 text-sm">
			<ArrowLeft class="size-4" />
			<p class="-translate-y-0.25 underline">return to home</p>
		</a>
	</div>
	<main class="flex grow flex-col items-center justify-center gap-6">
		<img
			src="https://avatars.githubusercontent.com/u/186395034?s=48&v=4"
			alt="Icon"
			class="border-input size-12 rounded-(--radius) border text-transparent"
			bind:this={iconHeader}
		/>
		<hgroup>
			<h1 class="mb-1 text-center text-2xl" bind:this={nameHeader}>Login</h1>
			<h2 class="text-muted-foreground text-center text-sm" bind:this={hostHeader}>
				(not connected)
			</h2>
		</hgroup>

		<form class="flex w-full max-w-sm flex-col space-y-2" bind:this={domainForm}>
			<Label for="url-{id}">Domain or URL</Label>
			<div class="flex w-full items-center space-x-2">
				<Input type="text" id="url-{id}" placeholder="demo.configpanel.org" required />
				<Button type="submit" id="submit-domain-{id}">Connect</Button>
			</div>
		</form>

		<form class="hidden w-full max-w-sm flex-col space-y-2" bind:this={loginForm}>
			{#if fields.length > 0}
				{#each fields as field}
					<LoginFieldForm {field} {loginLock} {context} />
				{/each}
			{:else}
				<Alert.Root variant="destructive">
					<LockOpen />
					<Alert.Title>Security Warning</Alert.Title>
					<Alert.Description>This host did not provide any login fields.</Alert.Description>
				</Alert.Root>
			{/if}
			<Button type="submit" id="submit-login-{id}">Login</Button>
		</form>
	</main>
	<Footer />
</div>
