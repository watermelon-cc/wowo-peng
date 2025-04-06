<template>
	<div class="w-full h-full rounded border flex-col">
		<div class="h-50 flex items-center justify-between cursor-pointer px-15 relative" style="border-bottom: 1px solid #eee;">
			<!-- 进度背景 -->
			<div 
				class="absolute left-0 top-0 h-full bg-blue-100 transition-all duration-300"
				:style="{ width: `${progressPercentage}%`, 'z-index': 1 }"
			></div>
			<div class="flex items-center relative z-10">
				<el-popover trigger="hover">
          <ul class="py-5">
            <li class="mb-10 cursor-pointer flex items-center" @click="handleEdit()">
							<el-icon size="16"><Operation /></el-icon>
							<span class="pl-10 text-333">维护</span>
						</li>
            <li class="mt-10 cursor-pointer flex items-center" @click="handleDel()">
							<el-icon size="16" color="#F56C6C"><Delete /></el-icon>
							<span class="pl-10 text-333">删除</span>
						</li>
          </ul>
          <template #reference>
            <div class="flex items-center h-full">
							<el-icon size="18" color="#666"><Menu /></el-icon>
						</div>
          </template>
        </el-popover>

				<el-badge :value="completedCount" class="item" type="primary" style="z-index: 2;">
					<span class="text-666 pl-6" :title="info.description">{{ project_info.project_name }}</span>
				</el-badge>
			</div>
			<div class="flex items-center" @click="showDateTimeDialog = true" style="z-index: 2;">
				<el-icon size="18" color="#666"><Timer /></el-icon>
				<span class="text-666 pl-6">提测时间：{{ project_info.cur_version_test_time || '待填写' }}</span>
			</div>
		</div>
		<div class="flex-1 p-15 overflow-auto">
			<todo-item
				v-for="(todo, index) in todoList"
				:key="index"
				:content="todo.content"
				:is-completed="todo.completed"
				@change="handleTodoChange(index, $event)"
			/>
		</div>

    <date-time-dialog
      v-model="showDateTimeDialog"
      label="选择提测时间"
      :value="project_info.cur_version_test_time"
      @confirm="handleTestTimeConfirm"
    />
	</div>
</template>

<script setup>
import { faker } from '@faker-js/faker'
import { ref, reactive, computed } from 'vue'
import { fromDate } from '@/utils/utils'
import TodoItem from './todo-item.vue'
import DateTimeDialog from './common/date-time-dialog.vue'
import { DEL_PROJECT, UPDATE_PROJECT } from '@/api/supabase.project.api'

const emit = defineEmits(['delete'])

const props = defineProps({
	info: {
		type: Object,
		required: true
	}
})

const showDateTimeDialog = ref(false)

const project_info = reactive({
	project_name: props.info.project_name || '口腔医院',
	cur_version_test_time: props.info.cur_version_test_time || ''
})

// 生成5条随机代办事项，包含完成状态
const todoList = ref(
	Array.from({ length: 10 }, () => ({
		content: faker.lorem.sentence(),
		completed: false
	}))
)

// 计算未完成的待办项数量
const completedCount = computed(() => {
	return todoList.value.filter(todo => !todo.completed).length
})

// 计算进度百分比
const progressPercentage = computed(() => {
	if (!project_info.cur_version_test_time) return 0
	
	const testTime = new Date(project_info.cur_version_test_time)
	const now = new Date()
	const startTime = new Date(testTime)
	startTime.setDate(startTime.getDate() - 10) // 提前10天开始
	
	// 如果当前时间早于开始时间，进度为0
	if (now < startTime) return 0
	// 如果当前时间晚于提测时间，进度为100%
	if (now > testTime) return 100
	
	const totalDuration = testTime - startTime
	const elapsedDuration = now - startTime
	return Math.round((elapsedDuration / totalDuration) * 100)
})

const handleTodoChange = (index, completed) => {
	todoList.value[index].completed = completed
}

const handleDel = () => {
	ElMessageBox.confirm(
		'此操作将永久删除该项目, 是否继续?', "提示", {
			type: 'warning',
			confirmButtonText: '确定',
			cancelButtonText: '取消',
		}
	).then(() => {
		DEL_PROJECT({id: props.info.id}).then(res => {
			if (res.success) {
				ElMessage({ type: 'success', message: res.message })
				emit('delete')
			} else {
				ElMessage({ type: 'error', message: res.message })
			}
		})
	}).catch(() => {
		console.log('取消删除')
	})
}

const handleEdit = () => {
	// 这里可以添加编辑项目的逻辑
	ElMessage({ type: 'info', message: '编辑功能尚未实现' })
}

const handleTestTimeConfirm = (time) => {
  project_info.cur_version_test_time = time
  // 这里可以调用API更新提测时间
  UPDATE_PROJECT({
    id: props.info.id,
    cur_version_test_time: time
  }).then(res => {
    if (res.success) {
      ElMessage({ type: 'success', message: res.message })
    } else {
      ElMessage({ type: 'error', message: res.message })
    }
  })
}
</script>

<style scoped>
.bg-blue-100 {
  background-color: #dbeafe;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-300 {
  transition-duration: 300ms;
}
</style>