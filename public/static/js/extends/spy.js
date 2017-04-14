/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2016/1/8
 * Time: 14:23
 * */
/*
 *	滚动检测器
 *
 *	spyElements : 检测滚动的元素 id
 *	triggerHeight : 进入屏幕响应的距离
 *
 */
;(function($,window,document,undefined){
    var Spy = function(ele,opt){

        this.spyElementsScrollTop = [] ;

        var settings = {
            'spyElements' : [] ,
            'triggerHeight' : 0 ,
            'spying' : function(i,top){}
        } ;

        this.options = $.extend({},settings,opt) ;
    }

    Spy.prototype._init = function(){

        this.getElementsScrollTop() ;

        this._bindEvents() ;
    }

    Spy.prototype._bindEvents = function(){
        var that = this ;
        $(document).on('scroll',scroll) ;
        scroll() ;

        function scroll(){
            var scrollTop = document.body.scrollTop ;
            that.spyScroll(scrollTop) ;
        }

    }

    Spy.prototype.spyScroll = function(pageScrollTop){
        var that = this ,
            arr = this.spyElementsScrollTop ,
            i = 0 ,
            initTop = arr[0] ,
            triggerHeight = this.options.triggerHeight ;

        for(var i=0;i<arr.length;i++){
            if( pageScrollTop - initTop - triggerHeight <= arr[i] ){
                that.options.spying(i,arr[i])
                break;
            }
        }
    }

    Spy.prototype.getElementsScrollTop = function(){
        var that = this ;
        $.each(this.options.spyElements,function(){
            var scrollTop = parseInt($(this).offset().top)
            that.spyElementsScrollTop.push(scrollTop);
        }) ;
        that.spyElementsScrollTop.sort(function(a,b){
            return a-b
        }) ;
    }

    $.fn.spy = function(options){
        var spy = new Spy(this,options)
        spy._init()
    }

})($,window,document) ;