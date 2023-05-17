<script lang="ts">
    import type { ActionData, PageData } from './$types';
    export let form: ActionData;
    export let data: PageData;
</script>   

<svelte:head>
	<title>Verfication | TrueOG</title>
</svelte:head>

<div class="content has-text-centered">To continue, please re-verify your account. Please enter the output of running <b>/stafflink</b> in-game.</div>
<form method="post">
    <section class="section">

        {#if data.paramInGame == "true"}
            <div class="notification is-danger">New IP acknowledged. Your access in-game has been restored. To continue using the staff pannel, please re-verify by running <b>/stafflink</b> in-game.</div>
        {:else if data.paramInGame == "false"}    
            <div class="notification is-danger">New IP detected. To continue using the staff pannel, please re-verify by running <b>/stafflink</b> in-game.</div>
        {/if}

        {#if form != null && !form.success}
            <div class="notification is-danger">{form?.message}</div>
        {/if}

        <div class="field">
            <label class="label">
                IGN
                <div class="control">
                    <input name="username" class="input " type="text" placeholder="Your IGN">
                    </div>
            </label>
        </div>

        <div class="field">
            <label class="label">
                Activation Code
                <div class="control">
                    <input name="actcode" class="input " type="text" placeholder="Your activation code">
                    </div>
            </label>
        </div>

        <div class="control">
            <button class="button is-primary">Verify</button>
        </div>
    </section>
</form>