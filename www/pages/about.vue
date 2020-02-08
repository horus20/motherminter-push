<template>
    <div>
        <header>
            <a href="/" class="logo">Push.</a>
            <div :class="{'hamburger-active': IsActiveHamburgerClass}" class="hamburger" v-on:click="toggleMenu()">
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
        <transition name="fade">
            <div class="menu" v-bind:class="{ 'menu-visible': isShowMenu }" v-if="isShowMenu">
                <ul class="nav">
                    <li><a href="/">{{ $t('menu.home') }}.</a></li>
                    <li><a href="/about/">{{ $t('menu.about') }}.</a></li>
                    <!--<li><a href="#">{{ $t('menu.account') }}.</a></li>-->
                    <li><a href="#" v-on:click="startCreateMenu()">{{ $t('menu.createWallet') }}.</a></li>
                </ul>
                <div class="lang-block">
                    <button class="btn" v-bind:class="{ 'lang-active': currentLang === 'en' }"  v-on:click="changeLocale('en')"><img src="/assets/img/svg/en.svg" alt="">En</button>
                    <button class="btn" v-bind:class="{ 'lang-active': currentLang === 'ru' }"  v-on:click="changeLocale('ru')"><img src="/assets/img/svg/rus.svg" alt="">Rus</button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>

  export default {
    name: "about",
    data() {
      return {
        IsActiveHamburgerClass: false,
        isShowMenu: false
      }
    },
    methods: {
      toggleMenu: function () {
        this.isShowMenu = !this.isShowMenu
        this.IsActiveHamburgerClass = !this.IsActiveHamburgerClass
      },
      changeLocale: function (locale) {
        this.$i18n.setLocaleCookie(locale)
        this.$i18n.setLocale(locale)
      },
    },
    computed: {
      currentLang() {
        return this.$i18n.locale
      },
    }
  }
</script>

<style scoped>
    .menu-visible {
        opacity: 1;
        z-index: 9;
    }
    .fade-enter-active {
        transition: opacity .8s;
    }
    .fade-leave-active {
        transition: opacity .3s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>