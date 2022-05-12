<svelte:options tag="mow-tree" />

<script context="module" lang="ts">
  export interface MowTreeEvents {
    custom: number;
  }
</script>

<script lang="ts">
  import TreeView, { type Tree } from "./TreeView.svelte";

  export let tree: Tree[] | string = [];

  let canRender = false;
  let renderTree: Tree[] = [];

  $: {
    if (Array.isArray(tree)) {
      renderTree = tree;
      canRender = true;
    } else if (typeof tree === "string") {
      renderTree = JSON.parse(tree);
      canRender = true;
    } else {
      console.warn("tree必须是合法的JSON字符串或对象数组");
    }
  }
</script>

{#if canRender}
  <TreeView tree={renderTree} on:itemToggle on:leafClick />
{/if}
