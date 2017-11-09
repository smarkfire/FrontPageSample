
Ext.define("Example.view.Query", {
    extend: 'Ext.panel.Panel',
    alias: 'widget.queryform',
    border: false,
    // collapsible: true,
    frame: false,
    autoScroll: true,
    defaults: {
        border: false,
        frame: false,
        baseCls: 'x-plain'
    },
    layout: {
        type: 'fit'
    },

    initComponent: function () {
        var me = this;
        me.items = [{
            xtype: 'form',
            id: 'searchFormId',
            items: [{
                xtype: 'container',
                defaults: {
                    labelAlign: 'right',
                    margin: '10 5 10 5'
                },
                layout: {
                    align: 'stretch',
                    type: 'hbox'
                },
                items: me.getFormItems()
            }]
        }];

        me.callParent(arguments);
    },
    getFormItems: function () {
        var me = this;
        var items = [

            // {
            //     xtype: 'tbfill',
            //     labelAlign: 'right'
            // },
            {
                 xtype: 'triggerfield',
                name: 'setuplocation',
                labelWidth: 55,
                fieldLabel: '安装城市',
                labelAlign: 'right',
                // emptyText: '请输入...',
                trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                // trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
                // onTrigger2Click: function (args) {
                //     me.query();
                // },
                onTrigger1Click: function (args) {
                    this.setValue();
                }
            },
            { xtype: 'tbseparator', width: 20},
            {
                xtype: 'textfield',
                name: 'vmTkStatusPoint.pointdesc',
                fieldLabel: '故障类型',
                labelAlign: 'right',
                labelWidth: 55,
                 displayField: 'name',
                valueField: 'id',
                trigger2Cls: 'x-form-clear-trigger',
                onTrigger2Click: function (args) {
                    this.setValue();
                    this.focus();
                }
            },
            {
                fieldLabel: "开始时间",
                width: 185,
                labelWidth: 55,
                trigger2Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                onTrigger2Click: function (args) {
                    this.setValue();
                    this.focus();
                    var end = this.up().down('datefield[name=endday]');
                    end.setMinValue();
                    end.validate();
                },
                id: 'startday',
                editable: false,
                format: 'Y-m-d',
                xtype: 'datefield',
                name: 'startday',
                vtype: 'daterange',
                endDateField: 'endday'
            },
            {
                fieldLabel: "至",
                width: 140,
                labelWidth: 10,
                trigger2Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                onTrigger2Click: function (args) {
                    this.setValue();
                    this.focus();
                    var end = this.up().down('datefield[name=startday]');
                    end.setMaxValue();
                    end.validate();
                },
                id: 'endday',
                editable: false,
                format: 'Y-m-d',
                xtype: 'datefield',
                name: 'endday',
                vtype: 'daterange',
                startDateField: 'startday'
            } ,
            { xtype: 'tbseparator', width: 5},
            {
                xtype: 'button',
                iconCls: 'x-btn-ico-seach',
                action : 'query',
                text: '查询',
                handler: function(button, event) {
                    me.query();
                }
            },
            { xtype: 'tbseparator'},
            {
                xtype: 'button',
                action : 'reset',
                handler: function(button, event) {
                    button.up('form').getForm().reset();
                },
                iconCls: 'x-btn-ico-reset',
                text: '重置'
            }
        ];
        return items;
    },
    query: function () {
        var me = this;
        var parms = Ext.getCmp('searchFormId').getForm().getValues();
        me.up().down('grid').reloadGridByParame(parms);
    }
})
