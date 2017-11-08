/**
 * Created by Administrator on 2017/7/7.
 */
Ext.Ajax.timeout = 90000;
//override orgmodel 增加 hrcode mdm code
Ext.define('component.model.OrgModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id'
        }, {
            name: 'hrCode'
        },{
            name:'mdmCode'
        },
        {
            name:'pid'
        },
        {
            name: 'name'
        },
        {
            name: 'shortName'
        },
        {
            name:'children'
        },
        {
            name: 'leaf'
        },
        {
            name:'path'
        }
    ]
});
Ext.apply(Ext.form.VTypes, {
    daterange : function(val, field) {
        var date = field.parseDate(val);

        if(!date){
            return false;
        }
        if (field.startDateField) {
            var start = Ext.getCmp(field.startDateField);
            if (!start.maxValue || (date.getTime() != start.maxValue.getTime())) {
                start.setMaxValue(date);
                start.validate();
            }
        }
        else if (field.endDateField) {
            var end = Ext.getCmp(field.endDateField);
            if (!end.minValue || (date.getTime() != end.minValue.getTime())) {
                end.setMinValue(date);
                end.validate();
            }
        }
        return true;
    }

});
Ext.override(Ext.form.field.ComboBox, {
    autoEncode: true,//自动对包含HTML标记的字符编码
    listConfig: {
        getInnerTpl: function(displayField) {
            if (this.autoEncode) {
                return '{[Ext.util.Format.htmlEncode(values.' + displayField + ')]}';
            } else {
                return '{' + displayField + '}';
            }
        }
    },
    createPicker: function() {
        var me = this,
            picker,
            pickerCfg = Ext.apply({
                xtype: 'boundlist',
                pickerField: me,
                selModel: {
                    mode: me.multiSelect ? 'SIMPLE' : 'SINGLE'
                },
                floating: true,
                hidden: true,
                store: me.store,
                autoEncode: me.autoEncode,
                displayField: me.displayField,
                focusOnToFront: false,
                pageSize: me.pageSize,
                tpl: me.tpl
            }, me.listConfig, me.defaultListConfig);

        picker = me.picker = Ext.widget(pickerCfg);
        if (me.pageSize) {
            picker.pagingToolbar.on('beforechange', me.onPageChange, me);
        }

        me.mon(picker, {
            itemclick: me.onItemClick,
            refresh: me.onListRefresh,
            scope: me
        });

        me.mon(picker.getSelectionModel(), {
            beforeselect: me.onBeforeSelect,
            beforedeselect: me.onBeforeDeselect,
            selectionchange: me.onListSelectionChange,
            scope: me
        });

        return picker;
    }
});

Ext.override(Ext, {
    convertToJson: function(name, val) {
        if (name != null && name.length > 0) {
            var index = name.lastIndexOf('.');
            var n1 = name.substring(index + 1, name.length);
            var n2 = name.substring(0, index);
            var obj = {};
            obj[n1] = val;
            return this.convertToJson(n2, obj);
        } else {
            return val;
        }
    },
    getJsonValue: function(values, name) {
        if (Ext.isObject(values) && name != null && name.length > 0) {
            if (values.hasOwnProperty(name)) {
                return values[name];
            } else {
                var index = name.indexOf('.');
                var n1 = name.substring(0, index);
                var n2 = name.substring(index + 1);
                return this.getJsonValue(values[n1], n2);
            }
        } else {
            return null;
        }
    },
    setJsonValue: function(values, name, val) {
        if (Ext.isObject(values) && name != null && name.length > 0) {
            if (values.hasOwnProperty(name)) {
                values[name] = val;
            } else {
                var index = name.indexOf('.');
                var n1 = name.substring(0, index);
                var n2 = name.substring(index + 1);
                this.setJsonValue(values[n1], n2, val);
            }
        }
    }
});

Ext.override(Ext.tree.Column, {
    autoEncode: false
});

Ext.override(Ext.grid.column.Action, {
    autoEncode: false
});

Ext.override(Ext.grid.column.Boolean, {
    autoEncode: false
});

Ext.override(Ext.grid.column.Date, {
    autoEncode: false
});

Ext.override(Ext.grid.column.Number, {
    autoEncode: false
});

Ext.override(Ext.grid.column.Template, {
    autoEncode: false
});

Ext.override(Ext.selection.CheckboxModel, {
    getHeaderConfig: function() {
        var me = this,
            showCheck = me.showHeaderCheckbox !== false;

        return {
            isCheckerHd: showCheck,
            text : '&#160;',
            width: me.headerWidth,
            sortable: false,
            draggable: false,
            resizable: false,
            hideable: false,
            menuDisabled: true,
            autoEncode: false,
            dataIndex: '',
            cls: showCheck ? Ext.baseCSSPrefix + 'column-header-checkbox ' : '',
            renderer: Ext.Function.bind(me.renderer, me),
            editRenderer: me.editRenderer || me.renderEmpty,
            locked: me.hasLockedHeader()
        };
    }
});

Ext.override(Ext.grid.header.Container, {
    sortable:false,
    autoEncode: true,//自动对包含HTML标记的字符编码
    getColumnsForTpl:function (flushCache) {
        var cols = [],
            headers = this.getGridColumns(flushCache),
            headersLn = headers.length,
            i = 0,
            header,
            width;

        for (; i < headersLn; i++) {
            header = headers[i];
            if (header.hidden || header.up('headercontainer[hidden=true]')) {
                width = 0;
            } else {
                width = header.getDesiredWidth();
            }
            //对于可编辑的输入框，增加底色
            if (header.editor) {
                if (header.tdCls) {
                    header.tdCls = header.tdCls + " editable-column";
                } else {
                    header.tdCls = "editable-column";
                }
            }
            cols.push({
                dataIndex:header.dataIndex,
                //add bodyAlign config,so header and body can be difference
                align:header.bodyAlign ? header.bodyAlign : header.align,
                width:width,
                id:header.id,
                cls:header.tdCls,
                columnId:header.getItemId()
            });
        }

        return cols;
    },
    prepareData:function (data, rowIdx, record, view, panel) {
        var me = this,
            obj = {},
            headers = me.gridDataColumns || me.getGridColumns(),
            headersLn = headers.length,
            colIdx = 0,
            header,
            headerId,
            renderer,
            value,
            metaData,
            store = panel.store;

        for (; colIdx < headersLn; colIdx++) {
            metaData = {
                tdCls:'',
                style:''
            };
            header = headers[colIdx];
            headerId = header.id;
            renderer = header.renderer;
            value = data[header.dataIndex];

            if (typeof renderer == "function") {
                value = renderer.call(
                    header.scope || me.ownerCt,
                    value,
                    // metadata per cell passing an obj by reference so that
                    // it can be manipulated inside the renderer
                    metaData,
                    record,
                    rowIdx,
                    colIdx,
                    store,
                    view
                );
            }
            //避免html字符引起显示不正常
            if (header.autoEncode && Ext.isString(value)) {
                value = Ext.String.htmlEncode(value);
            }

            // <debug>
            if (metaData.css) {
                // This warning attribute is used by the compat layer
                obj.cssWarning = true;
                metaData.tdCls = metaData.css;
                delete metaData.css;
            }
            // </debug>
            if (me.markDirty) {
                obj[headerId + '-modified'] = record.isModified(header.dataIndex) ? Ext.baseCSSPrefix + 'grid-dirty-cell' : '';
            }
            obj[headerId + '-tdCls'] = metaData.tdCls;
            obj[headerId + '-tdAttr'] = metaData.tdAttr;
            obj[headerId + '-style'] = metaData.style;
            if (typeof value === 'undefined' || value === null || value === '') {
                value = header.emptyCellText;
            }
            obj[headerId] = value;
        }
        return obj;
    }
});

Ext.override(Ext.form.Basic, {
    getFormValuesToJson: function(dirtyOnly, includeEmptyText, useDataValues) {
        var values = {}, fields = this.getFields().items, f, fLen = fields.length, isArray = Ext.isArray, field, data, val, bucket, name;

        for (f = 0; f < fLen; f++) {
            field = fields[f];

            if (field.ignoreSubmit == true) {
                continue;
            }

            if (!dirtyOnly || field.isDirty()) {
                data = field[useDataValues ? 'getModelData' : 'getSubmitData'](includeEmptyText);

                if (Ext.isObject(data)) {
                    for (name in data) {
                        if (data.hasOwnProperty(name)) {
                            val = data[name];

                            if (includeEmptyText && val === '') {
                                val = field.emptyText || '';
                            }

                            if (name.indexOf('.') > -1) {
                                var jsonValue = Ext.getJsonValue(values, name);
                                if (jsonValue != null) {
                                    bucket = jsonValue;

                                    if (!isArray(bucket)) {
                                        bucket = [bucket];
                                    }

                                    if (isArray(val)) {
                                        bucket = bucket.concat(val);
                                    } else {
                                        bucket.push(val);
                                    }

                                    Ext.setJsonValue(values, name, bucket);
                                } else {
                                    Ext.merge(values, Ext.convertToJson(name, val));
                                }
                            } else {
                                if (values.hasOwnProperty(name)) {
                                    bucket = values[name];

                                    if (!isArray(bucket)) {
                                        bucket = values[name] = [bucket];
                                    }

                                    if (isArray(val)) {
                                        values[name] = values[name] = bucket.concat(val);
                                    } else {
                                        bucket.push(val);
                                    }
                                } else {
                                    values[name] = val;
                                }
                            }
                        }
                    }
                }
            }
        }
        return values;
    },
    setFormValues: function(values) {
        var form = this;
        function setVal(fieldName, val) {
            var field = form.findField(fieldName);
            if (field) {
                if ((field.xtype == 'datefield' || field.xtype == 'datetimefield') && Ext.isNumber(val)) {
                    val = new Date(val);
                }
                field.setValue(val);
                if (form.trackResetOnLoad) {
                    field.resetOriginalValue();
                }
            }
        }
        function cascadeValue(values, prefixName) {//prefixName前缀
            for (var key in values) {
                var val = values[key];
                if (Ext.isObject(val)) {
                    if (Ext.isEmpty(prefixName)) {
                        cascadeValue(val, key);
                    } else {
                        cascadeValue(val, prefixName + '.' + key);
                    }
                } else {
                    if (Ext.isEmpty(prefixName)) {
                        setVal(key, val);
                    } else {
                        setVal(prefixName + '.' + key, val);
                    }
                }
            }
        }
        cascadeValue(values);
    }
});

/**
 * 修改ExtJs时间控件，只选择年和月
 * liutianfang
 *
 * 用法：	xtype: 'monthfield',
 *	        fieldLabel: '选择月份',
 *	        name:'monthDate',
 *	        editable: false,
 *	        labelWidth: 60,
 *	        labelAlign: 'right',
 *			format: 'Y-m'
 */
Ext.define('Ext.ux.form.MonthField', {
    extend: 'Ext.form.field.Picker',
    alias: 'widget.monthfield',
    format: "Y-m",
    altFormats: "m/y|m/Y|m-y|m-Y|my|mY|y/m|Y/m|y-m|Y-m|ym|Ym",
    triggerCls: Ext.baseCSSPrefix + 'form-date-trigger',
    matchFieldWidth: false,
    startDay: new Date(),
    trigger2Cls: 'x-form-clear-trigger',
    onTrigger2Click: function() {
        this.setValue();
    },
    initComponent: function () {
        var me = this;
        me.disabledDatesRE = null;
        me.callParent();
    },

    initValue: function () {
        var me = this,
            value = me.value;
        if (Ext.isString(value)) {
            me.value = Ext.Date.parse(value, this.format);
        }
        if (me.value)
            me.startDay = me.value;
        me.callParent();
    },

    rawToValue: function (rawValue) {
        return Ext.Date.parse(rawValue, this.format) || rawValue || null;
    },
    valueToRaw: function (value) {
        return this.formatDate(value);
    },
    formatDate: function (date) {
        return Ext.isDate(date) ? Ext.Date.dateFormat(date, this.format) : date;
    },
    createPicker: function () {
        var me = this, format = Ext.String.format;
        return Ext.create('Ext.picker.Month', {
            pickerField: me,
            ownerCt: me.ownerCt,
            renderTo: document.body,
            floating: true,
            shadow: false,
            focusOnShow: true,
            listeners: {
                scope: me,
                cancelclick: me.onCancelClick,
                okclick: me.onOkClick,
                yeardblclick: me.onOkClick,
                monthdblclick: me.onOkClick
            }
        });
    },

    onExpand: function () {
        this.picker.setValue(this.startDay);
    },

    onOkClick: function (picker, value) {
        var me = this,
            month = value[0],
            year = value[1],
            date = new Date(year, month, 1);
        me.startDay = date;
        me.setValue(date);
        me.picker.hide();
        me.collapse();
    },

    onCancelClick: function () {
        var me = this;
        me.picker.hide();
        me.collapse();
    }

});

/**
 * 修改ExtJs时间控件，只选择年和月
 * wangrong
 * 时间条件 必须选，不能为空进行查询
 * 用法：	xtype: 'monthfield',
 *	        fieldLabel: '选择月份',
 *	        name:'monthDate',
 *	        editable: false,
 *	        labelWidth: 60,
 *	        labelAlign: 'right',
 *			format: 'Y-m'
 */
Ext.define('Ext.ux.form.MonthFieldWR', {
    extend: 'Ext.form.field.Picker',
    alias: 'widget.monthfieldWR',
    format: "Y-m",
    altFormats: "m/y|m/Y|m-y|m-Y|my|mY|y/m|Y/m|y-m|Y-m|ym|Ym",
    triggerCls: Ext.baseCSSPrefix + 'form-date-trigger',
    matchFieldWidth: false,
    startDay: new Date(),
    onTrigger2Click: function() {
        this.setValue();
    },
    initComponent: function () {
        var me = this;
        me.disabledDatesRE = null;
        me.callParent();
    },

    initValue: function () {
        var me = this,
            value = me.value;
        if (Ext.isString(value)) {
            me.value = Ext.Date.parse(value, this.format);
        }
        if (me.value)
            me.startDay = me.value;
        me.callParent();
    },

    rawToValue: function (rawValue) {
        return Ext.Date.parse(rawValue, this.format) || rawValue || null;
    },
    valueToRaw: function (value) {
        return this.formatDate(value);
    },
    formatDate: function (date) {
        return Ext.isDate(date) ? Ext.Date.dateFormat(date, this.format) : date;
    },
    createPicker: function () {
        var me = this, format = Ext.String.format;
        return Ext.create('Ext.picker.Month', {
            pickerField: me,
            ownerCt: me.ownerCt,
            renderTo: document.body,
            floating: true,
            shadow: false,
            focusOnShow: true,
            listeners: {
                scope: me,
                cancelclick: me.onCancelClick,
                okclick: me.onOkClick,
                yeardblclick: me.onOkClick,
                monthdblclick: me.onOkClick
            }
        });
    },

    onExpand: function () {
        this.picker.setValue(this.startDay);
    },

    onOkClick: function (picker, value) {
        var me = this,
            month = value[0],
            year = value[1],
            date = new Date(year, month, 1);
        me.startDay = date;
        me.setValue(date);
        me.picker.hide();
        me.collapse();
    },

    onCancelClick: function () {
        var me = this;
        me.picker.hide();
        me.collapse();
    }

});

Ext.override(Ext.grid.Panel, {
    initComponent: function() {
        var me = this;

        me.addEvents(
            'beforeclose',
            'close',
            "beforeexpand",
            "beforecollapse",
            "expand",
            "collapse",
            'titlechange',
            'iconchange',
            'iconclschange'
        );

        if (me.collapsible) {
            // Save state on these two events.
            this.addStateEvents(['expand', 'collapse']);
        }
        if (me.unstyled) {
            me.setUI('plain');
        }

        if (me.frame) {
            me.setUI(me.ui + '-framed');
        }

        // Backwards compatibility
        me.bridgeToolbars();

        me.callParent();
        me.collapseDirection = me.collapseDirection || me.headerPosition || Ext.Component.DIRECTION_TOP;

        // Used to track hidden content elements during collapsed state
        me.hiddenOnCollapse = new Ext.dom.CompositeElement();

        // -----------------------append-----------------------------
        for (var i=0; c=me.columns[i]; i++) { //表头添加提示框
            if (c.tooltip == null) {
                c.tooltip = c.text;
            }
        }
        if (!me.listeners) {
            me.listeners = {};
        }
        me.listeners.beforedestroy = function(){//销毁grid前把编辑状态改为‘已完成’，防止关闭窗口时报错
            var cellEditings = me.plugins;
            if(!cellEditings)return;
            var cellEditing;
            for(var i =0;cellEditing = cellEditings[i];i++){
                if(cellEditing.ptype=='cellediting')
                    cellEditing.completeEdit();
            }
        }

        if (me.isEditGrid) {
            me.editCount = 0;
            me.addCount = 0;

            var cs = me.columns;
            var str = '';
            var c;
            for (var i=0; c=cs[i]; i++) {
                if (c.editor) {
                    c.editor.enableKeyEvents = true;
                    if (!c.editor.listeners) {
                        c.editor.listeners = {};
                    }


                    if (!c.rendererReadonly) {
                        c.renderer = function(value, metaData, record, rowIndex, colIndex, store, view) {
                            var column = this.columns[colIndex];
                            var dataIndex = column.dataIndex;

                            if (!record.get('$status' + colIndex)) {
                                record.set('old$' + dataIndex, record.get(dataIndex));
                                record.set('$status' + colIndex, '1');
                            }

                            if (record.get(dataIndex) != record.get('old$' + dataIndex)) {
                                metaData.style = 'background-color:#42E61A';
                                record.set('editStatus', true);
                            } else {
                                metaData.style = '';
                            }
                            if (column.xtype == 'datecolumn') {
                                if (value == null) {
                                    return '';
                                } else {
                                    return Ext.util.Format.date(value,column.format);
                                }
                            }
                            return value;
                        }
                    }
                }
            }
        }
        //-----------------------append-----------------------------
    }
});

Ext.override(Ext.form.DateField, {
    clickExpand: true,
    onFocus: function() {
        if (this.clickExpand == true) {
            if (!this.readOnly) {
                this.expand();
            }
        }
        this.callParent(arguments);
        this.clickExpand = true;
    },
    onSelect: function() {
        this.callParent(arguments);
        this.clickExpand = false;
    }
});

Ext.example = function(){
    var msgCt;

    function createBox(t, s){
        return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
    }
    return {
        msg : function(title, format,duration){
            if(!msgCt){
                msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, createBox(title, s), true);
            m.hide();
            if(duration && !isNaN(duration)){
                m.slideIn('t').ghost("t", { delay: duration, remove: true});
            }else{
                m.slideIn('t').ghost("t", { delay: 1500, remove: true});
            }

        },

        init : function(){
            if(!msgCt){
                msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }

        }
    };
}();


//----------------------------

Ext.namespace("com.shinfotech.platform.base.common");
/**
 * 与分页相关的基础信息
 */
com.shinfotech.platform.base.common.paging = {
    start : 0, //起始地址
    pageSize : 15, //页大小
    displayMsg : '第 {0} 条到 {1} 条，共 {2} 条',
    emptyMsg : "没有符合条件的记录!"
}
/**
 * 日志操作类型
 */
com.shinfotech.platform.base.common.BizLogOpType = {
    "01" : "登录认证管理日志",
    "02" : "帐号/权限管理日志",
    "03" : "配置管理类日志",
    "04" : "业务访问日志",
    "05" : "其他日志"
}

/**
 * 日志操作结果
 */
com.shinfotech.platform.base.common.BizLogResult = {
    "01" : "成功",
    "02" : "失败",
    "03" : "异常"
}

