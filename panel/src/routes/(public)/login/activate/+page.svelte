<script lang="ts">
    import type { ActionData } from './$types';
    interface Props {
        form: ActionData;
    }

    let { form }: Props = $props();
</script>   

<svelte:head>
	<title>Activate | TrueOG</title>
</svelte:head>

<div class="content has-text-centered">To activate your account, please enter your IGN and the output of running <b>/linkpanel</b> in-game.</div>
<form method="post">
    <section class="section">

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

        <div class="field">
            <label class="label">
                Choose a password
                <div class="control">
                    <input name="pwd" class="input " type="password" placeholder="Choose a pasword">
                    </div>
            </label>
        </div>

        <div class="field">
            <label class="label">
                Repeat your password
                <div class="control">
                    <input name="pwdrepeat" class="input " type="password" placeholder="Repeat your password">
                    </div>
            </label>
        </div>

        <div class="control">
            <button class="button is-primary">Activate Account</button>
        </div>
    </section>
</form>