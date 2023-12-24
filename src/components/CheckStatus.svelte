<script>
  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'
  import { promplateBaseUrl as baseUrl } from '@/utils/constants'

  onMount(async() => {
    toast.promise(
      fetch(`${baseUrl}/heartbeat`).then(res => res.text()),
      {
        loading: 'Checking backend status...',
        success: 'Receive backend greeting.',
        error: data => `Error: ${data.message}`,
      },
    )
  })
</script>
