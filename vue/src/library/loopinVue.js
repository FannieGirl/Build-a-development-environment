import Vue from 'vue'
import VueResource from 'vue-resource'
import vueDrapload from 'vue-drapload'
import Browser from 'library/Browser'
import LangVue from 'plugin/Lang'

Vue.use(LangVue,{lang:Browser.getLang()})
Vue.use(VueResource)
Vue.use(vueDrapload,{
    domUp: {               // 上方DOM
        initialCall: function () {
            var me = this
            me.dom.innerHTML = '<div class="dropload-refresh"><span class="pull_down"></span><span clas="releasetext">Pull down</span></div>'
        },
        loadingCall: function () {
            var me = this
            me.dom.innerHTML = '<div class="dropload-load"><span class="updateload"></span></div>'
        },
        loadEndCall: function () {
            var me = this
            me.dom.innerHTML = '<div class="dropload-load"></div>'
        },
        pullingCall: function (_absMoveY) {
            var me = this
            //alert(me.getDistance())
            if (_absMoveY <= me.getDistance()) {
                // 下拉过程
                me.initialCall()
            } else if (_absMoveY > me.getDistance()
                && _absMoveY <= me.getDistance() * 2) {
                    // 可以释放更新
                me.dom.innerHTML = '<div class="dropload-update"><span class="release"></span><span clas="releasetext">Release</span></div>'
            }
        }
    },
    domDown: {                                                          // 下方DOM
      initialCall: function () {
        var me = this
        me.dom.innerHTML = '<div class="dropload-refresh"></div>'
      },
      loadingCall: function () {
        var me = this
        me.dom.innerHTML = '<div class="dropload-load"><span class="loading"></span>loading...</div>'
      },
      domNoData: function () {
        var me = this
        me.dom.innerHTML = ''
      },
    },
})
const LoopinVueFactory = (App)=>{
    let v = new Vue({
      el: '#app',
      components: { App },
      methods:{
      },
    })
    Browser.setVueInstance(v)
    return v
}
//全局配置
export default LoopinVueFactory
