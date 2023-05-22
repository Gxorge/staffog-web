<script lang="ts">
    import type { ActionData } from "./$types";

    export let form: ActionData;
</script>

<svelte:head>
	<title>Submit Appeal | TrueOG</title>
</svelte:head>

<div class="content has-text-centered"><p><b>Appeal Submission</b></p></div>

<form method="post">
    <section class="section" style="padding-top: 0px;">
        {#if form != null && !form.success}
            <div class="notification is-danger">{form?.message}</div>
        {/if}

        {#if form == null || form.stage == 1}
            <div class="content has-text-centered"><p>To start, please enter your username.</p></div>
    
            <div class="field">
                <label class="label">
                    IGN
                    <div class="control">
                        <input name="username" class="input " type="text" placeholder="Your IGN">
                    </div>
                </label>
            </div>

            <div class="control">
                <button class="button" formaction="?/stage_one">Continue</button>
            </div>
        {:else if form.stage == 2}
            <div class="content has-text-centered"><p>Please select the punishment you would like to appeal.</p></div>
        
            <div class="field">
                <label class="label">
                    Select your punishment
                    <br>
                    <div class="select">
                        <select name="punishment">
                            {#each form.punishments as entry}
                                <option>{entry.type} for {entry.reason}</option>
                            {/each}
                        </select>
                    </div>
                </label>
            </div>

            <div class="control">
                <button class="button" formaction="?/stage_two">Continue</button>
            </div> 

        {:else if form.stage == 3}    
            <div class="content has-text-centered">
                <p>Appealing {form.punishment.type} for {form.punishment.reason}</p>
                <p>If you have any evidence, please provide it via YouTube, Streamable, Imgur, etc.</p>
            </div>
            
            <div class="field">
                <label class="label">
                    Why do you think your punishment should be revoked?
                    <br>
                    <textarea name="reason" class="textarea" placeholder="Please provide as much detail as possible."/>
                </label>
            </div>

            <div class="control">
                <button class="button is-success" formaction="?/stage_three">Submit</button>
            </div> 
        {/if}    
    </section>
</form>