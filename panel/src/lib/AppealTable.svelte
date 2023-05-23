<script lang="ts">
    import type { AppealEntry } from '$lib/types';
    import { getReadableDate } from './sharedfuncs';

    export let entryList: Array<AppealEntry>;

    function redirect(id: number) {
        window.location.href = "/appeals/" + id;
    }
</script>

<div class="box">
    <table class="table is-align-items-center">
        <thead>
            <tr>
                <th>ID</th>
                <th>Player</th>
                <th>Type</th>
                <th>Status</th>
                <th>Handler</th>
                <th>Date</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each entryList as p}
                <tr>
                    <th>{p.id}</th>
                    <td>{p.name}</td>
                    <td>{p.type}</td>
                    <td>{p.open ? "Open" : "Closed"}</td>
                    {#if p.assigned == null}
                        <td>-</td>
                    {:else }
                        <td>{p.assigned_name}</td>
                    {/if}
                    <td>{getReadableDate(p.time)}</td>
                    <td>
                        <button class="button is-primary" on:click={() => redirect(p.id)}>Manage</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
    {#if entryList.length == 0}
        <div class="content has-text-centered">No appeals found.</div>
    {/if}
</div>

<style lang="scss">
    table {
        margin-left:auto; 
        margin-right:auto;
    }
</style>