/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/12/2
 * Time: 16:55
 * 我的消息·详情
 * */
'use strict';
define(function (require, exports, module){
    module.exports=function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        var _type=App.getParam("type");

        function contactRepeat(arr,key,list){
            var n={},r=[];
            for(var i=0;i<arr.length;i++){
                if(!n[arr[i][key]]){
                    var tmp={};
                    tmp[key]=arr[i][key];
                    tmp[list]=[];
                    tmp[list].push(arr[i]);
                    r.push(tmp);
                    n[arr[i][key]]=true;
                }else{
                    r.forEach(function(item){
                        if(item[key]==arr[i][key]){
                            item[list].push(arr[i]);
                        }
                    });
                }
            }
            return r;
        }

        function cutString(str, len) {
            //length属性读出来的汉字长度为1
            if(str.length*2 <= len) {
                return str;
            }
            var strlen = 0;
            var s = "";
            for(var i = 0;i < str.length; i++) {
                s = s + str.charAt(i);
                if (str.charCodeAt(i) > 128) {
                    strlen = strlen + 2;
                    if(strlen >= len){
                        return s.substring(0,s.length-1) + "...";
                    }
                } else {
                    strlen = strlen + 1;
                    if(strlen >= len){
                        return s.substring(0,s.length-2) + "...";
                    }
                }
            }
            return s;
        }

        //查看详情
        function lookDetails(){
            var _wrap=$("#msgDetailsList");
            var _dd=$("#msgDetailsList dl dd");
            $.each(_dd,function(index,item){
                var _p=$(this).find(".uml-cont p");
                var _id=$(this).data("id");
                var lg=100;
                var content=_p.data("content");
                var _lookMore=$(this).find('.u-look-more');


                $(this).data("index",$(this).index());
                $(this).data("parentindex",$(this).parents("dl").data("index"));

                _p.html(cutString(content,lg));
                if(content.length*2>lg){
                    $(this).find(".uml-foot").removeClass("u-hidden");
                }
                //查看更多
                _lookMore.off().on("tap",function(){
                    $(this).addClass("u-hidden");
                    _p.html(content);
                });
                //删除
                _p.off().on("hold",function(){
                    var _$this=$(this);
                    App.Popover.confirm("","确定要删除这条消息吗?","取消","确定",true,function(){
                    },function(){
                        App.getJSON("message/clean?type"+_type+"&id="+_id,function(res){
                            if(res.code=="0000"){
                                if(_$this.parents("dl").find("dd").length==1){
                                    _$this.parents("dl").remove();
                                }else{
                                    _$this.parents("dd").remove();
                                }
                            }
                        })
                    });
                });

            });
        }

        App.getJSON("message/list?type="+_type+"&page=1&pagesize=10",function(res){
            console.log(res);
            if(res.code=="0000"){
                var cr=contactRepeat(res.data,"date","list");
                App.render({
                    url:_this.RouterTmpUrl,
                    data:{title:_this.RouterTitle,data:cr,judge:res.total},
                    _this:_this
                });

                var _typeStr="";
                switch(_type){
                    case "1":
                        _typeStr="物流信息";
                        break;
                    case "2":
                        _typeStr="优惠信息";
                        break;
                    case "3":
                        _typeStr="活动消息";
                        break;
                    case "4":
                        _typeStr="系统广播";
                        break;
                    default :
                        break;
                }
                $("head title").empty().html("我的消息·"+_typeStr);

                lookDetails();

                App.getJSON("message/read?type="+_type);

                var initLg=$("#pointsDetailsList").data("judge");
                if(initLg>=10){
                    App.component.scrollLoading({
                        wrapper:"#pointsDetailsList",
                        ejsUrl:"views/dhy/scrollPointsDetailsList.ejs",
                        judge:true,
                        getUrl:function(page,pageSize){
                            return "message/list?type="+_type+"&page="+page+"&pagesize="+pageSize;
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
                        },
                        preData:function(data){
                            return contactRepeat(data.data,"date","list");
                        },
                        callbackQuery:function(){
                            lookDetails();
                        }
                    });
                }

            }
        });
    };
});
