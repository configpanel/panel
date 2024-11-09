<h1 align="center">ConfigPanel</h1>
<p align="center">Simple and extendable configuration panel for SvelteKit</p>

## Installation

Set up a SvelteKit project and install the ConfigPanel package along with the TailwindCSS configuration.

```bash
npm i -D @configpanel/panel @configpanel/tailwind-config
```

### Tailwind setup

ConfigPanel uses TailwindCSS for styling. To make everything work as intended, re-export the Tailwind configuration in your `tailwind.config.ts` file:

```ts
export { default } from '@configpanel/tailwind-config';
```

### Panel setup

To set up the ConfigPanel, import the `Navigation` component in your `src/routes/+layout.svelte` file:

```svelte
<script lang="ts">
	import { Navigation } from '@configpanel/panel';
	let { children } = $props();
</script>

<Navigation nav={[]} />

{@render children}
```

That's it! You can now start adding your configuration pages.