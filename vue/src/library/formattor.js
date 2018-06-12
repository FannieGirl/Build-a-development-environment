export default class Formattor {
    date(d, fmt="YYYY-mm-dd HH:ii:ss") {
        let o = {
          "m+" : d.getMonth()+1,                 //月份
          "d+" : d.getDate(),                    //日
          "H+" : d.getHours(),                   //小时
          "i+" : d.getMinutes(),                 //分
          "s+" : d.getSeconds(),                 //秒
          "q+" : Math.floor((d.getMonth()+3)/3), //季度
          "s"  : d.getMilliseconds()             //毫秒
        };
        if(/(Y+)/.test(fmt))
          fmt=fmt.replace(RegExp.$1, (d.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
          if(new RegExp("("+ k +")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    }

    unixTime(t, fmt="YYYY-mm-dd HH:ii:ss") {
        let d = new Date();
        d.setTime(t*1000)
        return this.date(d,fmt);
    }
}
