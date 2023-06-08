<template>

	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<u-navbar title="" style="margin-bottom: 21rpx;" right-text="取消" :placeholder="true" bgColor="rgba(0,0,0,0)" :safeAreaInsetTop="true" @rightClick="rightClick" :autoBack="false">
			<view class="u-nav-slot"  slot="left">
				<u-search placeholder="请输入所在城市" inputAlign="left" width="100%"  :show-action="false" bgColor="#fff" v-model="keyword" @search="toSearch" @clear="toSearch"></u-search>
			</view>
			
		</u-navbar>
		<view class="location dis al_c" v-if="location!=''&&location!='选择城市'"> <image src="/static/icon/loc1.png" mode="widthFix" ></image> 当前定位城市 {{location}}</view>
		<view class="city-view">
			<t-index-address @select="select" :keyword="searchValue"></t-index-address>
		</view>
	</view>
</template>

<script>
	import headBgImg from '@/components/headBgImg.vue'
	export default {
		components: {
			headBgImg
		},
		data() {
			return {
				keyword:'',
				searchValue:'',
				location:''
			}
		},
		onLoad(opt) {
			if(opt.city){
				console.log(opt)
				this.location = opt.city
			}
		},
		mounted() {

		},
		onReachBottom() {
			// this.searchGoods(this.pageIndex + 1)
		},
		methods: {
			navBack() {
				uni.navigateBack()
			},
			select(data) {
				console.log(data)
				uni.setStorageSync('selectCity',data)
				uni.navigateBack()
			},
			rightClick(){
				uni.navigateBack()
			},
			toSearch(){
				this.searchValue = this.keyword
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 750rpx;
		background-color: #f0f0f0;
		position: fixed;
	}
	.location{
		width: 686rpx;
		margin: 21rpx;
		image{
			width: 30rpx;
			height: 30rpx;
		}
		view{
			font-size: 32rpx;
			font-family: PingFang SC-Regular, PingFang SC;
			font-weight: 400;
			color: #666666;
			margin-left: 10rpx;
		}
	}
	.city-view {
		width: 686rpx;
		background: #FFFFFF;
		border-radius: 32rpx;
		margin-top: 21rpx;
	}
	.u-nav-slot{
		width: 600rpx;
		height: 67rpx;
		background: #ffffff;
		border-radius: 32rpx;
	}
</style>