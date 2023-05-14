<svelte:head>
	<title>Login | TrueOG</title>
</svelte:head>

<container class="container box">
    <div class="content has-text-centered">
        <img src="/logo-alternate-transparent.png" alt="TrueOG logo." />
        <p>Please login with your credentials below.</p>
    </div>

    <section class="section">
        <div class="field">
            <label class="label">Username</label>
            <div class="control">
              <input class="input " type="text" placeholder="Your username">
            </div>
        </div>

        <div class="field">
            <label class="label">Password</label>
            <div class="control">
              <input class="input " type="password" placeholder="Your password">
            </div>
        </div>

        <div class="control">
            <button class="button is-primary">Login</button>
          </div>
    </section>
</container>

<style lang="scss">
    img {
        width: 50%;
        height: auto;
    }
</style>