import en from "config/lang/en"
import zh from "config/lang/zh"
import id from "config/lang/id"
import th from "config/lang/th"
import vi from "config/lang/vi"
class _Lang {
    constructor() {
        this.currentLang = "en"
        this.lang = {}
    }

    set(lang) {
        if(lang in this.lang) {
            this.currentLang = lang
        }

    }

    load(name, l) {
        this.lang[name] = l
    }

    resolve(id) {
        if(id in this.lang[this.currentLang]) {
            return this.lang[this.currentLang][id]
        }
        return ""
    }
}

const Lang = new _Lang()
Lang.load("en", en)
Lang.load("zh", zh)
Lang.load("in", id)
Lang.load("th", th)
Lang.load("vi", vi)
export default Lang
