Zepto(function($) {
    //获取登陆用户信息
    var staffInfo = getLoginStaffInfo();
    var serviceInfo = "";
    if (!staffInfo) {
        window.location.href = "loginAdmin.html";
        return;
    }
    var sId = parseInt(getUrlParam("serviceId"));
    //打开数据库
    var db = {};
    openIndexedDB(function(resp) {
        db = resp;
        init();
    });

    var titleObj = {
        _el: $("#service_title"),
        validate: function() {
            var value = this.val();
            if (!value) {
                showError(this._el,"标题不能为空！");
                return false;
            }
            return true;
        },
        val: function(e) {
            return e ? this._el.val(e) : this._el.val();
        }
    };
    var descObj = {
        _el: $("#service_desc"),
        validate: function() {
            var value = this.val();
            if (!value) {
                showError(this._el,"内容不能为空！");
                return false;
            }
            return true;
        },
        val: function(e) {
            return e ? this._el.val(e) : this._el.val();
        }
    };

    //保存修改
    $("#save").tap(function(){
    	save();
    });

    //取消修改
    $("#cancel").tap(function(){
    	window.location.href="serviceList.html";
    });

    /**
     * [init 根据服务Id查询服务项]
     * @return {[type]} [description]
     */
    function init() {
        var trans = db.transaction("demo_service", "readwrite");
        var store = trans.objectStore("demo_service");
        store.get(sId).onsuccess = function(e) {
            serviceInfo = e.target.result;
            if (serviceInfo) {
                titleObj.val(serviceInfo.title);
                descObj.val(serviceInfo.desc);
            }
        };
    }

    function save() {
        if (descObj.validate() && titleObj.validate()) {
            var trans = db.transaction("demo_service", "readwrite");
            var store = trans.objectStore("demo_service");
            serviceInfo.title = titleObj.val();
            serviceInfo.desc = descObj.val();
            store.put(serviceInfo).onsuccess=function(){
            	window.location.href="admin.html";
            };
        }
    }
});
