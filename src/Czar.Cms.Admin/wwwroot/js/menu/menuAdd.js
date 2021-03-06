
layui.config({
    base: "/js/"
}).extend({
    "authtree": "authtree"
});
layui.use(['form', 'layer', 'authtree'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery, authtree = layui.authtree;
    form.on("submit(addMenu)", function (data) {
        //获取防伪标记
        $.ajax({
            type: 'POST',
            url: '/Menu/AddOrModify/',
            data: {
                Id: $("#Id").val(),  //主键
                Name: $(".Name").val(),
                DisplayName: $(".DisplayName").val(),
                IconUrl: $(".IconUrl").val(),
                LinkUrl: $(".LinkUrl").val(),
                Sort: $(".Sort").val(),
                ParentId: $(".ParentId").val(),
                IsSystem: $("input[name='IsSystem']:checked").val() === "0" ? false : true,
                IsDisplay: $("input[name='IsDisplay']:checked").val() === "0" ? false : true
            },
            dataType: "json",
            headers: {
                "X-CSRF-TOKEN-yilezhu": $("input[name='AntiforgeryKey_yilezhu']").val()
            },
            success: function (res) {//res为相应体,function为回调函数
                if (res.ResultCode === 0) {
                    var alertIndex = layer.alert(res.ResultMsg, { icon: 1 }, function () {
                        layer.closeAll("iframe");
                        //刷新父页面
                        parent.location.reload();
                        top.layer.close(alertIndex);
                    });
                    //$("#res").click();//调用重置按钮将表单数据清空
                } else if (res.ResultCode === 102) {
                    layer.alert(res.ResultMsg, { icon: 5 }, function () {
                        layer.closeAll("iframe");
                        //刷新父页面
                        parent.location.reload();
                        top.layer.close(alertIndex);
                    });
                }
                else {
                    layer.alert(res.ResultMsg, { icon: 5 });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                layer.alert('操作失败！！！' + XMLHttpRequest.status + "|" + XMLHttpRequest.readyState + "|" + textStatus, { icon: 5 });
            }
        });
        return false;
    });
    form.verify({
        userName: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '菜单别名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '菜单别名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '菜单别名不能全为数字';
            }
            var msg;
            $.ajax({
                url: "/Menu/IsExistsName/",
                async: false,
                data: {
                    Name: value,
                    Id: $("#Id").val()
                },
                dataType: 'json',
                success: function (res) {
                    if (res.Data === true) {
                        msg= "系统已存在相同的别名的菜单，请修改后再进行操作";
                    }
                },
                error: function (xml, errstr, err) {
                    msg= "系统异常，请稍候再试";
                }
            });
            if (msg) {
                return msg;
            }
        }
    });      
});