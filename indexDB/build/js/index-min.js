Zepto(function(e){function t(){var t=i.transaction("demo_service","readwrite"),n=t.objectStore("demo_service"),o=IDBKeyRange.lowerBound(0),r=n.openCursor(o),c=[];r.onsuccess=function(t){var n=t.target.result;return n?(c.push(n.value),void n["continue"]()):void e(".service").each(function(t,n){e(n).children(".h3").text(c[t].title),e(n).children(".text").text(c[t].desc),e(n).children(".btn").attr("service_id",c[t].id)})}}var n=(new Swiper(".swiper-container",{autoplay:5e3,direction:"vertical",height:e(window).height()}),getLoginUserInfo()),i={};openIndexedDB(function(e){i=e,t()}),e(".service .btn").tap(function(t){var i=e(this).attr("service_id"),o="order.html?serviceId="+i;n?location.href=o:location.href="login.html?nextUrl="+encodeURIComponent(o)}),e("#myProfile").tap(function(e){n?location.href="myProfile.html":location.href="login.html"})});