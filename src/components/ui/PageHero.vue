<template>
  <div class="page-hero">
    <div class="container">
      <h1 class="page-title">{{ title }}</h1>
      <nav class="page-breadcrumb" aria-label="breadcrumb">
        <template v-for="(crumb, i) in crumbs" :key="i">
          <router-link v-if="crumb.to" :to="crumb.to">{{ crumb.label }}</router-link>
          <span v-else>{{ crumb.label }}</span>
          <span v-if="i < crumbs.length - 1" class="sep">/</span>
        </template>
      </nav>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  crumbs: {
    type: Array,
    default: () => []
    // Each crumb: { label: String, to?: String }
    // If `to` is provided, renders as a router-link; otherwise plain text.
  }
})
</script>
