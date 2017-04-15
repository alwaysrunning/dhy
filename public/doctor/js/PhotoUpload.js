/**
 * author by ricopter@qq.com on 2017/2/22.
 * 图片上传预览以及压缩  !/\/(?:jpeg|png|gif)
 */
'use strict';
(function (win,$) {
  //图片上传预览
  function PhotoUpload (options) {
    if (!(this instanceof PhotoUpload)) {
      return new PhotoUpload(options);
    }
    this.opts = {
      previewMod:"#imgShowList",
      fileButton:"#photo",
      isPreview:true,
      addCallback:function () {},
      supportedTypes:['image/jpg', 'image/jpeg', 'image/png','image/gif'],
      ImgSrcArr:[],
      limitMax:6,//最多一次上传的数量
      maxsize:100 * 1024, //小于100kb不压缩
      quality:0.5 //压缩质量
    };
    $.extend(this.opts, options);

    this.init();
    return this;
  }

  PhotoUpload.prototype={
    init:function () {
      this.fileButton=$(this.opts.fileButton);
      this.previewMod=$(this.opts.previewMod);
      this.ImgSrcArr=this.opts.ImgSrcArr||[];
      this.blobArr=[];//formData *所需的对象集合
      this._add();
    },
    _add:function (callback) {
      var _this=this;
      this.fileButton.on("change",function (e) {
        var _files=e.target.files;
        //非预览模式则一次只能选择一张或者多张不累计
        if(!_this.opts.isPreview) {
          _this.blobArr = [];
          _this.ImgSrcArr = [];
        }

        if(_this.blobArr.length>=_this.opts.limitMax||_files.length>=_this.opts.limitMax){
          alert("最多一次上传"+_this.opts.limitMax+"张图片!");
        }else{
          //todo 多张图片的时候会回调执行多次
          for(var i=0;i<_files.length;i++){
            var _tmpI=i;
            var _tmpFile=_files[i];
            var supportedTypes = _this.opts.supportedTypes;
            if (_tmpFile && supportedTypes.indexOf(_tmpFile.type) >= 0) {
              //异步的读取存储在用户计算机上的文件(或者原始数据缓冲) window.URL.createObjectURL(_tmpFile)
              var reader = new FileReader();
              //获取图片大小
              var size = _tmpFile.size / 1024 > 1024 ? (~~(10 * _tmpFile.size / 1024 / 1024)) / 10 + "MB" : ~~(_tmpFile.size / 1024) + "KB";

              console.log("==size==",size);

              reader.onload = function(e){
                var result = this.result;
                var img = new Image();
                img.src = result; //原始数据base64
                //console.log("===readerOnLoad===",result);
                //如果图片大小小于100kb，则直接上传
                if (result.length <= _this.opts.maxsize) {
                  img = null;
                  _this.blobArr.push(_this._baseStrBlob(result, _tmpFile.type));
                  console.log("++++++",_this.blobArr);
                  _this.ImgSrcArr.push(result);
                  if(_this.opts.isPreview){
                    _this._preview(_this.ImgSrcArr);
                  }else if(!_this.opts.isPreview && (_tmpI+1)==_this.blobArr.length){
                    _this.opts.addCallback.call(_this,_this.ImgSrcArr,_this.blobArr);
                  }
                }else{
                  //图片加载完毕之后进行压缩，然后上传
                  if (img.complete) {
                    readerCallback();
                  } else {
                    img.onload = readerCallback;
                  }

                }

                function readerCallback() {
                  var data = _this._compress(img);
                  _this.blobArr.push(_this._baseStrBlob(data, _tmpFile.type));
                  img = null;
                  console.log("+++readerCallback+++",_this.blobArr);
                  _this.ImgSrcArr.push(data);
                  if(_this.opts.isPreview) {
                    _this._preview(_this.ImgSrcArr);
                  }else if(!_this.opts.isPreview && (_tmpI+1)==_this.blobArr.length){
                    _this.opts.addCallback.call(_this,_this.ImgSrcArr,_this.blobArr);
                  }
                }

              };

              reader.readAsDataURL(_tmpFile);
            } else {
              alert('文件格式只支持：jpg、jpeg 和 png');
            }

          }

        }
        $(this).val("");
      })
    },
    _del:function () {
      var _this=this;
      _this.previewMod.find(".img-show").unbind().on("click",function () {
        var _num=$(this).data("index");
        _this.ImgSrcArr.splice(_num,1);
        _this.blobArr.splice(_num,1);
        //console.log("==del==",_num,_this.ImgSrcArr,_this.blobArr);
        $(this).remove();
      });
    },
    _preview:function (imgSrcArr) {
      var _this=this;
      _this.previewMod.children().not(".img-upload-add").remove();
      imgSrcArr.forEach(function (item,index) {
        _this.previewMod.find(".img-upload-add").before("<li class='img-show' data-index='"+index+"' style='background: url("+item+") no-repeat center center;background-size: cover;'><div class='mask'>删除</div></li>");
      });
      _this._del();
    },
    //图片上传，将base64的图片转成二进制对象
    _baseStrBlob:function (baseStr,fileType) {
      var text = window.atob(baseStr.split(",")[1]);
      var buffer = new Uint8Array(text.length);
      for (var i = 0; i < text.length; i++) {
        buffer[i] = text.charCodeAt(i);
      }
      return this.getBlob([buffer], fileType);
    },
    //canvas压缩图片
    _compress:function (img) {
      //用于压缩图片的canvas
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext('2d');
      //瓦片canvas
      var tCanvas = document.createElement("canvas");
      var tctx = tCanvas.getContext("2d");

      var initSize = img.src.length;
      var width = img.width;
      var height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      var ratio;
      if ((ratio = width * height / 4000000) > 1) {
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      //铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      var count;
      if ((count = width * height / 1000000) > 1) {
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
      //计算每块瓦片的宽和高
        var nw = ~~(width / count);
        var nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (var i = 0; i < count; i++) {
          for (var j = 0; j < count; j++) {
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      //进行最小压缩
      var ndata = canvas.toDataURL('image/jpeg', this.opts.quality);
      var initSizeStr = this._bytesToSize(initSize);
      var nDataStr= this._bytesToSize(ndata.length);
      console.log('压缩前：' + initSize,initSizeStr);
      console.log('压缩后：' + ndata.length,nDataStr);
      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    },
    //字节转换字符串
    _bytesToSize:function (bytes) {
      if (!bytes) return '0 B';
      // var k = 1024,
      //   sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      //   i = Math.floor(Math.log(bytes) / Math.log(k));
      //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
      return bytes / 1024 > 1024 ? (~~(10 * bytes / 1024 / 1024)) / 10 + "MB" : ~~(bytes / 1024) + "KB";
    },
    //formData 补丁, 给不支持formData上传blob的android机打补丁
    _formDataShim:function () {
      console.warn('using formdata shim');
      var o = this,
        parts = [],
        boundary = Array(21).join('-') + (+new Date() * (1e16 * Math.random())).toString(36),
        oldSend = XMLHttpRequest.prototype.send;
      this.append = function(name, value, filename) {
        parts.push('--' + boundary + '\r\nContent-Disposition: form-data; name="' + name + '"');
        if (value instanceof Blob) {
          parts.push('; filename="' + (filename || 'blob') + '"\r\nContent-Type: ' + value.type + '\r\n\r\n');
          parts.push(value);
        }
        else {
          parts.push('\r\n\r\n' + value);
        }
        parts.push('\r\n');
      };
      // Override XHR send()
      XMLHttpRequest.prototype.send = function(val) {
        var fr,
          data,
          oXHR = this;
        if (val === o) {
          // Append the final boundary string
          parts.push('--' + boundary + '--\r\n');
          // Create the blob
          data = getBlob(parts);
          // Set up and read the blob into an array to be sent
          fr = new FileReader();
          fr.onload = function() {
            oldSend.call(oXHR, fr.result);
          };
          fr.onerror = function(err) {
            throw err;
          };
          fr.readAsArrayBuffer(data);
          // Set the multipart content type and boudary
          this.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
          XMLHttpRequest.prototype.send = oldSend;
        }
        else {
          oldSend.call(this, val);
        }
      };
    },
    //获取blob对象的兼容性写法
    getBlob:function (buffer, format) {
      try {
        return new Blob(buffer, {type: format});
      } catch (e) {
        var bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder);
        buffer.forEach(function(buf) {
          bb.append(buf);
        });
        return bb.getBlob(format);
      }
    },
    //获取formData
    getFormData:function () {
      var isNeedShim = ~navigator.userAgent.indexOf('Android')
        && ~navigator.vendor.indexOf('Google')
        && !~navigator.userAgent.indexOf('Chrome')
        && navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534;
      return isNeedShim ? new this._formDataShim() : new FormData()
    }
  };

  $.PhotoUpload=PhotoUpload;
})(this,$);