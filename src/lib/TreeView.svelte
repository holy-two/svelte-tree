<svelte:options tag="tree-view" />

<script context="module" lang="ts">
  export type Tree = {
    text: string;
    selected?: boolean;
    children?: Tree[];
  };

  export type TreeViewEvents = {
    leafClick: Tree;
    itemToggle: {
      target: Tree;
      expand: boolean;
    };
  };

  export function flat(t: Tree[]) {
    const queue = [...t];
    const result: Tree[] = [];
    while (true) {
      if (queue.length <= 0) {
        break;
      }
      const t = queue.shift();
      result.push(t);
      if (t.children && t.children.length > 0) {
        queue.push(...t.children);
      }
    }
    return result;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { get_current_component } from "svelte/internal";

  import TreeItem from "./TreeItem.svelte";
  import TreeLeaf from "./TreeLeaf.svelte";

  export let tree: Tree[] = [];

  const thisComponent = get_current_component();

  const svelteDispatch = createEventDispatcher<TreeViewEvents>();

  const dispatch: typeof svelteDispatch = (type, detail) => {
    thisComponent?.dispatchEvent?.(
      new CustomEvent(type, {
        detail,
      })
    );
    return svelteDispatch(type, detail);
  };

  const handleLeafClick = (item: Tree) => {
    flat(tree).forEach((fit) => {
      fit.selected = false;
    });
    item.selected = true;
    tree = tree;
  };

  const handleChildrenLeafClick = (
    e: CustomEvent<TreeViewEvents["leafClick"]>
  ) => {
    flat(tree).forEach((fit) => {
      fit.selected = false;
    });
    tree = tree;
    dispatch("leafClick", e.detail);
  };
</script>

{#each tree as item}
  {#if !item.children}
    <tree-leaf
      selected={item.selected}
      on:click={() => {
        dispatch("leafClick", item);
        handleLeafClick(item);
      }}>{item.text}</tree-leaf
    >
  {:else}
    <tree-item
      text={item.text}
      on:toggleExpand={(e) => {
        dispatch("itemToggle", {
          target: item,
          expand: e.detail,
        });
      }}
    >
      <svelte:self
        tree={item.children}
        on:leafClick={(e) => {
          handleChildrenLeafClick(e);
        }}
        on:itemToggle={(e) => {
          dispatch("itemToggle", e.detail);
        }}
      />
    </tree-item>
  {/if}
{/each}
