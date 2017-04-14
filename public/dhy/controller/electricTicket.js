/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/12/1
 * Time: 16:22
 * 电子小票·列表
 * */
'use strict';
define(function (require, exports, module) {
    module.exports= function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        //是否完善信息
        App.getJSON("account/integration",function(exchangeRes){
            if(exchangeRes.code=="0000"){
                App.getJSON("pos/list?page=1&pagesize=10",function(res){
                    //console.log(res);
                    // res={"total":90,"pagesize":10,"page":1,"data":[{"ticketNo":"293441","carrier":"长沙南国","partition":"010","amount":"223.4","transDt":"2016-03-23 16:15:12","txnId":"1-1YRWEKI","cardNo":"550000000000934504","carrierCd":"120122"},{"ticketNo":"263958","carrier":"长沙金星路店","partition":"028","amount":"164.02","transDt":"2016-01-30 18:25:37","txnId":"1-1OWVVNS","cardNo":"550000000000934504","carrierCd":"120164"},{"ticketNo":"69693","carrier":"麓谷信息A座","partition":"001","amount":"12.4","transDt":"2015-12-23 09:25:53","txnId":"1-1FFVO9S","cardNo":"550000000000934504","carrierCd":"060078"},{"ticketNo":"114878","carrier":"长沙金星路店","partition":"007","amount":"681","transDt":"2015-11-28 11:49:11","txnId":"1-1AVLMOT","cardNo":"550000000000934504","carrierCd":"120164"},{"ticketNo":"565218","carrier":"长沙金星路店","partition":"022","amount":"159.1","transDt":"2015-11-23 20:52:49","txnId":"1-19X0T74","cardNo":"550000000000934504","carrierCd":"120164"},{"ticketNo":"428953","carrier":"长沙金星路店","partition":"024","amount":"169.8","transDt":"2015-11-21 10:42:43","txnId":"1-198VCK6","cardNo":"550000000000934504","carrierCd":"120164"},{"ticketNo":"923095535","carrier":"长沙金星路店","partition":"020","amount":"57.2","transDt":"2015-11-13 19:43:44","txnId":"1-17KFPN7","cardNo":"550000000000934504","carrierCd":"120164"},{"ticketNo":"465596","carrier":"长沙金星路店","partition":"025","amount":"100.7","transDt":"2015-11-06 19:16:57","txnId":"1-157VBD1","cardNo":"550000000000934504","carrierCd":"120164"},{"ticketNo":"34147","carrier":"麓谷信息A座","partition":"002","amount":"19.4","transDt":"2015-10-10 09:04:04","txnId":"1-ZPW6PG","cardNo":"550000000000934504","carrierCd":"060078"},{"ticketNo":"34028","carrier":"麓谷信息A座","partition":"002","amount":"8.5","transDt":"2015-10-08 18:04:36","txnId":"1-ZI7KNA","cardNo":"550000000000934504","carrierCd":"060078"}],"code":"0000"};
                    App.render({
                        url:_this.RouterTmpUrl,
                        data:{title:_this.RouterTitle,data:res.data},
                        _this:_this
                    });

                    if(res.total>8){
                        App.component.scrollLoading({
                            wrapper:"#electricTicket",
                            ejsUrl:"views/dhy/scrollElectricTicketList.ejs",
                            getUrl:function(page,pageSize){
                                return "pos/list?page="+page+"&pagesize="+pageSize;
                            },
                            totalPage:function(data){
                                var result=false;
                                if(data){
                                    var _total=data["total"];
                                    var _count= data["pagesize"];
                                    var _index=data["page"];
                                    var _maxPageSize=_count!==0?Math.ceil(_total/_count):0;
                                    if(_index<=_maxPageSize){
                                        result=_maxPageSize
                                    }else{
                                        console.log("page error!");
                                    }
                                }
                                return result;
                            }
                        });
                    }
                    //滑动显示删除按钮
                    // var touch=require("public/static/js/component/touch");
                    // touch.on(".u-electricTicket-list","swipeleft","li",function (e) {
                    //     $(this).parent().addClass("slide");
                    // });
                    // touch.on(".u-electricTicket-list","swiperight","li",function (e) {
                    //     $(this).parent().removeClass("slide");
                    // });
                    // var $deleteBtns=$(".u-electricTicket-list .u-delete");
                    // $deleteBtns.on("click",function (e) {
                    //     //TODO 等待删除接口
                    //     e.preventDefault();
                    //     e.stopPropagation();
                    //     alert(1);
                    //     $(this).parent().off().remove();
                    // })

                });
            }
        });

    };
});