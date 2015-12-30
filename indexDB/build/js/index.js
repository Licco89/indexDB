Zepto(function($) {
    //自动分页滑动
    var mySwiper = new Swiper('.swiper-container', {
        autoplay: 5000, //可选选项，自动滑动
        direction: "vertical",
        height: $(window).height()
    });

    //获取登陆用户信息
    var userInfo = getLoginUserInfo();

    //打开数据库
    var db = {};
    openIndexedDB(function(resp) {
        db = resp;
        init();
    });

    //订购服务，如果用户已登录则直接跳转到订购页，否则跳到登陆页
    $(".service .btn").tap(function(e) {
        var serviceId = $(this).attr("service_id");
        var url = "order.html?serviceId=" + serviceId;
        if (userInfo) {
            location.href = url;
        } else {
            location.href = "login.html?nextUrl="+encodeURIComponent(url);
        }
    });

    //查看我的资料
    $("#myProfile").tap(function(e) {
        if (userInfo) {
            location.href = "myProfile.html";
        } else {
            location.href = "login.html";
        }
    });

    /**
     * [init 查询所有服务项]
     * @return {[type]} [description]
     */
    function init() {
        var trans = db.transaction("demo_service", "readwrite");
        var store = trans.objectStore("demo_service");
        var keyRange = IDBKeyRange.lowerBound(0);
        var cursorRequest = store.openCursor(keyRange);
        var services = [];
        cursorRequest.onsuccess = function(e) {
            var result = e.target.result;
            if (!result) {
                $(".service").each(function(k, v) {
                    $(v).children('.h3').text(services[k].title);
                    $(v).children('.text').text(services[k].desc);
                    $(v).children('.btn').attr("service_id", services[k].id);
                });
                return;
            }
            services.push(result.value);
            result.continue();
        };
    }
});
