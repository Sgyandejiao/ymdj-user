<template>
	<view >
		<web-view :src="webUrl" @message="getMessage"></web-view>
		<!-- <iframe :src="webUrl" style="width: 100vw;height:100vh" frameborder="0"></iframe> -->
	</view>
</template>
<script>
	export default {
		data() {
			return {
				webUrl:''
			}
		},
		onLoad(opt) {
			let webData = uni.getStorageSync('webData')
			console.log('opt',webData)
			// plus.nativeUI.showWaiting()
			// this.webUrl = webData.url
			this.webUrl = 'http://192.168.6.37:5173/test'
			// setTimeout(()=>{
			// 	plus.nativeUI.closeWaiting()
			// 	uni.removeStorageSync('webData')
			// },500)
		},
		methods: {
			getMessage(e){
				console.log('message')
				console.log(e,'message')
			}
	
		},
	}
</script>

<style>
</style>