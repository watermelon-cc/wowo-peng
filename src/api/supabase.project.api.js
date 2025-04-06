import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/store'

export const get_user_all_project = async () => {
	try {
		const userStore = useAuthStore()

		let { data, error } = await supabase
		.from('project')
		.select('*')

		if (error) throw error
		return { success: true, data }

	}	catch (error) {
		return { success: false, error: error.message }
	}		
}

export const insert_project = async (params) => {
	try {
		const userStore = useAuthStore()
		if (!userStore.auth_info?.id) {
			throw new Error('用户未登录')
		}
		
		console.log('insert_project params ==> ', params)
		const { data, error } = await supabase
		.from('project')
		.insert([
			{ 
				project_name: params.project_name, 
				description: params.description || '',
				user_id: userStore.auth_info.id
			},
		])
		.select()
				

		if (error) throw error
		return { success: true, data }
	} catch (error) {
		return { success: false, error: error.message }
	}
}

export const DEL_PROJECT = async (params) => {
	try {
		const userStore = useAuthStore()
		if (!userStore.auth_info?.id) {
			throw new Error('用户未登录')
		}

		// 首先检查项目是否存在且属于当前用户
		const { data: projects, error: checkError } = await supabase
			.from('project')
			.select('id, user_id')
			.eq('id', params.id)

		if (checkError) throw new Error('查询项目失败')
		if (!projects || projects.length === 0) {
			throw new Error('项目不存在')
		}
		if (projects[0].user_id !== userStore.auth_info.id) {
			throw new Error('您没有权限删除此项目')
		}

		const { data, error } = await supabase
			.from('project')
			.delete()
			.eq('id', params.id)
			.eq('user_id', userStore.auth_info.id) // 确保只能删除自己的项目

		if (error) throw error
		return { success: true, message: '项目删除成功' }

	} catch (error) {
		return { success: false, message: error.message }
	}
}

export const UPDATE_PROJECT = async (params) => {
	try {
		const userStore = useAuthStore()
		if (!userStore.auth_info?.id) {
			throw new Error('用户未登录')
		}
		
		const { data, error } = await supabase
		.from('project')
		.update({ 
			project_name: params.project_name, 
			description: params.description || '',
			cur_version_test_time: params.cur_version_test_time || '',
		})
		.eq('id', params.id)
		.eq('user_id', userStore.auth_info.id) // 确保只能更新自己的项目

		if (error) throw error
		return { success: true, data, message: '项目更新成功' }
		
	} catch (error) {
		return { success: false, message: error.message }
	}
}

