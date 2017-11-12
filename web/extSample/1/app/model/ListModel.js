Ext.define('Example.model.ListModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'city', type: 'string'},
        {name: 'id', type: 'string'},
        {name: 'setuplocation', type: 'string'},//
        {name: 'signame', type: 'string'},
        {name: 'model', type: 'string'},
        {name: 'setupunit', type: 'string'},
        {name: 'contact', type: 'string'},
        {name: 'memo', type: 'string'},
        {name: 'tel', type: 'string'},
        {name: 'setupdate'}
    ]
});