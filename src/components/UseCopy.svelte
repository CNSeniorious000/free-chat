<script lang="ts">
  interface Props {
    text: string;
    children?: import('svelte').Snippet<[any]>;
  }

  const { text, children }: Props = $props()

  let displayText = $state('Copy')

  const handleClick = () => {
    navigator.clipboard.writeText(text)
    displayText = 'Copied'
    setTimeout(() => {
      displayText = 'Copy'
    }, 1000)
  }
</script>

{@render children?.({ handleClick, displayText })}
