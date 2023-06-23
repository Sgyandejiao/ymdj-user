<script>
	import encrypt from "./libs/encrypt.js";
	import permision from "@/js_sdk/wa-permission/permission.js"
	import tool from '@/components/tool.vue'
	// let env = 'dev'
	// let env = 'pro'
	// const apiUrl = env == 'pro' ? 'https://gateway.fanssh.com' : 'https://gateway-test.fanssh.com'

	export default {
		mixins:[tool],
		globalData: {
			isCloseLocation: false, //是否关闭请求定位
		},
		onLaunch: function() {
			console.log('App Launch')

			// 锁定屏幕旋转
			plus.screen.lockOrientation("portrait-primary")

			let isPlaying = false
			plus.push.addEventListener("click", (msg) => {
				console.log('普通消息点击', msg)

				let payload = msg.payload
				if (payload?.url) {
					if (!uni.getStorageSync('ftoken') || !uni.getStorageSync('phone')) {
						uni.redirectTo({
							url: '/pages/login/login'
						})
					} else {
						// 跳转对应页面
						let nav_url = '/' + payload.url + '?orderCode=' + payload.businessId
						plus.push.clear();
						uni.navigateTo({
							url: nav_url
						})
					}

				}
				return;

			}, false);

			// 监听在线消息事件    
			let msgs = plus.push.getAllMessage();
			// console.log('所有消息msgs==', msgs)

			plus.push.addEventListener("receive", (msg) => { // 透传消息
				console.log('透传消息', msg)
				let uuid = msg.__UUID__

				if (JSON.stringify(msgs).indexOf(uuid) > -1) {
					console.log('已存在该消息')
					return;
				}
				// 判断是否为本地创建的消息
				let payloadLocal = msg.payload
				console.log('msg.payload', payloadLocal)
				if (typeof(payloadLocal) === 'string') {
					payloadLocal = JSON.parse(payloadLocal)
				}

				if (payloadLocal.local) {
					// 本地消息和非呼叫消息不需要处理，如果再次创建本地消息则会引起死循环
					console.log('由本地创建的消息，不处理')

				} else {
					console.log('开始创建本地消息')
					// 本地创建的消息
					// 应用在前台运行时服务器推送的消息，这时候建议直接弹出提示框,而不是创建消息添加到通知栏
					let payload = ''
					payload = payloadLocal
					payload['local'] = 'local'

					console.log('创建本地消息', msg.payload.mBody, payload)
					plus.push.createMessage(msg.payload.mBody, payload);

				}

				// 播放中
				if (isPlaying) return;

				// 创建报修工单播报
				if (!msg.payload.voiceRes || msg.payload.voiceRes == '') {
					console.log('播放系统铃声')
					// 调用系统铃声
					let main = plus.android.runtimeMainActivity();
					let RingtoneManager = plus.android.importClass("android.media.RingtoneManager");
					let uri = RingtoneManager.getActualDefaultRingtoneUri(main, RingtoneManager
						.TYPE_NOTIFICATION);
					let MediaPlayer = plus.android.importClass("android.media.MediaPlayer");
					let player = MediaPlayer.create(main, uri);
					player.setLooping(false);
					player.prepare();
					player.start();


				} else {
					console.log('播放自定义铃声')
					// 使用自定义铃声
					const innerAudioContext = uni.createInnerAudioContext();
					innerAudioContext.autoplay = true;
					innerAudioContext.src = msg.payload.voiceRes;
					innerAudioContext.onPlay(() => {
						console.log('开始播放');
						isPlaying = true
					});
					innerAudioContext.onEnded(() => {
						console.log('结束播放');
						isPlaying = false
					})
					innerAudioContext.onStop(() => {
						console.log('结束播放');
						isPlaying = false
					})
					innerAudioContext.onError((res) => {
						console.log(res.errMsg);
						console.log(res.errCode);
						isPlaying = false
					});
				}


			}, false);
		},
		onShow: function() {
			console.log('App Show')
			//获取第三方程序调用时传递给程序的参数
			setTimeout(function() {
				let args = plus.runtime.arguments;
				if (args) {
					// 处理args参数的逻辑代码，如直达到某新页面等
					console.log('来自H5传递参数:', args)
					if(JSON.stringify(args).indexOf('ymdj.com')!=-1){
						this.changeLink(args,'app')
					}
				}
			}, 10);
			
			uni.getClipboardData({
				success: (res) => {
					let data = res.data
					console.log('截切板数据', res)
					let str = /[^\dA-Za-z0-9][A-Za-z0-9]{10,16}[^\dA-Za-z0-9]/
					if (JSON.stringify(data).indexOf('http://') != -1 || JSON.stringify(data).indexOf(
							'https://') != -1 || data.match(str)) {
						uni.setStorageSync('copyData', data)
						setTimeout(r => {
							console.log('isShenhe=', uni.getStorageSync('isShenhe'))
							console.log('ftoken=', uni.getStorageSync('ftoken'))
							if (uni.getStorageSync('isShenhe') == 0 && uni.getStorageSync(
									'ftoken')) {
								uni.navigateTo({
									url: '/pages/modal/modal'
								})
							}
						}, 1500)

					} else {
						console.log('未匹配到数据')
						uni.removeStorageSync('toPageModal')

					}
				},
				fail(err) {
					console.log('无剪切板数据', err)
				},
				complete: (com) => {

				}
			})
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {

		}

	}
</script>

<style lang="scss">
	@import '~@/common/scss/mixins.scss';

	// @import "@/uni_modules/uview-ui/index.scss";
	/*每个页面公共css */
	.dis {
		display: flex;
	}

	.cl {
		flex-direction: column;
	}

	.al_c {
		align-items: center;
	}

	.content {
		width: 750rpx;
	}

	.u-nav-slot {
		display: flex;
		align-items: center;
	}

	.u-nav-back {
		width: 48rpx;
		height: 48rpx;
		margin-top: 2rpx;
	}

	.u-nav-back-text {
		font-size: 36rpx;
		font-family: PingFang SC-Heavy, PingFang SC;
		font-weight: 800;
		color: #222222;
		margin: 0 16rpx;
	}

	.u-nav-rig-text {
		font-size: 28rpx;
	}

	.popup-tips {
		position: relative;
		width: 640rpx;
		background-color: #fff;
		border-radius: 16rpx;

		.title {
			width: 544rpx;
			font-size: 32rpx;
			font-family: PingFang SC-中粗体, PingFang SC;
			font-weight: 650;
			color: #333333;
			margin: 64rpx 0 16rpx 0;
			text-align: center;
		}

		.text {
			width: 544rpx;
			font-size: 32rpx;
			font-family: PingFang SC-常规体, PingFang SC;
			font-weight: normal;
			color: #666666;
			text-align: center;
		}

		.bottom {
			position: absolute;
			left: 0;
			bottom: 0;
			width: 640rpx;
			height: 112rpx;
			border-top: 1rpx solid #E7E7E7;

			view {
				width: 100%;
				text-align: center;
				font-size: 32rpx;
				font-family: PingFang SC-中粗体, PingFang SC;
				font-weight: normal;
				color: #F44850;
				line-height: 112rpx;
			}
		}
	}

	uni-tabbar {
		.uni-tabbar {
			.uni-tabbar-border {
				// tabBar 上边框
				background-color: #ffffff !important; // tabBar 上边框的颜色
			}
		}
	}
</style>