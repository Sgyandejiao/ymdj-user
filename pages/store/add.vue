<template>
	<view class="content dis cl al_c">
		<view class="item dis al_c" style="margin-top: 20rpx;">
			<view class="title">店铺名称</view>
			<input type="text" v-model="name" placeholder="请输入店铺名称">
			<!-- <image src="/static/icon/arrow-right.png" mode="widthFix"></image> -->
		</view>
		<view class="item dis al_c">
			<view class="title">所在位置</view>
			<input type="text" v-model="address" placeholder="请输入店铺所在位置">
			<!-- <image src="/static/icon/arrow-right.png" mode="widthFix"></image> -->
		</view>
		<view class="item dis al_c">
			<view class="title">营业时间</view>
			<view style="width: 500rpx;margin-left: 45rpx;" @click="selectTime">{{time}}</view>
			<image src="/static/icon/arrow-right.png" mode="widthFix"></image>

		</view>
		<view class="image_v">
			<view class="title dis al_c">
				<view>店铺照片</view>
				<view style="margin-left: 40rpx;">请上传店铺的门头照片</view>
			</view>
			<view class="detailInfoImgBox">
				<view class="detailInfoImgUpload dis">
					<view class="dis" v-if="showAddressImg.length">
						<view class="upLoadAcShow dis" v-for="(item,index) in showAddressImg" :key="item">
							<image class="upedImg" :src="item"></image>
							<image class="clearIcn" src="/static/icon/close.png" @click="toClearImg(index)"></image>
						</view>
					</view>
					<view class="upLoadDefault dis al_c j_c" v-if="showAddressImg.length<3" @click="uploadImg">
						<image src="/static/icon/upImg.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="btn" @click="submit">提交</view>
		<uni-popup ref="popup" type="bottom">
			<smh-time-range :time="['08','0','0','08','0']" @confrim="confrim" @cancel="cancel">
			</smh-time-range>
		</uni-popup>
	</view>
</template>

<script>
	import encrypt from '@/libs/encrypt.js'
	export default {
		data() {
			return {
				showAddressImg: [],
				imgIds: [],
				name: '',
				address: '',
				time: '请选择营业时间'
			};
		},
		methods: {
			toClearImg(index) {
				this.imgIds.splice(index, 1);
				this.showAddressImg.splice(index, 1);
			},
			uploadImg() {
				console.log('点击上传')
				plus.android.requestPermissions(['android.permission.CAMERA'], function(e) {
					if (e.deniedAlways.length > 0) {
						console.log('权限被拒绝')
					}
					if (e.deniedPresent.length > 0) {
						console.log('权限被临时拒绝')
					}
				})
				plus.ios.requestPermissions(['android.permission.CAMERA'], function(e) {
					if (e.deniedAlways.length > 0) {
						console.log('权限被拒绝')
					}
					if (e.deniedPresent.length > 0) {
						console.log('权限被临时拒绝')
					}
				})
				let _self = this;
				uni.chooseImage({
					sourceType: ['camera', 'album'],
					success: (res) => {
						console.log('已拍照', res)
						let tempFilePaths = res.tempFilePaths
						let tempFiles = res.tempFiles
						_self.showAddressImg.push(tempFilePaths[0])
						let APP_KEY = "ymdj";
						let APP_NOTIC = encrypt.createUUID(32).toLowerCase();
						let APP_TIMESTAMP = Math.round(new Date().getTime() / 1000);
						let APP_SIGN = encrypt.hex_md5(APP_NOTIC, APP_TIMESTAMP);

						let url = _self.$apis.uploadImg
						let filePath = tempFilePaths[0]
						let formData = {
							AppKey: 'ymdj',
							AppNotic: APP_NOTIC,
							AppSign: APP_SIGN,
							SystemCode: uni.getStorageSync('userType').code,
							AppTimestamp: APP_TIMESTAMP,
							ftoken: uni.getStorageSync('ftoken') || ''
						}
						console.log('up-url=', url)
						console.log('filePath=', filePath)
						console.log('formData=', formData)
						uni.uploadFile({
							url: url,
							// files: tempFiles,
							filePath: filePath,
							name: 'file',
							formData: formData,
							header: {
								AppKey: APP_KEY,
								AppNotic: APP_NOTIC,
								AppSign: APP_SIGN,
								SystemCode: uni.getStorageSync('userType').code,
								AppTimestamp: APP_TIMESTAMP,
								ftoken: uni.getStorageSync('ftoken') || ''
							},
							success: (res) => {
								res.data = JSON.parse(res.data)
								console.log('上传结果', res.data)
								if (res.data.status) {
									_self.imgIds.push(res.data.resultValue);
								} else {
									// this.$toast(res.statusMessage)

								}
							}
						});
					},
					fail(err) {
						console.log('err', err)
					}
				})
			},
			submit() {
				let {
					name,
					address,
					time
				} = this
				if (name == '' || address == '' || time == '请选择营业时间') {
					this.$toast('请完善店铺信息')
					return;
				}
				console.log('imgIds=',this.imgIds)
				let data = {
					"bussinessTime": time,
					"shopAddress": address,
					"shopId": "",
					"shopImagerUrl": this.imgIds.join(','),
					"shopName": name
				}
				console.log('data=',data)
				this.$util.request(this.$apis.addShop,data,'POST').then(r=>{
					console.log('添加店铺',r)
					if(r.status){
						this.$toast('添加店铺成功')
						setTimeout(res=>{
							uni.navigateBack()
						},1200)
						
					}
				})
			},
			getBack() {
				uni.navigateBack()
			},
			addStore() {

			},
			selectTime() {
				this.$refs.popup.open()
			},
			confrim(e) {
				console.log(e)
				this.time = e.time
				this.$refs.popup.close()
			},
			cancel() {
				this.$refs.popup.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100vw;
		background-color: whitesmoke;
	}

	.btn {
		position: fixed;
		bottom: 100rpx;
		// left: 0;
		width: 686rpx;
		height: 88rpx;
		background: linear-gradient(90deg, #FF4E8C 0%, #F73740 100%);
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		line-height: 88rpx;
		margin-top: 26rpx;
		border-radius: 46rpx 46rpx 46rpx 46rpx;
		z-index: 10;
	}

	.item {
		width: 750rpx;
		height: 120rpx;
		justify-content: space-between;
		border-bottom: 1rpx solid #eee;
		background-color: #fff;

		view {
			width: 120rpx;
			font-size: 30rpx;
			color: #333;
			margin-left: 20rpx;
		}

		input {
			width: 550rpx;
			font-size: 30rpx;
			color: #333;
			margin: 20rpx;
		}

		image {
			width: 45rpx;
			height: 45rpx;
			margin-right: 20rpx;
		}
	}

	.time_v {
		width: 750rpx;
		height: 500rpx;
		background-color: #fff;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;

	}

	.image_v {
		width: 750rpx;
		background-color: #fff;

		.title {
			margin: 20rpx;

			view {
				font-size: 28rpx;
				margin-right: 20rpx;
			}
		}
	}

	.detailInfoImgBox {
		width: 710rpx;
		background: #FFFFFF;
		box-sizing: border-box;
		padding: 20rpx 20rpx;
	}

	.detailInfoImgBox .detailInfoImgTitle {
		height: 40rpx;
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #333333;
		line-height: 40rpx;
	}

	.detailInfoImgBox .detailInfoImgUpload {
		margin-top: 35rpx;
	}

	.detailInfoImgBox .detailInfoImgUpload .upLoadDefault {
		width: 180rpx;
		height: 180rpx;
		/* background-color: #eee; */
	}

	.detailInfoImgBox .detailInfoImgUpload .upLoadDefault image {
		width: 100%;
		height: 100%;
	}

	.detailInfoImgBox .detailInfoImgUpload .upLoadAcShow {
		/* width: 200rpx; */
		height: 180rpx;
		position: relative;
		margin-right: 20rpx;
	}

	.detailInfoImgBox .detailInfoImgUpload .upLoadAcShow image {
		width: 180rpx;
		height: 180rpx;
	}

	.detailInfoImgBox .detailInfoImgUpload .upLoadAcShow image.clearIcn {
		width: 45rpx;
		height: 45rpx;
		position: absolute;
		top: 5rpx;
		right: 5rpx;
		border-radius: 50%;
		background: #eee;
	}

	.upedImg {
		width: 100rpx;
		height: 100rpx;
	}
</style>
