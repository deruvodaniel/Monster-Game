<template>
  <div 
    :class="$style.avatar"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <img 
      :src="src" 
      :alt="alt"
      :class="$style.avatarImage"
      @error="handleImageError"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'Avatar'
  },
  size: {
    type: Number,
    default: 64
  }
})

const handleImageError = (event) => {
  // Fallback to a default avatar if image fails to load
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNlMmU4ZjAiLz4KPHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxNiIgeT0iMTYiPgo8cGF0aCBkPSJNMTIgMTJDMTQuNzYxNCAxMiAxNyA5Ljc2MTQyIDE3IDdDMTcgNC4yMzg1OCAxNC43NjE0IDIgMTIgMkM5LjIzODU4IDIgNyA0LjIzODU4IDcgN0M3IDkuNzYxNDIgOS4yMzg1OCAxMiAxMiAxMloiIGZpbGw9IiM2Mzc0OGIiLz4KPHBhdGggZD0iTTEyIDE0QzguNjg2MjkgMTQgNiAxNi42ODYzIDYgMjBWMjJIMThWMjBDMTggMTYuNjg2MyAxNS4zMTM3IDE0IDEyIDE0WiIgZmlsbD0iIzYzNzQ4YiIvPgo8L3N2Zz4KPC9zdmc+'
}
</script>

<style module>
.avatar {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--border-color);
  background: var(--surface-color);
}

.avatarImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.avatar:hover .avatarImage {
  transform: scale(1.05);
}
</style>