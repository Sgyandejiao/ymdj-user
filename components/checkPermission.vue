<template>
	<view class="content dis cl al_c">
		<!-- <u-modal :title="modelTitle" :content="modeContent"  :show="isShowModal" confirmColor="#F44850" :showCancelButton="false"
			@cancel="isShowModal=false" @confirm="confirmModal"></u-modal> -->
	</view>
</template>

<script>
	import permision from "@/js_sdk/wa-permission/permission.js"
	// const scannerG = uni.requireNativePlugin('Ba-Scanner-G')
	export default {
		props: {

		},
		data() {
			return {
				modelTitle: '权限提醒',
				modeContent: '',
				isShowModal: true,
				isAgain: false,
				checkType: 0,
				permission: '',
			}
		},
		onLoad() {

		},
		methods: {
			async checkOtherPermission(permission) {
				this.checkType = 1
				this.permission = permission
				let permissionTitle = permission == 'camera' ? '相机' : permission == 'photoLibrary' ? '相册' :
					permission == 'push' ? '推送' : permission == 'call' ? '拨打电话':permision == 'location'?'位置' : ''
				if (plus.os.name == 'Android') {
					if (permission == 'camera') {
						permission = 'android.permission.CAMERA'
					} else if (permission == 'photoLibrary') {
						permission = 'android.permission.READ_EXTERNAL_STORAGE'
					} else if (permission == 'call') {
						permission = 'android.permission.CALL_PHONE'
					}else if(permision == 'location'){
						permission = 'android.permission.ACCESS_FINE_LOCATION'
					} else if (permission == 'push') {
						console.log('permission=====', permission)
						var main = plus.android.runtimeMainActivity();
						var NotificationManagerCompat = plus.android.importClass(
							"androidx.core.app.NotificationManagerCompat");
						let pkName = main.getPackageName();
						let packageNames = NotificationManagerCompat.from(main);
						console.log('通知权限', packageNames.areNotificationsEnabled())
						if (!packageNames.areNotificationsEnabled()) {
							let content = '是否开启通知，及时获取订单信息'
							this.showmodel(content)
						}
						return;
					}
					var result = await permision.requestAndroidPermission(permission)
					if (result == 1) {
						// 已打开权限
					} else if (result == 0) {
						let content = '请打开系统' + permissionTitle + '相关权限'
						this.isAgain = true
						this.showmodel(content, true)
					} else {
						// 永久拒绝授权 （安卓端无法再更新权限状态，只在错误时提示）
						let content = '请打开系统' + permissionTitle + '相关权限'
						this.isAgain = false
						this.showmodel(content, false)
					}
				} else if (permission != 'call' && permission != 'camera') {
					var result = permision.judgeIosPermission(permission)
					console.log('result', result)
					if (!result) {
						let content = '请在设置中打开' + permissionTitle + '相关权限'
						this.showmodel(content, false)
					}
				}
			},
			async checkBluetooth() {
				
				this.checkType = 0
				console.log('判断开启蓝牙定位权限')
				
				if (plus.os.name == 'Android') {
					var result = await permision.requestAndroidPermission('android.permission.ACCESS_FINE_LOCATION')
					console.log('result=', result)
					if (result == 1) {
						openBluetoothAdapter()
					} else if (result == 0) {
						let content = '请先同意定位相关权限'
						this.modalText = content
						this.isShowModal = true
						this.isAgain = true
					} else {
						// 永久拒绝授权 （安卓端无法再更新权限状态，只在错误时提示）
						let content = '请在设置或状态栏中打开定位及蓝牙权限'
						this.modalText = content
						this.isShowModal = true
					}
				} else {
					openBluetoothAdapter()
				}

				// return;
				let that = this
				
				let _this = this
				function openBluetoothAdapter() {
					uni.getSystemInfo({
						success: function(data) {
							console.log('getSystemInfo',data);
							var permissionArr;
							if (data.osAndroidAPILevel < 31 || plus.os.name=='iOS') {
								console.log('低版本-------')
								toOpen()
							} else {
								plus.android.requestPermissions(['android.permission.BLUETOOTH_SCAN','android.permission.WRITE_EXTERNAL_STORAGE'],(r)=>{
									console.log('resultSCAN===', r)
									if(r.deniedAlways.length>0){
										let content = ''
										if(r.deniedAlways.indexOf('android.permission.BLUETOOTH_SCAN')!=-1&&r.deniedAlways.length==1){
											content = '请在设置中开启附近设备权限'
										}else if(r.deniedAlways.indexOf('android.permission.WRITE_EXTERNAL_STORAGE')!=-1&&r.deniedAlways.length==1){
											content = '请在设置中开启存储权限'
										}else{
											content = '请在设置中开启附近设备及存储权限'
										}
										uni.showModal({
											title:'提示',
											content:content,
											success(res) {
												if(res.confirm){
													permision.gotoAppPermissionSetting()
												}else{
													
												}
											}
										})
									}else if(r.deniedPresent.length > 0){
										plus.android.requestPermissions(['android.permission.android.permission.BLUETOOTH_SCAN'])
										plus.android.requestPermissions(['android.permission.WRITE_EXTERNAL_STORAGE'])
									}else if(r.granted.length > 0){
										toOpen()
									}
								})
							
							}

						},
						fail: function() {
							uni.showModal({
								title: "提示",
								content: "未获取到设备信息，请重试或重启应用",
								success: function(data) {
									
								}
							})
						}
					})
					
					
				}
				function toOpen(){
					uni.openBluetoothAdapter({
						success: (res) => { //已打开
							uni.getBluetoothAdapterState({ //蓝牙的匹配状态
								success: (row) => {
									console.log('已开启蓝牙11111', row)
									that.isControl(0)
								},
								fail(error) {
									uni.showModal({
										content: '请在系统设置及状态栏开启系统蓝牙',
										showCancel: false,
										success() {
											if (plus.os.name != 'iOS') {
												permision.gotoAppPermissionSetting()
											}
										}
									})
									return;
								}
							});
					
						},
						fail: err => { //未打开 
							uni.showModal({
								content: '请在系统设置及状态栏开启系统蓝牙',
								showCancel: false,
								success() {
									if (plus.os.name != 'iOS') {
										permision.gotoAppPermissionSetting()
									}
								}
							})
							return;
						}
					})
				}
			},
			confirmModal() {
				if (this.isAgain) {
					this.isAgain = false
					this.isShowModal = false
					if (this.checkType == 0) {
						this.checkBluetooth()
					} else {
						this.checkOtherPermission(this.permission)
					}
				} else {
					plus.nativeUI.showWaiting()
					this.isShowModal = false
					setTimeout(() => {
						plus.nativeUI.closeWaiting()
					}, 1500)
					permision.gotoAppPermissionSetting()
				}
			},
			showmodel(content, isAgain) {
				uni.showModal({
					content,
					success: (res) => {
						if (res.confirm) {
							if (isAgain) {
								this.checkOtherPermission(this.permission)
							} else {
								plus.nativeUI.showWaiting()
								setTimeout(() => {
									plus.nativeUI.closeWaiting()
								}, 1500)
								if (plus.os.name != 'iOS') {
									permision.gotoAppPermissionSetting()
								}
							}
						}else{
							return;
						}
					}
				})
			},

			isControl(type) {
				console.log('deviceCode=', this.boxInfo.deviceCode)
				// let code = 'GWCC00113A0100'
				// let code = 'YMDJ20230400006B'
				// plus.nativeUI.showWaiting('正在寻找设备，请稍候..');
				// this.$bluetooth.initBluetooth(code, 0)
				// return;
				this.$util.request(this.$apis.getDeviceAuthStatus, {
					deviceCode: this.boxInfo.deviceCode
				}).then(res => {
					console.log('可操作状态', res)
					if (res.status || this.deviceTest) {
						console.log('id=', this.boxInfo.deviceCode)
						if (type == 0) {
							plus.nativeUI.showWaiting('正在寻找设备，请稍候..');
						}
						console.log('type=', type)
						this.$bluetooth.initBluetooth(this.boxInfo.deviceCode, type)
						if (type != 0) return;
						let data = {
							deviceCode: this.boxInfo.deviceCode,
							operateUserRemark: '',
							operateUserType: this.boxInfo.userType == '主用户' ? 0 : 3
						}
						console.log('增加使用记录data', data)
						this.$util.request(this.$apis.operate, data, 'POST').then(res => {
							console.log('已增加使用记录', res)
						})
					} else {
						if (type == 0) {
							this.$toast(res.statusMessage)
						}
					}
				})
			},


		}
	}
</script>

<style lang="scss">

</style>