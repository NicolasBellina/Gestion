<template>
  <div class="home-container">
    <h1 class="welcome-title">Bienvenue sur Mon Blog</h1>
    <div class="navigation-cards">
      <NuxtLink to="/blog" class="nav-card">
        <h2>Posts</h2>
        <p>Découvrez nos derniers articles</p>
      </NuxtLink>
      <NuxtLink to="/users" class="nav-card">
        <h2>Utilisateurs</h2>
        <p>Voir tous les utilisateurs</p>
      </NuxtLink>

    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1rem;
  text-align: center;
}

.welcome-title {
  font-size: 2.5rem;
  color: #1f2937;
  margin-bottom: 3rem;
}

.navigation-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.nav-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.nav-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px -1px rgba(0, 0, 0, 0.15);
}

.nav-card h2 {
  color: #3b82f6;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.nav-card p {
  color: #6b7280;
}
</style> 