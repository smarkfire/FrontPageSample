/**
 * Created by Administrator on 2017/7/7.
 */

/**
 * 提示
 * @param field
 * @param t
 */
var meFieldTip = function (field, t) {
    Ext.QuickTips.init();
    Ext.QuickTips.register({
        target: field.el,
        text: field.getValue()
    })
};
var meUpdateTip = function(field){
    Ext.QuickTips.init();
    if(field.rendered){
        field.getEl().dom.setAttribute("ext:qtip", field.getValue());
    }
};
var checkSaveMsg = function(win,other){
    Ext.Msg.alert('提示', "保存失败，请检查输入项");
}
var quitWin = function(win,isView,other){
    if(!isView ){
        Ext.MessageBox.confirm('提示', '系统将退出当前页面，如果信息未保存将会丢失，是否退出？', function (button) {
            if (button == 'yes') {
                win.close();
            }
        });
    }
    else{
        win.close();
    }
}
/**
 * 将合并的单元格拆开，以便可以重新合并
 */
var clearMerge = function(grid,cols){
    var arrayTr=document.getElementById(grid.getId()+"-body").firstChild.firstChild.firstChild.getElementsByTagName('tr');
    var trCount = arrayTr.length;
    Ext.each(cols,function(colIndex){ //逐列去操作tr
        for(var i=1;i<trCount;i++){  //i=0表示表头等没用的行
            var arrayTd = arrayTr[i].getElementsByTagName("td"); //合并行
            var td = arrayTd[colIndex - 1];
            td.rowSpan = 1;
            td.style.display = '';
        }
    });
};


/**
 * Kunoy
 * 合并单元格
 * @param {} grid  要合并单元格的grid对象
 * @param {} cols  要合并哪几列 [1,2,4]
 */
var mergeCells = function(grid,cols){
    var arrayTr=document.getElementById(grid.getId()+"-body").firstChild.firstChild.firstChild.getElementsByTagName('tr');
    var trCount = arrayTr.length;
    var arrayTd;
    var td;
    var merge = function(rowspanObj,removeObjs){ //定义合并函数
        if(rowspanObj.rowspan != 1){
            arrayTd =arrayTr[rowspanObj.tr].getElementsByTagName("td"); //合并行
            td=arrayTd[rowspanObj.td-1];
            td.rowSpan=rowspanObj.rowspan;
            td.vAlign="middle";
            Ext.each(removeObjs,function(obj){ //隐身被合并的单元格
                arrayTd =arrayTr[obj.tr].getElementsByTagName("td");
                arrayTd[obj.td-1].style.display='none';
            });
        }
    };
    var rowspanObj = {}; //要进行跨列操作的td对象{tr:1,td:2,rowspan:5}
    var removeObjs = []; //要进行删除的td对象[{tr:2,td:2},{tr:3,td:2}]
    var col;
    Ext.each(cols,function(colIndex){ //逐列去操作tr
        var rowspan = 1;
        var divHtml = null;//单元格内的数值
        for(var i=1;i<trCount;i++){  //i=0表示表头等没用的行
            arrayTd = arrayTr[i].getElementsByTagName("td");
            var cold=0;
//          Ext.each(arrayTd,function(Td){ //获取RowNumber列和check列
//              if(Td.getAttribute("class").indexOf("x-grid-cell-special") != -1)
//                  cold++;
//          });
            col=colIndex+cold;//跳过RowNumber列和check列
            if(!divHtml){
                divHtml = arrayTd[col-1].innerHTML;
                rowspanObj = {tr:i,td:col,rowspan:rowspan}
            }else{
                var cellText = arrayTd[col-1].innerHTML;
                var addf=function(){
                    rowspanObj["rowspan"] = rowspanObj["rowspan"]+1;
                    removeObjs.push({tr:i,td:col});
                    if(i==trCount-1)
                        merge(rowspanObj,removeObjs);//执行合并函数
                };
                var mergef=function(){
                    merge(rowspanObj,removeObjs);//执行合并函数
                    divHtml = cellText;
                    rowspanObj = {tr:i,td:col,rowspan:rowspan}
                    removeObjs = [];
                };
                if(cellText == divHtml){
                    if(colIndex!=cols[0]){
                        var leftDisplay=arrayTd[col-2].style.display;//判断左边单元格值是否已display
                        if(leftDisplay=='none')
                            addf();
                        else
                            mergef();
                    }else
                        addf();
                }else
                    mergef();
            }
        }
    });
};