<template>
  <el-config-provider :locale="zhCn">
    <el-dialog
      v-model="dialogVisible"
      :title="label"
      width="30%"
      :before-close="handleClose"
    >
      <div class="date-time-picker">
        <el-date-picker
          v-model="selectedDateTime"
          type="datetime"
          placeholder="选择日期时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </el-config-provider>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: '选择时间'
  },
  value: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectedDateTime = ref(props.value)

// 监听value变化，更新选中的时间
watch(() => props.value, (newVal) => {
  selectedDateTime.value = newVal
})

const handleClose = () => {
  dialogVisible.value = false
}

const handleConfirm = () => {
  emit('confirm', selectedDateTime.value)
  handleClose()
}
</script>

<style scoped>
.date-time-picker {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
</style> 