<script lang="ts">
    import type { AppealEntry, PunishEntry } from "./types";
    import { getReadableMillis, getReadableDate } from './sharedfuncs';

    export let appealEntry: AppealEntry;
    export let punishEntry: PunishEntry;
    export let back: string;
    export let myUUID: string;
    export let message: string | null;
    export let formData: FormData;

    let currentTime = new Date().getTime();

    function redirect(loc: string) {
        window.location.href = loc;
    }
</script>

<section class="container box">
    <div class="content has-text-centered">
        <h1>Appeal #{appealEntry.id}</h1>
        {#if appealEntry.open}
            <span class="tag is-danger">Open</span>
            <br>
            <br>
        {/if}

        {#if message != null && message == "closed"}
            <div class="notification is-success">Appeal closed successfully.</div>
        {:else if message != null && message == "closedrevokefail"}
            <div class="notification is-warning">Appeal closed successfully, however the punishment could not be automatically revoked. Please do this manually.</div>
        {/if}

        <table class="table is-centered is-bordered is-striped">
            <tbody>
                <tr>
                    <th>Player</th>
                    <td>{appealEntry.name}</td>
                </tr>
                <tr>
                    <th>Punish Type</th>
                    <td>{appealEntry.type}</td>
                </tr>
                <tr>
                    <th>Punished For</th>
                    <td>{punishEntry.reason}</td>
                </tr>
                <tr>
                    <th>Punished By</th>
                    <td>{punishEntry.by_name}</td>
                </tr>
                <tr>
                    <th>Submission Date</th>
                    <td>{getReadableDate(appealEntry.time)}</td>
                </tr>
                <tr>
                    <th>Player Comments</th>
                    <td>
                        <div class="notification is-warning">WARNING: PLEASE EXERCISE CAUTION WHEN CLICKING ANY LINKS.</div>
                        <br>
                        {appealEntry.reason}
                    </td>
                </tr>
                {#if appealEntry.assigned != null}
                    <tr>
                        <th>Assigned To</th>
                        <td>{appealEntry.assigned_name}</td>
                    </tr>

                    {#if appealEntry.verdict == null}
                        <tr>
                            <th>Verdict</th>
                            <td>Pending</td>
                        </tr>
                    {:else}
                        <tr>
                            <th>Verdict</th>
                            <td>{appealEntry.verdict == 1 ? "Accepted" : "Rejected"}</td>
                        </tr>
                        <tr>
                            <th>Staff Comments</th>
                            <td>{appealEntry.comment}</td>
                        </tr>
                    {/if}
                {/if}
            </tbody>
        </table>


        {#if appealEntry.assigned == myUUID && appealEntry.open}
            <br>
            {#if formData != null && !formData.success}
                <div class="notification is-danger">{formData.message}</div>
            {/if}
            <form method="post">
                <div class="field">
                    <label class="label">
                        Please review the player's comments, reach a verdict and put your comments below.
                        <br>
                        <textarea name="comments" class="textarea" placeholder="Please provide as much detail as needed."/>
                    </label>
                </div>
    
                <div class="control">
                    <button class="button is-success" formaction="?/accept">Accept</button>
                    <button class="button is-danger" formaction="?/reject">Reject</button>
                </div> 
            </form>
        {:else}
            <div class="buttons is-right">
                <button class="button" on:click={() => redirect(back)}>Back</button>
                {#if appealEntry.assigned == null}
                    <button class="button is-success">Claim</button>
                {/if}
            </div>
        {/if}
    </div>
</section>