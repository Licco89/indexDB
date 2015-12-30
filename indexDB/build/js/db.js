var DB_NAME = "t_demo"; //默认数据库
var DB_VERSION = "2"; //默认版本号
//初始化时新增的表
var TABLES = [{
    tableName: "demo_service",
    tableKey: {
        keyPath: 'id',
        autoIncrement: true
    }
},{
    tableName: "demo_order",
    tableKey: {
        keyPath: 'orderId',
        autoIncrement: true
    },
    indexList:[{
        name:"userId",
        element:"userId",
        unique:false
    }]
}, {
    tableName: "demo_user",
    tableKey: {
        keyPath: 'userId',
        autoIncrement: true
    },
    indexList:[{
        name:"name",
        element:"name",
        unique:false
    }]
}];

var INIT_SERVICE = [{
    "title": "APP的相关开发服务",
    "desc": "承接相关APP的开发，包括android及IOS系统，根据客户需求，出产品方案及流程图。"
}, {
    "title": "WEB页面开发服务",
    "desc": "常见的微官网页面开发，从设计到开发，前端呈现及后端后台搭建包括后期的页面运营维护都能给到全力支撑，并负责接入微信。"
}, {
    "title": "微信相关开发服务",
    "desc": "熟悉微信的众多接口，可以根据客户需求灵活的运用微信的功能提出解决方案，并开发实现，包括微信定位，微信摇一摇周边，微信红包配置，微信上墙，微信支付的配置，微信的语音系统，对微信的订阅号、服务号及企业号有比较高的熟悉度，并能配备相关技术开发，完成适合相关属性账号的开发。"
}, {
    "title": "软件系统的开发服务",
    "desc": "提供相关功能软件的开发服务，比如会员系统，定位系统，积分系统，CRM客户管理系统等，帮助用户解决相对性的需求。"
}, {
    "title": "商城的开发服务",
    "desc": "提供移动商城的相关开发服务，包括对接支付系统，对接积分商城，后期运营维护都有十分熟悉的经验。"
}, {
    "title": "网站的开发服务",
    "desc": "提供各种PC端网站页面的开发服务，电子商务网站的开发服务等，都具有丰富的经验。"
}, {
    "title": "技术咨询服务",
    "desc": "提供完善的技术咨询服务"
}];

var INIT_USER=[{
    "name":"admin",
    "password":"admin",
    "isAdmin":"1"
},{
    "name":"chemeng",
    "password":"chemeng",
    "isAdmin":"0"
},{
    "name":"李强",
    "password":"123456",
    "isAdmin":"0"
}];

/**
 * [openIndexedDB 打开数据库，当需要新增表或清除所有数据时传入后面的参数]
 * @param  {Function} callback  [打开成功后的回调]
 * @param  {[type]}   dbName    [数据库名称]
 * @param  {[type]}   dbVersion [数据库版本]
 * @param  {[type]}   tables    [需要新增/清除数据的表]
 * @return {[type]}             [description]
 */
function openIndexedDB(callback, dbName, dbVersion, tables) {
    dbName = dbName || DB_NAME; //数据库名称
    dbVersion = dbVersion || DB_VERSION; //数据库版本
    var db = {};
    tables = tables || TABLES;
    tables = $.isArray(tables) ? tables : [tables];

    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;

    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {
        READ_WRITE: "readwrite"
    }; // This line should only be needed if it is needed to support the object's constants for older browsers
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    if (!window.indexedDB) {
        window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
    }

    var request = indexedDB.open(dbName, dbVersion);

    //版本号变更后出发该事件
    request.onupgradeneeded = function(e) {
            var curDB = e.currentTarget.result;
            for (var j = 0; j < tables.length; j++) {
                var tablename = tables[j].tableName;
                var tableKey = tables[j].tableKey;
                var indexList = tables[j].indexList;

                if (curDB.objectStoreNames.contains(tablename)) {
                    curDB.deleteObjectStore(tablename);
                }
                var store = curDB.createObjectStore(tablename, tableKey);
                if (indexList && indexList.length > 0) {
                    for (var i = 0; i < indexList.length; i++) {
                        store.createIndex(indexList[i].name, indexList[i].element, {
                            unique: indexList[i].unique
                        });
                    }
                }

                if (tablename == "demo_service") {
                    $.each(INIT_SERVICE, function(k, v) {
                        store.add(v);
                    });
                }
                if (tablename == "demo_user") {
                    $.each(INIT_USER, function(k, v) {
                        store.add(v);
                    });
                }
            }

        };
        //数据库打开成功
    request.onsuccess = function(e) {
        db = e.target.result;
        callback(db);
    };
    request.onerror = function(e) {
        console.log("error:", e.srcElement.error.message);
    };

}
