<script>
  import { onMount } from 'svelte'
  import { promplateBaseUrl as baseUrl } from '@/utils/constants'
  import { setBanner } from './Banner.svelte'

  function wakeBackend() {
    setBanner('Checking backend status...')
    fetch(`${baseUrl}/heartbeat`).then(res => res.text()).then(() => {
      setBanner('Receive backend greeting.', 600)
    }).catch((err) => {
      console.error(err)
      setTimeout(wakeBackend, 1000)
    })
  }

  onMount(wakeBackend)
</script>
