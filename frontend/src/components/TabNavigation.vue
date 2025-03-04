<template>
  <div class="tab-navigation">
    <div class="tabs">
      <button 
        :class="{ active: activeTab === 'posts' }"
        @click="activeTab = 'posts'"
      >
        Posts
      </button>
      <button 
        :class="{ active: activeTab === 'users' }"
        @click="activeTab = 'users'"
      >
        Users
      </button>
    </div>
    
    <div class="tab-content">
      <div v-if="activeTab === 'posts'">
        <PostsList />
      </div>
      <div v-if="activeTab === 'users'">
        <UsersList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const activeTab = ref('posts')
</script>

<style scoped>
.tab-navigation {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  color: #6b7280;
  position: relative;
}

.tabs button.active {
  color: #3b82f6;
  font-weight: 600;
}

.tabs button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #3b82f6;
}

.tab-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style> 