Zepto(function($) {
    var userInfo = getLoginUserInfo();
    if (!userInfo) {
        location.href = "login.html";
        return;
    }
    var orders = [];
    //打开数据库
    var db = {};
    openIndexedDB(function(resp) {
        db = resp;
        getmyOrder();
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
                var container = $(".my>div");
                $.each(orders, function(k, v) {
                    var html = ' <div class="e_list_item">' +
                        '<p class="e_title02">' + v.service.title + '</p>' +
                        '<div class="e_list_t_b">' +
                        '<span class="e_i"><img class="img001" src="img/8sd.png">' + v.orderId + '</span>' +
                        '<span class="e_i"><img class="img002" src="img/asa.png">' + v.createTime + '</span>' +
                        '<span class="e_i"><img  class="img003" src="img/9qq.png">' + v.name + '</span>' +
                        '<span class="e_i"><img  class="img004" src="img/sjj.png">' + v.phone + '</span></div></div>';
                    container.append(html);
                })
                return;
            }
            if (cursor.key == userInfo.userId) {
                orders.push(cursor.value);
            }
            cursor.continue();
        };
    }
});
