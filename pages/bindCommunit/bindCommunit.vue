<template>

	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<u-navbar title="绑定小区" bgColor="rgba(0,0,0,0)" :placeholder="true" :autoBack="true">
			<view class="u-nav-slot" slot="left">
				<image class="u-nav-back" src="/static/icon/arrow-left.png" mode="widthFix"></image>
			</view>
		</u-navbar>
		<view class="search-view dis al_c">
			<view class="lef dis al_c" @click="toSelectCity">
				<image class="icon1" src="/static/icon/location.png" mode="widthFix"></image>
				<view class="city-name">{{city}}</view>
				<image class="icon2" src="/static/icon/arrow-bottom1.png" mode="widthFix"></image>
				<view class="line"> </view>
			</view>
			<input type="text" v-model="keyword" maxlength="15" placeholder-style="color:#ccc" placeholder="请输入小区"
				@confirm="search" @input="onInput">
		</view>

		<view class="card dis cl al_c">
			<view class="card-title" >
				<image src="/static/icon/fujinxiaoqu.png" mode="widthFix" v-if="!isSearchList"></image>
			</view>
			<scroll-view scroll-y="true" style="width:666rpx;height: 72vh;" upper-threshold="50" lower-threshold="10">
				<block v-for="(item,index) in list" :key="item.communityId">
					<view class="cell-item dis al_c">
						<view class="lef">
							<view class="name dis al_c">{{item.communityName}}
								<view v-if="item.distance">距离{{item.distance || '-'}}m</view>
							</view>
							<view class="address">
								{{item.address?item.address:item.provinceName+item.cityName+item.districtName}}</view>
						</view>
						<view class="rig" @click="bind(item)">绑定</view>
					</view>
				</block>
				<view class="noList" v-if="!list.length">附近没有小区，换个地方试试</view>
			</scroll-view>
		</view>
		<u-modal title="提示" :content="modalContent" :show="isShowModal" confirmColor="#F44850" :showCancelButton="true"
			@cancel="isShowModal=false" @confirm="confirmModal"></u-modal>
	</view>
</template>

<script>
	import headBgImg from '@/components/headBgImg.vue'
	import permision from "@/js_sdk/wa-permission/permission.js"
	import checkPermission from "@/components/checkPermission.vue"
	export default {
		mixins: [checkPermission], //混入文件
		components: {
			headBgImg
		},
		data() {
			return {
				keyword: '',
				pageIndex: 1,
				list: [],
				latitude: '',
				longitude: '',
				city: '选择城市',
				cityId:'',
				district: '',
				adCode:'',
				from:'',
				isShowModal:false,
				modalContent:'',
				isSearchList:false
			}
		},
		onLoad(opt) {
			if(opt?.from=='receive'){
				this.from=opt.from
			}
			
		},
		onUnload() {
			uni.removeStorageSync('selectCity')
			plus.nativeUI.closeWaiting()
		},
		onShow() {
			if (uni.getStorageSync('selectCity')) {
				console.log('selectCity=',uni.getStorageSync('selectCity'))
				let name = uni.getStorageSync('selectCity').name
				if(name.indexOf('盟')!=-1||name.indexOf('地区')!=-1||name.indexOf('旗')!=-1||name.indexOf('自治')!=-1){
					
				}else{
					name =name+'市'
				}
				this.city = name
				let cityId = uni.getStorageSync('selectCity').code
				cityId = cityId.padEnd(6,'0')
				this.cityId = cityId
				this.district = ''
				this.adCode = ''
				this.getCommunityByCity()
			}else{
				plus.nativeUI.showWaiting('定位中...')
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: (res) => {
						
						console.log('当前位置', res);
						this.latitude = res.latitude
						this.longitude = res.longitude
						this.city = res.address.city
						this.district = res.address.district
						getApp().globalData.isCloseLocation = false
						this.getAddress(res.latitude, res.longitude)
				
					},
					fail(err) {
						console.log('当前位置err', err);
						plus.nativeUI.closeWaiting()
						if(plus.os.name=='Android'){
							if(!getApp().globalData.isCloseLocation){ 
								uni.showModal({
									title:'提示',
									content:'关闭定位将无法获取附近小区，请确认',
									confirmText:'重新开启',
									success: (r) => {
										if(r.confirm){
											permision.gotoAppPermissionSetting()
										}else{
											getApp().globalData.isCloseLocation = true
										}
									}
								})
							}
							
						}else{
							var cllocationManger = plus.ios.import("CLLocationManager");
							var status = cllocationManger.authorizationStatus();
							console.log(status)
							if(status==2&&!getApp().globalData.isCloseLocation){
								uni.showModal({
									title:'提示',
									content:'关闭定位将无法获取附近小区，请确认',
									confirmText:'重新开启',
									success: (r) => {
										if(r.confirm){
											permision.gotoAppPermissionSetting()
										}else{
											getApp().globalData.isCloseLocation = true
										}
									}
								})
							}
							plus.ios.deleteObject(cllocationManger);
						}
						
						
					}
				});
			}
		},
		mounted() {

		},
		onReachBottom() {
			// this.searchGoods(this.pageIndex + 1)
		},
		methods: {
			onInput(e){
				console.log(e)
				if(this.keyword==''){
					this.getCommunityByCity()
				}
			},
			getAddress(lat, lon) {
				let _this = this
				let key = '95a890b94c9310891ed87b34e40eadae'
				let region = lat + ',' + lon
				console.log(lat, lon)
				uni.request({
					url: 'https://restapi.amap.com/v3/geocode/regeo',
					method: 'GET',
					data: {
						output:'json',
						location:lon+','+lat,
						key:'205b7576c02baad66b07792c0d2d96bd',
						radius:'1000',
						extensions:'all'
					},
					success(resdata) {
						console.log(resdata)
						plus.nativeUI.closeWaiting()
						if(resdata.data.status==1){
							_this.adCode = resdata.data.regeocode.addressComponent.adcode
							console.log('adCode=',_this.adCode)
							setTimeout(()=>{
								plus.nativeUI.showWaiting('正在加载小区...')
								_this.getCommunityByCity()
							},100)
						}
					},fail() {
						plus.nativeUI.closeWaiting()
					}
				})
			},
			getCommunityByCity() {
				let data = {
					cityId:this.cityId,
					cityName: this.city,
					districtId:this.adCode,
					communityName: this.keyword,
					districtName: this.district,
					pageIndex:1,
					pageSize:10
				}
				console.log('data', data)
				this.$util.request(this.$apis.getCommunityData, data, 'post').then(r => {
					console.log('小区列表', r)
					setTimeout(()=>{
						plus.nativeUI.closeWaiting()
					},200)
					uni.removeStorageSync('selectCity')
					if (r.status) {
						this.list = r.data ? r.data : [];
						this.isSearchList = this.keyword!=''?true:false;
					}
				})
			},
			navBack() {
				uni.navigateBack()
			},
			bind(item) {
				let data = item
				let params = {
					communityId:data.communityId
				}
				console.log('是否可绑入参',params)
				this.$util.request(this.$apis.validateIsBind,params).then(r=>{
					console.log('是否可绑',r)
					if(r.status){
						uni.navigateTo({
							url: '/pages/address/edit/editReceive?data='+JSON.stringify(data)+'&from='+this.from
						})
					}else{
						this.modalContent = r.statusMessage
						this.isShowModal = true
					}
				})
			},
			confirmModal(){
				this.isShowModal = false
				uni.makePhoneCall({
					phoneNumber:'400-0251117'
				})
			},
			search() {
				plus.nativeUI.showWaiting('正在搜索...')
				this.getCommunityByCity()
			},
			clearValue() {
				this.keyword = ''
				this.pageIndex = 1
				this.list = []
			},
			toSelectCity() {
				uni.navigateTo({
					url: '/pages/bindCommunit/selectCity?city=' + this.city
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 750rpx;
		background-color: #f0f0f0;

	}

	.search-view {
		width: 670rpx;
		height: 68rpx;
		background: #FFFFFF;
		border-radius: 68rpx;
		margin-top: 10rpx;
		background-color: #fff;
		margin-left: 10rpx;

		.lef {
			.icon1 {
				width: 30rpx;
				height: 30rpx;
				margin-left: 20rpx;
				margin-top: 2rpx;
			}

			.city-name {
				font-size: 28rpx;
				font-family: PingFang SC-Regular, PingFang SC;
				color: #333333;
				margin-left: 10rpx;
			}

			.icon2 {
				width: 25rpx;
				height: 25rpx;
				margin-left: 10rpx;
				margin-top: 2rpx;
			}

			.line {
				width: 1rpx;
				height: 28rpx;
				border-right: 1rpx solid #F4F4F4;
				margin-left: 20rpx;
			}
		}

		input {
			width: 395rpx;
			height: 100%;
			background-color: #fff;

			margin-left: 20rpx;
			font-size: 28rpx;
			font-family: PingFang SC-Regular, PingFang SC;
			font-weight: 400;
			color: #333;
		}
	}

	.card {
		width: 690rpx;
		min-height: 897rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		margin-top: 20rpx;
		margin-bottom: 20rpx;

		.card-title {
			width: 666rpx;
			margin: 24rpx 0 27rpx 0;

			image {
				width: 220rpx;
				height: 68rpx;
			}
		}

		.cell-item {
			width: 666rpx;
			margin-bottom: 56rpx;
			justify-content: space-between;

			.lef {
				.name {
					font-size: 29rpx;
					font-family: PingFang SC-Medium, PingFang SC;
					font-weight: 550;
					color: #333333;

					view {
						font-size: 22rpx;
						font-family: PingFang SC-Regular, PingFang SC;
						color: #F73740;
						margin: 9rpx 0 0 10rpx;
					}
				}

				.address {
					width: 556rpx;
					font-size: 25rpx;
					font-family: PingFang SC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
					margin-top: 12rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box; // 作为弹性伸缩盒子模型显示。
					-webkit-box-orient: vertical; // 设置伸缩盒子的子元素排列方式--从上到下垂直排列
					-webkit-line-clamp: 2; // 显示的行
				}
			}

			.rig {
				width: 80rpx;
				height: 50rpx;
				background: #F73740;
				text-align: center;
				line-height: 50rpx;
				font-size: 22rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				color: #FFFFFF;
				border-radius: 50rpx;
			}
		}
	}
	.noList{
		font-size: 28rpx;
		color: #666;
		width: 100%;
		text-align: center;
		margin-top: 200rpx;
	}
</style>