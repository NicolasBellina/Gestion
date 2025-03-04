<template>
  <div class="edit-post-modal">
    <div class="modal-overlay" @click="$emit('close')"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h2>Modifier l'article</h2>
        <button class="close-btn" @click="$emit('close')">
          <Icon name="uil:times" />
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="edit-form">
        <div class="form-group">
          <label for="title">Titre</label>
          <input 
            id="title"
            v-model="formData.title"
            type="text"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label for="content">Contenu</label>
          <textarea
            id="content"
            v-model="formData.content"
            class="form-input content-input"
            required
            rows="6"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="$emit('close')">
            Annuler
          </button>
          <button type="submit" class="submit-btn" :disabled="loading">
            <Icon v-if="loading" name="uil:spinner" class="spinner" />
            <span>{{ loading ? 'Modification en cours...' : 'Enregistrer' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  post: {
    _id: string;
    title: string;
    content: string;
  }
}>();

const emit = defineEmits(['close', 'update']);

const loading = ref(false);
const formData = ref({
  title: '',
  content: ''
});

const UPDATE_POST_MUTATION = `
  mutation UpdatePost($id: MongoID!, $title: String!, $content: String!) {
    updatePost(_id: $id, record: { title: $title, content: $content }) {
      _id
      title
      content
      createdAt
      author {
        _id
        name
        email
      }
    }
  }
`;

const handleSubmit = async () => {
  loading.value = true;
  try {
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: UPDATE_POST_MUTATION,
        variables: {
          id: props.post._id,
          title: formData.value.title,
          content: formData.value.content
        }
      })
    });

    const result = await response.json();

    if (result.data?.updatePost) {
      emit('update', result.data.updatePost);
      emit('close');
    } else if (result.errors) {
      console.error('Erreurs:', result.errors);
      alert('Erreur lors de la modification de l\'article');
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert('Une erreur est survenue lors de la modification de l\'article');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  formData.value = {
    title: props.post.title,
    content: props.post.content
  };
});
</script>

<style scoped>
.edit-post-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  z-index: 1001;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
}

.close-btn {
  background: none;
  border: none;
  color: #4a5568;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #1a202c;
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-btn, .cancel-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: #e5e7eb;
  color: #4b5563;
  border: none;
}

.cancel-btn:hover {
  background-color: #d1d5db;
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
</style> 