<template>
  <div class="create-post-page">
    <div class="page-header">
      <h1 class="page-title">Créer un nouvel article</h1>
      <NuxtLink to="/blog" class="back-link">
        <Icon name="uil:arrow-left" />
        Retour aux articles
      </NuxtLink>
    </div>
    <div class="create-post-form">
      <form @submit.prevent="handleSubmit" class="form">
        <div class="form-group">
          <label for="title">Titre</label>
          <input 
            id="title"
            v-model="formData.title"
            type="text"
            class="form-input"
            required
            placeholder="Entrez le titre de l'article"
          />
        </div>

        <div class="form-group">
          <label for="content">Contenu</label>
          <textarea
            id="content"
            v-model="formData.content"
            class="form-input content-input"
            required
            placeholder="Écrivez le contenu de votre article"
            rows="6"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="author">Auteur</label>
          <select
            id="author"
            v-model="formData.authorId"
            class="form-input"
            required
          >
            <option value="">Sélectionnez un auteur</option>
            <option v-for="user in users" :key="user._id" :value="user._id">
              {{ user.name }}
            </option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn" :disabled="loading">
            <Icon v-if="loading" name="uil:spinner" class="spinner" />
            <span>{{ loading ? 'Création en cours...' : 'Créer l\'article' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { navigateTo } from '#app';

interface FormData {
  title: string;
  content: string;
  authorId: string;
}

interface User {
  _id: string;
  name: string;
}

const formData = ref<FormData>({
  title: '',
  content: '',
  authorId: ''
});

const users = ref<User[]>([]);
const loading = ref(false);

// Requête GraphQL pour créer un article
const CREATE_POST_MUTATION = `
  mutation CreatePost($title: String!, $content: String!, $author: MongoID!) {
    createPost(title: $title, content: $content, author: $author) {
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

// Requête pour récupérer les utilisateurs
const GET_USERS_QUERY = `
  query GetUsers {
    users {
      _id
      name
    }
  }
`;

// Charger la liste des utilisateurs
const fetchUsers = async () => {
  try {
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_USERS_QUERY
      })
    });
    const result = await response.json();
    users.value = result.data.users;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
  }
};

// Gérer la soumission du formulaire
const handleSubmit = async () => {
  loading.value = true;
  try {
    const mutationData = {
      title: formData.value.title,
      content: formData.value.content,
      author: formData.value.authorId
    };

    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: CREATE_POST_MUTATION,
        variables: mutationData
      })
    });

    const result = await response.json();
    console.log('Réponse complète:', result);

    if (result.data?.createPost) {
      await navigateTo('/blog');
    } else if (result.errors) {
      console.error('Erreurs détaillées:', JSON.stringify(result.errors, null, 2));
      const errorMessage = result.errors.map((err: { message: any; }) => err.message).join('\n');
      alert('Erreur: ' + errorMessage);
    }
  } catch (error) {
    console.error('Erreur détaillée:', error);
    alert('Une erreur est survenue lors de la création de l\'article');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.create-post-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1a202c;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.back-link:hover {
  color: #3b82f6;
}

.create-post-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: white;
  color: #1a202c;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.content-input {
  min-height: 150px;
  resize: vertical;
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style> 