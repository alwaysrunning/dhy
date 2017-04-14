/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/4
 * Time: 16:12
 * 客服中心
 * */
'use strict';
define(function (require, exports, module) {
    module.exports=function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        var page=1,
            pageSize=10;
        var total,
            totalPage;
        var MORE="上拉加载更多";
        var NONE="没有客服";
        var NOMORE="没有更多啦";
        var RELEASE="松开立即加载";
        App.getJSON("customer/list?page="+page+"&pageSize="+pageSize,function(res){
            console.log(res);
            if(res.code=="0000"){
                var msg=false;
                total=res.total;
                totalPage=Math.ceil(total/pageSize);
                if(total === 0){
                    msg=NONE;
                }else if(total>10){
                    msg=MORE;
                }
                App.render({
                    url:_this.RouterTmpUrl,
                    data:{title:_this.RouterTitle,data:res.data,msg:msg,total:total},
                    _this:_this
                });
                if(total === 0){
                    $(".scroll-mod").addClass("u-scroll-inside");
                }else if(total>10){
                    App.component.scrollLoading({
                        wrapper: ".u-refresh",//*必须.u-refresh .scroll-mod
                        list: ".u-customer-cate-list",//*必须
                        pageSize: pageSize,
                        threshold: 10,
                        judge:true,
                        inside:true,
                        ejsUrl: "views/dhy/scrollCustomerCenter.ejs",
                        totalPage: function(data){
                            var result=false;
                            console.log(data,"===");
                            if(data){
                                var _total=data["total"];
                                var _count= data["pagesize"];
                                var _index=data["page"];
                                var _maxPageSize=_count!==0?Math.ceil(_total/_count):0;
                                //console.log(_index,_maxPageSize,"+++++");
                                if(_index<=_maxPageSize){
                                    result=_maxPageSize;
                                }else{
                                    App.Popover.weak({txt:"没有了更多内容了..."});
                                    console.log("page error!");
                                    $(".u-refresh-label").html("没有更多内容了");
                                }
                            }
                            return result;
                        },
                        getUrl: function (page, pageSize) {
                            return "customer/list?page="+page+"&pageSize="+pageSize;
                        }
                    })
                }
            }
        });


    };
});