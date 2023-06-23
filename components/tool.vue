<template>
	<view class="content dis cl al_c">
	</view>
</template>

<script>
	const Alibcsdk = uni.requireNativePlugin('UZK-Alibcsdk');
	const jdkpl = uni.requireNativePlugin("FFX-Kpl")
	export default {
		props: {

		},
		data() {
			return {
				
			}
		},
		onLoad() {

		},
		methods: {
			// 转链函数
			changeLink(args,from){
				console.log('待转换链接',args)
				console.log('来源',from)
			}
			
		}
	}
</script>

<style lang="scss">

</style>