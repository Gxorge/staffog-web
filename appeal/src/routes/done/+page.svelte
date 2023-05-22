<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;
</script>

<div class="content has-text-centered">
    <h2>Appeal Submitted</h2>
    <p>Your appeal has been submitted successfully. Your reference code is <b>{data.ref}</b>, you will need this to check the status of your report or if you need any further assistance.</p>
</div>