<template>
	<view>
		<web-view :src="webUrl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url1:'https://protocol.yimiaodaojia.com/YmdjUserPrivacy.html',
				url2:'https://protocol.yimiaodaojia.com/YmdjPrivacy.html',
				webUrl:''
			}
		},
		onLoad(opt) {
			plus.nativeUI.showWaiting()
			console.log('opt',opt)
			let title = opt.title
			this.webUrl = title == '用户协议' ? this.url1 : this.url2
			setTimeout(r => {
				uni.setNavigationBarTitle({
					title: opt.title
				})
			}, 200)
			setTimeout(()=>{
				plus.nativeUI.closeWaiting()
			},300)
		},
		methods: {


		},
	}
</script>

<style lang="scss">

</style>
