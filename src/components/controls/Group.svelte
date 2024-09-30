<script lang="ts">
  export let title: string
</script>

<div class="flex-rol flex items-center justify-between gap-2 text-xs">
  <h4 class="ws-nowrap">{title}</h4>
  <slot/>
</div>
