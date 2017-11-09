
Ext.define('Example.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'border',
    initComponent: function () {
        var me = this;

        me.items = [
            Ext.create('Example.view.List', {
                region: 'center',
                layout: 'fit'
            }),
            Ext.create('Example.view.Query', {
                title: bizname+'列表',
                region: 'north'
            })
        ]

        me.callParent(arguments);
    }
})
