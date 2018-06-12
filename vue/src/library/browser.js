
import parse from "url-parse"
const Base64 = require('js-base64').Base64;
class _Browser {
    constructor() {
        this.jsObject = window.jsObject || {}
        //解析
        let uri = parse(location.href, true)

        this.context = Object.assign({}, uri.query)
    }

    setVueInstance(v) {
        this.VueInstance = v
    }
    getContext() {
        return Object.assign({},this.context,JSON.parse(this.jsObject.getContext()))
    }

    setContext(context) {
        this.context = Object.assign(this.context,context)
    }
    encryptionWebRequestWithParamas(uri, params, method) {
        return JSON.parse(
            this.jsObject.encryptionWebRequestWithParamas(
                uri,
                JSON.stringify(params),
                method)
        );
    }

    reloadPage() {
        this.jsObject.reloadPage()
    }

    getSid() {
        let session = this.getSession()
        return session.sid;
    }

    // logout() {
    //     this.jsObject.logout()
    // }
    getSession() {
        let ss = JSON.parse(this.jsObject.getSession())
        if(!ss.sid) {
            this.logout()
        }
        return ss
    }

    getScheme() {
        let ss = JSON.parse(this.jsObject.getSession())
        if(!ss.scheme) {
            return "paramida";
        }
        return ss.scheme
    }

    showMenu(items) {
        this.jsObject.showMenu(JSON.stringify(items))
    }
    showInfo(info) {
        this.jsObject.showInfo(info)
    }

    triggerEvent(name, context) {
        let contextObject = null
        try{
            (function(){
                contextObject = JSON.parse(context)
            })()
        } catch (e) {
            contextObject = JSON.parse(Base64.decode(context))
        }
        if(this.VueInstance != undefined) {
            this.VueInstance.$broadcast(name, contextObject)
        }

    }
    redirect(href, title) {
        let url  = parse(href, true)
        this.jsObject.redirect(url.pathname, title, JSON.stringify(url.query))
    }
    loadComponent(id, context) {
        this.jsObject.loadComponent(id, JSON.stringify(context))
    }
    share(url) {
        this.jsObject.share(url)
    }
    getLang() {
        let lang = "en_us";
        try{
            lang = this.jsObject.getLang()
        } catch (e) {

        }
        lang = lang.toLowerCase()
        return lang.split('_')[0]
    }
    setPageProps(props) {
        this.jsObject.setPageProps(JSON.stringify(props))
    }
    setGuildTid(tid) {
        this.jsObject.enterGroupChat(tid)
    }
}

const Browser = new _Browser()

window.triggerEvent = function(name, context) {
    Browser.triggerEvent(name, context)
}
export default Browser;
