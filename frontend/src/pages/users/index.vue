<template>
  <div class="posts-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Utilisateurs</h1>
        <div class="sort-controls">
          <select v-model="sortBy" class="sort-select">
            <option value="name">Nom</option>
            <option value="email">Email</option>
            <option value="createdAt">Date de création</option>
          </select>
          <button @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'" class="sort-direction">
            <Icon :name="sortOrder === 'asc' ? 'uil:sort-amount-down' : 'uil:sort-amount-up'" :icon="sortOrder === 'asc' ? 'uil:sort-amount-down' : 'uil:sort-amount-up'" />
          </button>
        </div>
      </div>
      <button class="create-btn" @click="showCreateModal = true">
        <Icon :name="'uil:plus'" :icon="'uil:plus'" />
        Nouvel utilisateur
      </button>
    </div>

    <div class="posts-grid">
      <UserCard 
        v-for="user in sortedUsers" 
        :key="user._id" 
        :user="user"
        :post-count="user.postCount"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Modals -->
    <CreateUserModal v-if="showCreateModal" @close="showCreateModal = false" @create="handleCreate" />
    <EditUserModal v-if="editingUser" :user="editingUser" @close="closeEditModal" @update="handleUpdate" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Icon } from '@iconify/vue';
import UserCard from './UserCard.vue';
import EditUserModal from './EditUserModal.vue';
import CreateUserModal from './Create.vue';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  postCount?: number;
}

const users = ref<User[]>([]);
const sortBy = ref('name');
const sortOrder = ref('asc');
const editingUser = ref<User | null>(null);
const showCreateModal = ref(false);

const sortedUsers = computed(() => {
  if (!Array.isArray(users.value)) return [];
  
  return [...users.value].sort((a, b) => {
    if (sortBy.value === 'createdAt') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return (a[sortBy.value as keyof User] ?? '').toString().localeCompare((b[sortBy.value as keyof User] ?? '').toString());
  });
});

const GET_USERS_QUERY = `
  query GetUsers {
    users {
      _id
      name
      email
      avatar
      createdAt
    }
  }
`;

const DELETE_USER_MUTATION = `
  mutation DeleteUser($id: MongoID!) {
    removeUser(_id: $id) {
      _id
      name
      email
    }
  }
`;

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
    if (result.data?.users) {
      users.value = result.data.users;
    } else {
      console.error('Pas de données utilisateurs reçues:', result);
      users.value = [];
    }
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error);
    users.value = [];
  }
};

const handleEdit = (user: any) => {
  editingUser.value = user;
};

const handleDelete = async (user: any) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: DELETE_USER_MUTATION,
          variables: {
            id: user._id
          }
        })
      });

      const result = await response.json();

      if (result.errors) {
        console.error('Erreurs:', result.errors);
        throw new Error(result.errors[0].message);
      }

      if (result.data?.removeUser) {
        users.value = users.value.filter(u => u._id !== user._id);
      } else {
        throw new Error('La suppression a échoué');
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      alert(error.message || 'Une erreur est survenue lors de la suppression de l\'utilisateur');
    }
  }
};

const handleUpdate = (updatedUser: any) => {
  const index = users.value.findIndex(u => u._id === updatedUser._id);
  if (index !== -1) {
    users.value[index] = updatedUser;
  }
  editingUser.value = null;
};

const closeEditModal = () => {
  editingUser.value = null;
};

const sortUsers = () => {
  // Implementation of sortUsers function
};

const handleCreate = (newUser: User) => {
  users.value.push(newUser);
  showCreateModal.value = false;
};

onMounted(() => {
  fetchUsers();
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