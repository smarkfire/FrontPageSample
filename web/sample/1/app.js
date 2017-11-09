Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'UserExportFile':Ext.getContext()+'/dzy/exportfile/app'


}
});

Ext.application({
    appFolder: 'app',
    autoCreateViewport: true,
    name: 'Example',
    controllers: []
});