<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";

    interface Props {
        form: ActionData;
    }

    let { form }: Props = $props();

    let selectedOffence: String = $state();
    let inGameFailed: boolean = $state(false);
    let evidenceUrls = $state(0);
</script>

<svelte:head>
	<title>Submit Report | TrueOG</title>
</svelte:head>

<div class="content has-text-centered"><p><b>Report Submission</b></p></div>

<form method="post" use:enhance>
    <section class="section" style="padding-top: 0px;">
        {#if form != null && !form.success}
            <div class="notification is-danger">{form?.message}</div>
        {/if}

        <div class="content has-text-centered"><p>Please fill out the below form to submit a report. Please include as much detail as possible, including any evidence required.</p></div>
    
        <div class="field">
            <label class="label">
                What is your IGN?
                <div class="control">
                    <input name="username" class="input " type="text" placeholder="Your IGN">
                </div>
            </label>
        </div>

        <div class="field">
            <label class="label">
                What is the offender's IGN?
                <div class="control">
                    <input name="offender" class="input " type="text" placeholder="Offender's IGN">
                </div>
            </label>
        </div>

        <div class="field">
            <label class="label">
                What offence have they commited?
                <div class="control">
                    <div class="select">
                        <select name="offence" bind:value={selectedOffence}>
                            <option disabled selected>Please select an offence</option>
                            <option value="CHAT">Mutable Offence (i.e. abuse in chat, such as death threats.)</option>
                            <option value="BAN">Banable Offence (i.e cheating, exploiting, etc.)</option>
                            <option value="JAIL">Jailable Offence (i.e duping, glitching, etc.)</option>
                        </select>
                    </div>
                </div>
            </label>
        </div>

        {#if selectedOffence != null && selectedOffence == "CHAT" && inGameFailed == false}
            <div class="notification is-danger">
                Mutable Offences require an in-game chat report ID so that messages can be properly verified. This means that reports for Muteable Offences can only be submitted in-game with the <b>/chatreport</b> command.
                <br>
                If the in-game command failed but still gave you a chat report ID, you can continue with the button below.
                <br>
                <br>
                <span class="button" onclick={() => {inGameFailed = true;}}>Continue with Chat Report ID</span>
            </div>
        {/if}

        {#if selectedOffence != null && selectedOffence == "CHAT" && inGameFailed == true}
            <div class="field">
                <label class="label">
                    What is your chat report ID?
                    <div class="control">
                        <input name="crid" class="input " type="text" placeholder="Chat report ID">
                    </div>
                </label>
            </div>
        {/if}

        <div class="field">
            <label class="label">
                Please explain their offence. Evidence can be submitted below using the approved channels.
                <div class="control">
                    <textarea name="reason" class="textarea" placeholder="Please explain the offence."></textarea>
                </div>
            </label>
        </div>

        {#each {length: evidenceUrls} as _, i}
            <span class="label">
                    Evidence Link #{i+1}
            </span>
            <div class="field has-addons">
                <div class="contorl">
                    <span class="select">
                        <select name="evlink{i}-type">
                            <option value="YOUTUBE">youtube.com/watch?v=</option>
                            <option value="IMGUR">imgur.com/a/</option>
                            <option value="STREAMABLE">streamable.com/</option>
                        </select>
                    </span>
                </div>
                <div class="control">
                    <input name="evlink{i}-data" class="input " type="text" placeholder="Please finish the URL">
                </div>
            </div>

            <div class="field has-addons">

            </div>
        {/each}
        <input name="evlinkamt" type="text" value="{evidenceUrls}" hidden>

        <span class="button is-link" onclick={() => {evidenceUrls++;}}>Add Evidence Link</span>

        <br>
        <br>
        <div class="control">
            <button class="button is-success" formaction="?/submit" disabled={selectedOffence != null && selectedOffence == "CHAT" && inGameFailed == false}>Submit</button>
        </div>
    </section>
</form>