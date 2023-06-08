<template>
	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<u-navbar title="支付" bgColor="rgba(0,0,0,0)" :placeholder="true" :autoBack="true" @leftClick="backHome">
		</u-navbar>
		<image class="icon" src="/static/icon/success.png" mode="widthFix" v-if="payState"></image>
		<image class="icon" src="/static/icon/fail.png" mode="widthFix" v-else></image>
		<view class="t1" v-if="from!=3">{{payState?'支付成功':'支付失败'}}</view>
		<view class="t1" v-if="from==3">充值成功</view>
		<view class="t2" v-if="from==0">请等待跑腿人员接单</view>
		<view class="btn" @click="confirm">确定</view>
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
				from:0,
				payState:false
			};
		},
		onLoad(opt) {
			if(opt.type==0){
				this.payState=true
			}
			if(opt.from){
				this.from = opt.from
			}
		},
		methods:{
			backHome(){
				uni.switchTab({
					url:'/pages/home/index'
				})
			},
			confirm(){
				if(this.payState && this.from==0){
					uni.switchTab({
						url:'/pages/home/index'
					})
				}else{
					uni.navigateBack()
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		width: 750rpx;
		background-color: #f0f0f0;
	}
	.icon{
		width: 120rpx;
		height: 120rpx;
		margin-top: 114rpx;
	}
	.t1{
		font-size: 40rpx;
		font-weight: bold;
		color: #333333;
		margin-top: 40rpx;
	}
	.t2{
		font-size: 28rpx;
		color: #666666;
		margin-top: 12rpx;
	}
	.btn{
		width: 686rpx;
		height: 88rpx;
		background: linear-gradient(90deg, #FF4E8C 0%, #F73740 100%);
		border-radius: 46rpx;
		opacity: 1;
		text-align: center;
		line-height: 88rpx;
		position: fixed;
		left: 32rpx;
		bottom: 116rpx;
		font-size: 32rpx;
		color: #FFFFFF;
	}
</style>
