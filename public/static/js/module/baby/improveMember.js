/**
 * Created by ricopter@qq.com on 2016/11/11.
 */
'use strict';
$(function () {
    FastClick.attach(document.body);

    var sex="9";
    var birthday="";
    var sexVal="";
    var pickerBirthdayVal=$("#pickerBirthdayVal");
    var pickerBirthdayHide=$("#pickerBirthdayHide");
    var pickerBirthday=$("#pickerBirthday");

    var babySelectSex=$("#babySelectSex");
    var babySelectSexHide=$("#babySelectSexHide");
    var babySelectSexVal=$("#babySelectSexVal");

    function storageSet (obj) {
        localStorage[obj.key] = JSON.stringify(obj.val);
    }
    //宝宝性别选择
    // $(".ilogin2-myxz1").on("click",function(){
    //     $(this).addClass("on").siblings().removeClass("on");
    //     sex=$(this).data("id");
    //     if(sex=="4"){
    //         pickerBirthday.hide();
    //         pickerBirthdayVal.html("出生日期/预产期");
    //         birthday="";
    //     }else{
    //         pickerBirthday.show();
    //     }
    // });

    //0:男1：女 3:备孕中4：孕中
    var sexIdMap=["0","1","4","3"];
    var sexNameArr=['男','女','孕中','备孕'];

    babySelectSexHide.picker({
        title: "请选择宝宝性别",
        toolbarTemplate:'<div class="toolbar">\
          <div class="toolbar-inner">\
          <a href="javascript:;" class="picker-button close-cancel" id="pickerCloseSex">取消</a>\
          <a href="javascript:;" class="picker-button close-confirm" id="pickerConfirmSex">{{closeText}}</a>\
          <h1 class="title">{{title}}</h1>\
          </div>\
          </div>',
        cols: [
            {
                textAlign: 'center',
                values: sexNameArr
            }
        ],
        onClose:function (picker) {
           sexVal=picker.value.toString();
           // if(sexVal=="备孕"){
           //     pickerBirthday.hide();
           // }else{
           //     pickerBirthday.show();
           // }
        }
    });

    $(document).on("click","#babySelectSex",function () {
        babySelectSexHide.picker("open");
    });
    //取消
    $(document).on("click", "#pickerCloseSex", function() {
        babySelectSexHide.picker("close");
    });
    //完成
    $(document).on("click", "#pickerConfirmSex", function() {
        babySelectSexHide.picker("close");
        babySelectSexVal.html(sexVal);
        switch (sexVal){
            case "男":
                sex="0";
                pickerBirthday.show();
                break;
            case "女":
                sex="1";
                pickerBirthday.show();
                break;
            case "孕中":
                sex="4";
                pickerBirthday.show();
                break;
            case "备孕":
                sex="3";
                pickerBirthday.hide();
                break;
        }
        console.log(sexVal,"-----",sex);
    });
    /***********************/
    //出生日期
    pickerBirthdayHide.datetimePicker({
        title: '',
        yearSplit: '-',
        monthSplit: '-',
        dateSplit: '',
        toolbarTemplate:'<div class="toolbar">\
          <div class="toolbar-inner">\
          <a href="javascript:;" class="picker-button close-cancel" id="pickerClose">取消</a>\
          <a href="javascript:;" class="picker-button close-confirm" id="pickerConfirm">{{closeText}}</a>\
          <h1 class="title">{{title}}</h1>\
          </div>\
          </div>',
        times: function () {
            return [];
        },
        onChange: function (picker, values, displayValues) {
            //console.log("change",values);
        },
        onClose:function (picker) {
            birthday=picker.value.join("-");
        }
    });
    $(document).on("click","#pickerBirthday",function () {
        pickerBirthdayHide.picker("open");
    });
    //完成
    $(document).on("click", "#pickerConfirm", function() {
        pickerBirthdayHide.picker("close");
        pickerBirthdayVal.html(birthday);
    });
    //取消
    $(document).on("click", "#pickerClose", function() {
        pickerBirthdayHide.picker("close");
    });
    //提交表单
    $("#submitBtn").on("click",function () {

        if(sex =="9") {
            $.toast("请选择性别", "text");

        }else if(sex !=="3" && birthday){
            $.post('/api/dhy/baby/saveMember',{
                "sex":sex,
                "birthday":birthday
            },function (res) {
                storageSet({
                    key: "babyNewUser",
                    val: false
                });
                $.toast(res.message,"text",function () {
                    location.href="/#/memberCenter?channel=V0115";
                });
            });
        }else if(sex =="3"){
            $.post('/api/dhy/baby/saveMember',{
                "sex":sex
            },function (res) {
                storageSet({
                    key: "babyNewUser",
                    val: false
                });
                $.toast(res.message,"text",function () {
                    location.href="/#/memberCenter?channel=V0115";
                });
            });
        }else{
            $.toast("请选择出生日期","text");
        }

    });
});