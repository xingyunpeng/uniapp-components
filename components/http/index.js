import {
	http
} from './http.js'

const hashCode = function(str) {
	var hash = 0,
		i, chr, len;
	if (str.length === 0) return hash;
	for (i = 0, len = str.length; i < len; i++) {
		chr = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}

	return hash;
}

let httpApi = (url, data, fn, option = {}) => {

	/*
	option
		isCache	向结果值返回当前是一个缓存数据
	*/

	return {
		cache: (options = {}) => {
			let key = 'cache-network-data_' + hashCode(url + JSON.stringify(data));
			uni.getStorage({
				key: key,
				success: (res) => {
					let json = JSON.parse(res.data)
					if (options.isCache) {
						json.isCache = true
					}
					return fn(json)
				},
				fail() {
					return false
				}
			});
		},
		init: (options = {}) => {
			return http.post(url, data).then((res, d) => {
				fn(res)
				if (options.cache) {
					let key = 'cache-network-data_' + hashCode(url + JSON.stringify(data));
					uni.setStorage({
						key: key,
						data: JSON.stringify(res)
					});
				}
			}).catch(() => {
				return 'error'
			})
		}
	}

}

export default httpApi
