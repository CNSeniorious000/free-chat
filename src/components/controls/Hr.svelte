<script lang="ts">
  import { Separator } from 'bits-ui'

  export let text = ''
</script>

<div class="col-span-2 my-1.5 flex flex-row items-center gap-1.5 ws-nowrap text-xs text-$c-fg-70">
  {#if text}
    <div class="ml-0.7">
      {text}
    </div>
  {/if}
  <Separator.Root class="col-span-2 h-0.1em w-full bg-$c-fg-20" />
</div>
