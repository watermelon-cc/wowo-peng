<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
          <el-button type="primary" @click="handleEdit" v-if="!isEditing">编辑</el-button>
        </div>
      </template>
      
      <el-form 
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        :disabled="!isEditing"
      >
      <el-form-item label="头像">
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
        </el-form-item>

        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="formData.user_name" />
        </el-form-item>
        
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="formData.age" type="number" />
        </el-form-item>
        
        <el-form-item label="性别" prop="sex">
          <el-select v-model="formData.sex" placeholder="请选择性别">
            <el-option label="男" value="male" />
            <el-option label="女" value="female" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" />
        </el-form-item>
        
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" />
        </el-form-item>
        
        <el-form-item v-if="isEditing">
          <el-button type="primary" @click="handleSave">保存</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { supabase } from '@/lib/supabase'
import { faker } from '@faker-js/faker'

const isEditing = ref(false)
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
    const { data } = await supabase.auth.getUser()
    formData.email = data?.user?.email || ''
    const id = data?.user?.id
    if(!id) return
    formData.id = id
    getUserDetails(id)
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  }
}

// 获取用户详细信息
const getUserDetails = async (id) => {
  try {
    let { data: user_info } = await supabase
      .from('user_info')
      .select('*')
      .eq('id', id)
    
    if(!user_info.length) {
      formData.user_name = faker.person.fullName()
      formData.age = faker.number.int({ min: 18, max: 60 })
      formData.sex = 'male'
      formData.email = faker.internet.email()
      formData.phone = faker.phone.number('1##########')
      formData.avatar = faker.image.avatar()
    } else {
      let user = user_info.find(user => user.id === id)
      // 通过Object.assign() 方法将 user 对象的属性复制到 formData 对象中
      Object.assign(formData, user)
    }
  } catch (error) {
    ElMessage.error('获取用户详细信息失败')
  }
}

// 编辑按钮点击事件
const handleEdit = () => {
  isEditing.value = true
}

// 保存按钮点击事件
const handleSave = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
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

        if (error) {
          throw error
        }

        ElMessage.success('保存成功')
        isEditing.value = false
      } catch (error) {
        ElMessage.error('保存失败')
      }
    }
  })
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
  padding: 20px;
}

.profile-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-uploader {
  text-align: center;
}

.avatar-uploader .avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: block;
  object-fit: cover;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}
</style>