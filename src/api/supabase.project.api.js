import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/store'

export const get_user_all_project = async () => {
	try {
		const userStore = useUserStore()

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
		const userStore = useUserStore()
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
		console.error('insert_project: ', error)
		return { success: false, error: error.message }
	}
}
