<template>
  <div class="flex items-center py-2 px-4 hover:bg-gray-50">
    <el-checkbox 
      :model-value="isCompleted" 
      @update:model-value="$emit('change', $event)" 
    />
    <span :class="['ml-10', { 'line-through text-gray-400 italic': isCompleted }]">
      {{ content }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  content: {
    type: String,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
})

defineEmits(['change'])
</script> 