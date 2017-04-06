define(function(){
   var _ip = 'http://10.0.0.218:81' //localhost10.0.0.218:81

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

   /*var editors = {
      /*
       * @createEditor 初始化编辑器
       */
      /*createEditor: function(sel){
         var editorToolbar = [[
            'emotion', //表情
            'fontfamily', //字体
            'fontsize', //字号
            'forecolor', //字体颜色
            'backcolor', //背景色
            '|',
            'bold', //加粗
            'italic', //斜体
            '|',
            'underline', //下划线
            'strikethrough', //删除线
            '|',
            'fontborder', //字符边框
            '|',
            'subscript', //下标
            'superscript', //上标
            '|',
            'formatmatch', //格式刷
            '|',
            'insertorderedlist', //有序列表
            'insertunorderedlist', //无序列表
            'justifyleft', //居左对齐
            'justifyright', //居右对齐
            'justifycenter', //居中对齐
            'justifyjustify', //两端对齐
            'insertimage',
            'simpleupload',
            '|',
            'source', //源代码
         ]];
         return UE.getEditor(sel, {
            'lang': 'en',
            'toolbars': editorToolbar,
            'initialFrameWidth':"100%",
            'elementPathEnabled': false,
            'autoHeightEnabled':false,
            'initialFrameHeight': 200
         });
      }
   };*/

   return {
      ip: _ip,
      ajaxFn: function(url,opts){
         var _url = _ip + url,
            _method = opts.method || 'POST',
            _dataType = opts.dataType || 'json',
            _data = opts.data || null,
            _callback = opts.callback || new Function(),
            _errorCallback = opts.errorCallback || new Function(),
            vm = opts.vm;

         $.ajax({url: _url,
            method: _method,
            dataType: _dataType,
            data: _data,
            xhrFields: {withCredentials: true},
            crossDomain: true,
            success: function(res){
               if(!res.IsSuccess){
                  if(-9997==res.Code){
                     if(vm){
                        vm.$router.push({name: 'login'});
                     }
                  }
               }
               if (typeof(_callback) == "function" && typeof(res) != 'undefined') {
                  _callback(res);
               }
            },
            error: function(error){
               _errorCallback(error);
            }
         });
      },
      ajaxUpload: function(that,opts){
         var url = opts.url || 'http://10.0.0.218:5758/File/upload/Currency?action=uploadimage',
            _callback = opts.callback || new Function();
         
         that.ajaxSubmit({
            url: url,
            type: 'POST',
            success: function(res){
               if (typeof(_callback) == "function" && typeof(res) != 'undefined') {
                  _callback(res);
               }
            }
         });
      },
      dateTimeFormatter: Common.DateTimeFormatter,
      dateFormatter: Common.DateFormatter,
      isSelected: function(opts){
         if(opts.index == -1){
            $.gritter.add({
               title: opts.title,
               text: opts.txt,
               sticky: false,
               time: 5000,
               class_name: 'my-sticky'
            });
            return false;
         }else{
            return true;
         }
      },
      selectItem: function(sel,index,fnc){
         $(sel).on('click',function(e){
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();
 
            var $tr = $(e.target).closest('tbody>tr'),
               $tbody = $(e.target).closest('tbody'),
               $trs = $(e.target).closest('tbody').find('tr'),
               _id = $tr.attr('data-id');
            if($tbody.length > 0){
               if($tr.hasClass('warning')){
                  index = -1;
                  $trs.removeClass('warning');
               }else{
                  index = _id;
                  $tr.addClass('warning').siblings('tr').removeClass('warning');
               }
               if(typeof(fnc) == "function"){
                 fnc(index);
               }
            }
         });
      },
      // 重置form表单
      resetForms: function(that){
         that.each(function(){
            $(this)[0].reset();
         });
      },
      //initEditor: editors.createEditor
   }
});