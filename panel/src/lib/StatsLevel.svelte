<script lang="ts">
    import type { OnlineStats, PunishStats } from '$lib/types';

    export let onlineStats: OnlineStats;
    export let punishStats: PunishStats;
</script>

<nav class="level">
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