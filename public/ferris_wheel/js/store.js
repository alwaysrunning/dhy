/**
 * Created by 沐沐 on 2015-12-18.
 */

var App = {
    //本地存储
    store: function () {

        function _localStorage(){
            this.s=window.localStorage;
            return this;
        }

        _localStorage.prototype= {
            init:function(options){
                this.options = {
                    expires: 200*60*60000,//60000毫秒1分钟 2*60*60000 默认2小时
                    domain:window.location.host,
                    path:"/",
                    secure:"",
                    val:""
                };
                for(var x in options){
                    this.options[x]=options[x];
                }
            },
            check:function(key){
                var _date = new Date(),currentTime=_date.getTime();
                var _val=this.get(key);
                if(_val && currentTime>_val.expires){
                    return {"expire":true};//过期
                }else if(_val && currentTime<=_val.expires){
                    return {"expire":false};//未过期
                }else{
                    return {"expire":null};//值不存在
                }
            },
            set: function (key, val,_options) {
                this.init(_options);
                var date = new Date();
                this.options.expires=date.getTime() +this.options.expires;
                this.options.val=val;
                this.s.setItem(key, JSON.stringify(this.options));
                return this.options;
            },
            get:function(key){
                var _date = new Date(),currentTime=_date.getTime();
                var _value = this.s.getItem(key);
                if (typeof _value != 'string') { return undefined }
                var _val=JSON.parse(_value);
                if(_val && currentTime>_val.expires){
                    //console.log("过期");
                    this.remove(key);
                    return undefined;
                }else{
                    //console.log("未过期");
                    return _val;
                }
            },
            getAll: function() {
                var ret = {};
                for (var i=0; i<this.s.length; i++) {
                    var key = this.s.key(i);
                    ret[key] = this.get(key);
                }
                return ret;
            },
            remove: function(key) {
                this.s.removeItem(key);
            },
            clear: function() {
                this.s.clear();
            }
        };

        function _cookieStore(options){
            this.s=window.document.cookie;
        }
        _cookieStore.prototype={
            init:function(options){
                this.options = {
                    expires: 2*60*60000,//60000毫秒1分钟  默认2小时
                    domain:window.location.host,
                    path:"/",
                    secure:"",
                    val:""
                };
                for(var x in options){
                    this.options[x]=options[x];
                }
            },
            check:function(key){
                var _date = new Date(),currentTime=_date.getTime();
                var _val=this.get(key);
                if(_val && currentTime>_val.expires){
                    return {"expire":true};
                }else{
                    return {"expire":false};
                }
            },
            set: function (name, value,_options) {
                this.init(_options);
                var date = new Date();
                this.options.expires=date.getTime() +this.options.expires;
                this.options.val=value;
                var valueToUse="",
                    expires=this.options.expires,
                    path=this.options.path,
                    secure=this.options.secure;

                if(this.options.val !== undefined && typeof(this.options.val) === "object"){
                    valueToUse = JSON.stringify(this.options)
                }else{
                    valueToUse = encodeURIComponent(this.options)
                }
                this.s = name + "=" + valueToUse +(expires ? ("; expires=" + new Date(expires).toUTCString()) : '') +
                    "; path=" + (path || '/') +(secure ? "; secure" : '');
            },
            get: function (name) {
                var _date = new Date(),currentTime=_date.getTime();
                var cookies = this.getAllRawOrProcessed(false);
                if (cookies.hasOwnProperty(name)){
                    var _val=this.processValue(cookies[name]);
                    if(_val && currentTime>_val.expires){
                        console.log("过期");
                        this.remove(name);
                        return undefined;
                    }else{
                        console.log("未过期");
                        return _val;
                    }
                }else{
                    return undefined;
                }
                //if (cookies.hasOwnProperty(name)) return this.processValue(cookies[name]);
                //else return undefined;
            },
            processValue: function(value) {
                if (value.substring(0, 1) == "{") {
                    try { return JSON.parse(value);}
                    catch(e) {return value;}
                }
                if (value == "undefined") return undefined;
                return decodeURIComponent(value);
            },
            getAllRawOrProcessed: function(process) {
                //process - process value or return raw value
                var cookies = document.cookie.split('; '), s = {};
                if (cookies.length === 1 && cookies[0] === '') return s;
                for (var i = 0 ; i < cookies.length; i++) {
                    var cookie = cookies[i].split('=');
                    if (process) s[cookie[0]] = this.processValue(cookie[1]);
                    else s[cookie[0]] = cookie[1];
                }
                return s;
            },
            getAll: function() {
                return this.getAllRawOrProcessed(true);
            },
            remove: function (name) {
                this.set(name, "", -1);
            },
            clear: function() {
                var cookies = this.getAll();
                for (var i in cookies) {
                    this.remove(i);
                }
                return this.getAll();
            }
        };

        if(typeof window.localStorage == 'undefined'){
            return new _cookieStore();
        }else{
            return new _localStorage();
        }
    }
};