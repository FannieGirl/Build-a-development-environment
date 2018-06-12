import Lang from 'config/lang.js'

const LangVue = {

}

LangVue.install = function(v, o) {
    Lang.set(o.lang)
    v.prototype.lang = function(id) {
        return Lang.resolve(id)
    }
}

export default LangVue
