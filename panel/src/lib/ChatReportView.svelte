<script lang="ts">
    import { getReadableDate } from "./sharedfuncs";
    import type { ChatReportEntry } from "./types";

    interface Props {
        entry: ChatReportEntry;
        back: string;
    }

    let { entry, back }: Props = $props();

    let showAll: boolean = $state(true);
    let toggleAllButtonText: string = $state("Show only from the reported");
    let toggleAllButtonType: string = $state("is-danger");

    function toggleShowAll() {
        if (showAll) {
            showAll = false;
            toggleAllButtonText = "Show all messages";
            toggleAllButtonType = "is-success";
        } else {
            showAll = true;
            toggleAllButtonText = "Show only from the reported";
            toggleAllButtonType = "is-danger";
        }
    }

    function goBack() {
        window.location.href = "/" + back;
    }
</script>

<section class="container box">
    <div class="content has-text-centered">
        <h1>Chat Report #{entry.id}</h1>

        <table class="table is-centered is-bordered is-striped">
            <tbody>
                <tr>
                    <th>Player</th>
                    <td>{entry.name}</td>
                </tr>
                <tr>
                    <th>Created By</th>
                    <td>{entry.by_name}</td>
                </tr>
                <tr>
                    <th>Created Time</th>
                    <td>{getReadableDate(entry.time)}</td>
                </tr>
            </tbody>
        </table>  

        <h2>Messages</h2>
        <button class="button {toggleAllButtonType}" onclick={() => toggleShowAll()}>{toggleAllButtonText}</button>
        <br>
        <br>
        <table class="table is-centered is-bordered is-striped">
            <tbody>
                {#if showAll}
                    {#each entry.processedMessages as m }
                        <tr>
                            <th>
                                {m.name}
                                {#if m.uuid == entry.uuid}
                                    <span class="tag is-danger">Reported</span>
                                {/if}
                                {#if m.uuid == entry.by_uuid}
                                    <span class="tag is-warning">Reporter</span>
                                {/if}
                                <br>
                                {getReadableDate(m.time)}
                            </th>
                            <td>{m.message}</td>
                        </tr>
                    {/each}
                {:else}
                    {#each entry.processedMessages as m }
                        {#if m.uuid == entry.uuid}
                            <tr>
                                <th>{m.name}<br>{getReadableDate(m.time)}</th>
                                <td>{m.message}</td>
                            </tr>
                        {/if}
                    {/each}
                {/if}
            </tbody>
        </table>     
        
        <div class="buttons is-right">
            <button class="button" onclick={() => goBack()}>Back</button>
        </div>
    </div>
</section>