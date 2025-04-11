<template>
  <el-dialog v-model="visible" :show-close="false" width="500">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">信息维护</h4>
        <div>
          <el-button type="danger" @click="close">
            <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
            关闭
          </el-button>
          <el-button type="primary" @click="save">
            <el-icon class="el-icon--left"><CircleCheckFilled /></el-icon>
            保存
          </el-button>
        </div>
      </div>
    </template>
    <el-form :model="formData" label-width="100px">
      <el-form-item label="项目名称">
        <el-input v-model="formData.project_name" placeholder="请输入项目名称" />
      </el-form-item>
      <el-form-item label="项目描述">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入项目描述"
        />
      </el-form-item>
      <el-form-item label="测试时间">
        <el-date-picker
          v-model="formData.cur_version_test_time"
          type="datetime"
          placeholder="选择测试时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
        />
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="formData.cur_version_start_time"
          type="datetime"
          placeholder="选择开始时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="formData.cur_version_end_time"
          type="datetime"
          placeholder="选择结束时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
        />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, defineEmits } from 'vue'

const emit = defineEmits(['update'])
const visible = ref(false)
const formData = reactive({
  id: null,
  user_id: '',
  project_name: '',
  description: '',
  created_at: '',
  updated_at: '',
  cur_version_test_time: '',
  cur_version_start_time: null,
  cur_version_end_time: null
})

const show = (data) => {
  visible.value = true
  Object.assign(formData, data)
}

const close = () => {
  visible.value = false
}

const save = function () {
  emit('update', formData)
}

defineExpose({
  show,
  close
})
</script>

<style scoped>
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}
</style>
