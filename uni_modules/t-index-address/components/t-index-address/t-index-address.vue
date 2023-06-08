<template>
	<view class="t-index-address">
		<scroll-view class="t-index-address__scroll-view"  :scroll-into-view="scrollview" :scroll-with-animation="true"
			:scroll-y="true" :enable-flex="true">
			<view :id="group.initial" v-for="group in cityList" :key="group.initial">
				<view class="t-index-address__anchor">
					<text>{{ group.initial }}</text>
				</view>
				<view class="t-index-address__list">
					<view class="t-index-address__cell" v-for="(city, index) in group.list" :key="index"
						@click="selectTap(city)">
						<text>{{ city.name }}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="t-index-address__sidebar" v-if="keyword==''">
			<view class="t-index-address__index" v-for="group in cityList" :key="group.initial"
				@click="touchIndex(group.initial)">
				<span>{{ group.initial }}</span>
			</view>
		</view>
		<view class="t-index-address__alert" v-if="touchmove">
			<text>{{ activeIndex }}</text>
		</view>
	</view>
</template>

<script>
	import cityList from "./cities.json";

	export default {
		props: {
			keyword: ''
		},
		data() {
			return {
				scrollview: "A",
				cityList: [],
				activeIndex: "A",
				touchmove: false,
			};
		},
		watch: {
			keyword(value) {
				console.log('value', value)
				if (value) {
					let newList = JSON.parse(JSON.stringify(cityList))
					let city = newList
					city.forEach(item => {
						item.list = item.list.filter(son => {
							return son.name.indexOf(value) != -1
						})
					})
					city = city.filter(item => {
						return item.list.length != 0
					})
					console.log(city)
					this.cityList = city
				} else {
					this.cityList = cityList
				}
			},
			activeIndex(value) {
				this.scrollview = value;
			},
		},
		methods: {
			initCityList() {
				this.cityList = cityList;
			},
			touchIndex(index) {
				this.activeIndex = index;
				this.touchmove = true;
				setTimeout(() => {
					this.touchmove = false;
				}, 700)
			},
			onTouchMove(index) {
				this.activeIndex = index;
				this.touchmove = true;
			},
			onTouchStop() {
				this.touchmove = false;
			},
			selectTap(city) {
				this.$emit('select', city)
			}
		},
		mounted() {
			this.initCityList();
		},
	};
</script>

<style lang="scss" scoped>
	.t-index-address {
		height: 100%;

		&__scroll-view {
			width: 100%;
			height: 100%;
			max-height: 100vh;
		}

		&__anchor {
			padding: 15rpx 30rpx;
			width: 100%;
			font-size: 28rpx;
			font-weight: 500;
			color: #606266;
			// background-color: rgb(245, 245, 245);
			margin-top: 40rpx;
		}

		&__list {
			padding: 0 70rpx 0 30rpx;
		}

		&__cell {
			height: 100rpx;
			line-height: 100rpx;
			border-bottom: 1rpx solid #f2f2f2;
			color: #666666;

			&:last-child {
				border: none;
			}
		}

		&__sidebar {
			position: fixed;
			top: 59%;
			right: 0;
			transform: translateY(-50%);
			z-index: 99;
			width: 63rpx;
			background: #F44850;
			background: rgba(244, 72, 80, 0.1);
			color: #333;
			font-size: 24rpx;
		}

		&__index {
			padding: 15rpx 20rpx;
			font-size: 24rpx;
			font-weight: 500;
			line-height: 1;
		}

		&__alert {
			position: fixed;
			top: 55%;
			right: 90rpx;
			z-index: 99;
			margin-top: -60rpx;
			width: 120rpx;
			height: 120rpx;
			font-size: 50rpx;
			color: #fff;
			border-radius: 24rpx;
			background-color: rgba(0, 0, 0, 0.5);
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>