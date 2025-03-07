<template>
  <header class="header">
    <nav class="nav-container">
      <NuxtLink to="/" class="logo">
        Mon Blog
      </NuxtLink>
      <div class="nav-links">
        <NuxtLink to="/blog" class="nav-link">Blog</NuxtLink>
        <NuxtLink to="/users" class="nav-link">Utilisateurs</NuxtLink>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 600;
  color: #3b82f6;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #3b82f6;
}
</style> 