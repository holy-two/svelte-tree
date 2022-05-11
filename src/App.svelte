<svelte:options tag="mow-tree" />

<script lang="ts">
  import { onMount } from "svelte";

  import TreeView, { type Tree } from "./lib/TreeView.svelte";

  export let tree: Tree[] | string = [];

  let canRender = false;
  let renderTree: Tree[] = [];

  onMount(() => {
    if (Array.isArray(tree)) {
      renderTree = tree;
      canRender = true;
    } else if (typeof tree === "string") {
      renderTree = JSON.parse(tree);
      canRender = true;
    }
  });
</script>

{#if canRender}
  <TreeView tree={renderTree} on:itemToggle on:leafClick />
{/if}
