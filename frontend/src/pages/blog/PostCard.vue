<template>
  <div class="post-card">
    <div class="post-header">
      <h2 class="post-title">{{ post.title }}</h2>
      <div class="post-meta">
        <div class="meta-item">
          <Icon name="heroicons:calendar" class="icon" />
          <span class="post-date">{{ formatDate(post.createdAt) }}</span>
        </div>
        <div v-if="post.author" class="meta-item">
          <Icon name="heroicons:user" class="icon" />
          <span class="post-author">{{ post.author.name }}</span>
        </div>
      </div>
    </div>
    <p class="post-content">{{ post.content }}</p>
    <div class="post-footer">
      <NuxtLink :to="`/blog/${post._id}`" class="read-more">
        <span>Lire la suite</span>
        <Icon name="uil:arrow-right" class="icon" />
      </NuxtLink>
      <div class="action-buttons">
        <button class="action-btn edit" @click="handleEdit(post._id)">
          <Icon name="uil:edit" />
          <span class="tooltip">Modifier</span>
        </button>
        <button class="action-btn delete" @click="handleDelete(post._id)">
          <Icon name="uil:trash-alt" />
          <span class="tooltip">Supprimer</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const props = defineProps<{
  post: Post;
}>();

const DELETE_POST_MUTATION = `
  mutation DeletePost($id: MongoID!) {
    removePost(_id: $id) {
      _id
    }
  }
`;

const emit = defineEmits(['edit', 'delete']);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const handleDelete = async (postId: string) => {
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
            id: postId
          }
        })
      });

      const result = await response.json();

      if (result.data?.removePost) {
        emit('delete', postId);
      } else if (result.errors) {
        console.error('Erreurs:', result.errors);
        alert('Erreur lors de la suppression de l\'article');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la suppression de l\'article');
    }
  }
};

const handleEdit = (postId: string) => {
  emit('edit', props.post);
};
</script>

<style scoped>
.post-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.post-header {
  margin-bottom: 1.5rem;
}

.post-title {
  color: #1a202c;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.post-meta {
  display: flex;
  gap: 1.5rem;
  color: #64748b;
  font-size: 0.9rem;
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
  line-height: 1.7;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.read-more {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  padding: 0.5rem 0;
}

.read-more:hover {
  color: #2563eb;
  gap: 0.75rem;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn .tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  background-color: #1f2937;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s;
}

.action-btn .tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: #1f2937 transparent transparent transparent;
}

.action-btn:hover .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-4px);
}

.action-btn.edit {
  background-color: #eef2ff;
  color: #4f46e5;
}

.action-btn.edit:hover {
  background-color: #e0e7ff;
  transform: translateY(-2px);
}

.action-btn.delete {
  background-color: #fee2e2;
  color: #dc2626;
}

.action-btn.delete:hover {
  background-color: #fecaca;
  transform: translateY(-2px);
}

@media (max-width: 640px) {
  .post-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .action-btn .tooltip {
    display: none;
  }
}
</style> 