<script lang="ts">
    import { comment } from "svelte/internal";
import type { ActionData } from "./$types";

    export let form: ActionData;
</script>

<svelte:head>
	<title>Check Appeal | TrueOG</title>
</svelte:head>

<form method="post">
    <section class="section" style="padding-top: 0px;">
        {#if form != null && !form.success}
            <div class="notification is-danger">{form?.message}</div>
        {/if}

        {#if form == null || form.appeal == null}
            <div class="content has-text-centered"><p>Please enter your username and reference number.</p></div>
    
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
                    Refernce Number
                    <div class="control">
                        <input name="ref" class="input " type="text" placeholder="Your reference number">
                    </div>
                </label>
            </div>

            <div class="control">
                <button class="button is-link">Submit</button>
            </div>
        {:else}
            <div class="content has-text-centered">
                <h2>Appealing {form.appeal.type} for {form.appeal.punishment.reason}</h2>
                <p>Appeal Status: <b>{form.appeal.open ? "Open" : "Closed"}</b></p>
                {#if !form.appeal.open}
                    <h3>Appeal Verdict: {form.appeal.verdict == 0 ? "REJECTED" : "ACCEPTED"}</h3>
                    <p><b>Staff Comment: </b> {form.appeal.comment}</p>
                {:else}
                    <br>
                    <p>Your appeal is still awaiting a verdict. Please check back later.</p>    
                {/if}
            </div>
        {/if}    
    </section>
</form>