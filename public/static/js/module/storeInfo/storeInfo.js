/**
 * Created by rico on 2016/8/22.
 */
'use strict';
$(function () {

    //微信签名
    $.getJSON('/api/weixin/sign', {
        url: encodeURIComponent(window.location.href.split('#')[0])
    }, function (data) {
        wx.config({
            debug:false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature,// 必填，签名，见附录1
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'showMenuItems', 'hideAllNonBaseMenuItem','openLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
    });

    wx.ready(function () {
        wx.showOptionMenu({
            menuList: [
                "menuItem:share:appMessage",
                "menuItem:share:timeline",
                "menuItem:share:qq",
                "menuItem:share:weiboApp",
                "menuItem:share:facebook",
                "menuItem:share:QZone",
                "menuItem:copyUrl",
                "menuItem:share:email"
            ]
        });
    });

    function storageGet (key) {
        return JSON.parse(localStorage.getItem(key));
    }

    function getParam (item) {
        var sValue = location.href.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        return sValue ? sValue[1] : sValue;
    }
    //微信地图上定位
    function getMapLocation(latitude,longitude,name,address) {
        wx.ready(function () {
            wx.openLocation({
                latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
                longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
                name: name, // 位置名
                address: address, // 地址详情说明
                scale:14, // 地图缩放级别,整形值,范围从1~28。默认为最大
                infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
            });
        });
    }
    //门店业态
    $(document).on("pageInit",'#storeTypeList', function (e, id, page) {
        var city=storageGet("city");
        //var categoryName=getParam("categoryName");
        var loading = false;
        var curPage=2;
        var pageSize=10;
        var loadLock=true;
        var _preLoader=$('#storeTypeList .infinite-scroll-preloader .preloader');
        var _preLoaderTips=$("#storeTypeList .infinite-scroll-preloader .preloader-over-tips");

        function loadItems(cityId) {
            $.getJSON("/api/customer/list?page=" + curPage + "&pageSize=" + pageSize, function (res) {
                var _data = res.data;
                var _total = res["total"];
                var _maxPageSize=pageSize!==0?Math.ceil(_total/pageSize):0;
                var _index=res["page"];
                if(_index<=_maxPageSize) {
                    var html = '';
                    $.each(_data, function (key, item) {
                        var _url = "storeList?categoryId=" + item["categoryId"] + "&sellerid=" + item["id"]+"&logoImg="
                            +encodeURIComponent(item["logoImg"])+"&categoryName"+encodeURIComponent(item["name"]);
                        var _img = item["logoImg"];
                        var _name = item["name"];
                        html += '<li><a href="' + _url + '" class="external"><div class="uol-img"><img src="' + _img + '"></div><div class="uol-txt">' + _name + '</div></a></li>';
                    });
                    $('#storeTypeList .u-operation-list').append(html);
                    curPage++;
                }else{
                    $.toast("没有更多内容了");
                   // _preLoaderTips.html("全部数据已经加载完成!");
                    loadLock=false;
                }
            });
        }

        $(page).on('infinite', function() {

            if(loadLock){
                _preLoader.addClass("on");
                if (loading) return;
                loading = true;
                setTimeout(function() {
                    loading = false;
                    loadItems(city.id);
                    _preLoader.removeClass("on");
                }, 1000);
            }else{
                // _preLoaderTips.html("全部数据已经加载完成!");
            }
        });

    });

    //门店列表
    $(".swiper-container").swiper({
        speed: 2000,
        spaceBetween:0,
        autoplay:1000,
        autoplayDisableOnInteraction:false,
        loop:true
    });

    $(document).on("pageInit",'#storeList', function (e, id, page) {
        var curPage=2;
        var pageSize=10;
        var loadLock=true;
        var loading = false;
        var _cityId=getParam("cityId");//城市区域id
        var _sellerId=getParam("sellerid");//业态id

        var _preLoader=$('#storeList .infinite-scroll-preloader .preloader');
        var _preLoaderTips=$("#storeList .infinite-scroll-preloader .preloader-over-tips");
        var _storeList=$('#storeList .msb-store-list');
        var cityPicker= $("#cityPicker");

        function addItems(_cityId) {
            var areaid=_cityId;
            if(areaid){
                $.getJSON("/api/customer/shop?sellerid="+_sellerId+"&areaid="+areaid+"&page="+curPage+"&pagesize="+pageSize, function (res) {
                    var _data = res.data;
                    var _total = res["total"];
                    var _maxPageSize=pageSize!==0?Math.ceil(_total/pageSize):0;
                    var _index=res["page"];
                    if(_index<=_maxPageSize) {
                        var html = '';
                        $.each(_data, function (key, item) {
                            html += '<li>' +
                                '<div class="msl-hd"><a href="storeDetails?storeId='+item.id+'" class="external">' +
                                '<i class="icon iconfont">&#xe613;</i> ' +
                                '<span>'+item.name+'</span>' +
                                '</a></div>' +
                                '<div class="msl-bd">' +
                                '<div class="msl-txt"><a href="storeDetails?storeId='+item.id+'" class="external"><p>客服电话：'+item.contact+'</p><p>地址：'+item.address+'</p></a></div>' +
                                '<div class="msl-icon">' +
                                '<a class="icon iconfont external icon-ditudaohang map-location" data-latitude="'+item.latitudeValue+'" data-longitude="'+item.longitudeValue+'data-name="'+item.name+'data-address="'+item.address+'"></a><a class="icon iconfont external" href="tel:'+item.contact+'">&#xe625;</a></div>' +
                                '</div>' +
                                '</li>';
                        });
                        _storeList.append(html);
                        mapGetPos();
                        curPage++;
                    }else{
                        $.toast("没有更多内容了");
                        _preLoaderTips.html("没有更多内容了");
                        loadLock=false;
                    }
                });
            }else{
                $.getJSON("/api/customer/shop?sellerid="+_sellerId+"&page="+curPage+"&pagesize="+pageSize, function (res) {
                    var _data = res.data;
                    var _total = res["total"];
                    var _maxPageSize=pageSize!==0?Math.ceil(_total/pageSize):0;
                    var _index=res["page"];
                    if(_index<=_maxPageSize) {
                        var html = '';
                        $.each(_data, function (key, item) {
                            html += '<li>' +
                                '<div class="msl-hd"><a href="storeDetails?storeId='+item.id+'" class="external">' +
                                '<i class="icon iconfont">&#xe613;</i> ' +
                                '<span>'+item.name+'</span>' +
                                '</a></div>' +
                                '<div class="msl-bd">' +
                                '<div class="msl-txt"><a href="storeDetails?storeId='+item.id+'" class="external"><p>客服电话：'+item.contact+'</p><p>地址：'+item.address+'</p></a></div>' +
                                '<div class="msl-icon">' +
                                '<a class="icon iconfont external icon-ditudaohang map-location" data-latitude="'+item.latitudeValue+'" data-longitude="'+item.longitudeValue+'data-name="'+item.name+'data-address="'+item.address+'"></a><a class="icon iconfont external" href="tel:'+item.contact+'">&#xe625;</a></div>' +
                                '</div>' +
                                '</li>';
                        });
                        _storeList.append(html);
                        mapGetPos();
                        curPage++;
                    }else{
                        $.toast("没有更多内容了");
                        _preLoaderTips.html("没有更多内容了");
                        loadLock=false;
                    }
                });
            }
        }

        $(page).on('infinite', function() {

            if(loadLock) {
                _preLoader.addClass("on");
                if (loading) return;
                loading = true;
                setTimeout(function () {
                    loading = false;
                    addItems(_cityId);
                    _preLoader.removeClass("on");
                }, 1000);
            }else{
               // _preLoaderTips.html("全部数据已经加载完成!");
            }
        });

        //地图定位
        function mapGetPos() {
            $("#msbStoreList .map-location").on("click",function () {
                var _latitude=parseFloat($(this).data("latitude"));
                var _longitude=parseFloat($(this).data("longitude"));
                var _name=$(this).data("name");
                var _address=$(this).data("address");

                getMapLocation(_latitude,_longitude,_name,_address);
            });
        }
        mapGetPos();
        /**筛选**/
        //获取tree筛选id
        function GetTreeByName(data,name){
            var deep,T,F;
            for (F = data.length;F;)
            {
                T = data[--F];
                if (name === T.name) return T;
                if (T.children)
                {
                    deep = GetTreeByName(T.nodes,name);
                    if (deep) return deep
                }
            }
        }
        function AddAllNode(data){
            var deep,T,F,_node={id:null, name: "全部", parentId: 0, nodes:data.nodes||[], children: []};
            data.unshift(_node);

            for (F = data.length;F;)
            {
                T = data[--F];
                if(T.name === _node.name){
                   return
                }
                if (T.nodes)
                {
                    deep = AddAllNode(T.nodes);
                    if (deep) return deep
                }
            }
        }
        //筛选id
        function filterCityId(data) {
            var cityStr="";
            var cityData=data;

            var selectCity=cityPicker.val().split(" ");

            if(selectCity[2]){
                if(selectCity[2]!=="全部"){
                    cityStr=selectCity[2];
                }else if(cityStr=selectCity[1]!=="全部"){
                    cityStr=selectCity[1];
                }else if(cityStr=selectCity[0]!=="全部"){
                    cityStr=selectCity[0];
                }else{
                    cityStr="全部";
                }
            }else if(selectCity[1]){
                if(cityStr=selectCity[1]!=="全部"){
                    cityStr=selectCity[1];
                }else if(cityStr=selectCity[0]!=="全部"){
                    cityStr=selectCity[0];
                }else{
                    cityStr="全部";
                }
            }else{
                if(selectCity[0]!=="全部"){
                    cityStr=selectCity[0];
                }else{
                    cityStr="全部";
                }
            }
            //console.log("==1==",cityStr);

            var province="";
            var selectCityId=null;
            //获取省份
            $.each(cityData,function (key,item) {
                if(item.name !=="全部" && item.name==selectCity[0]){
                    province=item;
                    //console.log("==省份==",province,cityStr);
                }
            });
            if(cityStr==province.name){
                selectCityId=province.id
            }else if(cityStr!=="全部"){
                console.log(GetTreeByName(cityData,cityStr),"~~~");
                selectCityId=GetTreeByName(cityData,cityStr).id||null
            }else{
                selectCityId=null;
            }
            //console.log("+++++",selectCityId);
            return selectCityId;
        }

        $.getJSON("/api/area/getRegionAll")
        .done(function (data) {
            $.smConfig.rawCitiesData=data.data.nodes;
            //$.smConfig.rawCitiesOld= $.extend(true,{},data.data.nodes);

            AddAllNode($.smConfig.rawCitiesData);

            $("#filterPicker").removeClass("disable");
            cityPicker.cityPicker({
                toolbarTemplate: '<header class="bar bar-nav"><button class="button button-link pull-left close-picker">取消</button><button class="button button-link pull-right close-picker close-confirm">确认</button><h1 class="title">选择门店区域</h1></header>'
            });

            $(document).on("click", ".close-confirm", function() {
                var getCityId=filterCityId($.smConfig.rawCitiesData);
                //重置列表
                console.log("重置列表",getCityId);
                curPage=1;
                loadLock=true;
                loading = false;
                _storeList.empty();
                _preLoaderTips.html("");
                addItems(getCityId);
            });
        }).fail(function(err) {
            $.toast("请求数据失败"+err);
        });
    });

    //门店详情
    $(document).on("pageInit",'#storeDetails', function (e, id, page) {

        var _curPage=2;
        var _pageSize=10;
        var _storeId=getParam("storeId");
        var loadLock=true;
        var _preLoader=$('#storeDetails .infinite-scroll-preloader .preloader');
        var _preLoaderTips=$("#storeDetails .infinite-scroll-preloader .preloader-over-tips");

        function addItems() {
            $.getJSON("/api/store/activity?storeId="+_storeId+"&page="+_curPage+"&pageSize="+_pageSize).done(function (res) {
                var _data = res.data;
                var _total = res["total"];
                var _maxPageSize=_pageSize!==0?Math.ceil(_total/_pageSize):0;
                var _index=res["page"];
                if(_index<=_maxPageSize) {
                    var html = '';
                    var _link='';
                    $.each(_data, function (key, item) {
                        if(item.linkType == 3 || item.linkType == 5){
                            //3积分商品 优惠券 详情/列表
                            if(item.linkContent.length > 0 && item.islist == 0){
                                _link="#/pointsExchangeDetails?id="+item.linkContent;
                            }else if(item.linkContent.length > 1 && item.islist == 1){
                                _link="#/pointsExchangeList?idArr="+item.linkContent;
                            }else{
                                _link='javascript:void(0)';
                            }
                        }else if(item.linkType == 4){
                            //云猴小店商品 详情/列表
                            _link='javascript:void(0)';
                        }else if(item.linkType == 6){
                            // URL H5
                            _link=item.linkContent;
                        }else if(item.linkType == 12){
                            //云猴小店
                            _link='javascript:void(0)';
                        }else if(item.linkType == 9){
                            _link='javascript:void(0)';
                        }else{
                            _link='javascript:void(0)';
                        }

                        html += '<li>' +
                            '<div class="sdl-hd">' +
                            '<i class="icon iconfont">&#xe61a;</i><span>'+item["activityname"]+'</span>' +
                            '</div>' +
                            '<div class="sdl-bd"><p>'+item["introduction"]+'</p></div>' +
                            '<div class="sdl-ft">' +
                            '<a class="external" href="'+_link+'">查看更多<i class="icon iconfont">&#xe604;</i></a>' +
                            '</div>' +
                            '</li>';
                    });
                    $('#storeDetails .store-details-list').append(html);
                    _curPage++;
                }else{
                    $.toast("没有更多内容了");
                    //_preLoaderTips.html("全部数据已经加载完成!");
                    loadLock=false;
                }
            }).fail(function(){
                $.toast("请求数据失败");
            });
        }
        var loading = false;

        $(page).on('infinite', function() {
            var _active=$("#tab2").hasClass("active");
            if(loadLock && _active) {
                _preLoader.addClass("on");
                if (loading) return;
                loading = true;
                setTimeout(function () {
                    loading = false;
                    addItems();
                    _preLoader.removeClass("on");
                }, 1000);
            }else if(!loadLock && _active){
               // _preLoaderTips.html("全部数据已经加载完成!");
            }else{
                _preLoaderTips.html("");
            }
        });

        //地图定位
        $("#getStoreMap").on("touchstart",function () {
            var _latitude=parseFloat($(this).data("latitude"));
            var _longitude=parseFloat($(this).data("longitude"));
            var _name=$(this).data("name");
            var _address=$(this).data("address");
            getMapLocation(_latitude,_longitude,_name,_address);
        });
    });

   $.init();
});

