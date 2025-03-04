<template>
  <div class="user-card">
    <div class="user-avatar">
      <img v-if="user.avatar" :src="user.avatar" :alt="user.name" class="avatar-image" />
      <Icon v-else name="uil:user-circle" class="avatar-icon" />
    </div>
    <div class="user-info">
      <h3 class="user-name">{{ user.name }}</h3>
      <p class="user-email">{{ user.email }}</p>
      <p class="user-meta">
        <span class="meta-item">
          <Icon name="uil:calendar-alt" class="icon" />
          Membre depuis {{ formatDate(user.createdAt) }}
        </span>
        <span class="meta-item">
          <Icon name="uil:newspaper" class="icon" />
          {{ postCount }} article{{ postCount !== 1 ? 's' : '' }}
        </span>
      </p>
    </div>
    <div class="action-buttons">
      <button class="action-btn edit" @click="$emit('edit', user)">
        <Icon name="uil:edit" />
        <span class="tooltip">Modifier</span>
      </button>
      <button class="action-btn delete" @click="$emit('delete', user)">
        <Icon name="uil:trash-alt" />
        <span class="tooltip">Supprimer</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  avatar?: string;
}

const props = defineProps<{
  user: User;
  postCount?: number;
}>();

defineEmits(['edit', 'delete']);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped>
.user-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  display: flex;
  gap: 1.5rem;
  align-items: center;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.user-avatar {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-icon {
  width: 40px;
  height: 40px;
  color: #64748b;
}

.user-info {
  flex-grow: 1;
}

.user-name {
  color: #1a202c;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
}

.user-email {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0 0 0.75rem;
}

.user-meta {
  display: flex;
  gap: 1.5rem;
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
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

.action-buttons {
  display: flex;
  gap: 0.75rem;
  margin-left: auto;
}

.action-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn .icon {
  width: 1.2rem;
  height: 1.2rem;
  transition: transform 0.2s ease;
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
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.1);
}

.action-btn.edit:hover .icon {
  transform: rotate(15deg);
}

.action-btn.delete {
  background-color: #fee2e2;
  color: #dc2626;
}

.action-btn.delete:hover {
  background-color: #fecaca;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.1);
}

.action-btn.delete:hover .icon {
  transform: scale(1.1);
}

/* Animation pour le survol */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.action-btn:active {
  transform: translateY(0);
}

/* Responsive design */
@media (max-width: 640px) {
  .user-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .user-meta {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }

  .action-buttons {
    margin-left: 0;
    justify-content: center;
    width: 100%;
  }

  .action-btn {
    width: 3rem;
    height: 3rem;
  }

  .action-btn .icon {
    width: 1.4rem;
    height: 1.4rem;
  }

  .action-btn .tooltip {
    display: none;
  }
}
</style> 