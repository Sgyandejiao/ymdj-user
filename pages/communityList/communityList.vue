<template>
	<view class="content dis cl al_c">
		<view class="list dis cl al_c">
			<view class="item dis cl" v-for="(item,index) in list" key="id">
				<view class="top">
					<view class="dis al_c">
						<image class="avatar" src="/static/512.png" mode="widthFix"></image>
						<view class="name">粉丝花园</view>
					</view>
					<view class="address">浙江省杭州市滨江区斌神鹿</view>
				</view>
				<view class="bottom dis al_c">
					<view class="text">有无电梯</view>
					<view class="radio_v dis al_c">
						<radio-group @change="radioChange">
							<view class="dis al_c">
								<label class="uni-list-cell uni-list-cell-pd dis al_c">
									<view>
										<radio :checked="item.isLift" />
									</view>
									<view>有</view>
								</label>
								<label class="uni-list-cell uni-list-cell-pd  dis al_c" style="margin-left: 20rpx;">
									<view>
										<radio :checked="!item.isLift" />
									</view>
									<view>无</view>
								</label>
							</view>
						
						</radio-group>
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
				isLift: true,
				list: [{
					isLift: true
				}]
			};
		},
		methods:{
			radioChange(e){
				
			},
			getData(){
				// this.$util.request(this.$apis.)
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 750rpx;
		background-color: whitesmoke;
	}

	.list {
		width: 750rpx;

		.item {
			width: 710rpx;
			height: 253rpx;
			background-color: #fff;
			border-radius: 20rpx;
			margin-top: 20rpx;

			.top {
				width: 100%;
				height: 165rpx;
				background-color: cornflowerblue;
				border-radius: 16rpx 16rpx 0px 0px;
				// margin: 20rpx;
				padding-top: 20rpx;
				.avatar {
					width: 48rpx;
					height: 48rpx;
					margin-left: 20rpx;
				}

				.name {
					width: 550rpx;
					font-size: 36rpx;
					font-weight: 550;
					margin-left: 20rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					color: #fff;
				}
				.address{
					width: 600rpx;
					text-align: left;
					margin-top: 8rpx;
					color: #fff;
					margin-left: 88rpx;
					font-size: 28rpx;
					opacity: 0.7;
				}
			}
			.bottom{
				width: 686rpx;
				height: 100rpx;
				justify-content: space-between;
				.text{
					margin-left: 20rpx;
				}
			}
		}
	}
</style>
