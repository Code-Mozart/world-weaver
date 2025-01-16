<script lang="ts">
  import "$lib/styles/info-text.css";

  import { page } from "$app/stores";
</script>

<p class="info">{$page.status}: {$page.error?.message}</p>
