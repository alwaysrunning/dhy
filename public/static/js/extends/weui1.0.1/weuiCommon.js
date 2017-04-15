/**
 * Created by ricopter@qq.com on 2017/3/16.
 * jquery-wei-ui 公共
 */
'use strict';
$(function () {

  function LoadingMask() {
    this.loadingTransparentHTML="<div class='weui-mask_transparent u-loading-mask-transparent'></div>";
    this.loadingMaskHtml="<div class='weui-toast weui_loading_toast weui-toast--visible u-loading-mask'>" +
        "<div class='weui_loading'>" +
        "<i class='weui-loading weui-icon_toast'></i>" +
        "</div>" +
        "<p class='weui-toast_content'>数据加载中</p>" +
      "</div>";
  }

  LoadingMask.prototype={
      show:function () {
        var $body=$("body");
         if(!$body.hasClass("loadTag")){
           $body.addClass("loadTag");
           $body.append(this.loadingTransparentHTML).append(this.loadingMaskHtml);
         }
      },
      hide:function () {
         $("body").removeClass("loadTag");
         $(".u-loading-mask-transparent").remove();
         $(".u-loading-mask").remove();
      }
  };

  var loadingMask=new LoadingMask();

  $.extend($.ajaxSettings, {
    beforeSend: function () {
      loadingMask.show();
    },
    complete: function () {
      loadingMask.hide();
    },
    error: function (xhr,type) {
      var errorTxt = "";
      var codeTxt = "";
      codeTxt = xhr.responseJSON.code;
      errorTxt = xhr.responseJSON.message;
      $.toast(errorTxt, "text");
    }
  });

});