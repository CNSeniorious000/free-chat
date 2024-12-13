<script lang="ts">
  interface Props {
    title: string;
    children?: import('svelte').Snippet;
  }

  const { title, children }: Props = $props()
</script>

<div class="flex-rol flex items-center justify-between gap-2 text-xs">
  <h4 class="ws-nowrap">{title}</h4>
  {@render children?.()}
</div>
