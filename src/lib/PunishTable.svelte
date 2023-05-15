<script lang="ts">
    import type { PunishEntry } from '$lib/types';
    import { getReadableMillis, getReadableDate } from './sharedfuncs';

    export let entryList: Array<PunishEntry>;
</script>

<div class="box">
    <table class="table is-align-items-center">
        <thead>
            <tr>
                <th>ID</th>
                <th>Player</th>
                <th>Reason</th>
                <th>Duration</th>
                <th>Punished By</th>
                <th>Date</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each entryList as p}
                <tr>
                    <th>{p.id}</th>
                    <td>{p.name}</td>
                    <td>{p.reason}</td>
                    <td>{getReadableMillis(p.until, p.time)}</td>
                    <td>{p.by_name}</td>
                    <td>{getReadableDate(p.time)}</td>
                    <td>
                        <button class="button is-primary">Manage</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style lang="scss">
    table {
        margin-left:auto; 
        margin-right:auto;
    }
</style>