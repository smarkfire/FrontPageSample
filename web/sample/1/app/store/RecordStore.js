
Ext.define('Example.store.RecordStore',{
    extend: 'Ext.data.Store',
    model: 'Example.model.ListModel',
    pageSize: common.pageSize,
    autoLoad: true,
    storeId : 'recordStoreId',
    proxy: {
        type: 'ajax',
        extraParams : {
         },
        actionMethods: {read: 'POST' },
        url:Ext.getContext()+'/sample/sdata/page.json',
        // url : Ext.getContext()+ '/example/findPage',

         reader: {
            type: 'json',
            root: 'records',
            totalProperty: 'totalRecords',
            successProperty: 'success'
        }
    }
});