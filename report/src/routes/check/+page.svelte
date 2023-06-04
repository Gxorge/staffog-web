<script lang="ts">
    import { convertReportType, createLinkFromEvidence } from "$lib/sharedfuncs";
    import type { ActionData } from "./$types";

    export let form: ActionData;
</script>

<svelte:head>
	<title>Check Report | TrueOG</title>
</svelte:head>

<form method="post">
    <section class="section" style="padding-top: 0px;">
        {#if form != null && !form.success}
            <div class="notification is-danger">{form?.message}</div>
        {/if}

        {#if form == null || form.report == null}
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
                <h1>Report #{form.report.id} against {form.report.name}</h1>
                <p>You have submitted a {convertReportType(form.report.type)} report against {form.report.name}</p>

                {#if form.report.open}
                    <br>
                    <p>Your report is still being investigated. Please check back later.</p> 
                {/if}

                <table class="table is-bordered is-striped ">
                    <tbody>
                        <tr>
                            <th>Report Status</th>
                            <td>{form.report.open ? "Open" : "Closed"}</td>
                        </tr>
                        <tr>
                            <th>Your Comments</th>
                            <td>{form.report.reason}</td>
                        </tr>
                        <tr>
                            <th>Report Evidence</th>
                            {#if form.report.evidence.length == 0}
                                <td>None provided.</td>
                            {:else}
                                <td>
                                    {#each form.report.evidence as evi}
                                        <a href={createLinkFromEvidence(evi)}>{createLinkFromEvidence(evi)}</a>
                                        <br>
                                    {/each}
                                </td>
                            {/if}
                        </tr>
                        {#if form.report.crid != null}
                            <tr>
                                <th>Chat Report ID</th>
                                <td>#{form.report.crid}</td>
                            </tr>
                        {/if}
                        {#if form.report.open}
                            <tr>
                                <th>Report Verdict</th>
                                <td>Pending</td>
                            </tr>
                        {:else}
                            <tr>
                                <th>Report Verdict</th>
                                <td>{form.report.verdict == 0 ? "No Futher Action" : "Punishment Issued"}</td>
                            </tr>
                            <tr>
                                <th>Staff Comment</th>
                                <td>{form.report.comment}</td>
                            </tr>
                        {/if}
                    </tbody>
                </table>
            </div>
        {/if}    
    </section>
</form>