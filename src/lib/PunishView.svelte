<script lang="ts">
    import type { PunishEntry } from "./types";
    import { getReadableMillis, getReadableDate } from './sharedfuncs';

    export let entry: PunishEntry;
    export let type: string;
    export let admin: boolean;
    export let back: string;

    let currentTime = new Date().getTime();

    function redirect(loc: string) {
        window.location.href = loc;
    }
</script>

<section class="container box">
    <div class="content has-text-centered">
        <h1>{type} #{entry.id}</h1>
        {#if entry.active}
            <span class="tag is-danger">Active</span>
            <br>
            <br>
        {/if}
        <table class="table is-centered is-bordered is-striped">
            <tbody>
                <tr>
                    <th>Player</th>
                    <td>{entry.name}</td>
                </tr>
                <tr>
                    <th>Punished By</th>
                    <td>{entry.by_name}</td>
                </tr>
                <tr>
                    <th>Reason</th>
                    <td>{entry.reason}</td>
                </tr>
                <tr>
                    <th>Date</th>
                    <td>{getReadableDate(entry.time)}</td>
                </tr>
                <tr>
                    <th>Duration</th>
                    <td>{getReadableMillis(entry.until, entry.time)}</td>
                </tr>
                {#if entry.until != BigInt(-1) && entry.active}
                    <tr>
                        <th>Expires In</th>
                        {#if BigInt(currentTime) >= entry.until}
                            <td>Due to Expire</td>
                        {:else}
                            <td>{getReadableMillis(entry.until, BigInt(currentTime))}</td>    
                        {/if}
                    </tr>
                {/if}
                {#if !entry.active}
                    <tr>
                        <th>Removed By</th>
                        <td>{entry.removed_name}</td>
                    </tr>
                    <tr>
                        <th>Removed On</th>
                        <td>{getReadableDate(entry.removed_time)}</td>
                    </tr>
                    <tr>
                        <th>Reason</th>
                        <td>{entry.removed_reason}</td>
                    </tr>
                {/if}
            </tbody>
        </table>

        <div class="buttons is-right">
            <button class="button" on:click={() => redirect(back)}>Back</button>
            {#if entry.active}
                <button class="button is-link" on:click={() => redirect(window.location.href + "/edit")}>Edit {type}</button> 
                {#if admin}
                    <button class="button is-danger" on:click={() => redirect(window.location.href + "/revoke")}>Revoke {type}</button>
                {/if}
            {/if}
        </div>
    </div>
</section>