import encrypt from '@/libs/encrypt.js'
import {
	createCode,
	analysisCode
} from '@/static/utils/jsencryptKey.js'
export default {
	data() {
		return {
			publicKeyObj: {},
			resultKey: '',
			code: '',
			phone: '',
			logOnType:1
		}
	},
	created() {},
	mounted() {

	},
	methods: {
		initKey(phone,type) {
			if (phone) {
				this.phone = phone
			}
			if(type&&type==2){ // 微信登录方式
				this.logOnType = 2
			}
			this.$util.request(this.$apis.getPublicKey).then(res => {
				console.log('init===', res)
				if (!res.status) {
					this.$toast(res.statusMessage)
					return;
				}
				const keyCode = res.resultValue
				const key = this.getDateInfoKey()
				const a = encrypt.decryptByDES(keyCode, key)
				this.publicKeyObj = JSON.parse(a)
				console.log('123===', res)
				this.encryptKeyDoKey()
			})
		},
		getDateInfoKey() {
			let time = new Date()
			let month = time.getUTCMonth() + 1
			let monthStr = month >= 10 ? month : '0' + month
			let day = time.getUTCDate()
			day = day >= 10 ? day : '0' + day
			let resultStr = `fssh${monthStr}${day}`
			return resultStr
		},
		encryptKeyDoKey() {
			console.log('456===')
			const {
				keyId,
				publicKey
			} = this.publicKeyObj
			const dataStr = createCode(publicKey)
			const opt = {
				keyId: keyId,
				data: dataStr
			}

			this.$util.request(this.$apis.getEncryptKey, opt, 'POST').then(res => {
				console.log('--------------')
				if (res.status) {
					const resultKey = analysisCode(res.resultValue)
					this.resultKey = resultKey
					this.toHome()
				}
			})
		},
		toHome() {
			let {
				publicKeyObj,
				resultKey,
				code,
				phone
			} = this
			let data =
				`systemCode=YMDJ_USER&mobile=${phone}&password=5005&ignoreCode=1&logOnType=${this.logOnType}&systemVersion=1.0.0&clientOs=Android&autoRegister=0`
			console.log('入参字符串', data)
			
			let resultData = encrypt.encryptByDES(data, resultKey)
			let opt = {
				data: resultData,
				keyId: publicKeyObj.keyId
			}
			console.log('登录入参', opt)
			this.$util.request(this.$apis.appLogin, opt, 'POST').then(res => {
				console.log('登录', res)

				if (res.status) {
					let ftoken = JSON.parse(encrypt.decryptByDES(res.resultValue, resultKey));
					console.log('ftoken=', ftoken)
					uni.setStorageSync('ftoken', ftoken.token)
					uni.setStorageSync('phone', phone)
					this.isLogin = true
					this.getInfoMixin()
				} else {
					this.$toast(res.statusMessage)
					uni.$emit("oneLoginEvent", 0)
					// uni.navigateTo({
					// 	url:'/pages/login/code'
					// })
				}

			})


		},
		getInfoMixin() {
			this.$util.request(this.$apis.getUserInfo).then(res => {
				console.log('用户信息', res)
				if (res.status) {
					this.bindGeTuiMixin(res.data.userId)
				}
			})
		},
		bindGeTuiMixin(userid) {
			// 个推绑定别名
			// #ifdef APP-PLUS

			let reg1 = new RegExp("-", "g");
			let newUserId = userid.replace(reg1, "")

			let alias = 'U_' + newUserId
			console.log('alias=', alias)
			uni.setStorageSync('alias', alias)
			if (plus.os.name == 'Android') {
				// console.log('if (plus.os.name')
				let PushManager = plus.android.importClass("com.igexin.sdk.PushManager");
				// console.log('let PushManager', PushManager)
				let context = plus.android.runtimeMainActivity().getContext();
				// console.log('let context =', context)
				let Instance = PushManager.getInstance();
				// console.log('let Instance ', Instance)
				var info = plus.push.getClientInfo();
				// console.log('绑定cid==', info.clientid)
				Instance.bindAlias(context, alias);
			} else {
				console.log('ios绑定cid')
				let GeTuiSdk
				GeTuiSdk = plus.ios.importClass("GeTuiSdk");
				// console.log('GeTuiSdk = ')
				GeTuiSdk.bindAliasandSequenceNum(alias, alias);
				console.log('ios已绑定cid')
				// GeTuiSdk.setTags(tags);
			}
			uni.$emit("oneLoginEvent", 1)
			// #endif 
		},
	}
}
