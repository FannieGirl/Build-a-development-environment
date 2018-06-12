import Vue from 'vue'
import Browser from './Browser'
import Config from 'config/config'
export default class Api {
    constructor() {
        this.opts = Config.api
        //LoopinVue.http.headers.common["content-type"] = "application/x-www-form-urlencoded";
        Vue.http.interceptors.push((request, next) => {
            var timeout;
            // 這裡改用 _timeout ，就不會觸發原本的
            if (request._timeout) {
            // 一樣綁定一個定時器，但是這裡是只要觸發了，就立即返回 response ， 並且這邊自定義了 status 和 statusText
                timeout = setTimeout(() => {
                    next(request.respondWith(request.body, {
                        status: 408,
                        statusText: 'Request Timeout'
                    }));
                }, request._timeout);
            }

            next((response) => {
                clearTimeout(timeout);
            });
        })
    }

    get(uri, data={}, success=null, error=null) {
        if(success == undefined) {
            success = null
        }
        if(error == undefined) {
            error = null
        }
        let d = Browser.encryptionWebRequestWithParamas(uri, data, "GET")
        Vue.http.get(this.opts.host + uri, {params:d,_timeout:5000}).
            then((response)=>{
                let parsedBody = this.parseBody(response)
                if(parsedBody["status"] == 30007) {
                    // Browser.logout()
                }
                success(parsedBody)
            }, (response)=>{
                error(this.parseBody(response))
            })
    }

    post(uri, data={}, success, error) {
        let d = Browser.encryptionWebRequestWithParamas(uri, data,"POST")
        Vue.http.post(this.opts.host + uri, this.formUrlencode(d) ,{headers:{"content-type":"application/x-www-form-urlencoded"}, _timeout:5000}).
            then((response)=>{
                let parsedBody = this.parseBody(response)
                if(parsedBody["status"] == 30007) {
                    // Browser.logout()
                }
                success(parsedBody)
            }, (response)=>{
                error(this.parseBody(response))
            })
    }

    formUrlencode(d) {
        let data = ""
        for(let key in d) {
            data += "&" + key + "=" + encodeURIComponent(d[key])
        }
        return data.substr(1)
    }

    parseBody(response) {
        if(!response.ok) {
            return {
                status:response.status,
                info:response.statusText,
                data:{}
            }
        }
        try{
            if(typeof response.body == 'string') {
              response.body = JSON.parse(response.body)
            }
            return response.body
        } catch(ex) {
            return {
                status:100,
                info:"服务器错误!",
                data:{}
            }
        }
    }
}
