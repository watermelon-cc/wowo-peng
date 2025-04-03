<template>
  <div class="profile-container">
    <div class="profile-header">
      <h2>个人信息</h2>
      <el-button 
        type="primary" 
        @click="handleEdit" 
        v-if="!isEditing"
        class="edit-button"
      >
        编辑
      </el-button>
    </div>

    <div class="profile-content">
      <el-form 
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        :disabled="!isEditing"
        class="profile-form"
      >
        <div class="avatar-section">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :disabled="!isEditing"
          >
            <img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="avatar-tip">点击上传头像</div>
        </div>

        <div class="form-section">
          <el-form-item label="用户名" prop="user_name">
            <el-input v-model="formData.user_name" placeholder="请输入用户名" />
          </el-form-item>
          
          <el-form-item label="年龄" prop="age">
            <el-input v-model.number="formData.age" type="number" placeholder="请输入年龄" />
          </el-form-item>
          
          <el-form-item label="性别" prop="sex">
            <el-select v-model="formData.sex" placeholder="请选择性别" class="w-full">
              <el-option label="男" value="male" />
              <el-option label="女" value="female" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" placeholder="请输入邮箱" />
          </el-form-item>
          
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="formData.phone" placeholder="请输入手机号" />
          </el-form-item>
        </div>

        <div class="form-actions" v-if="isEditing">
          <el-button type="primary" @click="handleSave" :loading="loading">保存</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { supabase } from '@/lib/supabase'
import { faker } from '@faker-js/faker'
import { useAuthStore } from '@/stores/store'

const isEditing = ref(false)
const loading = ref(false)
const formRef = ref(null)

const formData = reactive({
  id: null,
  user_name: '',
  age: null,
  sex: '',
  email: '',
  phone: '',
  avatar: ''
})

const rules = {
  user_name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', min: 1, max: 120, message: '年龄必须在 1 到 120 之间', trigger: 'blur' }
  ],
  sex: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 获取用户信息
const getUserInfo = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    formData.email = user.email
    formData.id = user.id
    
    const { data: profile, error } = await supabase
      .from('user_info')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (error) throw error
    
    if (profile) {
      profile.age = Number(profile.age)
      Object.assign(formData, profile)
    } else {
      // 如果没有用户信息，使用默认值
      formData.user_name = faker.person.fullName()
      formData.age = faker.number.int({ min: 18, max: 60 })
      formData.sex = faker.person.sex()
      formData.phone = faker.phone.number({ style: 'international' })
      formData.avatar = faker.image.avatar()
      
      // 保存默认信息
      await saveUserInfo()
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
  }
}

// 保存用户信息
const saveUserInfo = async () => {
  try {
    let result
    
    // 先查询用户信息是否存在
    const { data: existingData, error: queryError } = await supabase
      .from('user_info')
      .select('*')
      .eq('id', formData.id)
      .single()
    
    if (queryError && queryError.code !== 'PGRST116') { // PGRST116 表示记录不存在
      throw queryError
    }
    
    if (existingData) {
      // 编辑保存
      const { data, error } = await supabase
        .from('user_info')
        .update({
          user_name: formData.user_name,
          age: formData.age,
          sex: formData.sex,
          email: formData.email,
          phone: formData.phone,
          avatar: formData.avatar
        })
        .eq('id', formData.id)
        .select()
      
      if (error) throw error
      result = data[0]
    } else {
      // 新增保存
      const { data, error } = await supabase
        .from('user_info')
        .insert({
          id: formData.id,
          user_name: formData.user_name,
          age: formData.age,
          sex: formData.sex,
          email: formData.email,
          phone: formData.phone,
          avatar: formData.avatar
        })
        .select()
      
      if (error) throw error
      result = data[0]
    }

    // 更新 store 中的用户信息
    useAuthStore().setUserInfo(result)
    return true
  } catch (error) {
    console.error('保存用户信息失败:', error)
    ElMessage.error('保存失败：' + error.message)
    return false
  }
}

// 编辑按钮点击事件
const handleEdit = () => {
  isEditing.value = true
}

// 保存按钮点击事件
const handleSave = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    const success = await saveUserInfo()
    if (success) {
      ElMessage.success('保存成功')
      isEditing.value = false
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    loading.value = false
  }
}

// 取消按钮点击事件
const handleCancel = () => {
  isEditing.value = false
  getUserInfo() // 重新获取用户信息，恢复原始数据
}

// 头像上传成功回调
const handleAvatarSuccess = (response) => {
  formData.avatar = response.url
  ElMessage.success('头像上传成功')
}

// 头像上传前的验证
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

// 页面加载时获取用户信息
onMounted(() => {
  getUserInfo()
})
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.profile-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.edit-button {
  background-color: #3ecf8e;
  border-color: #3ecf8e;
}

.edit-button:hover {
  background-color: #2fb67c;
  border-color: #2fb67c;
}

.profile-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar-uploader {
  text-align: center;
}

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: block;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.avatar-uploader .el-upload {
  border: 2px dashed #e5e7eb;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.avatar-uploader .el-upload:hover {
  border-color: #3ecf8e;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}

.avatar-tip {
  color: #6b7280;
  font-size: 0.875rem;
}

.form-section {
  display: grid;
  gap: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

:deep(.el-input__wrapper:hover),
:deep(.el-select__wrapper:hover) {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-select__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(62, 207, 142, 0.2);
}

.w-full {
  width: 100%;
}
</style>