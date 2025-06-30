<script lang="ts">
	import type { Context, LoginField } from '$lib/types';
	import Token from '$c/LoginFieldForm/Token.svelte';

	export let field: LoginField;
	export let loginLock: (lock: boolean) => void;
	export let context: Context;
</script>

{#if field.type === 'token'}
	<Token {field} {loginLock} {context} />
{/if}
