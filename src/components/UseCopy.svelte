<script lang="ts">
  export let text: string

  let displayText = 'Copy'

  const handleClick = () => {
    navigator.clipboard.writeText(text)
    displayText = 'Copied'
    setTimeout(() => {
      displayText = 'Copy'
    }, 1000)
  }
</script>

<slot {handleClick} {displayText} />
