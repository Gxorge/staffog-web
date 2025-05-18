<script lang="ts">
    import type { ReportEntry } from "./types";
    import { convertReportType, createLinkFromEvidence, getReadableDate } from './sharedfuncs';

    interface Props {
        reportEntry: ReportEntry;
        back: string;
        myUUID: string;
        isAdmin: boolean;
        message: string | null;
        formData: FormData;
    }

    let {
        reportEntry,
        back,
        myUUID,
        isAdmin,
        message,
        formData = $bindable()
    }: Props = $props();

    let currentTime = new Date().getTime();
    let unclaimText = $state("Unclaim")

    function redirect(loc: string) {
        window.location.href = loc;
    }

    async function unclaimAppeal() {
        if (unclaimText == "Unclaim") {
            unclaimText = "Are you sure?";
        } else {
            let unclaimRes = await fetch('/backend/reports/' + reportEntry.id + '/unclaim');
            if (unclaimRes.status != 200) {
                formData.success = false;
                formData.message = await unclaimRes.text();
            } else {
                redirect('/reports/' + reportEntry.id + '?message=unclaimed')
            }
        }
    }
</script>

<section class="container box">
    <div class="content has-text-centered">
        <h1>Report #{reportEntry.id}</h1>
        {#if reportEntry.open}
            <span class="tag is-danger">Open</span>
            <br>
            <br>
        {/if}

        {#if message != null && message == "closed"}
            <div class="notification is-success">Report closed successfully.</div>
        {:else if message != null && message == "claimed"}
            <div class="notification is-success">You have claimed this report.</div>
        {:else if message != null && message == "unclaimed"}
            <div class="notification is-success">You have unclaimed this report.</div>
        {/if}

        {#if formData != null && !formData.success && formData.message != null}
            <div class="notification is-danger">{formData.message}</div>
        {/if}

        <table class="table is-centered is-bordered is-striped">
            <tbody>
                <tr>
                    <th>Player</th>
                    <td>{reportEntry.name}</td>
                </tr>
                <tr>
                    <th>Reporter</th>
                    <td>{reportEntry.by_name}</td>
                </tr>
                <tr>
                    <th>Report Type</th>
                    <td>{convertReportType(reportEntry.type)}</td>
                </tr>
                {#if reportEntry.type == "CHAT"}
                    <tr>
                        <th>Chat Report ID</th>
                        <td><a href="/chatreport/{reportEntry.crid}?back=reports/{reportEntry.id}">#{reportEntry.crid}</a></td>
                    </tr>
                {/if}
                <tr>
                    <th>Submission Date</th>
                    <td>{getReadableDate(reportEntry.time)}</td>
                </tr>
                <tr>
                    <th>Reporter Comments</th>
                    <td>
                        <div class="notification is-warning">WARNING: <b>DO NOT CLICK LINKS FROM THIS SECTION</b>.</div>
                        <br>
                        {reportEntry.reason}
                    </td>
                </tr>
                <tr>
                    <th>Report Evidence</th>
                    {#if reportEntry.evidence.length == 0}
                        <td>None provided.</td>
                    {:else}
                        <td>
                            <span class="tag is-danger">Please continue to exercise caution when clicking links.</span>
                            <br>
                            <br>
                            {#each reportEntry.evidence as evi}
                                <a href={createLinkFromEvidence(evi)}>{createLinkFromEvidence(evi)}</a>
                                <br>
                            {/each}
                        </td>
                    {/if}
                </tr>
                {#if reportEntry.assigned != null}
                    <tr>
                        <th>Assigned To</th>
                        <td>{reportEntry.assigned_name}</td>
                    </tr>

                    {#if reportEntry.verdict == null}
                        <tr>
                            <th>Verdict</th>
                            <td>Pending</td>
                        </tr>
                    {:else}
                        <tr>
                            <th>Verdict</th>
                            <td>{reportEntry.verdict == 1 ? "Punishment Issued" : "No Further Action"}</td>
                        </tr>
                        <tr>
                            <th>Staff Comments</th>
                            <td>{reportEntry.comment}</td>
                        </tr>
                    {/if}
                {/if}
            </tbody>
        </table>


        {#if reportEntry.assigned == myUUID && reportEntry.open}
            <br>
            {#if formData != null && !formData.success && formData.closeMessage != null}
                <div class="notification is-danger">{formData.closeMessage}</div>
            {/if}
            <form method="post">
                <div class="field">
                    <label class="label">
                        Please review the reporter's comments and evidence, and reach a verdict and put your comments below.
                        <br>
                        <textarea name="comments" class="textarea" placeholder="Please provide as much detail as needed."></textarea>
                    </label>
                </div>
    
                <div class="control">
                    <button class="button is-success" formaction="?/accept">Accept</button>
                    <button class="button is-danger" formaction="?/reject">Reject</button>
                </div> 
            </form>
            <br>
            <div class="buttons is-right">
                <button class="button" onclick={() => redirect(back)}>Back</button>
                <button class="button is-warning" onclick={unclaimAppeal}>{unclaimText}</button>
            </div>
        {:else}
            <div class="buttons is-right">
                <button class="button" onclick={() => redirect(back)}>Back</button>
                {#if reportEntry.assigned == null && reportEntry.open}
                    <form method="post">
                        <button class="button is-success" formaction="?/claim">Claim</button>
                    </form>
                {:else if reportEntry.open && isAdmin}
                    <button class="button is-warning" onclick={unclaimAppeal}>{unclaimText}</button>
                {/if}
            </div>
        {/if}
    </div>
</section>