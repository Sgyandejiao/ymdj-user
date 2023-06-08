let silentLogin = (phone)=>{
	this.$util.request(this.$apis.getPublicKey).then(res => {
		console.log('init',res)
		// if(!res.status){
		// 	this.$toast(res.statusMessage)
		// 	return;
		// }
		// const keyCode = res.resultValue
		// const key = this.getDateInfo()
		// console.log('dateStr=',key)
		// const a = encrypt.decryptByDES(keyCode, key)
		// this.publicKeyObj = JSON.parse(a)
		// this.encryptKeyDo()
	})
}

export default{
	silentLogin
}