<script lang="ts">
	import type { Context, LoginField } from '$lib/types';
	import * as Alert from '$ui/alert';
	import { Button } from '$ui/button';
	import { KeyRound } from 'lucide-svelte';
	import { sp } from 'string-params';
	import { onMount } from 'svelte';

	export let field: LoginField;
	export let loginLock: (lock: boolean) => void;
	export let context: Context;

	let callback: string;
	let params: string;

	onMount(() => {
		[callback, params] = window.location.href.split('#');
		loginLock(context.params[field.id] === undefined);
	});
</script>

<input type="hidden" name={field.id} value={context.params[field.id]} />

{#if context.params[field.id]}
	<Alert.Root>
		<KeyRound />
		<Alert.Title>Token provided</Alert.Title>
	</Alert.Root>
{:else}
	<Alert.Root>
		<KeyRound />
		<Alert.Title>Token requested</Alert.Title>
		<Alert.Description>
			By clicking the button below, you will be redirected to an external page to generate the
			token.
		</Alert.Description>
	</Alert.Root>

	<a
		href={new URL(
			sp(field.url ?? '#', {
				callback: encodeURIComponent(callback),
				params: encodeURIComponent(params),
				varname: encodeURIComponent(field.id)
			}),
			context.baseUrl
		).toString()}
		class="block w-full"
	>
		<Button class="w-full">Generate token</Button>
	</a>
{/if}
