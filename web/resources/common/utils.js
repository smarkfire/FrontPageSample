/**
 * Created by Administrator on 2017/7/7.
 */
MyApp = {};
MyApp.getContext = function() {
    var base = document.getElementsByTagName('base')[0];
    if (base && base.href && (base.href.length > 0)) {
        base = base.href;
    } else {
        base = document.URL;
    }
    var count = base.indexOf("/", base.indexOf("//") + 2) + 1;
    var base_1 = base.substr(count);
    var count_1 = base_1.indexOf("/");
    return "/"+base_1.substr(0, count_1);
};
var appMsg = {
    CANCEL_OK:'撤销成功！',
    GETBACK_OK:'撤回成功！',
    CANCEL_ERROR:'撤销失败！',
    GETBACK_ERROR:'撤回失败!',
    SAVE_OK:'保存成功！',
    DELETE_OK:'删除成功！',
    SAVE_ERROR:'保存失败！',
    DELETE_ERROR:'删除失败！',
    SEARCH_OK:'查询成功！',
    SEARCH_ERROR:'查询失败！',
    COMMITE_OK:'提交成功！',
    COMMITE_ERROR:'提交失败！',
    EXCEPTION:'系统异常，请联系管理员！'
}

function parse_url() {
    var url = location.href;
    var pattern = /(\w+)=(\w+)/ig;// 定义正则表达式
    var parames = {};// 定义数组
    url.replace(pattern, function(a, b, c) {
        parames[b] = c;
    });
    return parames;
};