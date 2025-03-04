<template>
  <div class="post-detail-page">
    <div v-if="loading" class="loading">
      <Icon name="heroicons:arrow-path" class="spinner" />
      Chargement de l'article...
    </div>
    <div v-else-if="error" class="error">
      <Icon name="heroicons:exclamation-triangle" />
      Une erreur est survenue lors du chargement de l'article.
    </div>
    <div v-else class="post-detail">
      <div class="post-header">
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="post-meta">
          <div class="meta-item">
            <Icon name="heroicons:calendar" class="icon" />
            <span>{{ formatDate(post.createdAt) }}</span>
          </div>
          <div v-if="post.author" class="meta-item">
            <Icon name="heroicons:user" class="icon" />
            <span>{{ post.author.name }}</span>
          </div>
        </div>
      </div>

      <div class="post-content">
        {{ post.content }}
      </div>

      <div class="post-actions">
        <NuxtLink to="/blog" class="back-btn">
          <Icon name="heroicons:arrow-left" class="icon" />
          Retour aux articles
        </NuxtLink>
        <div class="action-buttons">
          <button class="edit-btn" @click="handleEdit">
            <Icon name="heroicons:pencil-square" class="icon" />
            Modifier
          </button>
          <button class="delete-btn" @click="handleDelete">
            <Icon name="heroicons:trash" class="icon" />
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <EditPost
      v-if="showEditModal"
      :post="post"
      @close="closeEditModal"
      @update="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EditPost from './EditPost.vue';

const route = useRoute();
const router = useRouter();
const post = ref<any>(null);
const loading = ref(true);
const error = ref(false);
const showEditModal = ref(false);

const GET_POST_QUERY = `
  query GetPost($id: MongoID!) {
    post: post(_id: $id) {
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

const DELETE_POST_MUTATION = `
  mutation DeletePost($id: MongoID!) {
    removePost(_id: $id) {
      _id
    }
  }
`;

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const fetchPost = async () => {
  try {
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_POST_QUERY,
        variables: {
          id: route.params.id
        }
      })
    });
    
    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
      error.value = true;
      return;
    }
    
    if (result.data?.post) {
      post.value = result.data.post;
    } else {
      error.value = true;
      console.error('Post not found');
    }
  } catch (err) {
    error.value = true;
    console.error('Erreur lors de la récupération de l\'article:', err);
  } finally {
    loading.value = false;
  }
};

const handleEdit = () => {
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const handleUpdate = (updatedPost: any) => {
  post.value = updatedPost;
  showEditModal.value = false;
};

const handleDelete = async () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: DELETE_POST_MUTATION,
          variables: {
            id: post.value._id
          }
        })
      });

      const result = await response.json();

      if (result.data?.removePost) {
        router.push('/blog');
      } else {
        alert('Erreur lors de la suppression de l\'article');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la suppression de l\'article');
    }
  }
};

onMounted(() => {
  fetchPost();
});
</script>

<style scoped>
.post-detail-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.loading, .error {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 1.1rem;
  color: #4a5568;
}

.error {
  color: #dc2626;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.post-detail {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.post-header {
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1.5rem;
}

.post-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.post-meta {
  display: flex;
  gap: 2rem;
  color: #64748b;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  width: 1.2em;
  height: 1.2em;
}

.post-content {
  color: #4a5568;
  line-height: 1.8;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  white-space: pre-wrap;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.back-btn:hover {
  background: #f3f4f6;
  color: #1a202c;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.edit-btn, .delete-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.edit-btn {
  background: #eef2ff;
  color: #4f46e5;
}

.edit-btn:hover {
  background: #e0e7ff;
  transform: translateY(-1px);
}

.delete-btn {
  background: #fee2e2;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fecaca;
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .post-detail-page {
    padding: 1rem;
  }

  .post-detail {
    padding: 1.5rem;
  }

  .post-title {
    font-size: 2rem;
  }

  .post-meta {
    flex-direction: column;
    gap: 0.75rem;
  }

  .post-actions {
    flex-direction: column-reverse;
    gap: 1rem;
  }

  .action-buttons {
    width: 100%;
  }

  .edit-btn, .delete-btn {
    flex: 1;
    justify-content: center;
  }

  .back-btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 