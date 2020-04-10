import Request from './request'
import config from '@/config.js'

const http = new Request()
http.setConfig((http_config) => { /* 设置全局配置 */
	http_config.baseUrl = config.api_url
	http_config.header = {
		...http_config.header,
		token: 1,
	}
	// config.custom = { auth: true }
	return http_config
})

http.interceptor.request((http_config, cancel) => { /* 请求之前拦截器 */
	http_config.header = {
		...http_config.header,
	}
	// if (config.custom.auth) {
	//   config.header.token = 'token'
	// }
	/*
	if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
	  cancel('token 不存在') // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
	}
	*/
	return http_config
})

/**
 * 自定义验证器，如果返回true 则进入响应拦截器的响应成功函数(resolve)，否则进入响应拦截器的响应错误函数(reject)
 * @param { Number } statusCode - 请求响应体statusCode（只读）
 * @return { Boolean } 如果为true,则 resolve, 否则 reject
 */
http.validateStatus = (statusCode) => {
	return statusCode === 200
}

http.interceptor.response((response) => { /* 请求之后拦截器 */
	return response
}, (response) => { // 请求错误做点什么
	return response
})

/**
 * 自定义验证器，如果返回true 则进入响应拦截器的响应成功函数(resolve)，否则进入响应拦截器的响应错误函数(reject)
 * @param { Number } statusCode - 请求响应体statusCode（只读）
 * @return { Boolean } 如果为true,则 resolve, 否则 reject
 */
http.validateStatus = (statusCode) => {
	if (statusCode != 200) {
		uni.showToast({
			title: '网络错误',
			icon: "none",
			duration: 2000,
			position: "bottom"
		});
	}
	return statusCode === 200
}

http.interceptor.request((http_config, cancel) => { /* 请求之前拦截器 */
	//在请求之前直接做Loading
	uni.hideLoading();
	uni.showLoading({
		title: '加载中'
	});
	//停止下拉框

	http_config.header = {
		...http_config.header,
		token: 1,
		version: "1.0.5",
		versionNumber: "105",
	}
	/*
	if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
	  cancel('token 不存在') // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
	}
	*/
	return http_config
})

http.interceptor.response((res) => { /* 请求之后拦截器 */
	// if (response.data.code !== 200) { // 服务端返回的状态码不等于200，则reject()
	//   return Promise.reject(response)
	// }
	// if (response.http_config.custom.verification) { // 演示自定义参数的作用
	//   return response.data
	// }
	uni.hideLoading();
	//判断当前是否要更新APP

	//判断整体全局
	if (res.statusCode == "200") {
		if (res.data.data.status != "200") {

			if (res.data.data.msg) {
				uni.showToast({
					title: res.data.data.msg ? res.data.data.msg : '数据返回不正确',
					icon: "none",
					duration: 2000,
					position: "bottom"
				});
				return false
			}
		} else {
			if (res.data.data.notice == 1) {
				uni.showToast({
					title: res.data.data.msg,
					icon: "none",
					duration: 2000,
					position: "bottom"
				});
			}
			uni.stopPullDownRefresh()
		}
	} else {
		uni.showToast({
			title: '网络错误',
			icon: "none",
			duration: 2000,
			position: "bottom"
		});

		return false
	}

	console.log("数据加载完成");

	return res.data.data
}, (res) => { // 请求错误做点什么
	uni.hideLoading();
	if (res.errMsg == "request:fail") {
		uni.showToast({
			title: '网络错误',
			icon: "none",
			duration: 2000,
			position: "bottom"
		});
		return false
	}
	return res
}, (res) => {
	console.log(3);
	return 8
})

export {
	http,
}
