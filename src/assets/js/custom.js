define(function(){
   var _ip = 'http://10.0.0.218:81'

   Date.prototype.format = function (format) {
       var o = {
           "M+": this.getMonth() + 1,  //month 
           "d+": this.getDate(),     //day 
           "h+": this.getHours(),    //hour 
           "m+": this.getMinutes(),  //minute 
           "s+": this.getSeconds(), //second 
           "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter 
           "S": this.getMilliseconds() //millisecond 
       }
       if (/(y+)/.test(format)) {
           format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
       }
       for (var k in o) {
           if (new RegExp("(" + k + ")").test(format)) {
               format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
           }
       }
       return format;
   };
   var Common = {

       //EasyUI用DataGrid用日期格式化
       TimeFormatter: function (value, rec, index) {
           if (value == undefined) {
               return "";
           }
           /*json格式时间转js时间格式*/
           value = value.substr(1, value.length - 2);
           var obj = eval('(' + "{Date: new " + value + "}" + ')');
           var dateValue = obj["Date"];
           if (dateValue.getFullYear() < 1900) {
               return "";
           }
           var val = dateValue.format("yyyy-MM-dd hh:mm:ss");
           return val.substr(11, 5);
       },
       DateTimeFormatter: function (value, rec, index) {
           if (value == undefined) {
               return "";
           }
           /*json格式时间转js时间格式*/
           value = value.substr(1, value.length - 2);
           var obj = eval('(' + "{Date: new " + value + "}" + ')');
           var dateValue = obj["Date"];
           if (dateValue.getFullYear() < 1900) {
               return "";
           }
           return dateValue.format("yyyy-MM-dd hh:mm:ss");
       },

       //EasyUI用DataGrid用日期格式化
       DateFormatter: function (value, rec, index) {
           if (value == undefined) {
               return "";
           }
           /*json格式时间转js时间格式*/
           value = value.substr(1, value.length - 2);
           var obj = eval('(' + "{Date: new " + value + "}" + ')');
           var dateValue = obj["Date"];
           if (dateValue.getFullYear() < 1900) {
               return "";
           }

           return dateValue.format("yyyy-MM-dd");
       }
   };
   return {
      ajaxFn: function(url,opts){
         var _url = _ip + url,
            _method = opts.method || 'POST',
            _dataType = opts.dataType || 'json',
            _data = opts.data || null,
            _callback = opts.callback || new Function(),
            _errorCallback = opts.errorCallback || new Function();

         $.ajax({url: _url,
            method: _method,
            dataType: _dataType,
            data: _data,
            success: function(res){
               if (typeof(_callback) == "function" && typeof(res) != 'undefined') {
                  _callback(res);
               }
            },
            error: function(error){
               _errorCallback(error);
            }
         });
      },
      dateTimeFormatter: Common.DateTimeFormatter
   }
});