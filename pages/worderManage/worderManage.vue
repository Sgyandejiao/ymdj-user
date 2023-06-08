<template>
	<view class="content dis cl al_c">
		<u-navbar rightText="邀请" title="跑腿人员管理" :safeAreaInsetTop="true" @rightClick="addStore" @leftClick="getBack">
		</u-navbar>
		<view class="head_search dis al_c">
			<u-search :showAction="true" actionText="搜索" :animation="false"></u-search>
		</view>
		<view class="list dis cl al_c">
			<view class="item dis cl al_c" @click="toDetail">
				<view class="top dis al_c">
					<view class="t1">注册时间：2022-08-01</view>
					<view class="t2">联系他</view>
				</view>
				<view class="data dis al_c">
					<view class="info dis cl">
						<view class="t1"><text>用户姓名</text>李萌</view>
						<view class="t2"><text>性别</text>男</view>
						<view class="t3"><text>状态</text>接单中</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
			getBack() {
				uni.navigateBack()
			},
			addStore() {
				uni.navigateTo({
					url:'./add'
				})
			},
			toDetail(){
				uni.navigateTo({
					url:'./detail'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 100vw;
		background-color: whitesmoke;
	}

	.head_search {
		width: 710rpx;
		padding:0 20rpx;
		height: 120rpx;
		position: fixed;
		left: 0;
		top: 150rpx;
		z-index: 1;
		background-color: white;
	}
	.list{
		width: 100%;
		position: relative;
		top: 300rpx;
		.item{
			width: 710rpx;
			height: 300rpx;
			border-radius: 20rpx;
			margin-top: 20rpx;
			background-color: #fff;
			.top{
				width: 666rpx;
				height: 90rpx;
				line-height: 90rpx;
				border-bottom: 1rpx solid #eee;
				justify-content: space-between;
				.t1{
					font-size: 28rpx;
					color: #333;
				}
				.t2{
					font-size: 28rpx;
					color: chartreuse;
				}
			}
			.data{
				width: 666rpx;
				height: 150rpx;
				margin: 20rpx 0;
				image{
					width: 150rpx;
					height: 150rpx;
				}
				.info{
					justify-content: space-between;
					height: 150rpx;
					margin-left: 20rpx;
					.t1,.t2,.t3{
						text{
							display: inline-block;
							width: 150rpx;
						}
					}
					.t1{
						font-size: 28rpx;
						color: #333;
					}
					.t2{
						font-size: 28rpx;
						color: #999;
					}
					.t3{
						font-size: 28rpx;
						color: chartreuse;
					}
				}
			}
		}
	}
</style>
