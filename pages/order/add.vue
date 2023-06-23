<template>
	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<u-navbar :title="navTitle" bgColor="rgba(0,0,0,0)" :placeholder="true" :autoBack="true" @rightClick="see">
			<view class="u-nav-slot" slot="left">
				<image class="u-nav-back" src="/static/icon/arrow-left.png" mode="widthFix"></image>
			</view>
			<view class="u-nav-slot" slot="right" v-if="navIndex==1">
				<view class="u-nav-rig-text" style="color: #2E6EEF;">代购攻略</view>
			</view>
		</u-navbar>
		<scroll-view scroll-y="true" style="width:750rpx;height: 89vh;">
			<view class="dis cl al_c" style="padding-bottom:170rpx;">
				<view class="tips dis " v-if="tipsText">
					<image src="/static/icon/tips2.png" mode="widthFix"></image>
					<view>{{tipsText}} 服务时间为{{serveTime}}</view>
				</view>

				<scroll-view class="nav-tabs" scroll-x="true" :show-scrollbar="false"
					style="width: 686rpx;white-space: nowrap;" v-if="navIndex==3">
					<view class="dis al_c" @touchmove.stop>
						<view class="item dis cl al_c" v-for="(item,index) in tabs" :key="item.typeName"
							@click="selectTab(index)">
							<view :class="['icon',tabsCurrent==index?'act-img':'default-img']">
								<image :src="item.typeImageUrl || '/static/logo.png'" mode="aspectFill"></image>
							</view>
							<view :class="['title',tabsCurrent==index?'act':'default']">{{item.typeName}}</view>
						</view>
					</view>

				</scroll-view>

				<view class="card dis cl al_c">
					<view class="textarea-label" v-if="navIndex==1||navIndex==2">需求信息</view>
					<textarea class="textarea" name="" id="" cols="30" :maxlength="100" :auto-height="true"
						:placeholder="placeholderText" v-model="orderDesc" rows="10" v-if="navIndex==3"></textarea>
					<textarea class="textarea" v-model="orderDesc" :maxlength="100" :auto-height="true"
						placeholder-style="color:#999" :placeholder="placeholderText" id="" cols="30" :rows="10"
						v-if="(navIndex!=0 || radio==1)&&navIndex!=3"></textarea>
					<view class="sub_title dis al_c" v-if="navIndex!=0 || radio==1">
						{{navIndex==0?'上传订单截图':navIndex==1?'商品图片':navIndex==2?'物品图片':'上传图片'}}<text
							v-if="navIndex==0||navIndex==2">（多个订单请依次上传）</text>
					</view>
					<view class="itm dis" v-if="navIndex!=0 || radio==1">
						<view class="img dis">
							<view class="cell dis al_c" v-for="(item,index) in showAddressImg" :key="index"
								v-if="showAddressImg.length">
								<image class="img_item" :src="item" @click="previewImg(index)"></image>
								<image class="del_img" src="/static/icon/del.png" mode="widthFix"
									@click="delImg(index)">
								</image>
							</view>
							<image class="img_item" src="/static/icon/upImg.png" @click="upImg" mode="aspectFill"
								v-if="showAddressImg.length<6">
							</image>
						</view>
					</view>
					<view class="addCode dis al_c j_c" @click="addCode" v-if="navIndex==0&&radio==0&&codeSum==0">
						<image src="/static/icon/add.png" mode="widthFix"></image>
						<view>添加快递信息</view>
					</view>
					<view class="code_list"
						:style="codeOpen?openHeight:codeSum==1?miniHeight:(codeList.length==2&&codeSum==2)?defaultHeight:closeHeight"
						v-if="navIndex==0&&radio==0&&codeSum>0&&codeList.length">
						<view class="item dis cl al_c" v-for="(item,index) in codeList" :key="item.id"
							v-if="item['codeList']&&item['codeList'].length">
							<view class="top-view dis al_c" @click="addCode">
								<view class="top dis al_c">
									<image src="/static/logo.png" mode="widthFix"></image>
									<view>{{item.name}}{{item.addressType}}</view>
								</view>
								<view class="add dis al_c">
									<image src="/static/icon/arrow-right2.png" mode="widthFix"></image>
								</view>
							</view>

							<view class="code_v dis al_c" v-for="(son,sonIndex) in item['codeList']">
								<view class="lef dis al_c">取件码{{sonIndex+1}}
									<text>{{son['code'+son.index1+son.index2]}}</text>
								</view>
								<view class="rig dis al_c j_c" @click="delCode(index,sonIndex)">
									<image src="/static/icon/del3.png" mode="widthFix"></image>
								</view>
							</view>
						</view>

					</view>
					<view class="open-icon dis j_c" v-if="navIndex==0&&radio==0&&codeSum>2" @click="codeOpen=!codeOpen">
						<view class="btm dis j_c al_c">
							<view>共{{codeSum}}件</view>
							<image class="btm_open" src="/static/icon/arrow-bottom1.png" mode="widthFix"
								v-if="!codeOpen&&codeSum>1"></image>
							<image class="btm_open" style="transform: rotateZ(-180deg);"
								src="/static/icon/arrow-bottom1.png" mode="widthFix" v-if="codeOpen&&codeSum>1">
							</image>
						</view>
					</view>

				</view>
				<view class="card2 dis cl al_c" v-if="navIndex!=3">
					<view class="itm dis al_c" @click="toShowPickup" v-if="navIndex!=0 || radio==1">
						<view class="lef dis al_c"><text
								class="t1">{{navIndex!=2?'取':'收'}}</text>{{navIndex==0?'在哪里取件':navIndex==2?'收件地址':'在哪里购买'}}
						</view>
						<view class="rig  dis al_c" style="color: #F44850;">
							<view class="ad_text" v-if="navIndex!=2">
								<text v-if="navIndex==1">{{pickupInfo.shopName}}{{pickupInfo.shopAddress}}</text>
								<view v-if="pickupInfo.address=='请选择'&&navIndex==1" style="color: #CCCCCC;">不选,表示不指定购买商店
								</view>
								<view v-else-if="navIndex!=1">{{pickupInfo.address}}</view>
							</view>

							<u--textarea v-model="receiveAddress" placeholder="请输入您的收件地址" maxlength="200"
								placeholder-style="color:#CCC;padding:0"
								:class="['placeholder',receiveAddress.length<11?'text_rig':'']" autoHeight v-else>
							</u--textarea>
							<image src="/static/icon/arrow-right2.png" mode=" " v-if="navIndex!=2"></image>
						</view>
					</view>
					<view class="itm itm_ls dis al_c" style="height: 150rpx;" @click="toReceive">
						<view class="lef dis al_c"><text
								class="t2">{{navIndex==2?'寄':'送'}}</text>{{navIndex==2?'寄件地址':'送到哪里去'}}</view>
						<view class="rig dis al_c" style="color: #2E6EEF;">
							<view class="ad_text dis cl" v-if="navIndex!=2">
								<view class="name">{{receiveInfo.communityName}}</view>
								<view class="address">{{receiveInfo.receiveAddress}}</view>
							</view>
							<view class="ad_text dis cl" style="margin-right: 20rpx;" v-else>
								<view class="name">{{receiveInfo.communityName}}</view>
								<view class="address">{{receiveInfo.receiveAddress}}</view>
							</view>
							<image src="/static/icon/arrow-right2.png" mode=""></image>
						</view>
					</view>
				</view>
				<view class="card3" v-if="navIndex==3">
					<view class="itm dis al_c">
						<view class="lef dis al_c">
							<image src="/static/icon/address.png" mode=""></image> 服务地址
						</view>
						<view class="rig  dis al_c" style="color: #F44850;">
							<u--textarea v-model="address1" placeholder="请输入服务地址" maxlength="62"
								placeholder-style="color:#CCC;padding-left:50rpx" autoHeight></u--textarea>
						</view>
					</view>
				</view>
				<view class="card2 dis cl al_c" v-if="navIndex!=1&&navIndex!=3">
					<view class="itm dis al_c" @click="isShowWeight=true">
						<view class="lef">重量/大小</view>
						<view class="rig  dis al_c"> {{weightValue}}
							<image src="/static/icon/arrow-right2.png" mode=""></image>
						</view>
					</view>
					<view class="itm itm_ls  dis al_c">
						<view class="lef">数量</view>
						<view class="rig dis al_c">
							<!-- 可减少数量已经最低 -->
							<!-- <u-number-box v-model="num" :disabled="isdisabledNum" :disableMinus="true" :min="1"
								:max="1000" :disabledInput="true" @change="valChange"
								v-if="(Number(sumPrice)-Number(originalPrice))<0">
								<image slot="minus" class="minus" style="width: 48rpx;height: 48rpx;"
									src="/static/icon/jian.png" mode="widthFix"></image>
								<text slot="input" style="width: 61rpx;text-align: center;" class="input">{{num}}</text>
								<image slot="plus" class="plus" style="width: 48rpx;height: 48rpx;"
									src="/static/icon/jia.png" mode="widthFix" v-if="radio==1"></image>
								<image slot="plus" style="width: 48rpx;height: 48rpx;" src="/static/icon/jia1.png"
									mode="widthFix" v-if="radio==0"></image>
							</u-number-box> -->

							<u-number-box v-model="num" :min="1" :disabled="isdisabledNum" :max="1000" button-size="46"
								:disabledInput="true" @change="valChange">
								<image slot="minus" class="minus" style="width: 48rpx;height: 48rpx;"
									src="/static/icon/jian1.png" mode="widthFix" v-if="num>1&&radio!=0"></image>
								<image slot="minus" class="minus" style="width: 48rpx;height: 48rpx;"
									src="/static/icon/jian.png" mode="widthFix" v-if="num==1 || radio==0"></image>
								<text slot="input" style="width: 61rpx;text-align: center;" class="input">{{num}}</text>
								<image slot="plus" class="plus" style="width: 48rpx;height: 48rpx;"
									src="/static/icon/jia.png" mode="widthFix" v-if="radio==1"></image>
								<image slot="plus" style="width: 48rpx;height: 48rpx;" src="/static/icon/jia1.png"
									mode="widthFix" v-if="radio==0"></image>
							</u-number-box>
						</view>
					</view>
					<view class="itm itm_ls dis al_c" v-if="navIndex==2">
						<view class="lef">是否代寄</view>
						<view class="rig  dis al_c">
							<u-switch v-model="isSend" activeColor="#F44850"></u-switch>
						</view>
					</view>
				</view>

				<!-- 取件地址 -->
				<view class="picker">
					<u-popup :show="showPickup" :round="20" mode="bottom">
						<view class="pickup-view dis cl al_c">
							<view class="pick-title dis al_c">
								<view></view>
								<view>请选择代取点</view>
								<image src="/static/icon/recharge/close.png" mode="widthFix" @click="showPickup=false">
								</image>
							</view>
							<view class="pick-cell dis al_c" v-for="(item,index) in pickupList1" :key="item.name"
								@click="pickupIndex=index">
								<view class="name">{{item.name}}</view>
								<image src="/static/icon/selects2.png" mode="widthFix" v-if="pickupIndex==index">
								</image>
								<image src="/static/icon/select1.png" mode="widthFix" v-else></image>
							</view>
							<textarea class="pickup-input" maxlength="50" placeholder="请输入其他代收点地址"
								placeholder-style="color:#CCCCCC" v-model="pickupOrtherAdds"
								v-if="pickupIndex==pickupList1.length-1"></textarea>
							<view class="btn default" v-if="pickupIndex!=pickupList1.length-1 || pickupOrtherAdds!=''"
								@click="confirmPickup">确定</view>
							<view class="btn disable" v-else>确定</view>
						</view>
					</u-popup>
					<!-- <u-picker :show="showPickup" :columns="pickupList" keyName="name" @confirm="confirmPickup"
						@cancel="showPickup=false"></u-picker> -->
				</view>

				<view class="card2 dis cl al_c" v-if="navIndex!=3">
					<view class="itm dis al_c" v-if="navIndex==0">
						<view class="lef">优惠券</view>
						<view class="rig  dis al_c" @click="toCoupon">
							<view v-if="couponNum!=0&&couponList.length==0"> {{couponNum}}张</view>
							<view class="dis al_c" v-else><text v-if="couponNum>0">已选{{couponList.length}}张</text>
								{{couponNum>0?'跑腿券':'暂无'}}
							</view>
							<image src="/static/icon/arrow-right.png" mode=""></image>
						</view>

					</view>
					<view class="itm itm_ls dis al_c">
						<view class="lef">小计</view>
						<view class="rig dis al_c price_info"><text class="t2" style="font-size: 26rpx;">￥</text><text
								class="t1">{{sumPriceInteger}}</text><text class="t2"><text
									class="t3">.{{sumPriceDecimal}}</text>
							</text></view>
					</view>
				</view>
				<view class="card dis cl al_c" style="height: 111rpx;padding:0" v-if="navIndex!=3">
					<view class="itm dis al_c" style="height: 111rpx;">
						<view class="t1">送达时间</view>
						<view class="dis al_c radio">
							<view class="son dis al_c" @click="radio1=0" v-if="isBusiness || isAtTime">
								<image src="/static/icon/select.png" mode="widthFix" v-if="radio1==1"></image>
								<image src="/static/icon/selects.png" mode="widthFix" v-else></image>
								<view :class="[radio1==0?'act':'def']">当天</view>
							</view>
							<view class="son dis al_c" @click="radio1=1">
								<image src="/static/icon/select.png" mode="widthFix" v-if="radio1==0"></image>
								<image src="/static/icon/selects.png" mode="widthFix" v-else></image>
								<view :class="[radio1==1?'act':'def']">隔天</view>
							</view>
						</view>
					</view>
				</view>
				<view class="card tabs-info" v-if="navIndex==3&&tabs.length">
					<view class="info-title dis al_c">
						<view class="title">佣金</view>
						<input type="digit" v-model="commission" placeholder="请输入佣金" placeholder-style="color:#CCCCCC"
							@blur="changeAddPrice">
					</view>
					<view class="dis" @click="isExpand=!isExpand">
						<view :class="['info-content',isExpand?'expand':'no-expand']" v-if="tabsCurrent!=-1">
							{{tabs[tabsCurrent].typeDesc}}
						</view>
						<image :class="['info-icon',isExpand?'deg180':'no-deg']" src="/static/icon/arrow-bottom1.png"
							mode="widthFix" v-if="tabsCurrent!=-1"></image>
					</view>
				</view>
			</view>

			<view class="bottom_v dis " v-if="!showPickup">
				<view class="num_count dis cl j_c">
					<view class="price" v-if="navIndex!=3 || commission>=orderPrice"><text class="t4">合计：</text> <text
							class="t2">￥</text><text class="t1">{{sumPriceInteger}}</text><text class="t2"><text
								class="t3">.{{sumPriceDecimal}}</text>
						</text></view>
					<view class="price" style="color: #333;" v-if="navIndex==3&&commission<orderPrice">合计：--</view>
					<view class="discount" v-if="couponMoney>0&&couponNum>0">
						已优惠￥{{couponMoney.toFixed(2)}}</view>
				</view>

				<view class="btn" @click="confrimOrder">提交订单</view>
			</view>
		</scroll-view>

		<u-popup :show="isShowWeight" :round="20" mode="center">
			<view class="weight_body dis cl al_c">
				<view class="title">选择重量/大小</view>
				<view class="select_v dis">
					<view :class="['item',wtCurrent==index?'act':'']" v-for="(item,index) in weightList1"
						:key="item.desc" @click="selectWeight(item,index)">{{item.desc}}</view>
				</view>
				<view class="bottom dis al_c">
					<view class="lef btn" @click="isShowWeight=false">取消</view>
					<view class="line"> </view>
					<view class="rig btn" @click="confirmWeight">确定</view>
				</view>
			</view>
		</u-popup>
		<u-popup :show="isTips" :round="20" mode="center">
			<view class="popup-tips dis cl al_c" style="height: 448rpx;">
				<view class="title">{{tips.title}}</view>
				<view class="text">{{tips.text1}}{{serveTime}}</view>
				<view class="text" v-if="tips.text2">{{tips.text2}}</view>
				<view class="text" v-if="tips.text3">{{tips.text3}}</view>
				<view class="bottom dis al_c">
					<view class="rig btn" @click="isTips=false">确定</view>
				</view>
			</view>
		</u-popup>
		<u-popup :show="showPaySelect" :closeOnClickOverlay="true" :round="20" mode="bottom">
			<view class="pop_body dis cl">
				<view class="itm dis al_c j_c" @click="submit(0)">
					<image src="/static/icon/alipay.png" mode="widthFix"></image>
					<view>支付宝支付</view>
				</view>
				<view class="itm dis al_c j_c" @click="submit(1)">
					<image src="/static/icon/wepay.png" mode="widthFix"></image>
					<view>微信支付</view>
				</view>
				<u-gap height="8" bgColor="#F0F0F0"></u-gap>
				<view class="cancel_btn" @click="showPaySelect=false">取消</view>
			</view>
		</u-popup>
		<u-modal :show="isShowModal" :show-cancel-button="false" :title='modalText' @confirm="confirmModal"
			width="500rpx"></u-modal>
	</view>
</template>

<script>
	import encrypt from '@/libs/encrypt.js'
	import headBgImg from '@/components/headBgImg.vue'
	import checkPermission from "@/components/checkPermission.vue"
	export default {
		mixins: [checkPermission],
		components: {
			headBgImg
		},
		data() {
			return {
				tips: {
					title: '提示',
					text1: '服务时间：',
					text2: '未在服务时间，下单后将在服务时间内',
					text3: '为您服务。'
				},
				isTips: false,
				isSend: true,
				isAtTime: true, //	当天服务时间未开始
				isShowWeight: false,
				modalText: '',
				isShowModal: false,
				navIndex: 0,
				communitId: '',
				receiveAddress: '', //代寄快递地址
				receiveInfo: {
					communityName: '',
					receiveAddress: ''
				},
				settingInfo: {},
				showPickup: false,
				pickupList: [],
				pickupList1: [],
				pickupInfo: {
					address: '请选择'
				},
				orderDesc: '',
				couponInfo: {
					couponMoney: 0
				},
				couponMoney: 0,
				navTitle: '代取快递外卖',
				radio: 0,
				radio1: 0,
				radiovalue1: '快递',
				showAddressImg: [],
				imgIds: [],
				address1: '',
				address2: '',
				value: 0,
				num: 1,
				originalPrice: '0.00', // 原始价格（不包含优惠金额）
				orderPrice: '0.00',
				sumPrice: '0.00',
				sumPriceInteger: '0',
				sumPriceDecimal: '00',
				showWeight: false,
				wtCurrent: 0,
				weightValue: '1-5/公斤',
				weightCode: 0,
				weightList: [],
				weightList1: [],
				showPaySelect: false,
				couponList: [],
				couponNum: 0,
				isDisabled: false,
				deviceCode: '',
				placeholderText: '',
				tipsText: '',
				pickCommunitId: '',
				codeList: [],
				codeSum: 0,
				codeOpen: false,
				codeHeight: 0,
				closeHeight: {
					height: '280rpx',
					transition: 'all 0.5s'
				},
				defaultHeight: {
					height: '370rpx',
				},
				miniHeight: {
					height: '180rpx',
				},
				openHeight: {
					height: '',
					transition: ''
				},
				pickupJson: [],
				serveTime: '',
				isBusiness: true,
				isdisabledNum: true,
				tabsCurrent: -1,
				tabs: [],
				commission: '',
				communitConfig: {},
				isSubmit: false,
				isExpand: false,
				pickupIndex: 0,
				pickupOrtherAdds: ''
			};
		},
		computed: {
			priceInfo() {
				let priceInfo = {}
				let price = Number(this.orderPrice) * this.num
				priceInfo['integer'] = this.$getBit(price).integer
				priceInfo['decimal'] = this.$getBit(price).decimal
				return priceInfo
			}
		},

		onLoad(opt) {
			// console.log('opt=', opt)
			if (opt.index) {
				this.navIndex = opt.index
				let idx = opt.navIndex
				let text = idx == 0 ? '取快递' : idx == 1 ? '取外卖' : idx == 2 ? '代购商品' : idx == 3 ? '代寄送' : '万能帮'
				this.navTitle = text
				let placeholderText = ''
				let tipsText = '若产生其他费用或发生其他情况与平台无关。'
				if (idx == 0) this.num = 0
				if (idx == 1 || idx == 3) this.isdisabledNum = false
				if (idx == 0 || idx == 1) {
					placeholderText = '请上传订单截图或输入取件信息。如：收件人姓名、取货码。'
					this.radio = idx
				} else if (idx == 2) {
					placeholderText = '请详细描述您的需求，也可以上传对应的图片。跑腿人员先垫付后结算。'
				} else if (idx == 3) {
					placeholderText = '填写您寄送的物品名称，寄什么快递（中通、顺丰等），不需要管家代寄的，请说明送达的快递点位置。'
					tipsText = tipsText + '寄件费待管家确认后补单进行支付，或者自行付费给快递站。'
				} else {
					placeholderText = '请详细描述您的需求(如：丢垃圾、代遛狗等)，等待跑腿人员接单后联系您。'
					tipsText = tipsText
					this.getTypeSetting(placeholderText, opt.communityId)
				}
				this.placeholderText = placeholderText
				this.tipsText = tipsText
				// console.log('tipsText=', this.tipsText)
			}
			if (opt.deviceCode) {
				this.deviceCode = opt.deviceCode
			}
			plus.nativeUI.showWaiting('加载中...')
			this.getData()
			this.getWeightEnum()

		},
		onShow() {
			if (uni.getStorageSync('receiveInfo')) { // 收货地址

				this.receiveInfo = uni.getStorageSync('receiveInfo')
				console.log('receiveInfo', this.receiveInfo)
				if (this.communitId != '' && this.communitId != this.receiveInfo.communityId && this.navIndex ==
					1) { // 收货地址变更（需重新选择取货地址）
					this.communitId = this.receiveInfo.communityId
					this.pickupInfo = {
						address: ''
					}
					this.modalText = '小区已变更，需重新选择取货地址'
					this.isShowModal = true
					uni.removeStorageSync('pickupInfo')
				}
				this.communitId = this.receiveInfo.communitId
				this.getOrderPrice()
				uni.removeStorageSync('receiveInfo')
			}
			if (uni.getStorageSync('pickupInfo')) { // 取货地址（代购商品）
				let pickupInfo = uni.getStorageSync('pickupInfo')
				pickupInfo['shopName'] = pickupInfo.shopName + '：'
				this.pickupInfo = pickupInfo
				// console.log('已选商铺=', pickupInfo)
				uni.removeStorageSync('pickupInfo')
			}
			if (uni.getStorageSync('couponList')) { // 优惠券
				// console.log('存在优惠券', uni.getStorageSync('couponList'))
				let couponSumprice = uni.getStorageSync('couponSumprice')
				// 判断如果选择优惠券或者重新选择优惠券，实付金额先还原
				this.sumPrice = this.originalPrice
				this.sumPriceInteger = this.$getBit(this.sumPrice).integer
				this.sumPriceDecimal = this.$getBit(this.sumPrice).decimal
				this.couponList = uni.getStorageSync('couponList')
				this.couponMoney = couponSumprice

				if (Number(this.sumPrice) >= Number(this.couponMoney)) {
					this.sumPrice = (this.sumPrice - Number(this.couponMoney)).toFixed(2)
					this.sumPriceInteger = this.$getBit(this.sumPrice).integer
					this.sumPriceDecimal = this.$getBit(this.sumPrice).decimal

				} else {
					this.$toast('订单金额需大于优惠券金额')
					this.couponList = []
					this.couponMoney = 0
				}

				uni.removeStorageSync('couponList')
				uni.removeStorageSync('couponSumprice')
			}
			console.log('onshow---')
			// console.log('codeList----',uni.getStorageSync('codeList'))
			if (uni.getStorageSync('codeList') && uni.getStorageSync('codeSum')) {
				let codeList = uni.getStorageSync('codeList')
				console.log('codeList==', codeList)
				this.sumCodeHight(codeList)
				this.codeList = codeList
				this.codeSum = uni.getStorageSync('codeSum')
				this.toSumPrice(this.codeSum, true)
				this.num = uni.getStorageSync('codeSum')

			}
			this.upReceiveInfo()
		},
		onUnload() {
			uni.removeStorageSync('codeList')
			uni.removeStorageSync('codeSum')
		},
		methods: {
			selectTab(index) {
				this.tabsCurrent = index
				this.orderDesc = '#' + this.tabs[index].typeName + ' '
				this.commission = this.tabs[index].typePrice
				this.orderPrice = this.tabs[index].typePrice
				this.sumPriceInteger = this.$getBit(this.tabs[index].typePrice).integer
				this.sumPriceDecimal = this.$getBit(this.tabs[index].typePrice).decimal
			},
			getTypeSetting(text, communityId) {
				let data = {
					operateType: 0,
					communityId: communityId
				}
				console.log('万能帮入参', data)
				this.$util.request(this.$apis.getTypeSetting, data).then(r => {
					// console.log('万能帮服务类型', r)
					if (r.status) {
						this.tabs = r.data
						this.orderDesc = ''

					}
				})
			},
			changeAddPrice(e) {
				var that = this
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				console.log('value=', e.target.value)
				console.log('minPrice=', that.orderPrice)
				if (that.tabsCurrent != -1 && Number(e.target.value) < this.orderPrice) {

					that.$toast('小于最低佣金' + that.tabs[that.tabsCurrent].typePrice + '请修改后重试')
					that.commission = that.orderPrice
					that.sumPriceInteger = that.$getBit(that.orderPrice).integer
					that.sumPriceDecimal = that.$getBit(that.orderPrice).decimal
					return;
				}
				if (e.target.value && Number(e.target.value) > 0) {
					console.log('价格赋值', e.target.value)
					that.$nextTick(() => {
						that.commission = Number(e.target.value).toFixed(2)
						// that.orderPrice = e.target.value
						that.sumPriceInteger = that.$getBit(e.target.value).integer
						that.sumPriceDecimal = that.$getBit(e.target.value).decimal
					})
					console.log('commission', that.commission)
					console.log('orderprice', that.orderPrice)
				} else {
					that.$nextTick(() => {
						that.commission = ''
						that.sumPriceInteger = that.$getBit(that.sumPrice).integer
						that.sumPriceDecimal = that.$getBit(that.sumPrice).decimal
					})
					that.commission = ''
					// console.log('commission=', this.commission)
				}

			},
			confrimOrder() {
				if (this.navIndex == 3 && this.address1 == '') {
					this.$toast('请添加服务地址')
					return
				}
				if (this.navIndex == 3 && this.commission == '') {
					this.$toast('请填入佣金金额')
					return
				}
				if (this.navIndex == 3 && this.commission < this.orderPrice) {
					this.$toast('佣金金额不能低于最低金额')
					return
				}
				if (this.navIndex == 3 && this.tabsCurrent == -1) {

				}
				if (this.navIndex == 2 && this.receiveAddress == '') {
					this.$toast('请添加收件地址')
					return
				}
				if (this.navIndex == 0 && this.radio == 1 && this.pickupInfo.address == '请选择') {
					this.$toast('请添加取件地址')
					return
				}
				if (this.navIndex == 0 && this.radio == 0 && this.codeSum == 0) {
					this.$toast('请添加取件码')
					return;
				} else if (this.navIndex == 0 && this.radio == 0 && this.codeSum > 0) {
					let pickupJson = []
					let list = this.codeList
					// console.log('list=', list)
					list.forEach((item, itemIndex) => {
						let itm = {
							pAddress: item.name + '：' + item.address,
							pCodes: []
						}
						let pCodes = ''
						item.codeList.forEach((son, sonIndex) => {
							itm.pCodes.push(son['code' + son.index1 + son.index2])
						})
						itm.pCodes = itm.pCodes.join(',')
						pickupJson.push(itm)

					})

					this.pickupJson = JSON.stringify(pickupJson)
					// console.log('pickupJson=', this.pickupJson)
				}
				if (this.sumPrice > 0) {
					this.showPaySelect = true
				} else {
					// 订单金额为0，默认支付宝下单
					this.submit(0)
				}
			},
			submit(payType) {
				let {
					communitId,
					navIndex
				} = this
				if (communitId == '') {
					this.$toast('您还未添加魔盒')
					this.showPaySelect = false
					return;
				}

				this.showPaySelect = false
				if (this.isSubmit) return;
				this.isSubmit = true
				uni.showLoading({
					title: '支付中请稍后..'
				})
				console.log('receiveInfo==', this.receiveInfo)
				console.log('navIndex==', this.navIndex)
				let data = {
					"communityId": this.navIndex != 3 ? this.receiveInfo.communityId : '',
					"communityName": this.navIndex != 3 ? this.receiveInfo.communityName : '',
					"couponId": this.couponList,
					"couponMoney": this.couponMoney,
					"orderDesc": this.orderDesc,
					"orderImageId": this.imgIds.join(';'),
					"orderMoney": this.navIndex == 3 ? this.commission : Number(this.orderPrice) * this.num,
					"payMoney": Number(this.sumPrice),
					"payType": payType,
					"pickupAddress": this.navIndex != 3 ? this.pickupInfo.address : '',
					"quantity": this.num,
					"receiveId": this.navIndex != 3 ? this.receiveInfo.receiveId : '',
					"type": this.radio,
					"weightSize": this.weightCode,
					"shopAddress": this.pickupInfo.address == '请选择' ? '不指定购买商店' : this.pickupInfo.address,
					"serviceAddress": this.address1,
					"pickupDeviceId": this.navIndex != 3 ? this.receiveInfo.receiveId : '',
					"deviceId": this.receiveInfo.receiveId,
					"receiveAddress": this.receiveAddress,
					"isSend": this.isSend ? 1 : 0,
					"pickupJson": (this.navIndex == 0 && this.radio == 0) ? this.pickupJson : [],
					"isOtherday": this.radio1
				}
				console.log('提交订单入参', data)
				let url = (navIndex == 0 && this.radio == 0) ? this.$apis.placeExpressOrder : (navIndex == 0 && this
						.radio == 1) ? this.$apis.placeAnOrder : navIndex == 1 ? this.$apis.bugGoodsAnOrder :
					navIndex == 3 ? this.$apis.agentAnythingOrder : this.$apis.deliveryExpressOrder
				// console.log('url=', url)
				this.$util.request(url, data, 'POST').then(r => {
					console.log('下单结果', r)
					if (!r.status) {
						this.isSubmit = false
						this.$toast(r.statusMessage)
						return;
					}
					if (Number(this.sumPrice) == 0) {
						plus.nativeUI.closeWaiting()
						this.$toast('下单成功')
						setTimeout(rr => {
							uni.navigateTo({
								url: '/pages/order/payState?type=0'
							})
						}, 800)

						return;
					}
					if (payType == 0) {
						this.payMent(r.resultValue, payType)
					} else {
						this.payMent(r.data, payType)
					}
				})
			},
			payMent(payData, payType) {
				// console.log('payData',payData)
				// console.log('payType',payType)
				if (payType == 0) {
					// 支付宝
					// console.log('开始唤起支付')
					uni.requestPayment({
						provider: 'alipay',
						orderInfo: payData, //微信、支付宝订单数据 【注意微信的订单信息，键值应该全部是小写，不能采用驼峰命名】
						success: (res) => {
							uni.hideLoading()
							plus.nativeUI.closeWaiting()
							uni.navigateTo({
								url: '/pages/order/payState?type=0'
							})
						},
						fail: (err) => {
							this.isSubmit = false
							uni.hideLoading()
							plus.nativeUI.closeWaiting()
							this.$toast('未完成支付')
						}
					});
				} else {
					// 微信支付
					uni.requestPayment({
						"provider": "wxpay",
						"orderInfo": {
							"appid": payData.appid, // 微信开放平台 - 应用 - AppId，注意和微信小程序、公众号 AppId 可能不一致
							"noncestr": payData.nonce_str, // 随机字符串
							"package": payData.package, // 固定值
							"partnerid": payData.mch_id, // 微信支付商户号
							"prepayid": payData.prepay_id, // 统一下单订单号 
							"timestamp": payData.timestamp, // 时间戳（单位：秒）
							"sign": payData.sign // 签名，这里用的 MD5/RSA 签名
						},
						success: (res) => {

							uni.hideLoading()
							// console.log('微信支付结果', res)
							plus.nativeUI.closeWaiting()
							uni.navigateTo({
								url: '/pages/order/payState?type=0'
							})
						},
						fail: (e) => {
							this.isSubmit = false
							uni.hideLoading()
							plus.nativeUI.closeWaiting()
							uni.showToast({
								title: '未完成支付',
								duration: 2500
							})
						}
					})
				}
			},
			toCoupon() {
				console.log('原始金额', this.originalPrice)
				uni.navigateTo({
					url: '/pages/my/coupon?type=0&orderPrice=' + this.originalPrice + '&couponList=' +
						JSON.stringify(this.couponList)
				})
			},
			upReceiveInfo() {
				this.$util.request(this.$apis.getReceiveAddressList).then(r => {
					if (r.status) {
						r.data = r.data ? r.data : []
						this.receiveInfo = r.data[0]
					}
				})
			},
			getData() {
				this.$util.request(this.$apis.getCouponList, {
					type: 0
				}).then(r => {
					if (r.status) {
						this.couponNum = r.data ? r.data.length : 0
					}
				})
				this.$util.request(this.$apis.getReceiveAddressList).then(r => {
					console.log('用户收件地址列表', r)
					if (r.status) {
						r.data = r.data ? r.data : []
						this.communitId = r.data[0].communityId
						this.receiveInfo = r.data[0]
						this.getOrderPrice()
						let data = {
							communityId: r.data[0].communityId
						}
						if (this.navIndex == 0) {
							this.$util.request(this.$apis.getPickupAddressList, data).then(r => {
								console.log('外卖--用户取件地址列表', r)
								if (r.status && this.navIndex == 0) {
									r.data = r.data.filter(item => {
										return item.addressType == '驿站'
									})
									r.data.push({
										name: '其他代收点',
										address: ''
									})
									this.pickCommunitId = data.communityId
									this.pickupList = [r.data]
									this.pickupList1 = r.data
								}
							})
						}
						this.$util.request(this.$apis.getCommunitySetting, data).then(rr => {
							console.log('小区配置', rr)
							if (rr.status) {
								let data = rr.data
								let tipsText = ''
								let tips1 = '无电梯将加收费用' + data.extraWalkupMoney + '元'
								let tips2 = '雨天将加收费用' + data.extraRainMoney + '元'
								if (!data.isElevator && data.isRain) {
									tipsText = '若遇' + tips1 + '，' + tips2 + ' 。'
								} else if (!data.isElevator && !data.isRain) {
									tipsText = '若遇' + tips1 + ' 。'
								} else if (data.isElevator && data.isRain) {
									tipsText = '若遇' + tips2 + ' 。'
								} else {
									tipsText = ''
								}

								let timeArr = rr.data.bussinessTime.split('-');
								let isAtTime = checkAtTime(timeArr[0]); // 是否当日且服务时间未开启
								let isBusiness = checkAuditTime(timeArr[0], timeArr[1]) ? true :
									false; //是否不在服务时间
								this.radio1 = isBusiness ? 0 : 1
								this.serveTime = data.bussinessTime
								this.isAtTime = isAtTime
								// console.log('isAtTime=',isAtTime)
								if (!isBusiness) {
									this.isBusiness = false
									this.isTips = true
								}
								if (this.navIndex != 0 && this.navIndex != 1) return;
								this.communitConfig = rr.data
								this.tipsText = this.tipsText + tipsText

							}
						})
						var checkAuditTime = (beginTime, endTime) => {
							var nowDate = new Date();
							var beginDate = new Date(nowDate);
							var endDate = new Date(nowDate);

							var beginIndex = beginTime.lastIndexOf("\:");
							var beginHour = beginTime.substring(0, beginIndex);
							var beginMinue = beginTime.substring(beginIndex + 1, beginTime.length);
							beginDate.setHours(beginHour, beginMinue, 0, 0);

							var endIndex = endTime.lastIndexOf("\:");
							var endHour = endTime.substring(0, endIndex);
							var endMinue = endTime.substring(endIndex + 1, endTime.length);
							endDate.setHours(endHour, endMinue, 0, 0);
							return nowDate.getTime() - beginDate.getTime() >= 0 && nowDate.getTime() <= endDate
								.getTime();
						}

						var checkAtTime = (beginTime) => {
							let date = new Date();
							let hour = date.getHours();
							let minutes = date.getMinutes();
							let currTimeList = [hour, minutes]
							let beginTimeList = beginTime.split(':')
							if (currTimeList[0] > 0 && currTimeList[0] < Number(beginTimeList[0])) {
								return true
							} else if (currTimeList[0] == Number(beginTimeList[0]) && currTimeList[1] < Number(
									beginTimeList[1])) {
								return true
							} else {
								return false
							}
						}
					} else {
						plus.nativeUI.closeWaiting()
						this.$toast(r.statusMessage)
					}
				})


			},
			confirmWeight(e) {
				this.weightCode = this.weightList1[this.wtCurrent].code
				this.weightValue = this.weightList1[this.wtCurrent].desc
				this.isShowWeight = false
				this.getOrderPrice()
			},
			confirmPickup(e) {
				// let itm = e.value[0]
				let itm = this.pickupIndex!=this.pickupList1.length-1?this.pickupList1[this.pickupIndex]:{name:'',address:this.pickupOrtherAdds};
				let info = {
					address: ''
				}
				info.address = itm.name?itm.name + ':' + itm.address:itm.address;
				console.log(info)
				this.pickupInfo = info
				this.showPickup = false

			},
			getWeightEnum() {
				this.$util.request(this.$apis.getWeightEnum).then(r => {
					console.log('重量规格', r)
					if (r.status) {
						let weightList = r.data
						weightList.forEach(item => {
							item.desc = item.desc + '/公斤'
						})
						this.weightList = [weightList]
						this.weightList1 = weightList
						this.weightCode = weightList[0].code
						this.getOrderPrice()
					} else {
						plus.nativeUI.closeWaiting()
						this.$toast(r.statusMessage)
					}
				})
			},
			getOrderPrice() {
				if (!this.receiveInfo.communityId) {
					this.$util.request(this.$apis.getReceiveAddressList).then(r => {
						if (r.status) {
							r.data = r.data ? r.data : []
							this.communitId = r.data[0].communityId
							this.receiveInfo = r.data[0]
							this.getPrice()
						} else {
							plus.nativeUI.closeToast()
							this.$toast('数据丢失，请重新进入')

						}

					})
				} else {
					this.getPrice()
				}
			},
			radioChange(index) {
				this.radio = index
				this.getPrice()
				this.isdisabledNum = index == 0 ? true : false
			},
			getPrice() {
				let {
					navIndex,
					radio
				} = this
				let data = {
					code: this.weightCode,
					communityId: this.receiveInfo.communityId,
					num: 1,
					type: (navIndex == 0 && radio == 0) ? 0 : (navIndex == 0 && radio == 1) ? 1 : navIndex == 1 ? 2 :
						navIndex == 2 ? 4 : 3
				}
				console.log('订单价格入参', data)
				this.$util.request(this.$apis.getExpense, data, 'POST').then(res => {
					console.log('订单价格', res)
					setTimeout(() => {
						plus.nativeUI.closeWaiting()
					}, 500)
					let orderPrice = Number(res.resultValue).toFixed(2)
					this.orderPrice = orderPrice
					this.toSumPrice(this.num, true, true)
				})
			},
			upImg() {
				let _self = this;

				function compressImage(num) {
					let path = imgdatas[num]
					plus.zip.compressImage({
						src: path,
						dst: "_doc/" + get
					})
				}
				uni.chooseImage({
					sourceType: ['camera', 'album'],
					count: 6 - this.showAddressImg.length,
					success: (res) => {
						// console.log('已选照片', res)
						let tempFilePaths = res.tempFilePaths
						let tempFiles = res.tempFiles
						_self.showAddressImg = _self.showAddressImg.concat(tempFilePaths)

						let url = _self.$apis.uploadImg
						uni.showLoading({
							title: '图片上传中...',
							mask: true
						})
						let newImgList = []
						let upLoadImg = () => {
							newImgList.forEach((item, index) => {
								// 上传图片------------------------------------------------
								let APP_KEY = "ymdj";
								let APP_NOTIC = encrypt.createUUID(32).toLowerCase();
								let APP_TIMESTAMP = Math.round(new Date().getTime() / 1000);
								let APP_SIGN = encrypt.hex_md5(APP_NOTIC, APP_TIMESTAMP);
								let formData = {
									AppKey: APP_KEY,
									AppNotic: APP_NOTIC,
									AppSign: APP_SIGN,
									SystemCode: uni.getStorageSync('userType').code,
									AppTimestamp: APP_TIMESTAMP,
									ftoken: uni.getStorageSync('ftoken') || ''
								}
								// console.log('path=', item)
								uni.uploadFile({
									url: url,
									filePath: item,
									name: 'file',
									formData: formData,
									header: {
										AppKey: APP_KEY,
										AppNotic: APP_NOTIC,
										AppSign: APP_SIGN,
										SystemCode: uni.getStorageSync('userType').code,
										AppTimestamp: APP_TIMESTAMP,
										ftoken: uni.getStorageSync('ftoken') || ''
									},
									success: (res) => {
										res.data = JSON.parse(res.data)
										console.log('上传结果', res.data)
										if (index == newImgList.length - 1) {
											uni.hideLoading()
											this.$toast('图片上传成功')

										}
										if (res.data.status) {
											_self.imgIds.push(res.data.resultValue);
										} else {
											// this.$toast(res.statusMessage)

										}
									},
									fail: (err) => {
										// console.log('err', err)
										this.isImgup = false
									}
								});
							})
						}

						// 压缩图片 （方法限制异步压缩最多三张，改为循环压缩）
						let compressImg = (num) => {
							// console.log('item',item)
							uni.compressImage({
								src: tempFiles[num].path,
								quality: 50,
								success: (r) => {
									// console.log('压缩成功', r)
									newImgList.push(r.tempFilePath)
									if (num == tempFiles.length - 1) {
										upLoadImg()
									} else {
										compressImg(num + 1)
									}
								},
								fail(err) {
									// console.log('压缩失败', err)
								}
							})
						}
						compressImg(0)
					},
					fail: () => {
						uni.hideLoading()
						this.isImgup = false
						this.checkOtherPermission('camera')
					}
				})
			},
			delImg(index) {
				this.showAddressImg.splice(index, 1)
				this.imgIds.splice(index, 1)
			},
			groupChange(n) {
				// console.log('groupChange', n);
				this.getOrderPrice()
			},

			valChange(e) {
				this.toSumPrice(e.value, true)
			},
			toSumPrice(num, isAgain, isWeight) {
				console.log('原始价格', this.orderPrice)
				console.log('小区配置', this.communitConfig)
				let oldPrice = Number(this.orderPrice) // 原始价格：只包含开启雨天、无电梯的价格

				if (this.communitConfig.extraRainMoney && this.communitConfig.isRain == 1) { // 计算数量时去掉雨天、无电梯价格
					oldPrice = oldPrice - this.communitConfig.extraRainMoney
				}
				if (this.communitConfig.extraWalkupMoney && this.communitConfig.isElevator == 0) {
					oldPrice = oldPrice - this.communitConfig.extraWalkupMoney
				}

				let sumPrice = (oldPrice * num).toFixed(2)
				if (this.communitConfig.extraRainMoney && this.communitConfig.isRain == 1 && sumPrice > 0) {
					console.log('加上雨天', sumPrice)
					console.log('extraRainMoney=', this.communitConfig.extraRainMoney)
					sumPrice = Number(sumPrice) + this.communitConfig.extraRainMoney
					console.log('加上雨天1', sumPrice)
				}
				if (this.communitConfig.extraWalkupMoney && this.communitConfig.isElevator == 0 && sumPrice > 0) {
					console.log('加上电梯')
					sumPrice = Number(sumPrice) + this.communitConfig.extraWalkupMoney
				}

				// 保存原始价格，用于优惠券判断
				this.originalPrice = (this.couponMoney == 0 || isAgain) ? sumPrice : this.originalPrice
				if (sumPrice - Number(this.couponMoney) >= 0) {
					// 此处减去优惠金额
					sumPrice = (sumPrice - Number(this.couponMoney)).toFixed(2)

				} else if (isWeight) {
					uni.showModal({
						content: '该重量范围低于总优惠金额，需重新选择优惠券',
						showCancel: false,
						success: (r) => {
							this.couponList = []
							this.couponMoney = 0
							uni.removeStorageSync('couponList')
							uni.removeStorageSync('couponSumprice')

						}
					})
				} else {
					uni.showModal({
						content: '订单金额低于优惠金额，需重新选择优惠券',
						showCancel: false,
						success: (r) => {
							this.couponList = []
							this.couponMoney = 0
							uni.removeStorageSync('couponList')
							uni.removeStorageSync('couponSumprice')

						}
					})
				}
				this.num = num
				this.sumPrice = sumPrice

				this.sumPriceInteger = this.$getBit(sumPrice).integer
				this.sumPriceDecimal = this.$getBit(sumPrice).decimal

			},
			toShowPickup() {
				// console.log('----communitId', this.communitId)
				if (this.communitId != '') {
					if (this.navIndex == 0) {
						this.showPickup = true
					} else if (this.navIndex == 1) {
						uni.navigateTo({
							url: '/pages/address/picking?communitId=' + this.communitId
						})
					}
				} else {
					this.$toast('您还未添加魔盒')
				}



			},
			confirmModal() {
				uni.navigateTo({
					url: '/pages/address/picking?communitId=' + this.communitId
				})
			},
			toReceive() {
				if (this.communitId != '') {
					uni.navigateTo({
						url: '/pages/address/receive'
					})
				} else {
					this.$toast('您还未添加魔盒')
				}

			},
			selectWeight(item, index) {
				this.wtCurrent = index
			},
			previewImg(index) {
				uni.previewImage({
					urls: this.showAddressImg,
					current: index,
					success() {

					}
				})
			},
			see() {
				// console.log('----')
				uni.navigateTo({
					url: './dmProcess'
				})
			},
			addCode() {
				uni.navigateTo({
					url: '/pages/order/writeCode?pickCommunitId=' + this.pickCommunitId
				})
			},
			delCode(index, sonIndex) {
				let list = this.codeList
				let num = this.codeSum
				num -= 1
				list[index].codeList.splice(sonIndex, 1)
				this.codeSum = num
				this.codeList = list
				this.sumCodeHight(list)
				this.couponList = []
				this.couponMoney = 0
				this.toSumPrice(num)
				// console.log('del===', list)
				uni.setStorageSync('codeList', list)
				uni.setStorageSync('codeSum', num)
			},
			sumCodeHight(list) {
				let codeHeight = 0
				let addNum = this.codeSum <= 12 ? 98 : 100
				console.log('addNum', addNum)
				list.forEach(item => {
					if (item.codeList.length) codeHeight += 98
					item.codeList.forEach(son => {
						codeHeight += addNum
					})
				})
				codeHeight = codeHeight > 230 ? codeHeight : 230
				let openHeight = {
					height: codeHeight + 'rpx',
					transition: 'all 0.5s'
				}
				this.openHeight = openHeight
			},
			
		}
	}
</script>

<style lang="scss">
	@import '~@/common/scss/mixins.scss';

	page {
		width: 100%;
		background-color: #f0f0f0;
	}

	.pop_body {
		width: 750rpx;
		height: 404rpx;
		background-color: #fff;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;

		.itm {
			width: 750rpx;
			height: 112rpx;
			border-bottom: 1rpx solid #eee;
			display: flex;
			justify-content: center;

			image {
				width: 48rpx;
				height: 48rpx;
				margin-right: 8rpx;
			}

			view {
				// width: 170rpx;
				font-size: 34rpx;
				font-family: PingFang SC-Regular, PingFang SC;
				font-weight: 400;
				color: #000000;
				// text-align: center;
			}
		}

		.cancel_btn {
			width: 750rpx;
			height: 50rpx;
			text-align: center;
			line-height: 120rpx;
			font-size: 34rpx;
		}
	}

	.tips {
		width: 646rpx;
		// height: 90rpx;
		background: #FFF3E0;
		border-radius: 16rpx;
		opacity: 1;
		color: #F7A421;
		font-size: 24rpx;
		padding: 20rpx;
		margin-top: 16rpx;

		image {
			width: 30rpx;
			height: 30rpx;
			margin: 2rpx 8rpx 0 0;
		}

		view {
			font-size: 24rpx;
			color: #F7A421;
			width: 600rpx;
		}
	}

	.card {
		width: 686rpx;
		// min-height: 506rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		opacity: 1;
		margin-top: 16rpx;
		padding-bottom: 38rpx;

		.itm {
			width: 638rpx;
			min-height: 90rpx;
			justify-content: space-between;

			.radio {
				.son {
					margin-left: 40rpx;

					image {
						width: 32rpx;
						height: 32rpx;
					}

					view {
						font-size: 32rpx;
						margin-left: 6rpx;

					}
				}

				.def {
					color: #333;
				}

				.act {
					color: #2E6EEF;
				}
			}

			.img {
				flex-wrap: wrap;
				justify-content: flex-start;

				.cell {
					width: 120rpx;
					height: 120rpx;
					position: relative;
					margin: 0 22rpx 22rpx 0;
				}

				.img_item {
					width: 120rpx;
					height: 120rpx;
					border-radius: 16rpx;
					// border: 1rpx solid #666666;
				}

				.del_img {
					position: absolute;
					right: -15rpx;
					top: -15rpx;
					z-index: 999;
					width: 32rpx;
					width: 32rpx;
				}
			}
		}

		.textarea-label {
			width: 638rpx;
			text-align: left;
			font-size: 32rpx;
			font-family: PingFang SC-Regular, PingFang SC;
			font-weight: 400;
			color: #666666;
			margin-top: 31rpx;
		}

		.textarea {
			width: 596rpx;
			min-height: 138rpx;
			background: #F8F8F8;
			border-radius: 16rpx;
			opacity: 1;
			// margin-top: 24rpx;
			font-size: 28rpx;
			font-family: PingFang SC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
			padding: 24rpx 24rpx 14rpx 24rpx;
			margin-top: 26rpx;

		}

		.sub_title {
			width: 638rpx;
			font-size: 32rpx;
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: 500;
			color: #666666;
			margin: 22rpx 0;

			text {
				color: #999999;
			}
		}


		.addCode {
			width: 640rpx;
			height: 88rpx;
			background-color: whitesmoke;
			border-radius: 12rpx;
			margin-top: 40rpx;
			justify-content: center;

			image {
				width: 22rpx;
				height: 22rpx;
				margin-right: 16rpx;
			}

			view {
				color: #333;
				font-size: 32rpx;
			}
		}

		.open-icon {
			position: relative;
			width: 638rpx;
			margin-top: 20rpx;
			justify-content: center;
		}

		.btm {
			// position: absolute;
			left: 0;
			bottom: 0rpx;
			width: 210rpx;
			height: 48rpx;
			// background-color: gray;
			background: #F8F8F8;
			border-radius: 24rpx;
			justify-content: center;

			view {
				font-size: 24rpx;
				font-family: PingFang SC-常规体, PingFang SC;
				font-weight: normal;
				color: #999999;
			}

			.btm_open {
				width: 32rpx;
				height: 32rpx;
			}
		}



		.default {
			height: 300rpx;
		}

		.code_list {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 638rpx;
			// margin-top: 20rpx;
			// background-color: whitesmoke;
			// padding: 16rpx;
			// border-radius: 12rpx;
			overflow: hidden;
			border-top: 1rpx solid #F0F0F0;

			.top-view {
				width: 638rpx;
			}

			.add {
				// width: 100%;
				// justify-content: flex-end;

				image {
					width: 39rpx;
					height: 39rpx;
				}

			}

			.item {
				width: 600rpx;
				margin-bottom: 12rpx;

				.top {
					width: 600rpx;
					height: 78rpx;

					image {
						width: 48rpx;
						height: 48rpx;
						margin-right: 16rpx;
					}

					view {
						font-size: 32rpx;
						color: #333;
						font-weight: normal;
					}
				}

				.code_v {
					width: 638rpx;
					margin-top: 20rpx;
					justify-content: space-between;

					.lef {
						width: 534rpx;
						height: 80rpx;
						font-size: 26rpx;
						color: #666666;
						background: #F8F8F8;
						border-radius: 8rpx;
						padding-left: 16rpx;

						text {
							color: #333;
							font-weight: 600;
							margin-left: 20rpx;
						}
					}

					.rig {
						width: 80rpx;
						height: 80rpx;
						justify-content: center;
						background: #F8F8F8;
						border-radius: 8rpx;

						image {
							width: 38rpx;
							height: 38rpx;
						}

					}
				}
			}
		}
	}

	.card1 {
		width: 686rpx;
		height: 224rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		opacity: 1;
		margin-top: 15rpx;
		border-bottom: 1rpx solid #fff;

		.itm {
			width: 662rpx;
			height: 112rpx;
			justify-content: space-between;
			border-bottom: 1rpx solid #F0F0F0;
			font-weight: 500;

			.lef {
				font-size: 32rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
				margin: 0 20rpx;

				text {
					display: inline-block;
					width: 40rpx;
					height: 40rpx;
					text-align: center;
					line-height: 40rpx;
					font-size: 22rpx;
					margin-right: 12rpx;
					border-radius: 50%;
					color: #fff;
				}

				.t1 {
					background: #F44850;

				}

				.t2 {
					background: #2E6EEF;
				}
			}

			.rig {
				font-size: 32rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;

				image {
					width: 40rpx;
					height: 40rpx;
					margin-left: 8rpx;
				}
			}
		}

	}

	.card2 {
		width: 686rpx;
		// height: 224rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		opacity: 1;
		margin-top: 15rpx;
		border-bottom: 1rpx solid #fff;

		.itm {
			width: 638rpx;
			min-height: 112rpx;
			justify-content: space-between;
			border-bottom: 1rpx solid #F0F0F0;
			font-weight: 500;

			.lef {
				font-size: 32rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
				margin: 0 20rpx 0 0;

				text {
					margin-right: 12rpx;
				}

				.t1 {
					display: inline-block;
					width: 40rpx;
					height: 40rpx;
					background: #F44850;
					border-radius: 50%;
					text-align: center;
					line-height: 40rpx;
					font-size: 22rpx;
					color: #fff;
				}

				.t2 {
					display: inline-block;
					width: 40rpx;
					height: 40rpx;
					background: #2E6EEF;
					border-radius: 50%;
					text-align: center;
					line-height: 40rpx;
					font-size: 22rpx;
					color: #fff;
				}
			}

			.rig {
				font-size: 32rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
				font-size: 32rpx;

				textarea {
					width: 420rpx;
					padding: 0;
					border: none;
					font-size: 28rpx;
					color: #F44850;
					text-align: right;
					// margin-left: 40rpx;

				}

				.ad_text {
					view {
						font-size: 30rpx;
						text-align: right;
						width: 360rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box; // 作为弹性伸缩盒子模型显示。
						-webkit-box-orient: vertical; // 设置伸缩盒子的子元素排列方式--从上到下垂直排列
						-webkit-line-clamp: 1; // 显示的行
					}

					.address {
						font-size: 26rpx;
						color: #999;
					}


				}

				image {
					width: 32rpx;
					height: 32rpx;
					margin-left: 8rpx;
				}
			}
		}


		.itm_ls {
			border-bottom: 1rpx solid #fff;
		}
	}

	.bottom_v {
		width: 750rpx;
		height: 142rpx;
		background: #FFFFFF;
		box-shadow: 0px -3rpx 6rpx 1rpx rgba(0, 0, 0, 0.1);
		border-radius: 0px 0px 0px 0px;
		opacity: 1;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 90;
		justify-content: space-between;

		.lef {
			font-size: 32rpx;
			font-family: PingFang SC-Bold, PingFang SC;
			font-weight: bold;
			color: #333333;
			margin-left: 32rpx;
			margin-top: -60rpx;

			// align-items: flex-end;
			.number {
				// align-items: flex-end;
				margin-bottom: 20rpx;

				.t1 {
					font-size: 32rpx;
					color: #F44850;
					font-weight: 500;

				}

				.t2 {
					margin-bottom: 50rpx;
					font-size: 46rpx;
					color: #F44850;
					font-weight: 500;

				}
			}

		}

		.btn {
			width: 220rpx;
			height: 80rpx;
			background: linear-gradient(90deg, #FF4E8C 0%, #F73740 100%);
			border-radius: 46rpx;
			opacity: 1;
			text-align: center;
			line-height: 80rpx;
			color: #fff;
			font-size: 32rpx;
			margin-right: 32rpx;
			margin-top: 16rpx;
		}

	}

	.card3 {
		width: 686rpx;
		min-height: 112rpx;
		border-radius: 16rpx;
		opacity: 1;
		margin-top: 17rpx;
		background-color: #fff;

		image {
			width: 40rpx;
			height: 40rpx;
			margin-right: 12rpx;
		}

		.itm {
			width: 662rpx;
			min-height: 112rpx;
			justify-content: space-between;
			border-bottom: 1rpx solid #F0F0F0;
			font-weight: 500;

			.lef {
				font-size: 32rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #666666;
				margin: 0 20rpx;

			}

			.rig {
				font-size: 32rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;

				textarea {
					width: 390rpx;

					border: none;
					font-size: 28rpx;
					color: #F44850;
					text-align: right;

				}

				image {
					width: 40rpx;
					height: 40rpx;
					margin-left: 8rpx;
				}
			}
		}

	}

	.bottom_v .price {
		font-size: 34rpx;
		font-family: PingFang-SC-Bold, PingFang-SC;
		// font-weight: bold;
		color: #FF5D18;
		width: 100%;
		justify-content: space-between;
		margin-left: 32rpx;

		.t4 {
			font-size: 28rpx;
			color: #333;
			font-weight: bold;

		}
	}

	.bottom_v .price .t1 {
		font-size: 44rpx;
		font-weight: bold;
	}

	.bottom_v .price .t2 {
		font-size: 30rpx;
		font-family: PingFang-SC-Regular, PingFang-SC;
		font-weight: bold;
		color: #FF5D18;
		// margin-left: 8rpx;
	}

	.bottom_v .price .t3 {
		font-size: 30rpx;
		font-family: PingFang-SC-Regular, PingFang-SC;
		font-weight: bold;
		color: #FF5D18;
	}

	.weight_body {
		width: 640rpx;
		min-height: 600rpx;
		background: #FFFFFF;
		border-radius: 16rpx;

		.title {
			font-size: 34rpx;
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: 500;
			color: #000000;
			width: 100%;
			text-align: center;
			margin-top: 54rpx;
		}

		.select_v {
			margin-top: 78rpx;
			width: 570rpx;
			flex-wrap: wrap;
			margin-left: 16rpx;

			.item {
				width: 168rpx;
				height: 88rpx;
				background: #F2F2F2;
				border-radius: 9rpx;
				border: 2rpx solid #f2f2f2;
				margin: 0 16rpx 16rpx 0;
				text-align: center;
				line-height: 88rpx;
				font-size: 28rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
			}

			.act {
				color: #F44850;
				background: #FFE5E6;
				border: 2rpx solid #F44850;
			}
		}

		.bottom {
			width: 100%;
			margin-top: 119rpx;
			border-top: 1rpx solid #eee;

			.btn {
				width: 317rpx;
				height: 103rpx;
				text-align: center;
				line-height: 103rpx;
			}

			.line {
				width: 1rpx;
				height: 104rpx;
				border-left: 1rpx solid #eee;
			}

			.lef {
				color: #333333;
			}

			.rig {
				color: #F44850;
			}
		}
	}

	.placeholder {
		width: 350rpx;
		text-align: right;
	}

	.text_rig {
		text-align: right;
	}

	.minus {
		width: 48rpx;
		height: 48rpx;
		background: #F2F2F2;
		border-radius: 8rpx;
		@include flex;
		justify-content: center;
		align-items: center;
		color: #CCCCCC;
	}

	.input {
		padding: 0 10rpx;
	}

	.plus {
		width: 58rpx;
		height: 58rpx;
		background-color: #FF0000;
		border-radius: 8rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
	}

	.discount {
		font-size: 26rpx;
		font-family: PingFang SC-Medium, PingFang SC;
		font-weight: 500;
		color: #999999;
		margin-left: 32rpx;
	}

	.num_count {
		height: 80%;
		justify-content: center;
	}

	.price_info {
		align-items: center;

		.t1 {
			display: inline-block;
			font-size: 36rpx;
			color: #FF5D18;
			// font-weight: bold;

		}

		.t2 {
			font-size: 28rpx;
			font-family: PingFang-SC-Regular, PingFang-SC;
			// font-weight: bold;
			color: #FF5D18;
			// margin-left: 8rpx;
			margin-top: 6rpx;
		}

		.t3 {
			font-size: 28rpx;
			font-family: PingFang-SC-Regular, PingFang-SC;
			// font-weight: bold;
			color: #FF5D18;
			margin-top: 6rpx;
		}
	}

	.picker {
		position: fixed;
		z-index: 999;

	}

	.card3 {
		width: 686rpx;
		// height: 111rpx;
		background: #FFFFFF;
		border-radius: 16rpx;

		.itm {
			width: 686rpx;
			// height: 111rpx;
			justify-content: space-between;

			.lef {
				font-size: 32rpx;
				font-family: PingFang SC-中黑体, PingFang SC;
				font-weight: normal;
				color: #333333;
				margin-left: 24rpx;
			}

			.rig {
				margin-right: 24rpx;

				.son {
					image {
						width: 32rpx;
						height: 32rpx;
					}

					view {
						font-size: 32rpx;
						font-family: PingFang SC-常规体, PingFang SC;
						font-weight: normal;
					}
				}
			}
		}
	}

	.nav-tabs {
		margin: 26rpx 0;

		.item {
			margin-right: 46rpx;

			image {
				@include setBox(62rpx, 62rpx);
			}

			.title {
				font-size: 22rpx;
				margin-top: 16rpx;
				padding: 2rpx 5rpx;
			}
		}

		.icon {
			width: 88rpx;
			height: 88rpx;
			border-radius: 35rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.act-img {
			width: 88rpx;
			height: 88rpx;
			background-image: url('/static/icon/order/icon6.png');
			background-size: 100% 100%;
		}

		.act {
			color: #fff;
			padding: 2rpx 5rpx;
			border-radius: 8rpx;
			background: #F44850;
		}

		.default-img {
			// border: 3rpx solid #F4F4F4;
		}

		.default {
			color: #333;
			padding: 5rpx 8rpx;
		}
	}

	.tabs-info {
		// border-radius: 20rpx;
		// background-color: #fff;
		padding: 26rpx 0;

		.info-title {
			margin-left: 26rpx;

			.title {
				@include setFont(32rpx, #333);
			}

			input {
				width: 200rpx;
				margin-left: 55rpx;
				@include setFont(32rpx, #333);
			}
		}

		.info-content {
			width: 600rpx;
			margin-left: 26rpx;
			@include setFont(26rpx, #666);
			margin-top: 26rpx;
		}

		.expand {}

		.no-expand {
			@include textOverHidden(1)
		}

		.info-icon {
			@include setBox(28rpx, 28rpx);
			margin: 26rpx 0 0 6rpx;
		}

		.deg180 {
			transform-origin: center center;
			transform: rotate(180deg);
		}
	}

	.pickup-view {
		width: 750rpx;
		background-color: #fff;
		min-height: 450rpx;
		max-height: 928rpx;
		padding-bottom: 120rpx;
		position: relative;
		border-top-left-radius: 50rpx;
		border-top-right-radius: 50rpx;

		.pick-title {
			width: 750rpx;
			height: 110rpx;
			background: #F7F7F9;
			justify-content: space-between;
			border-top-left-radius: 50rpx;
			border-top-right-radius: 50rpx;

			view {
				font-size: 34rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 550;
				color: #333333;
				margin-left: 30rpx;
			}

			image {
				width: 48rpx;
				height: 48rpx;
				margin-right: 30rpx;
			}
		}

		.pick-cell {
			width: 670rpx;
			height: 98rpx;
			justify-content: space-between;

			view {
				font-size: 28rpx;
				font-family: PingFang SC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
			}

			image {
				width: 36rpx;
				height: 36rpx;
			}
		}

		.pickup-input {
			width: 620rpx;
			height: 120rpx;
			background: #FCFCFC;
			border-radius: 10rpx;
			border: 1rpx solid #D2D2D2;
			padding: 20rpx;
			font-size: 26rpx;
			font-family: PingFang SC-Regular, PingFang SC;
			font-weight: 400;
			color: #333;
			margin-bottom: 44rpx;
		}

		.btn {
			width: 690rpx;
			height: 98rpx;
			background: linear-gradient(to left, #FF4E8C, #F73740);
			border-radius: 50rpx;
			line-height: 98rpx;
			text-align: center;
			font-size: 34rpx;
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			position: absolute;
			bottom: 20rpx;
			left: 30rpx;
		}

		.disable {
			opacity: 0.5;
		}

		.default {
			opacity: 1;
		}
	}
</style>