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

const activeTab = ref('posts');
</script>