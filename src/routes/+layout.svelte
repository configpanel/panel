<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$ui/sonner';

	let { children } = $props();
</script>

<ModeWatcher />
<Toaster />

<nav></nav>

<main>{@render children()}</main>

<footer></footer>
