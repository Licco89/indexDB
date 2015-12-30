Zepto(function($) {
    var staffInfo = getLoginStaffInfo();
    if (!staffInfo) {
        location.href = "loginAdmin.html";
        return;
    }

    //打开数据库
    var db = {};
    openIndexedDB(function(resp) {
        db = resp;
        init();
    });
    $(".admin_tab").tap(function() {
        var type = $(this).attr("tab_type");
        $(this).addClass("t_btn_on").siblings().removeClass("t_btn_on");
        if (type == "2") {
            getOrders();
        } else {
            init();
        }
    });
    /**
     * [getOrders 从数据库中查询所有订单]
     * @return {[type]} [description]
     */
    function getOrders() {
        var trans = db.transaction("demo_order", "readwrite");
        var store = trans.objectStore("demo_order");
        var orders = [];
        store.openCursor().onsuccess = function(e) {
            var cursor = event.target.result;
            if (!cursor) {
                var container = $("#container");
                $("#container").empty();
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
            orders.push(cursor.value);
            cursor.continue();
        };
    }
    /**
     * [init 查询所有服务项]
     * @return {[type]} [description]
     */
    function init() {
        var trans = db.transaction("demo_service", "readwrite");
        var store = trans.objectStore("demo_service");
        var services = [];
        store.openCursor().onsuccess = function(e) {
            var cursor = e.target.result;
            if (!cursor) {
                var container = $("#container");
                $("#container").empty();
                $.each(services, function(k, v) {
                    var html = '<div class="e_list_item">' +
                        '<p class="e_title02">服务项目：' + v.title + '</p><a class="e_btn_02" ' +
                        'href="serviceEdit.html?serviceId=' + v.id + '">' +
                        '<img src="img/asdas.png" />编辑</a>' +
                        '<p class="e_text">服务内容：' + v.desc + '</p></div>';
                    container.append(html);
                });
                return;
            }
            services.push(cursor.value);
            cursor.continue();
        };
    }
});
