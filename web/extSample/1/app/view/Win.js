
Ext.define('Example.view.Win', {
    alias: 'widget.mywin',
    extend: 'Ext.window.Window',
    itemId: 'mywinId',
    title: '新增'+bizname,
    width: '70%',
    height: '80%',
    layout: 'fit',
    autoShow: true,
    reflashgrid: null,//who open me
    border: false,
    autoScroll: true,
    maximized: false,
    maximizable: true,
    modal: true,
    initComponent: function () {

        var me = this;
        if (!me.isView) {

            me.isView = false;
        }
        me.items = [
            {
                xtype: 'panel',
                autoScroll: true,
                margin: '0 0 0 0',
                header: false,
                border: 0,
                layout: {
                    align: 'stretch',
                    type: 'vbox'
                },
                items: me.setWinItems()
            }
        ];
        me.buttons = [
            {
                text   : '保存',
                handler: function() {
                    me.saveBtnClick(this);
                }
            }
        ],
        me.callParent(arguments);
    },


    listeners: {
        'show': function (win) {
             if (typeof(win.entityid) != 'undefined') {
                var form = win.down('form').getForm();
                Ext.Ajax.request({
                    url: Ext.getContext() + '/sdata/form.json',
                    type: 'GET',
                    async: false,
                    params: {id: win.entityid},
                    scope: this,
                    success: function (response, opts) {
                        var result = Ext.decode(response.responseText);
                        result.getData=function(){
                            return result.data;
                        };
                        form.loadRecord(result);
                    },
                    failure: function (response, opts) {
                        Ext.Msg.alert('提示', appMsg.EXCEPTION);
                     }
                });
            }
        }
    },
    //窗体里的表格或其他
    setWinItems: function () {
        var me = this;
        var form = Ext.create('Example.view.Form', {isView: me.isView});
        return [form];
    },

    /**
     * 保存按钮点击
     */
    saveBtnClick:function(){
        var me = this;
        var form = me.down('form');

        if(!form.getForm().isValid()){
            return;
        }
        //todo if条件里面需要测试是否正确
        var values = form.getForm().getValues();
        var saveUrl,modifyUrl;
        if(values.id===''){
            me.saveToDB(true,me,saveUrl,values,false);
        }else {
            me.saveToDB(true,me,modifyUrl,values,false);
        }

    },

    saveToDB:function(async,win, url,params, showMsg){
        var me = this;
        var loadMask = new Ext.LoadMask(win, {msg: '请稍候...'});
        loadMask.show();
         Ext.Ajax.request({
            url: url,
            type: 'POST',
            async:async,
            jsonData: params,
            scope: this,
            success: function (response, opts) {
                loadMask.hide();
                result = Ext.decode(response.responseText);
                if (result.success) {
                    me.reflashgrid.getStore().reload();//刷新列表
                    me.close();//关闭窗口
                    if(showMsg) {
                        Ext.Msg.alert('提示', appMsg.SAVE_OK);
                    }
                } else {
                    Ext.Msg.alert('提示', result.message);
                }
            },
            failure: function (response, opts) {
                loadMask.hide();
                Ext.Msg.alert('提示', appMsg.EXCEPTION);
            }
        });
    }
});