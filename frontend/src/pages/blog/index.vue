<template>
  <div class="posts-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Articles</h1>
        <div class="sort-controls">
          <select v-model="sortBy" class="sort-select">
            <option value="title">Titre</option>
            <option value="createdAt">Date de création</option>
            <option value="author">Auteur</option>
          </select>
          <button @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'" class="sort-direction">
            <Icon :name="sortOrder === 'asc' ? 'uil:sort-amount-down' : 'uil:sort-amount-up'" />
          </button>
        </div>
      </div>
      <NuxtLink to="/blog/create" class="create-btn">
        <Icon name="uil:plus" />
        Nouvel article
      </NuxtLink>
    </div>
    
    <div v-if="loading" class="loading">
      Chargement des articles...
    </div>
    <div v-else-if="error" class="error">
      Une erreur est survenue lors du chargement des articles.
    </div>
    <div v-else class="posts-grid">
      <PostCard 
        v-for="post in sortedPosts" 
        :key="post._id" 
        :post="post"
        @edit="openEditModal"
        @delete="handleDelete"
      />
    </div>

    <!-- Modal d'édition -->
    <EditPost
      v-if="editingPost"
      :post="editingPost"
      @close="closeEditModal"
      @update="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import PostCard from './PostCard.vue';
import EditPost from './EditPost.vue';

interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    _id: string;
    name: string;
  };
}

const posts = ref<Post[]>([]);
const loading = ref(true);
const error = ref(false);
const sortBy = ref('createdAt');
const sortOrder = ref('desc');
const editingPost = ref(null);

const sortedPosts = computed(() => {
  return [...posts.value].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy.value) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'createdAt':
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        break;
      case 'author':
        comparison = (a.author?.name || '').localeCompare(b.author?.name || '');
        break;
    }
    
    return sortOrder.value === 'asc' ? comparison : -comparison;
  });
});

const GET_POSTS_QUERY = `
  query GetPosts {
    posts {
      _id
      title
      content
      createdAt
      author {
        _id
        name
      }
    }
  }
`;

const fetchPosts = async () => {
  try {
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_POSTS_QUERY
      })
    });
    const result = await response.json();
    posts.value = result.data.posts;
  } catch (err) {
    error.value = true;
    console.error('Erreur lors de la récupération des articles:', err);
  } finally {
    loading.value = false;
  }
};

const openEditModal = (post: null) => {
  editingPost.value = post;
};

const closeEditModal = () => {
  editingPost.value = null;
};

const handleUpdate = (updatedPost: Post) => {
  const index = posts.value.findIndex(p => p._id === updatedPost._id);
  if (index !== -1) {
    posts.value[index] = updatedPost;
  }
  closeEditModal();
};

const handleDelete = async (postId: string) => {
  // Filtrer le post supprimé de la liste locale
  posts.value = posts.value.filter(post => post._id !== postId);
};

onMounted(() => {
  fetchPosts();
});
</script>

<style scoped>
.posts-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

*, :before, :after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: rgb(var(--color-gray-200) / 1);
  gap: 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1a202c;
}

.sort-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.sort-select {
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
  background-color: white;
  color: #4a5568;
  font-size: 0.875rem;
}

.sort-direction {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
  background-color: white;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
}

.sort-direction:hover {
  background-color: #f7fafc;
  color: #2d3748;
}

.create-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.create-btn:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
}

.create-btn .icon {
  width: 1.2em;
  height: 1.2em;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: #4a5568;
  font-size: 1.1rem;
}

.error {
  color: #dc2626;
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-content {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .sort-controls {
    width: 100%;
  }
  
  .sort-select {
    flex-grow: 1;
  }
  
  .create-btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 