<template>
  <div class="layout">
    <Header />
    <slot />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style> 