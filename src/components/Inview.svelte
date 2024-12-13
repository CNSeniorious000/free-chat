<script lang="ts">
  import { inview } from 'svelte-inview'

  interface Props {
    inView: boolean;
    [key: string]: any
  }

  let { inView = $bindable(), ...rest }: Props = $props()
</script>

<div use:inview oninview_change={({ detail }) => { inView = detail.inView }} {...rest} role="presentation"></div>
