/**
 * Created by ricopter@qq.com on 2016/11/13.
 */
'use strict';
/*
 *auther:leay
 *@2016.10.25
 * */
(function ($) {

    var startRadian = -0.5*Math.PI;
    var cancvsObj = "";
    var endRadian = "";
    var circleObj = "";

    function Circle(circle){
        this.init(circle);
    }

    Circle.prototype = {
        init: function(circle){
            var self = this;
            if(circle.dom==undefined||circle.dom==""){
                console.error("请输入容器");
                return;
            }else if(circle.radius==undefined||circle.radius==""){
                console.error("请输入进度条的颜色");
                return;
            }else if(circle.pbColor==undefined||circle.pbColor==""){
                console.error("请输入进度条的颜色");
                return;
            }else if(circle.pbWidth==""){
                console.error("请输入进度条的宽度");
                return;
            }else if(circle.value==undefined){
                console.error("缺少必要的属性--当前的进度数值");
                return;
            }
            self._createElementFun(circle);
            if(self._drawing(circle)=="error"){
                return;
            };
        },
        /*
         * name Drawing
         * auther
         * params circle
         * function 渲染图形
         *
         */
        _drawing: function(circle){
            var self = this;
            var X = self._hanleData(circle);
            if(X=="error"){
                return "error";
            }else{
                if(X == 0){
                    endRadian = 0;
                }else{
                    endRadian = X*Math.PI;
                }
            }
            cancvsObj = self.cancvsDom;

            circleObj = cancvsObj.getContext('2d');


            if(circle.pbWidth==undefined){
                circleObj.lineWidth = 5;
            }else{
                circleObj.lineWidth = circle.pbWidth;
            }
            circleObj.lineCap = 'round';
            circleObj.strokeStyle = "#cccccc";
            circleObj.beginPath();
            circleObj.arc(circle.radius+10,circle.radius+10,circle.radius,0,circle.openVal*Math.PI,false);
            circleObj.stroke();

            if(circle.pbWidth==undefined){
                circleObj.lineWidth = 5;
            }else{
                circleObj.lineWidth = circle.pbWidth;
            }
            circleObj.lineCap = 'round';
            circleObj.strokeStyle = circle.pbColor;
            circleObj.beginPath();
            circleObj.arc(circle.radius+10,circle.radius+10,circle.radius,0,endRadian,false);
            circleObj.stroke();

            return "ok";
        },
        /*
         * name hanleData
         * auther
         * params circle
         * return circle
         * 返回处理后的数据对象
         * function 处理数据
         *
         */
        _hanleData: function(circle){
            var result = "";
            if(circle.value!=""||circle.value==0){
                if(circle.totalValue!=undefined&&circle.totalValue!=""){
                    result = circle.value*circle.openVal/circle.totalValue;
                }else{
                    result = circle.value*circle.openVal/100;
                }
                return result;
            }else{
                console.error("请输入目前的进度数值");
                return "error";
            }
        },
        /*
         * name createElementFun
         * auther
         * params circle
         * function 创建DOM元素
         *
         */
        _createElementFun: function(circle){
            var self = this;
            var innerDom = document.createElement("div");
            var side = Math.sqrt(circle.radius*circle.radius+circle.radius*circle.radius);
            var horn = (circle.radius+10-side/2)+circle.pbWidth/2;
            $(innerDom).addClass('circle-innerDom').css({
                position: "absolute",
                width: side-circle.pbWidth + 'px',
                height: side-circle.pbWidth + 'px',
                left: (horn-1)+'px',
                top: horn+'px',
                'z-index': 100,
                'text-align': 'center',
                'line-height': side-10 + 'px',
                color: circle.pbColor,
                'font-size': circle.fontSize+ 'px'
            });
            if(circle.totalValue==undefined||circle.totalValue==""){
                innerDom.innerHTML = (circle.value/100)*100+"%";
            }else{
                innerDom.innerHTML = circle.value/circle.totalValue*100+"%";
            }



            self.cancvsDom = document.createElement("canvas");
            $(self.cancvsDom).addClass('circle-cancvsDom')
                .attr({
                    height: circle.radius*2+20,
                    width: circle.radius*2+20
                })
                .css({
                    transform: 'rotate('+ circle.rotate + 'deg)'
                });


            self.firstDom = document.createElement("div");
            $(self.firstDom).addClass('circle-firstDom')
                .css({
                    width: circle.radius*2+20+'px',
                    height: circle.radius*2+20+'px',
                    position: 'relative',
                    left:"-2px"
                })
                .append(self.cancvsDom).append(innerDom);

            var ZeroDom = $(circle.dom);
            ZeroDom.append(self.firstDom);
        },
        destory: function(){
            $(self.firstDom) && $(self.firstDom).remove();
        }
    };

    $.fn.Circle=Circle;
})($);