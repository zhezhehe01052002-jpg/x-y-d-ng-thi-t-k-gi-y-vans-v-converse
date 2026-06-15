<template>
  <div id="app">
    <AppHeader />
    <CartDrawer />
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <SupportChat />
    <AppFooter />
    <GlobalToast />
    <BackToTop />
  </div>
</template>

<script setup>
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import CartDrawer from './components/cart/CartDrawer.vue'
import SupportChat from './components/layout/SupportChat.vue'
import GlobalToast from './components/ui/GlobalToast.vue'
import BackToTop from './components/ui/BackToTop.vue'
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
