Zepto(function($) {
    $(".page").height($(window).height());
    var db = {};
    openIndexedDB(function(resp) {
        db = resp;
        init();
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
                $(".service").each(function(k,v){
                    console.log(v);
                });
                return;
            }
            services.put(result.value);
            result.continue();
        };
    }
});
