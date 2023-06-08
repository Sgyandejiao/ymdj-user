<template>
	<view class="">
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:''
			}
		},
		onLoad(opt) {
			let url = uni.getStorageSync('pddUrl')
			console.log('pddUrl=', url)
			this.url = url
		}
	}
</script>

<style lang="scss">
	
</style>