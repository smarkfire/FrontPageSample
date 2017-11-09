

Ext.define('Example.view.Form', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.winform',
    layout: 'fit',
    border: false,
    autoScroll: true,
    meDefaultColumnWidth: 0.5,
    initComponent: function () {

        var me = this;
        if (!me.isView) {
            me.isView = false;
        }
        me.items = [

            {
                xtype: 'form',
                baseCls: 'x-plain',
                defaults: {
                    labelAlign: 'right',
                    border: false,
                    columnWidth: me.meDefaultColumnWidth,
                    margin: '10 10 10 10'
                },
                layout: {
                    type: 'column'
                },
                items: me.setFormItems()
            }
        ];

        me.callParent(arguments);
    },
    setFormItems: function () {
        var me = this;
        var items = [
            {
                xtype: 'textfield',
                name: 'id',//模板id
                hidden: true
            }
            , {
                fieldLabel: "安装地址",
                xtype: 'textfield',
                readOnly: me.isView,
                maxLength: 50,
                allowBlank: false,//不允许为空
                name: 'setuplocation'
            }, {
                fieldLabel: "所在单位",
                blankText: '请输入所在单位',
                emptyText: '请输入所在单位',
                xtype: 'orgtreepicker' ,
                extraParams:{
                    orgId:'8a00100e420d68190142556b8a5a2336'
                 },
                readOnly: me.isView,
                maxLength: 10,
                allowBlank: false,//不允许为空
                name: 'city',
                listeners : {
                    //配置监听器，如选择树节点，赋值trackuser
                    "select"  : function(tree, record) {
                        var form = me.down('form').getForm();
                        form.findField('setupunit').setValue(record.data.mdmCode);
                      }
                }
            }
            , {
                fieldLabel: "单位mdmcode",
                xtype: 'textfield',
                readOnly: true,
                maxLength: 50,
                name: 'setupunit'
            }

            , {
                fieldLabel: "安装时间",
                xtype: 'datefield',
                format: 'Y-m-d',
                editable: false,
                readOnly: me.isView,
                name: 'setupdate'
            }
            , {
                fieldLabel: "联系人",
                xtype: 'textfield',
                readOnly: true,
                value: currentUser.name,
                maxLength: 20,
                name: 'contact'
            }
            , {
                fieldLabel: "联系人电话",
                xtype: 'textfield',
                readOnly: me.isView,
                maxLength: 20,
                name: 'tel'
            }, {
                fieldLabel: "下拉字典",
                xtype: 'combo',
                store: logicTypeStore,
                editable: false,
                displayField: 'name',
                queryMode: 'local',
                valueField: 'id',
                readOnly: me.isView,
                maxLength: 20,
                name: 'signame'
            }
        ];

        return items;
    }

});