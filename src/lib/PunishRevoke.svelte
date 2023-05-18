<script lang="ts">
    import type { ActionData } from "../routes/(main)/$types";
    import { getReadableMillis } from "./sharedfuncs";
    import type { PunishEntry } from "./types";

    let currentTime = new Date().getTime();

    export let form: ActionData;
    export let entry: PunishEntry;
    export let type: string;

    function redirect(loc: string) {
        window.location.href = loc;
    }
</script>

<section class="container box">
    {#if !entry.active}
        <div class="content has-text-centered">
            <h1>Revoke {type} #{entry.id}</h1>
            <h3>{type} on {entry.name} by {entry.by_name} for {getReadableMillis(entry.until, entry.time)}</h3>
            <p><b>Reason: </b>{entry.reason}</p>
            <div class="notification is-danger">This {type.toLowerCase()} has been removed by {entry.removed_name} for {entry.removed_reason}.</div>

            <a class="button" href={"/" + type.toLowerCase() + "s/" + entry.id}>Back</a>
        </div>
    {:else if entry.until != BigInt(-1) && BigInt(currentTime) >= entry.until}
        <div class="content has-text-centered">
            <h1>Revoke {type} #{entry.id}</h1>
            <h3>{type} on {entry.name} by {entry.by_name} for {getReadableMillis(entry.until, entry.time)}</h3>
            <p><b>Reason: </b>{entry.reason}</p>
            <div class="notification is-danger">This {type.toLowerCase()} is due to expire.</div>

            <a class="button" href={"/" + type.toLowerCase() + "s/" + entry.id}>Back</a>
        </div>
    {:else}
        <div class="content has-text-centered">
            <h1>Revoke {type} #{entry.id}</h1>
            <h3>{type} on {entry.name} by {entry.by_name} for {getReadableMillis(entry.until, entry.time)}</h3>
            <p><b>Reason: </b>{entry.reason}</p>
            <p><b>Expires In: </b>{getReadableMillis(entry.until, BigInt(currentTime))}</p>    
        </div>

        
        <section class="section">
            <form method="post">
                {#if form != null && !form.success}
                    <div class="notification is-danger">{form?.message}</div>
                {/if}
            

                <div class="field">
                    <label class="label">
                        Please enter your reason for revoking {entry.name}'s {type.toLowerCase()}
                        <br>
                        <div class="control">
                            <input name="reason" class="input " type="text" placeholder="Reason for revoking the {type.toLowerCase()}">
                        </div>
                    </label>
                </div>

                <div class="buttons control">
                    <button class="button is-danger">Revoke {type}</button>
                    <a class="button" href={"/" + type.toLowerCase() + "s/" + entry.id}>Back</a>
                </div>
            </form>  
        </section>    
    {/if}  

</section>