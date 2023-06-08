<template>
	<view class="content dis cl al_c">

		<image src="/static/images/logo-text.png" mode="widthFix"></image>
		<!-- <button type="default" @click="tbLogin">淘宝授权登录</button>
		<button type="default" @click="openCar">打开我的购物车</button> -->
		<!-- <button @click="scan">扫一扫</button> -->
	</view>
</template>

<script>
	const plug = uni.requireNativePlugin('Html5app-Baichuan');

	// 管家：YMDJ_GJ
	// 合伙人：YMDJ_PARTNER
	// 跑腿：YMDJ_PT
	// 用户：YMDJ_USER


	export default {

		data() {
			return {

			}
		},
		onLoad() {
			console.log('ftoken',uni.getStorageSync('ftoken'))
			uni.switchTab({
				url: '/pages/home/index'
			}) 
		},
		methods: {
			scan() {
				uni.scanCode({
					success: (r) => {
						console.log('r=', r)
					}
				})
			},
			tbLogin() {
				plug.login({}, result => {
					console.log('result=', result)
					if (result.code == 0) {
						uni.showToast({
							title: '已开启淘宝授权'
						})
					}
				});
			},
			openCar() {
				plug.OpenMyCart({
					"openType": 1
				}, result => {});
			}
		}
	}
</script>

<style lang="scss">
	image {
		width: 500rpx;
		height: 500rpx;
		margin: 600rpx 0 0 0;
	}
</style>
