Zepto(function($) {
    var userInfo = getLoginUserInfo();
    if (!userInfo) {
        location.href = "login.html";
        return;
    }
    var orderNum = 0;
    //打开数据库
    var db = {};
    openIndexedDB(function(resp) {
        db = resp;
        getmyOrder();
    });


    $(".my_top .my_name").text(userInfo.name);
    $("#loginOut").tap(function() {
        localStorage.removeItem("userInfo");
        window.location.href = "index.html";
    });
    $("#showOrder").tap(function(){
        window.location.href = "myOrders.html";
    });



    /**
     * [getmyOrder 从数据库中查询用户的订单]
     * @return {[type]} [description]
     */
    function getmyOrder() {
        var trans = db.transaction("demo_order", "readwrite");
        var store = trans.objectStore("demo_order");
        var queryIndex = store.index("userId");
        queryIndex.openCursor().onsuccess = function(e) {
            var cursor = event.target.result;
            if (!cursor) {
                $(".my_l_num").text(orderNum);
                return;
            }
            if (cursor.key == userInfo.userId) {
                orderNum++;
            }
            cursor.continue();
        };
    }
});
