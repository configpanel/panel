<script lang="ts">
	import { Button } from '$lib/ui/button';
	import { Moon, Sun } from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';
</script>

<footer class="bg-background text-foreground flex flex-col items-center justify-center">
	<div class="flex items-center justify-center gap-4 text-center text-sm">
		<Button onclick={toggleMode} variant="ghost" size="icon">
			<Sun
				class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
			/>
			<Moon
				class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>

	<div class="flex items-center justify-center gap-4 p-2 text-center text-sm">
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
	</div>
</footer>
