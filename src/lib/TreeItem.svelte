<svelte:options tag="tree-item" />

<script context="module" lang="ts">
  export type TreeItemEvents = {
    toggle: boolean;
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { slide } from "svelte/transition";

  export let leaf = false;
  export let text = "";
  export let expand = false;
  export let selected = false;

  const dispatch = createEventDispatcher<TreeItemEvents>();
</script>

<div class="item">
  {#if leaf}
    <div
      class="cursor-pointer text-gray-600 flex items-center h-40px bg-white transition hover-bg-eee"
      style={selected ? "background-color: rgba(119, 197, 250, 0.315)" : ""}
      on:click
    >
      <div class="ml-4"><slot /></div>
    </div>
  {:else}
    <div
      class="cursor-pointer text-gray-600 flex items-center h-40px bg-white transition hover-bg-eee"
      on:click={() => {
        expand = !expand;
        dispatch("toggle", expand);
      }}
    >
      <div
        class="ml-1 text-12px text-gray-600 flex item-center"
        style="height: 100%; width:16px;"
      >
        <div class="flex items-center transition" class:rotate-90={expand}>
          <svg
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="16"
            height="16"
            ><path
              d="M593.450667 512.128L360.064 278.613333l45.290667-45.226666 278.613333 278.762666L405.333333 790.613333l-45.226666-45.269333z"
              p-id="1089"
            /></svg
          >
        </div>
      </div>
      <div class="ml-1">{text}</div>
    </div>
    {#if expand}
      <div transition:slide class="ml-1">
        <slot />
      </div>
    {/if}
  {/if}
</div>

<style lang="less">
  @import "//at.alicdn.com/t/font_3389698_dswc4srkyv.css";
  .item {
    user-select: none;
    .cursor-pointer {
      cursor: pointer;
    }
    .text-gray-600 {
      color: rgb(73, 73, 73);
    }
    .flex {
      display: flex;
    }
    .items-center {
      align-items: center;
    }
    .bg-white {
      background-color: #fff;
    }
    .hover-bg-eee:hover {
      background-color: #eee;
    }
    .transition {
      transition: all 0.2s ease;
    }
    .ml-4 {
      margin-left: 32px;
    }
    .ml-3 {
      margin-left: 24px;
    }
    .ml-2 {
      margin-left: 16px;
    }
    .ml-1 {
      margin-left: 8px;
    }
    .h-40px {
      height: 40px;
    }
    .text-12px {
      font-size: 12px;
    }
    .inline-block {
      display: inline-block;
    }
    div.rotate-90 {
      transform: rotate(90deg);
    }
  }
</style>
