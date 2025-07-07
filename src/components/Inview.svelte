<script lang="ts">
  import { inview, type ObserverEventDetails } from 'svelte-inview'

  interface Props {
    inView: boolean;
    [key: string]: any
  }

  let { inView = $bindable(), ...rest }: Props = $props()

  function oninview_change({ detail }: CustomEvent<ObserverEventDetails>) {
    inView = detail.inView
  }
</script>

<div use:inview {oninview_change} {...rest} role="presentation"></div>
