/**
 * Created by Administrator on 2017/7/7.
 */

//右键
document.oncontextmenu=function(){
    return false;
}
//禁用F5，backspace，一级alert 方向左右键，Ctrl+R
document.onkeydown = function (e) {
    if ((window.event.altKey)&&
        ((window.event.keyCode==37)|| //屏蔽 Alt+ 方向键 ←
        (window.event.keyCode==39))){ //屏蔽 Alt+ 方向键 →
        alert("不准你使用ALT+方向键前进或后退网页！");
        event.returnvalue=false;
    }

    if ((event.keyCode == 8) &&
        (event.srcElement.type != "text" &&
        event.srcElement.type != "textarea" &&
        event.srcElement.type != "password") || //屏蔽退格删除键
        (event.keyCode ==116)|| //屏蔽 F5 刷新键
        (event.ctrlKey && event.keyCode==82)){ //Ctrl + R
        event.keyCode=0;
        event.returnvalue=false;
        return  false;
    }
}
