<template>
	<view class="content dis cl al_c" style="position: fixed;">
		<image src="/static/icon/home/maicai.png" mode="widthFix" @click="shoModal=true"></image>
		<u-modal title="功能正在开发中~" :show="shoModal" confirmColor="#2E6EEF" :showCancelButton="false"
			@cancel="shoModal=false" @confirm="confirmModal"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				shoModal:false
			};
		},
		onShow() {
			
			
		},
		
		created() {
			
		},
		onReady() {


		},
		mounted() {
			
		},
		methods: {
			confirmModal(){
				this.shoModal=false
			}
		}

	}
</script>

<style lang="scss">
	
	image{
		width: 100vw;
		height: 900rpx;
	}
</style>
