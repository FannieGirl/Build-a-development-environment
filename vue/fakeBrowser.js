(function(){
    function mergeObj(o1,o2){
       for(var key in o2){
           o1[key]=o2[key]
       }
       return o1;
   }

   function getKeysOfObj(obj) {
       var keys = []
       for(var key in obj) {
           keys.push(key)
       }
       return keys
   }

   // window.jsObject ||   兼容安卓的测试
    window.jsObject = window.jsObject || {

        /********************不要修改以下方法***************************/
        encryptionWebRequestWithParamas:function(uri, params,method) {
            var params = JSON.parse(params)
            var method = method.toLowerCase()
            var commonParas = {
                req_id:(new Date()).getTime(),
                os: "android-4.4.4",
                appkey: "123456abc",
                sdkv: "1.0.0",
                appv: "1.0",
                 cid: "6c52d9fcda64bf4b3cb62189413582bb",
                 network: "1",
                 time: (new Date()).getTime(),
                 manufacturer: "Xiaomi",
                 model: "HM NOTE 1LTE",
                 resolution: "123",
                 country: "china",
                 lang: "zh-CN",
                 channel: "test",
            };
            var signParmas = mergeObj(params, commonParas)
            var keys = getKeysOfObj(signParmas)
            keys.sort();
            var signStr = uri + "&" + method;
            for(index in keys) {
                signStr += "&" + keys[index] + "=" + signParmas[keys[index]]
            }
            var sec = "d404727329c5acd7f52e743fc2f8cd50"
            // var sign = hex_md5(hex_md5(signStr) + sec)
            // signParmas['sign'] = sign
            return JSON.stringify(signParmas)
        },
        /*************************************************************/

        reloadPage:function(){
            location.reload();
        },
        getContext:function(){
            return JSON.stringify({
                "gameId":1
            });
        },
        getSession:function(){
            return JSON.stringify({
                sid:"5b53895c3d2fdbb50c96a879111df6cc",
                uid:102,
            })
        },
        showInfo(info) {
            alert(info)
        },
        share(url) {
            console.log(url)
        },
        redirect(path, title, context) {
            context = JSON.parse(context)
            let param = ""
            for(let key in context) {
                param += "&" + key + "=" + context[key]
            }
            param = param.substr(1)
            if(param != "") {
                param = "?" + param
            }

            location.href=path + param
        },
        loadComponent:function(){},
        setPageProps:function(props) {
            var properties = JSON.parse(props);

        }
    }
})(window)
