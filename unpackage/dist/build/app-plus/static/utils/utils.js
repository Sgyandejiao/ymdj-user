function igexinTool() {
	console.log('---')
    var isAndorid, PushManager, context, Instance, GeTuiSdk;

    if (plus.os.name == 'Android') {
        isAndorid = true;
    } else {
        isAndorid = false;
    }

    if (isAndorid) {
        PushManager = plus.android.importClass("com.igexin.sdk.PushManager");
        context = plus.android.runtimeMainActivity().getContext();
        Instance = PushManager.getInstance();
    } else {
        GeTuiSdk = plus.ios.importClass("GeTuiSdk");
    }

    this.bindAlias = function(alias) {
		console.log('alias==',alias)
        if (isAndorid) {
			
            Instance.bindAlias(context, alias);
        } else {
            GeTuiSdk.bindAliasandSequenceNum(alias, alias);
        }
    }

    this.unbindAlias = function(alias) {
        if (isAndorid) {
            Instance.unBindAlias(context, alias, true);
        } else {
            GeTuiSdk.unbindAliasandSequenceNumandIsSelf(alias, alias, true);
        }
    }

    this.getVersion = function() {
        if (isAndorid) {
            return Instance.getVersion(context);
        } else {
            return GeTuiSdk.version;
        }
    }

    //开启推送  
    this.turnOnPush = function() {
        if (isAndorid) {
            Instance.turnOnPush(context);
        } else {
            GeTuiSdk.setPushModeForOff(false);
        }
    }

    //关闭推送  
    this.turnOffPush = function() {
        if (isAndorid) {
            Instance.turnOffPush(context);
        } else {
            GeTuiSdk.setPushModeForOff(true);
        }
    }

}

// 获取金额整数位小数位
function getBit(value, bit = 2){
	console.log('开始计算整数小数')
	value = (Number(value).toFixed(2)).toString();
	let integer = value.split('.')[0]
	let decimal = value.split('.')[1]
	return { integer, decimal };
}
