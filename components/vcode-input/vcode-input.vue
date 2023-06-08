<template>
	<view class="vcode-input-body">
		<text class="vcode-input-item" :class="isBorderLine?'vcode-input-line':'vcode-input-border'"
			v-for="(v,index) in sum" :key="index" @tap.stop="setFocus" :style="{
			borderColor:text.length===index&&focus?borderActiveColor:(text.length>index?borderValueColor:borderColor),
			color:text.length>index?borderValueColor:borderColor
		}">{{text[index]}}</text>
		<view class="hidden-input">
			<input id="vcodeInput" ref="vcodeInput" type="number" style="color:rgba(0, 0, 0, 0);"
				:show-confirm-bar="false" auto-blur :focus="focus" :selection-start="cursorNum" :selection-end="cursorNum" :maxlength="sum" v-model="value" @blur="setBlur"
				@focus="setFocus" :password="isPassword" @input="inputChange" placeholder="" />
		</view>
	</view>
</template>

<script>
	export default {
		name: 'VcodeInput',
		props: {
			autofocus: {
				type: Boolean,
				default: true
			},
			sum: {
				type: Number,
				default: 6
			},
			isBorderLine: {
				type: Boolean,
				default: false
			},
			borderColor: {
				type: String,
				default: '#DADADA'
			},
			borderValueColor: {
				type: String,
				default: '#424456'
			},
			borderActiveColor: {
				type: String,
				default: '#F44850'
			},
			isAutoComplete: {
				type: Boolean,
				default: true
			},
			isPassword: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				focus: false,
				text: [],
				value: ''
			};
		},
		onShow() {
			
		},
		created() {
			// console.log('created-value=',this.value)
			// console.log('created-text=',this.text)
		},
		mounted(){
			// console.log('mounted-value=',this.value)
			// console.log('mounted-text=',this.text)
		},
		computed:{
			cursorNum(){
				
				this.$nextTick(() => {
					let cursorNum = this.text.length-1
					console.log('cursorNum',cursorNum)
					return cursorNum
				})
				
			}
		},
		watch: {
			value(value, oldVal) {
				console.log('value',value)
				console.log('oldVal',oldVal)
				if (this.isAutoComplete) {
					if (value.length >= this.sum) {
						// this.focus=false;
						this.$emit('vcodeInput', value);
					}
				} else {
					this.$emit('vcodeInput', value);
				}
				if (this.isPassword) {
					let val = '';
					for (let i = 0; i < value.length; i++) {
						val += '●';
					}
					this.text = val;
				} else {
					this.text = value.split("");
				}
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.initInput()
			})
		},
		methods: {
			inputChange(e){
				console.log('inputChange',e.target.value)
			},
			pageShow(){
				console.log('show-value=',this.value)
				console.log('show-text=',this.text)
				this.focus = true
			},
			initInput() {
				console.log('input')
				if (this.autofocus){
					this.focus = true;
				}
			},
			setBlur() {
				uni.hideKeyboard();
				this.$nextTick(() => {
					this.focus = false;
				})
			},
			setFocus() {
				this.focus = true;
			},
			clearValue() {
				this.setBlur();
				this.value = '';
				this.text = [];
				this.$forceUpdate();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.vcode-input-body {
		margin-left: -36rpx;
		margin-right: -36rpx;
		position: relative;
		overflow: hidden;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.vcode-input-item {
		width: 121rpx;
		height: 168rpx;
		margin-right: 20rpx;
		line-height: 168rpx;
		text-align: center;
		font-weight: bold;
		font-size: 68rpx;
	}

	.vcode-input-border {
		border: 2rpx solid #F0F0F0;
		// border-style: solid;
		// border-width: 2rpx;
		// border-color: #F0F0F0;
		border-radius: 8rpx;
	}

	.vcode-input-line {
		border-bottom-style: solid;
		border-bottom-width: 2rpx;
		border-color: $uni-border-color;
	}

	.hidden-input {
		width: 1px;
		height: 1px;
		position: absolute;
		left: -1px;
		top: -1px;
		color: blue;
		overflow: hidden;
		// width: 588rpx;
		// height: 168rpx;
		// border: 1rpx solid blue;
		// background-color: whitesmoke;
	}
	input {
		color: white;
		caret-color: white;
	}
</style>
