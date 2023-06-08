// import JsEncrypt from "jsencrypt"
import JsEncrypt from 'encryptlong'

// const {JSEncrypt} = require('encryptLong')

//  生成的公钥
const pubKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMf2R4meg9zmfiTTs0qf5+CFz0lRZjkYbP/aFGkaR5QZwY3MZqkL/8EG4/CWjXYG41IXfJAq/IY/QxV6y36lwOI7EGf8d/WhHsTW/uSo7Dq2/8HgOBdSLzepERd2ebZkCvSbag2eJ0F7Xz2zSLxq7W0NivneNPpNxgXgxjBFpDtQIDAQAB`

//  生成的私钥
const privKey = `MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAMx/ZHiZ6D3OZ+JNOzSp/n4IXPSVFmORhs/9oUaRpHlBnBjcxmqQv/wQbj8JaNdgbjUhd8kCr8hj9DFXrLfqXA4jsQZ/x39aEexNb+5KjsOrb/weA4F1IvN6kRF3Z5tmQK9JtqDZ4nQXtfPbNIvGrtbQ2K+d40+k3GBeDGMEWkO1AgMBAAECgYBGp2EcNfjCmfTUgGCLUoyGGPec3YHNxvLwG65EBn/wERYQlP7MxNRAD6E3kFWzzDJnkvei8JWxQ6+T+LnJFWTWM5nsCUbzszdFbfMmBH3hMw30EBYL+m4BW71kiACSjyseLWzW/+V/4ap6iMyS4t5VL8NF3d/pI7WH/DNQC5LCZQJBAOwLfTvnT3Wzx8VPPo1YZrFSRcPMsVJQkvh1WkzNwDV59N2OrzBSvCTIq0rJaHeX3cEsoCKoTEYhaWIq6eFBqHcCQQDdySdo/kLWwXggD7pcBDmUM+eOKeDaIt3CFHoE/w97vPqFW1MZinmg+jze5EXsNKZ7T4OulaQqy23+OqEAyOwzAkEAvG0/f35a8/6bzmo/6N1UvOCMSI0yUB9581TazMzCTu4YBnVMbCrffg2ij4TQHAfjQb2553Cp0qIBWhgfs22SaQJASOk9PIYCISm/PQMOp/t3lmIt6I2Z7vxxXMFwj73uMCajUT4Bpq7gZ2x8oGX5GrsAVB+C0d09+BeilGZf0as8AwJAddCrLHJqfhIbNqg57PIt1gW0Cop6fOn/PDCugD98nyN2C3UrXbpvCxb9xOcG0KXT/MarnJp+dbyfUKxO4jM1tA==`

// 利用服务器生成的公钥加密 公钥
export function createCode(code) {
  // 实例化JSEncrypt
  const jse = new JsEncrypt()
  // console.log("查看rsa")
  // console.log(jse)
  // console.log(jse.encrypt)

  jse.setPublicKey(code)
  // console.log(pubKey)
  // let  data = jse.encrypt(pubKey.toString());  // 进行加密
  const data = jse.encryptLong(pubKey) // 进行加密
  return data
}

export function analysisCode(code) {
  const jse = new JsEncrypt()
  jse.setPublicKey(privKey)

  const data = jse.decryptLong(code) // 解密

  return data
}

// 解密
// params 待解密字符串
export function sendEncryCode(params) {
  // 实例化JSEncrypt
  const jse = new JsEncrypt()
  // 使用前端私钥解密（私钥由服务端生成）
  const privKey = `-----BEGIN PRIVATE KEY-----
    MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAKYGNM2g1siOtlWg
    S3k4E0zrNn/INnvCC/ncDp6RO4Cyp8neNeYsLs+qqsnGCqoN/aXvYKdELxnEgCSJ
    QGYgr8UgOuWoIE+XWHRibyo8uZS6/mXfGaGVvr5r+/bbjjg9b9TpSvSXUG9sKiuu
    xZXeV4UV8tnmhPiar2NfORAu/wXrAgMBAAECf0qUfyPgHJv7f+z3FPBfQExNXS4J
    wm/Vu4uCTw7sLs6hcr48E/pR3rVq9U2uqRu7LTZdUg3Rk1b/7pB7F3LJPCuX5n/t
    nqcEWfWoyAc6wnVLffxkvx7toD7nMl7+2/LsUgSiY/QFdG43dKs+5rXuEOOwcZV/
    tLdivN9SEN44mEECQQDXls/rpMPYnd0IHHqh6YZEA3dH1CZAWeW/4XF/BINW/02m
    jtoNr+sTcZN9ekaLFTQnF/jJRi35dNwGhroG+k/hAkEAxST9oYDugGPTbu81JU1p
    nO8tLQPHvpVu3lGQEFahWZi6j70FlhNEhX74lDLrhvTOI4ohzHX28pU5TbQkiyl/
    SwJBALxQseHmFGR80HurVLtlnrB+TozhlWAUpolLRbZrnMY7T/qzQWk/Rxm+1dR/
    IGuQ4/NaDyjRMot6Nk9FE+3QbEECQQCXib+MDVdHSXSUqTro2YB9KTxIhcdcL/Fw
    4rEiXfTYshV1t447tcPN+bOJ9zokGrj5iIxCZcrU3O+XUwlkDxnRAkArwYiJZFlS
    Lu9zj+e03+kGWu6c/x8RRoLqfZcWFffBZlkxOHa06aN6jYCdJtRON43JUbynMvDY
    l5glkcwnZlbi
    -----END PRIVATE KEY-----`

  jse.setPrivateKey(privKey)
  const data = jse.decrypt(params) // 解密

  return data
}
// 加密
// str 未加密字符串
export function getEncryCode(str) {
  // 实例化JSEncrypt
  const jse = new JSEncrypt()
  // 加密公钥（由服务端生成）
  const pubKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmBjTNoNbIjrZVoEt5OBNM6zZ/
yDZ7wgv53A6ekTuAsqfJ3jXmLC7PqqrJxgqqDf2l72CnRC8ZxIAkiUBmIK/FIDrl
qCBPl1h0Ym8qPLmUuv5l3xmhlb6+a/v22444PW/U6Ur0l1BvbCorrsWV3leFFfLZ
5oT4mq9jXzkQLv8F6wIDAQAB
-----END PUBLIC KEY-----`

  jse.setPublicKey(pubKey)
  console.log(str)
  const data = jse.encryptLong(str.toString()) // 进行加密
  return data
}
