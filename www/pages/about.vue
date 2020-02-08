<template>
    <div>
        <header>
            <a href="/" class="logo">Push.</a>
            <div class="hamburger" onclick="activeMenu()">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </header>
        <div class="menu">
            <ul class="nav">
                <li><a href="/">Home.</a></li>
                <li><a href="/about.html">About.</a></li>
                <li><a href="/account-login.html">Account.</a></li>
                <li><a href="/choose-wallet.html">Create wallet.</a></li>
            </ul>
            <div class="lang-block">
                <button class="btn lang-active"><img src="/assets/img/svg/en.svg" alt="">En</button>
                <button class="btn"><img src="/assets/img/svg/rus.svg" alt="">Rus</button>
            </div>
        </div>
        <!-- /Header -->
        <!-- Content -->
        <main>
            <div class="container">
                <div class="conten-items">
                    <!-- Content Start -->
                    <div class="content__item about">
                        <h1>About</h1>
                        <p>This link-wallet is powered by Minter, a blockchain network that lets people, projects, and companies create and manage their own coins and exchange them at a fair price with absolute and instant liquidity.</p>
                        <p class="caption">Useful links:</p>
                        <ul class="useful-links">
                            <li><a target="_blank" rel="nofollow" href="https://www.minter.network/">What is Minter</a></li>
                            <li><a target="_blank" rel="nofollow" href="https://about.minter.network/">About Network</a></li>
                            <li><a target="_blank" rel="nofollow" href="https://console.minter.network/">Consol wallet</a></li>
                            <li><a target="_blank" rel="nofollow" href="https://t.me/MinterTeam">Telegram</a></li>
                        </ul>
                    </div>
                    <!-- /Content Start -->
                </div>
            </div>
        </main>
        <!-- /Content -->
        <!-- Footer -->
        <footer>
            <a href="https://www.minter.network/" target="_blank" class="copy">Powered by <span>Minter</span></a>
        </footer>
        <!-- /Footer -->
        <!-- /Page -->
        <!-- Scripts -->
        <!--<script src="assets/js/jQuery.min.js"></script>-->
        <!--<script src="assets/js/custom.js"></script>-->
    </div>
</template>

<script>
  export default {
    name: "about"
  }
</script>

<style scoped>

</style>