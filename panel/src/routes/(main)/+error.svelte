<script lang="ts">
    import { page } from '$app/state';
</script>

<div class="box content has-text-centered">
    <h2>Error {page.status}</h2>
    <p>{page.error.message}</p>
    <br><br>
    <p>If you believe this is a mistake, please get in touch with <b>admin@trueog.net</b>.</p>
</div>