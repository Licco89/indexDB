Zepto(function($) {
    //获取登陆用户信息
    var userInfo = getLoginUserInfo();
    var serviceInfo = "";
    var orderInfo = {};
    if (!userInfo) {
        window.location.href = "login.html";
        return;
    }
    var sId = parseInt(getUrlParam("serviceId"));
    //打开数据库
    var db = {};
    openIndexedDB(function(resp) {
        db = resp;
        init();
    });

    var nameObj = {
        _el: $("#name"),
        validate: function() {
            var value = this.val();
            if (!value) {
                showError(this._el,"姓名不能为空！");
                return false;
            }
            return true;
        },
        val: function(e) {
            return e ? this._el.val(e) : this._el.val();
        }
    };
    var phoneObj = {
        _el: $("#phone"),
        validate: function() {
            var value = this.val();
            if (!value) {
                showError(this._el,"手机号不能为空！");
                return false;
            }
            if (!/1[3|4|5|7|8][0-9](\d|\*){4}\d{4}/.test(this._el.val())) {
                showError(this._el,"手机号格式不正确！");
                return false;
            }
            return true;
        },
        val: function(e) {
            return e ? this._el.val(e) : this._el.val();
        }
    };

    //保存修改
    $("#save").tap(function() {
        saveOrder();
    });

    //返回首页
    $("#back_index").tap(function() {
        window.location.href = "index.html";
    });
    //查看订单
    $("#check_order").tap(function() {
        window.location.href = "myOrders.html";
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
                $(".f_title003").text(serviceInfo.title);
                $(".f_title004").text(serviceInfo.desc);
            }
        };
    }

    function saveOrder() {
        if (nameObj.validate() && phoneObj.validate()) {
            orderInfo.createTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
            orderInfo.service = serviceInfo;
            orderInfo.userId = userInfo.userId;
            orderInfo.name = nameObj.val();
            orderInfo.phone  = phoneObj.val();
            var trans = db.transaction("demo_order", "readwrite");
            var store = trans.objectStore("demo_order");
            store.put(orderInfo).onsuccess = function() {
                $("#order").hide();
                $("#success").show();
                $("#service_title").text(serviceInfo.title);
                $("#service_desc").text(serviceInfo.desc);
            };
        }
    }
});
