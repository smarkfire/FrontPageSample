// 此文件定义了字典下拉框

//是否停用
var isStopStore = Ext.create('Ext.data.Store',{
    fields:[{name:"name",type:"string"},
        {name:"id",type:'string'}],
    data:[
        {name:'否',id:'0'},
        {name:'是',id:'1'}
    ]
}) ;
 //逻辑类型 todo
var logicTypeStore = Ext.create('Ext.data.Store',{
    fields:[{name:"name",type:"string"},
        {name:"id",type:'string'}],
    data:[
        {name:'默认',id:'1'},
        {name:'计算',id:'2'},
        {name:'支架',id:'3'},
        {name:'物资',id:'4'}
    ]
}) ;