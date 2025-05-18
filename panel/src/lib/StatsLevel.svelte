<script lang="ts">
    import type { OnlineStats, PunishStats } from '$lib/types';

    interface Props {
        onlineStats: OnlineStats;
        punishStats: PunishStats;
    }

    let { onlineStats, punishStats }: Props = $props();
</script>

<nav class="level">
    {#if !onlineStats.online}
        <div class="level-item has-text-centered">
            <div>
                <p class="heading">Server Status</p>
                <p class="title">OFFLINE</p>
            </div>
        </div>
    {:else}
        <div class="level-item has-text-centered">
            <div>
                <p class="heading">Players Online</p>
                <p class="title">{onlineStats.players}</p>
            </div>
        </div>
        <div class="level-item has-text-centered">
            <div>
                <p class="heading">Staff Online</p>
                <p class="title">{onlineStats.staff}</p>
            </div>
        </div>
    {/if}
    <div class="level-item has-text-centered">
        <div>
            <p class="heading">Total Punishmnets</p>
            <p class="title">{punishStats.total}</p>
        </div>
    </div>
    <div class="level-item has-text-centered">
        <div>
            <p class="heading">Punishments this Month</p>
            <p class="title">{punishStats.month}</p>
        </div>
    </div>
    <div class="level-item has-text-centered">
        <div>
            <p class="heading">Punishments this Week</p>
            <p class="title">{punishStats.week}</p>
        </div>
    </div>
    <div class="level-item has-text-centered">
        <div>
            <p class="heading">Punishments Today</p>
            <p class="title">{punishStats.day}</p>
        </div>
    </div>
</nav>