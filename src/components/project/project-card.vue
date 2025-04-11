<template>
	<div class="w-full h-full rounded border flex-col" :style="{boxShadow: `var(--el-box-shadow-light)`}">
		<div class="h-50 flex items-center justify-between cursor-pointer px-15 relative" style="border-bottom: 1px solid #eee;">
			<!-- 进度背景 -->
			<div 
				class="absolute left-0 top-0 h-full bg-blue-100 transition-all duration-300"
				:style="{ width: `${progressPercentage}%`, 'z-index': 0, borderTopRightRadius: '8px' }"
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
					<span class="text-333 pl-6" :title="info.description">{{ project_info.project_name }}</span>
				</el-badge>
			</div>
			<!-- <div class="flex items-center" @click="showDateTimeDialog = true" style="z-index: 2;"> -->
			<div class="flex items-center" style="z-index: 2;">
				<el-icon size="18" color="#666"><Timer /></el-icon>
				<span class="text-333 pl-6"><span style="font-weight: 500;">提测时间</span>：{{ project_info.cur_version_test_time || '待填写' }}</span>
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

		<ProjectDialog ref="projectDialog" v-bind="info" @update="handleUpdateInfo" />
	</div>
</template>

<script setup>
import { fa, faker } from '@faker-js/faker'
import { ref, reactive, computed } from 'vue'
import { fromDate } from '@/utils/utils'
import TodoItem from './todo-item.vue'
import ProjectDialog from './project-dialog.vue'
import DateTimeDialog from '@/components/common/date-time-dialog.vue'
import { DEL_PROJECT, UPDATE_PROJECT } from '@/api/supabase.project.api'
import emitter from '@/utils/eventBus'

const emit = defineEmits(['delete'])

const props = defineProps({
	info: {
		type: Object,
		required: true
	}
})

const showDateTimeDialog = ref(false)

const project_info = reactive({
	...props.info,
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
	console.log('project_info', project_info, project_info.cur_version_test_time, project_info.cur_version_start_time)
	if (!project_info.cur_version_test_time || !project_info.cur_version_start_time) return 0
	
	const testTime = new Date(project_info.cur_version_test_time)
	const startTime = new Date(project_info.cur_version_start_time)
	const now = new Date()
	
	// 如果当前时间早于开始时间，进度为0
	if (now < startTime) return 0
	// 如果当前时间晚于提测时间，进度为100%
	if (now > testTime) return 100
	
	const totalDuration = testTime - startTime // all duration
	const elapsedDuration = now - startTime // elapsed duration
	console.log('totalDuration', totalDuration)
	console.log('elapsedDuration', elapsedDuration)
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

const projectDialog = ref(null)

const handleEdit = () => {
	projectDialog.value.show(props.info)
}
const handleUpdateInfo = function (formData) {
	UPDATE_PROJECT({
		...formData
	}).then(res => {
		if (res.success) {
			projectDialog.value.close()
			ElMessage({ type: 'success', message: res.message })
			emitter.emit('project-list-updated')
		} else {
			ElMessage({ type: 'error', message: res.message })
		}
	})
}
const handleTestTimeConfirm = (time) => {
	UPDATE_PROJECT({
		...props.info,
		cur_version_test_time: time
	}).then(res => {
		if (res.success) {
			ElMessage({ type: 'success', message: res.message })
			// 添加短暂延迟确保数据更新完成
			setTimeout(() => {
				emitter.emit('project-list-updated')
			}, 100)
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