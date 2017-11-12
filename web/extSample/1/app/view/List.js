Ext.define("Example.view.List", {
    extend: 'Ext.grid.Panel',
    alias: 'widget.querylist',
    id: 'myquerylistid',
    stripeRows: true,
    loadMask: true,
    store: Ext.create('Example.store.RecordStore'),
    columnLines: true,
    border: false,
    autoScroll: true,
    viewConfig: {
        forceFit: true   //每列自动充满Grid
    },
    initComponent: function () {

        var me = this;
        if (!me.isView) {
            me.isView = false;
        }
        var cols = me.getMyColumns();
        me.columns = cols;
        var mydockitems = me.getMyDockedItems();
        if (mydockitems.length > 0) {
            me.dockedItems = mydockitems;
        }

        me.callParent(arguments);
    },
    getMyColumns: function () {
        var me = this;
        var cols = [
            {
                header: '',
                xtype: 'rownumberer',
                align: 'center',
                width: 40
            },
            {header: ' ', hideable: false, dataIndex: 'id', hidden: true},
            {
                header: '所在城市', dataIndex: 'city'
            },
            {
                header: '安装地址', dataIndex: 'setuplocation', minWidth: 100, flex: 1
            },
            {
                header: '安装单位', dataIndex: 'setupunit', minWidth: 100, flex: 1,
                renderer: function (value, metaData, record, colIndex, store, view) {
                    metaData.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            },
            {
                header: '联系人', dataIndex: 'contact', minWidth: 100, flex: 1
            },
            {
                header: '下拉字典', dataIndex: 'signame', minWidth: 100, flex: 1,
                renderer: function (value, metaData, record, colIndex, store, view) {
                    var record = logicTypeStore.queryBy(function (rec) {
                        if (rec.data.id == value) {
                            return true;
                        }
                    }, this);
                    if (record.getCount() == 1) {
                        return record.get(0).data.name;
                    }
                }
            },
            {
                header: '日期', dataIndex: 'setupdate', minWidth: 100, flex: 1,
                renderer: function (value, metaData, record, colIndex, store, view) {
                    if (value == null) return '';
                    var v = Ext.Date.dateFormat(new Date(value), 'Y-m-d');
                    // metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(v) + '"';
                    return v;
                }
            },
            {
                xtype: 'actioncolumn',
                width: 150,
                bodyAlign: 'center',
                altText: '<i>Actions</i>',
                tooltip: '操作',
                header: '操作',
                items: [
                    {
                         icon : Ext.getContext() + '/resources/images/edit.png',
                         handler: function (aGrid, aRowIndex, aColIndex, aItem, aEvent, aRecord) {
                            me.edit(aRecord);
                        }
                    },

                    {
                        iconCls: 'bik',
                        handler: function (aGrid, aRowIndex, aColIndex, aItem, aEvent, aRecord) {
                            me.delete(aRecord);
                        }
                    }
                ]
            }
        ];
        return cols;
    },
    delete: function (aRecord) {
        var me = this;
        var id = aRecord.data.id;
        Ext.MessageBox.confirm('提示', '确认删除选中的记录吗？', function (btn) {
            if (btn == 'yes') {

                Ext.Ajax.request({
                    url: Ext.getContext() + '/example/delete',
                    type: 'GET',
                    async: false,
                    params: {id: id},
                    scope: this,
                    success: function (response, opts) {
                        me.getStore().reload();
                    },
                    failure: function (response, opts) {
                        Ext.Msg.alert('提示', appMsg.EXCEPTION);
                    }
                });
            }
        });

    },
    edit: function (aRecord) {
        var me = this;
        var win = Ext.create('Example.view.Win', {
            reflashgrid: me,
            title: '编辑' + bizname,
            entityid: aRecord.data.id
        });

    }
    ,
    getMyDockedItems: function () {
        var me = this;
        var mydockitems = [];
        var bottomtoolbar = {
            xtype: 'pagingtoolbar',
            store: me.store,
            dock: 'bottom',
            displayInfo: true
        };
        var toptoolbar = {
            xtype: 'toolbar',
            dock: 'top',
            layout: 'hbox',
            items: [
                {
                    iconCls: 'Add',
                    xtype: 'button',
                    action: 'add',
                    itemId: 'addBtn',
                    text: '新增',
                    handler: function () {
                        Ext.create('Example.view.Win', {reflashgrid: me});
                    }
                },
                {
                    iconCls: 'Arrowdown',
                    xtype: 'button',
                    text: '导出',
                    handler: function () {
                        Ext.create('UserExportFile.view.Win', {reflashgrid: me});
                    }
                }
            ]
        };
        mydockitems.push(bottomtoolbar, toptoolbar);
        return mydockitems;
    }
    ,
    reloadGridByParame: function (params) {
        var me = this;
        var store = me.getStore();
        if (params != null) {
            store.proxy.extraParams = params;
        }
        store.reload();
    }
})
