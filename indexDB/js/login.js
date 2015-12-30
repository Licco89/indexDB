Zepto(function($) {
    var db = {};
    var localStorage = window.localStorage;
    var nextUrl = ""; //登录成功后需要跳转的页面
    var nameObj = {
        _el: $("#name"),
        validate: function() {
            var value = this.val();
            if (!value) {
                showError(this._el, "请输入用户名！");
                return false;
            }
            return true;
        },
        val: function() {
            return this._el.val();
        }
    };
    var passwordObj = {
        _el: $("#password"),
        validate: function() {
            var value = this.val();
            if (!value) {
                showError(this._el, "请输入密码！");
                return false;
            }
            return true;
        },
        val: function() {
            return this._el.val();
        }
    };
    //账号角色，隐藏在界面中
    var rool = $("#rool").val();
    if (rool == "1") {
        nextUrl = "admin.html"
        if (getLoginStaffInfo()) {
            window.location.href = "admin.html";
        }
    } else {
        nextUrl = getUrlParam("nextUrl") || "myProfile.html";
        if (getLoginUserInfo()) {
            //如果已经登录哦则直接跳转到index.html
            window.location.href = "index.html";
        }
    }

    //打开数据库
    openIndexedDB(function(resp) {
        db = resp;
    });

    $("#addUser").tap(function() {
        register(rool);
    });

    $(".loginBtn").tap(function() {
        login(rool);
    });

    /**
     * [findUser 根据用户名查找数据]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function findUser(callback) {
        var trans = db.transaction("demo_user", "readwrite");
        var store = trans.objectStore("demo_user");
        var nameIndex = store.index("name");
        nameIndex.openCursor().onsuccess = function(e) {
            callback(e);
        };
    }

    /**
     * [login 根据账号角色登陆]
     * @param  {[type]} rool [账号角色 0：个人用户；1：管理用户]
     * @return {[type]}      [description]
     */
    function login(rool) {
        if (nameObj.validate() && passwordObj.validate()) {
            findUser(function(e) {
                var cursor = e.target.result;
                if (cursor) {
                    if (cursor.key == nameObj.val() && cursor.value.isAdmin == rool) {
                        if (cursor.value.password == passwordObj.val()) {
                            var user = {
                                name: cursor.key,
                                userId: cursor.value.userId,
                                isAdmin: cursor.value.isAdmin
                            };
                            var key = rool == "0" ? "userInfo" : "staffInfo";
                            localStorage.setItem(key, JSON.stringify(user));
                            window.location.href = nextUrl;
                            return;
                        } else {
                            showError(passwordObj._el, "密码错误！");
                            return;
                        }
                    }
                } else {
                    showError(nameObj._el, "用户名不存在！");
                    return;
                }
                cursor.continue();
            });
        }
    }

    /**
     * [register 注册用户]
     * @param  {[type]} rool [账号角色 0：个人用户；1：管理用户]
     * @return {[type]}      [description]
     */
    function register(rool) {
        if (nameObj.validate() && passwordObj.validate()) {
            findUser(function(e) {
                var cursor = e.target.result;
                if (cursor) {
                    if (cursor.key == nameObj.val() && cursor.value.isAdmin == rool) {
                        showError(nameObj._el, "该用户已存在!");
                        return;
                    }
                } else {
                    var trans = db.transaction("demo_user", "readwrite");
                    var store = trans.objectStore("demo_user");
                    store.add({
                        "name": nameObj.val(),
                        "password": passwordObj.val(),
                        "isAdmin": rool
                    });
                    return;
                }
                cursor.continue();
            });
        }
    }
});
