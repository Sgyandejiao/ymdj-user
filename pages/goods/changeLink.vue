<template>
	<view class="content dis cl al_c">
		<view class="link_content">{{content}}</view>
		<view class="copy" @click="copy">点击复制</view>
		<view class="card order dis cl al_c" v-if="linkInfo.itemTitle!=''" @click="toUrl(linkInfo.itemId)">
			<view class="info dis al_c">
				<image class="goods_img" :src="linkInfo.itemPic" mode="widthFix"></image>
				<view class="content dis cl">
					<view class="title">{{linkInfo.title}}</view>
					<view class="dis al_c">
						<view class="itm_coupon" v-if="linkInfo.couponMoney">
							<image src="/static/icon/coupon.png" mode="widthFix"></image>
							<view>￥{{item.couponMoney}}券</view>
						</view>
						<view class="itm_coupon">
							<image style="width: 125rpx;" src="/static/icon/quan.png" mode="widthFix"></image>
							<view style="width:120rpx;color: #654200;">跑腿券x1</view>
						</view>
					</view>
					<view class="from">到手价<text>{{linkInfo.finalPrice}}</text></view>
				</view>
				<image class="tag_img" src="/static/icon/tb.png" mode="widthFix" v-if="index==0"></image>
				<image class="tag_img" src="/static/icon/jd.png" mode="widthFix" v-if="index==1"></image>
				<image class="tag_img" style="left:225rpx;width: 80rpx;" src="/static/icon/pdd.png" mode="widthFix"
					v-if="index==2"></image>
			</view>
		</view>
	</view>

</template>

<script>
	const Alibcsdk = uni.requireNativePlugin('UZK-Alibcsdk');
	const jdkpl = uni.requireNativePlugin("FFX-Kpl")
	export default {
		data() {
			return {
				content: '',
				linkInfo: {
					itemTitle: ''
				}
			}
		},
		onLoad(opt) {
			if (opt.index && uni.getStorageSync('changeLink')) {

				this.index = Number(opt.index)
				this.content = uni.getStorageSync('changeLink').content
				this.linkInfo = uni.getStorageSync('changeLink')
			}
		},
		mounted() {
			Alibcsdk.init(result => {
				console.log('百川初始化', result)
			});
			jdkpl.initSdk((e) => {
				console.log('jdkplInit', e);
				// e=> {"code":0/1,"message":"初始化失败/成功"}
				uni.setStorageSync('jdkplInit', e)
			});
		},
		methods: {
			copy() {
				uni.setClipboardData({
					data: this.content,
					success() {

					}
				})
			},
			toUrl(id) {
				let index = this.index
				let data = {
					itemFrom: index,
					para: id
				}
				this.$util.request(this.$apis.postHighComission, data, 'POST').then(r => {
					console.log('转链', r)
					if (r.status) {
						if (index == 0) {
							Alibcsdk.openurl({
								url: r.data.schemaUrl,
								nativeFailedMode: 'download'
							}, result => {
								console.log('plug.openurl', result)
							});
						} else if (index == 1) {
							jdkpl.openUrl({
								url: r.data.schemaUrl
							}, (e) => {
								console.log(e);
								// e=> {"code":0/1,"message":"打开失败/成功"}
							});
						} else {
							if (plus.runtime.isApplicationExist({
									pname: 'com.xunmeng.pinduoduo',
									action: 'pinduoduo://'
								})) {
								// 应用已安装，打开相关转链页面
								plus.runtime.openURL(r.data.schemaUrl)
							} else {
								//在这里可以进行些针对未安装情况的操作,例如隐藏相应的功能
								plus.runtime.openURL(r.data.shortUrl)
							}
						}


					} else {
						this.$toast(r.statusMessage)
					}

				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 750rpx;
		background-color: whitesmoke;
	}

	.link_content {
		width: 686rpx;
		min-height: 300rpx;
		padding: 22rpx 17rpx;
		background-color: #fff;
		font-size: 28rpx;
		color: #999;
		margin-top: 20rpx;
		border-radius: 12rpx;
		line-height: 50rpx;

	}

	.copy {
		width: 686rpx;
		height: 88rpx;
		border-radius: 46rpx 46rpx 46rpx 46rpx;
		background: linear-gradient(90deg, #FF4E8C 0%, #F73740 100%);
		font-size: 28rpx;
		text-align: center;
		line-height: 88rpx;
		color: #fff;
		margin-top: 50rpx;

	}

	.card {
		width: 710rpx;
		// height: 450rpx;
		background-color: #fff;
		background-color: #fff;
		border-radius: 20rpx;
		margin-top: 20rpx;
	}

	.order {
		margin-top: 20rpx;

		.top {
			width: 666rpx;
			height: 70rpx;
			// justify-content: space-between;
			border-bottom: 1rpx solid #eee;

			.t1 {
				.text {
					max-width: 550rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					font-size: 28rpx;
					color: #999;
					white-space: nowrap;
				}
			}


			.order_num {
				font-size: 28rpx;
				color: red;
			}
		}

		.address1,
		.address2 {
			width: 600rpx;
			font-size: 28rpx;
			margin: 30rpx 0 0 0;
		}

	}
	.goods_img{
		background-color: whitesmoke;
	}
	.info .tag_img {
		width: 60rpx;
		height: 40rpx;
		position: absolute;
		left: 230rpx;
		top: 8rpx;
		z-index: 9999;
	}

	.itm_coupon {
		position: relative;
		margin-right: 18rpx;

		image {

			width: 110rpx;
			height: 40rpx;
			z-index: 98rpx;
		}

		view {
			width: 100rpx;
			height: 40rpx;
			position: absolute;
			left: 0;
			top: 0;
			text-align: center;
			font-size: 24rpx;
			color: #fff;
			z-index: 99;
			line-height: 40rpx;
		}
	}

	.info {
		width: 666rpx;
		margin: 20rpx 0;
		position: relative;

		image {
			width: 220rpx;
			height: 220rpx;
		}

		.content {
			height: 240rpx;
			margin-left: 12rpx;
			width: 440rpx;
			justify-content: space-between;

			// background-color: whitesmoke;
			.title {
				width: 400rpx;
				font-size: 30rpx;
				color: #333;
				text-indent: 2.8rem;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box; // 作为弹性伸缩盒子模型显示。
				-webkit-box-orient: vertical; // 设置伸缩盒子的子元素排列方式--从上到下垂直排列
				-webkit-line-clamp: 2; // 显示的行
			}

			.num_v {
				width: 440rpx;
				justify-content: space-between;
			}
		}

		.from {
			font-size: 24rpx;
			color: #FF4E8C;
			margin-bottom: 10rpx;
			text{
				font-size: 35rpx;
				
			}
		}
	}
</style>
