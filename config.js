let config = {}

//当前APP版本号
config.version = '1.25.35'
//API接口域名
config.domain = '192.168.191.1'
//API接口地址
config.api_url = 'http://' + config.domain + '/index.php/api'
//禁止清除缓存前辍
config.cache_prohibitDelete = [
	'user', //用户信息
	'vuex', //vuex
	'prohibit', //禁止删除前辍
	//'network_cache_data_',//网络缓存也得要清除
	//cache-image 图片缓存也是清理
]

export default config
