<script lang="ts">
    import type { AppealEntry, PunishEntry } from "./types";
    import { getReadableMillis, getReadableDate } from './sharedfuncs';

    export let appealEntry: AppealEntry;
    export let punishEntry: PunishEntry;
    export let back: string;

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
            </tbody>
        </table>

        <div class="buttons is-right">
            <button class="button" on:click={() => redirect(back)}>Back</button>
        </div>
    </div>
</section>