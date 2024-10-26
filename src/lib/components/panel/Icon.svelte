<script lang="ts">
  import { icons } from 'lucide-svelte';
  export let icon: keyof typeof icons;
</script>

<svelte:component this={icons[icon] as unknown as ConstructorOfATypedSvelteComponent} />