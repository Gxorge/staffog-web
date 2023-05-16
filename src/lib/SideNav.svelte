<script lang="ts">
    import type { AuthResult } from "./types";

    export let userInfo: AuthResult;
</script>

<div class="column is-1 staffog-sidenav">
    <aside class="menu">
        <img class="is-centered" src="/true-og-logo-transparent-background.png" alt="TrueOG logo." />
        <ul class="menu-list">
            <li><a href="/">Home</a></li>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/stafflist">Staff List</a></li>
            <li><a href="/reports">Reports</a></li>
            {#if userInfo.admin}
                <li><a href="/admin/appeals">Appeals</a></li>
            {/if}
            <li><a href="/">Staff Guide</a></li>
            <li><a href="https://true-og.net/staff-apps">Staff Apps</a></li>
            <li><a href="https://true-og.net/todo-list">To-Do List</a></li>
            <li><a href="/login/out">Sign-out</a></li>
        </ul>
    </aside>
</div>

<style lang="scss">
    .staffog-sidenav {
        background-color: rgb(42,57,80);
        height: 100vh;
    }

    img {
        padding-left: 20px;
        width: 60%;
        height: auto;
    }
</style>