<template>
	<view class="content dis cl al_c">
		<u-navbar title="" bgColor="rgba(0,0,0,0)"  :autoBack="true" ></u-navbar>
		<image class="img1" src="/static/images/process/img1.png" mode="widthFix"></image>
		<image class="img2" src="/static/images/process/img2.png" mode="widthFix"></image>
		<image class="img3" src="/static/images/process/img3.png" mode="widthFix"></image>
	</view>
	
</template>

<script>
	export default {
		data(){
			return {
				
			}
		}
	}
</script>

<style lang="scss">
	image{
		margin: 0;
		padding:0;
		width: 750rpx;
	}
	.img1{
		height: 1349rpx;
	}
	.img2{
		height: 1079rpx;
		
	}
	.img3{
		height: 1081rpx;
		margin-top: -1px;
	}
</style>