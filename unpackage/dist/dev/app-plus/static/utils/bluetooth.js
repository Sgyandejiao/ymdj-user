let pageData = {
	bleStatus: "蓝牙未打开",
	bleAdapterStatus: "未初始化",
	bleChipInfo: {},
	bleChips: [],
	devNeedBand: true,
	bleConnSuccess: false,
	devBanded: false,
	bleNotifyData: "未读取数据",
	devQRCode: "",
	boardQRCode: "",
	bandMsg: "",
	devVolNum: "",
	macAddr: "",
	toothName: '',
	instruct: 0, // 0 取快递 ; 1 存快递 ; 2 读电量
}
let intval = null
// 初始化蓝牙 --- 传入要搜寻的蓝牙名称/mac地址
function initBluetooth(toothName, instruct) {
	pageData.toothName = toothName
	pageData.instruct = instruct
	console.log('要匹配id=', pageData.toothName)
	console.log('instruct=', pageData.instruct)
	if (pageData.instruct == 2) {
		plus.nativeUI.showWaiting()
	}
	uni.openBluetoothAdapter({
		success: (r) => {
			bleDisCovery()
			if (pageData.instruct != 2) { // 开箱操作计时
				setTimeout(() => {
					// 当设备一直未响应，关闭等待
					console.log('设备状态=', pageData.bleConnSuccess)
					if (!pageData.bleConnSuccess && plus.os.name == 'Android') {
						plus.nativeUI.closeWaiting()
						uni.hideLoading()
						plus.nativeUI.toast('开启失败，请重试或检查是否开启附近设备权限')
					}
					clearInterval(intval)
					intval = null
				}, 20000)
			} else { // 读电量计时
				setTimeout(() => {
					plus.nativeUI.closeWaiting()
					uni.hideLoading()
				}, 6000)
			}

		},
		fail(err) {
			console.log('初始化失败', err)
			plus.nativeUI.closeWaiting()
		}
	})
}

// 开始搜寻附近蓝牙
function bleDisCovery() {
	uni.startBluetoothDevicesDiscovery({
		allowDuplicatesKey: false,
		interval: 1000,
		success: (r) => {
			bleFound()
		},
		fail: () => {
			// if(pageData.instruct==2){
			// 	plus.nativeUI.closeWaiting()
			// }
		}
	})
}

// 开始监听搜寻到寻设备事件
function bleFound() {

	uni.onBluetoothDeviceFound(res => {
		let devices = res.devices
		let devicesLength = devices.length

		if (devicesLength > 0) {
			for (let index in devices) {
				let deviceI = devices[index]
				if (deviceI?.localName) {
					console.log('找到一个设备', deviceI)
				}

				if (deviceI?.localName && deviceI['localName'].indexOf(pageData.toothName) == 0) {
					console.log('已匹配当前设备--------', deviceI)
					pageData.deviceId = deviceI.deviceId
					pageData.bleChipInfo = deviceI
					pageData.macAddr = deviceI['deviceId']
					onConnBleT()
				}
			}
		}
	})
}


function onConnBleT() {
	uni.stopBluetoothDevicesDiscovery({
		success: () => {}
	})
	let device = pageData.bleChipInfo
	// 连接设备

	if (pageData.instruct != 2) {
		plus.nativeUI.closeWaiting()
		setTimeout(() => {
			plus.nativeUI.showWaiting('蓝牙连接中，请稍候..');
		}, 200)
	}
	let deviceId = device.deviceId
	console.log('连接设备id-deviceId：', deviceId)
	uni.createBLEConnection({
		deviceId: deviceId,
		success: (r) => {
			bleServices(deviceId)
		},
		fail(err) {
			console.log('连接失败', err)
			plus.nativeUI.toast('蓝牙连接失败，请稍候重试或检查设备')
			plus.nativeUI.closeWaiting()

		}
	})

}

//获取蓝牙服务列表
function bleServices(deviceId) {
	plus.nativeUI.closeWaiting()
	setTimeout(() => {
		plus.nativeUI.showWaiting('获取蓝牙服务中，请稍候..');
	}, 100)
	let services = []
	intval = setInterval(() => {
		uni.getBLEDeviceServices({
			deviceId: deviceId,
			success: (r) => {
				services = r.services
				let sss = "";
				console.log('services列表', services)
				if (services.length != 0) {
					clearInterval(intval)
					intval = null
					plus.nativeUI.closeWaiting()
					setTimeout(() => {
						plus.nativeUI.showWaiting('正在开箱...');
						for (let index in services) {
							let service = services[index]
							sss = sss + service.uuid + ";"
							getCharacter(null, service.uuid);
						}
					}, 100)
				}
			},
			fail(err) {
				console.log('获取服务列表失败', err)

			}
		})
	}, 500)
	setTimeout(()=>{
		if(!services.length){
			clearInterval(intval)
			intval = null
			plus.nativeUI.closeWaiting()
		}
	},6000)
}

// 根据服务id获取特征值列表
function getCharacter(event, servid) {
	let device = pageData.bleChipInfo
	let deviceId = device.deviceId
	uni.getBLEDeviceCharacteristics({
		deviceId: deviceId,
		serviceId: servid,
		success: (r) => {
			var cc = r.characteristics;
			console.log('特征值列表', cc)
			let charList = []
			let Obj = {}
			cc.forEach((item, index) => {
				if (item.uuid.indexOf('FF02') > -1) {
					Obj = item
					cc.splice(index, 1)
				}
			})
			cc.push(Obj)

			for (var i = 0; i < cc.length; i++) {
				getvuel(servid, cc[i].uuid, i, cc.length);
			}
		},
		fail(err) {
			console.log('getBLEDeviceCharacteristics---', err)

		}
	})
}

// 根据特征值写入不同指令
function getvuel(servid, charid, i, len) {
	let device = pageData.bleChipInfo
	let deviceId = device.deviceId

	// 处理指令编码
	let strArray = []
	if (charid && charid.indexOf('FF02') > -1) { //	取快递
		// 间隔时间，去读电量
		setTimeout(() => {
			readVolNum(servid, charid, i, len)
		}, 1500)

		strArray = [0x4C, 0x4B, 0x4B, 0x31]
		console.log('取快递')
	} else if (charid && charid.indexOf('FF01') > -1) {
		if(plus.os.name=='iOS'){
			openNotify(deviceId, servid, charid)
		}else{
			setTimeout(() => {
				openNotify(deviceId, servid, charid)
			}, 1000)
		}
		
	}

	// 当读电量时不操作开箱   （读电量会关闭蓝牙，影响二次开箱）
	if (pageData.instruct != 2 && charid && charid.indexOf('FF02') > -1) {
		const arrayBuFF = new Uint8Array(strArray.length)
		strArray.forEach((item, index) => arrayBuFF[index] = item)
		setTimeout(() => {
			console.log('执行开箱指令')
			uni.writeBLECharacteristicValue({
				deviceId: deviceId,
				serviceId: servid,
				characteristicId: charid,
				value: arrayBuFF.buffer,
				success: (r) => {
					console.log('指令回调', r)
					setTimeout(() => {
						plus.nativeUI.closeWaiting()
						plus.nativeUI.toast('操作成功')
					}, 200)
					pageData.bleConnSuccess = true
					uni.$emit("globleEvent", "boxOpen")
				},
				fail: (err) => {
					// if(charid.indexOf('FF01')!-1 || charid.indexOf('FF02')!-1){
					// 	console.log('writeValue-fail:', err)
					// }
					uni.hideLoading()
				},
				complete: () => {
					if (i == len - 1) {
						plus.nativeUI.closeWaiting()
					}
				}
			})
		}, 0)
	}


}

function readVolNum(servid, charid, i, len) {
	let device = pageData.bleChipInfo
	let deviceId = device.deviceId

	// 处理指令编码
	let strArray = []
	strArray = [0x4c, 0x4b, 0x4b, 0x33]
	const arrayBuFF = new Uint8Array(strArray.length)
	strArray.forEach((item, index) => arrayBuFF[index] = item)
	console.log('开始读取电量', servid, '---', charid)
	uni.writeBLECharacteristicValue({
		deviceId: deviceId,
		serviceId: servid,
		characteristicId: charid,
		value: arrayBuFF.buffer,
		success: (r) => {
			console.log('读电量回调', r)
		},
		fail: (err) => {
			console.log('writeValue1-fail:', err)
			uni.hideLoading()
		},
		complete: () => {
			// if (i == len - 1) {
			// 	setTimeout(()=>{
			// 		plus.nativeUI.closeWaiting()
			// 	},2000)
			// }
		}
	})
}

function openNotify(deviceId, serviceId, characteristicId) {
	console.log('deviceId=', deviceId, ';', 'serviceId=', serviceId, ';', 'characteristicId=', characteristicId)

	uni.notifyBLECharacteristicValueChange({
		deviceId: deviceId,
		serviceId: serviceId,
		characteristicId: characteristicId,
		state: true,
		success: function(res) {
			plus.nativeUI.closeWaiting()
			onNotifyChange(deviceId, serviceId, characteristicId)

		},
		fail: function(err) {
			console.log('开启特征值监听失败', err)

		}
	});
}

function onNotifyChange(deviceId, serviceId, characteristicId) {
	// ArrayBuffer转16进制字符串示例
	function ab2hex(buffer) {
		const hexArr = Array.prototype.map.call(
			new Uint8Array(buffer),
			function(bit) {
				return ('00' + bit.toString(16)).slice(-2)
			}
		)
		return hexArr.join('')
	}

	function hexToString(hex) {
		var tmp = '';
		if (hex.length % 2 == 0) {
			for (var i = 0; i < hex.length; i += 2) {
				tmp += '%' + hex.charAt(i) + hex.charAt(i + 1);
			}
		}
		return decodeURIComponent(tmp);
	}


	uni.onBLECharacteristicValueChange(function(res) {
		// ios系统并且为开箱操作下
		if (plus.os.name == 'iOS' && pageData.instruct != 2) {
			console.log('已开箱')
			plus.nativeUI.closeWaiting()
			uni.$emit("globleEvent", "boxOpen")
		}

		// 读电量操作时
		// if (pageData.instruct==2) { 

		// }
		console.log(`characteristic返回值 ${res.characteristicId} has changed, now is ${res.value}`)
		let value = ab2hex(res.value)
		console.log('16进制-value=', value)
		value = hexToString(value)

		if (parseFloat(value).toString() == "NaN") {
			console.log('非数值')
		} else {
			console.log('电压值', value)
			let obj = {
				volNum: value,
				phone: uni.getStorageSync('phone') || ''
			}
			uni.setStorageSync('voltage', obj)
		}




	});
}
module.exports = {
	initBluetooth,
};