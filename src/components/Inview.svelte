<script lang="ts">
  import { inview } from 'svelte-inview'

  export let inView: boolean
</script>

<div use:inview on:inview_change={({ detail }) => { inView = detail.inView }} {...$$restProps} role="presentation" />
