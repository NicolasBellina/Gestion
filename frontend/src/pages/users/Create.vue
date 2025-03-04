<template>
  <div class="create-user-modal">
    <div class="modal-overlay" @click.self="$emit('close')"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h2>Nouvel utilisateur</h2>
        <button class="close-btn" @click="$emit('close')">
          <Icon :icon="'uil:times'" />
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="create-form">
        <!-- Avatar upload -->
        <div class="form-group">
          <label for="avatar">Photo de profil</label>
          <div class="avatar-upload">
            <img v-if="avatarPreview" :src="avatarPreview" class="avatar-preview" alt="Aperçu de l'avatar" />
            <div v-else class="avatar-placeholder">
              <Icon :icon="'uil:user-circle'" />
            </div>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              @change="handleAvatarChange"
              class="avatar-input"
            />
            <button type="button" class="upload-btn" @click="triggerFileInput">
              <Icon :icon="'uil:camera'" />
              Choisir une photo
            </button>
          </div>
        </div>

        <div class="form-group">
          <label for="name">Nom</label>
          <input 
            id="name"
            v-model="user.name"
            type="text"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="user.email"
            type="email"
            required
            class="form-input"
          />
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="$emit('close')">
            Annuler
          </button>
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? 'Création...' : 'Créer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

const emit = defineEmits(['close', 'create']);

const loading = ref(false);
const avatarPreview = ref('');
const avatarFile = ref<File | null>(null);

const user = ref({
  name: '',
  email: ''
});

const CREATE_USER_MUTATION = `
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      _id
      name
      email
      createdAt
    }
  }
`;

const handleAvatarChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    avatarFile.value = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(input.files[0]);
  }
};

const triggerFileInput = () => {
  document.getElementById('avatar')?.click();
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: CREATE_USER_MUTATION,
        variables: {
          input: {
            name: user.value.name,
            email: user.value.email
          }
        }
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    if (result.data?.createUser) {
      emit('create', result.data.createUser);
      emit('close');
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert('Une erreur est survenue lors de la création de l\'utilisateur');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.create-user-modal {
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
  animation: modalAppear 0.3s ease-out;
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
  transform: scale(1.05);
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
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

.form-input:hover {
  border-color: #d1d5db;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
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
  padding: 0.75rem 1.5rem;
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
  transform: translateY(-1px);
}

.submit-btn {
  background: #3b82f6;
  color: white;
  border: none;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .modal-content {
    width: 95%;
    padding: 1.5rem;
    margin: 1rem;
  }

  .form-actions {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }

  .cancel-btn, .submit-btn {
    width: 100%;
    padding: 0.875rem;
  }

  .modal-header h2 {
    font-size: 1.25rem;
  }
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 2.5rem;
}

.avatar-input {
  display: none;
}

.upload-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-btn:hover {
  background-color: #e5e7eb;
}
</style> 