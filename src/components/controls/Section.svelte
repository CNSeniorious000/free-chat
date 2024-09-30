<script lang="ts">
  export let title: string
  export let tips = ''
</script>

<section class="w-full flex flex-col gap-1.5">
  <h3 class="ml-0.5">{title}</h3>
  <div class="flex flex-col gap-2 rounded-md bg-$c-fg-2 p-1.5">
    <slot />
  </div>
  {#if tips}
    <p class="ml-0.5 text-xs op-70">
      <span class="op-40">*</span>
      {tips}
    </p>
  {/if}
</section>
