<script lang="ts">
    import type { PunishEntry } from '$lib/types';
    import { getReadableMillis, getReadableDate } from './sharedfuncs';

    interface Props {
        entryList: Array<PunishEntry>;
        punishType: string;
    }

    let { entryList, punishType }: Props = $props();

    function redirect(id: bigint) {
        window.location.href = "/" + punishType + "/" + id;
    }
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
                        <button class="button is-primary" onclick={() => redirect(p.id)}>Manage</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
    {#if entryList.length == 0}
        <div class="content has-text-centered">No {punishType} issued.</div>
    {/if}
</div>

<style lang="scss">
    table {
        margin-left:auto; 
        margin-right:auto;
    }
</style>