<script lang="ts">
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
                <h1>Appeal #{form.appeal.id} by {form.username}</h1>
                <p>You are appealing your {form.appeal.type.toLowerCase()} for {form.appeal.punishment.reason}</p>

                {#if form.appeal.open}
                    <br>
                    <p>Your appeal is still awaiting a verdict. Please check back later.</p> 
                {/if}

                <table class="table is-bordered is-striped ">
                    <tbody>
                        <tr>
                            <th>Appeal Status</th>
                            <td>{form.appeal.open ? "Open" : "Closed"}</td>
                        </tr>
                        {#if form.appeal.open}
                            <tr>
                                <th>Appeal Verdict</th>
                                <td>Pending</td>
                            </tr>
                        {:else}
                            <tr>
                                <th>Appeal Verdict</th>
                                <td>{form.appeal.verdict == 0 ? "Rejected" : "Accepted"}</td>
                            </tr>
                            <tr>
                                <th>Staff Comment</th>
                                <td>{form.appeal.comment}</td>
                            </tr>
                        {/if}
                    </tbody>
                </table>
            </div>
        {/if}    
    </section>
</form>