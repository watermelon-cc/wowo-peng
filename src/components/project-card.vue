<template>
	<div class="w-full h-full rounded border flex-col">
		<div class="h-50 flex items-center justify-between cursor-pointer px-15" style="border-bottom: 1px solid #eee;">
			<div class="flex items-center">
				<el-icon size="18" color="#666"><Menu /></el-icon>
				<el-badge :value="completedCount" class="item" type="primary">
					<span class="text-666 pl-6">{{ project_info.project_name }}</span>
				</el-badge>
			</div>
			<div class="flex items-center">
				<el-icon size="18" color="#666"><Timer /></el-icon>
				<span class="text-666 pl-6">提测时间：{{ project_info.test_time }}</span>
			</div>
		</div>
		<div class="flex-1 p-15">
			<todo-item
				v-for="(todo, index) in todoList"
				:key="index"
				:content="todo.content"
				:is-completed="todo.completed"
				@change="handleTodoChange(index, $event)"
			/>
		</div>
	</div>
</template>

<script setup>
import { faker } from '@faker-js/faker'
import { ref, reactive, computed } from 'vue'
import { fromDate } from '@/utils/utils'
import TodoItem from './todo-item.vue'

const props = defineProps({
	info: {
		type: Object,
		required: true
	}
})

const project_info = reactive({
	project_name: props.info.project_name || '口腔医院',
	test_time: fromDate(new Date(faker.date.future()))
})

// 生成5条随机代办事项，包含完成状态
const todoList = ref(
	Array.from({ length: 5 }, () => ({
		content: faker.lorem.sentence(),
		completed: false
	}))
)

// 计算未完成的待办项数量
const completedCount = computed(() => {
	return todoList.value.filter(todo => !todo.completed).length
})

const handleTodoChange = (index, completed) => {
	todoList.value[index].completed = completed
}
</script>