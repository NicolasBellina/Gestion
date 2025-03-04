<template>
  <div class="edit-user-modal">
    <div class="modal-overlay" @click="$emit('close')"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h2>Modifier l'utilisateur</h2>
        <button class="close-btn" @click="$emit('close')">
          <Icon name="uil:times" />
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="edit-form">
        <div class="avatar-section">
          <div class="avatar-preview">
            <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar preview" class="avatar-image" />
            <Icon v-else name="heroicons:user-circle" class="avatar-icon" />
          </div>
          <label class="photo-upload-btn">
            <Icon name="heroicons:camera" class="camera-icon" />
            <span>Choisir une photo</span>
            <input
              type="file"
              accept="image/*"
              @change="handleAvatarChange"
              class="hidden-input"
            />
          </label>
        </div>

        <div class="form-group">
          <label for="name">Nom</label>
          <input 
            id="name"
            v-model="formData.name"
            type="text"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            class="form-input"
            required
          />
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
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  }
}>();

const emit = defineEmits(['close', 'update']);

const loading = ref(false);
const formData = ref({
  name: '',
  email: '',
  avatar: ''
});
const avatarPreview = ref('');

const UPDATE_USER_MUTATION = `
  mutation UpdateUser($id: MongoID!, $record: UpdateUserInput!) {
    updateUser(_id: $id, record: $record) {
      _id
      name
      email
      avatar
      createdAt
    }
  }
`;

const handleAvatarChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) { // 5MB max
      alert('L\'image est trop volumineuse. Taille maximum : 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const base64String = e.target.result as string;
        formData.value.avatar = base64String;
        avatarPreview.value = base64String;
      }
    };
    reader.onerror = () => {
      alert('Erreur lors de la lecture du fichier');
    };
    reader.readAsDataURL(file);
  }
};

const removeAvatar = () => {
  avatarPreview.value = '';
  formData.value.avatar = '';
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    const updateData: any = {
      name: formData.value.name,
      email: formData.value.email
    };

    // Ajouter l'avatar seulement s'il a été modifié
    if (formData.value.avatar !== props.user.avatar) {
      updateData.avatar = formData.value.avatar || null;
    }

    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: UPDATE_USER_MUTATION,
        variables: {
          id: props.user._id,
          record: updateData
        }
      })
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    if (result.data?.updateUser) {
      emit('update', result.data.updateUser);
      emit('close');
    } else {
      throw new Error('La mise à jour a échoué');
    }
  } catch (error: any) {
    console.error('Erreur:', error);
    alert(error.message || 'Une erreur est survenue lors de la modification de l\'utilisateur');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  formData.value = {
    name: props.user.name,
    email: props.user.email,
    avatar: props.user.avatar || ''
  };
  avatarPreview.value = props.user.avatar || '';
});
</script>

<style scoped>
.edit-user-modal {
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
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 500px;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  z-index: 1001;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  border: none;
  background: #f3f4f6;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  color: #1f2937;
  background: white;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn, .submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.cancel-btn:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.submit-btn {
  background: #3b82f6;
  color: white;
  border: none;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .modal-content {
    width: 95%;
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .cancel-btn, .submit-btn {
    width: 100%;
  }
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid #e5e7eb;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-icon {
  width: 80px;
  height: 80px;
  color: #9ca3af;
}

.photo-upload-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #4b5563;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.photo-upload-btn:hover {
  background-color: #e5e7eb;
}

.camera-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.hidden-input {
  display: none;
}

/* Animation pour le hover */
.photo-upload-btn {
  position: relative;
  overflow: hidden;
}

.photo-upload-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.05);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.photo-upload-btn:hover::after {
  opacity: 1;
}

/* Style pour le focus */
.photo-upload-btn:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Style pour l'état actif */
.photo-upload-btn:active {
  transform: translateY(1px);
}
</style> 