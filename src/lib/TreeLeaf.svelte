<svelte:options tag='tree-leaf' />

<script>
  import TreeItem from "./TreeItem.svelte";
  export let selected = false;
</script>

<tree-item leaf on:click {selected}>
  <slot />
</tree-item>
