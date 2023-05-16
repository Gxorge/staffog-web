<script lang="ts">
    import type { ActionData, PageData } from './$types';
    export let form: ActionData;
    export let data: PageData;
</script>   

<svelte:head>
	<title>Login | TrueOG</title>
</svelte:head>

<div class="content has-text-centered">Please login with your credentials below.</div>
<form method="post">
    <section class="section">

        {#if data.paramSuccess != null && data.paramSuccess == "true"}
            <div class="notification is-success">Activation successfully. Please sign-in below.</div>
        {:else if data.paramSuccess != null && data.paramSuccess == "false"}
            <div class="notification is-danger">You must login to view that page.</div>
            {:else if data.paramSuccess != null && data.paramSuccess == "out"}
            <div class="notification is-link">You have signed-out successfully.</div>    
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
                Password
                <div class="control">
                    <input name="pwd" class="input " type="password" placeholder="Your password">
                    </div>
            </label>
        </div>

        <div class="control">
            <button class="button is-primary">Login</button>
        </div>
        <br>
        <p>Got an activation code? <a href="/login/activate">Click here to active your account</a>.</p>
    </section>
</form>