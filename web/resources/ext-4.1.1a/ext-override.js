Ext.override(Ext.selection.RowModel, {

    bindComponent:function (view) {
        var me = this;

        me.views = me.views || [];
        me.views.push(view);
        me.bindStore(view.getStore(), true);
        //解决selection model和dd冲突的问题
        view.on({
            itemclick:me.onRowMouseDown,
            scope:me
        });

        if (me.enableKeyNav) {
            me.initKeyNav(view);
        }
    }
})

//高宽自适应，生产环境显示器23寸
//未来考虑随窗口变化居中，适应窗口变化
Ext.override(Ext.window.Window, {
	constrain : true,
    height:document.documentElement.clientHeight * 0.8,
    width:document.documentElement.clientWidth * 0.8

});

//给grid增加列边框线，注：默认样式不是黑色，不好看，需要结合sh样式
Ext.override(Ext.panel.Table, {
    columnLines:true
});


//自动获取app的context
Ext.getContext = function () {
    var base = document.getElementsByTagName('base')[0];
    if (base && base.href && (base.href.length > 0)) {
        base = base.href;
    } else {
        base = document.URL;
    }
    var count = base.indexOf("/", base.indexOf("//") + 2) + 1;
    var base_1 = base.substr(count);
    var count_1 = base_1.indexOf("/");
    return "/" + base_1.substr(0, count_1);
};

Ext.Ajax.on({'requestexception':function (conn, response) {

	//session超时，ajax请求跳cas登录页处理，https会为空，测试环境无论如何都是异常
	if(response.responseText=="" ) {
		var e = {event:"login"};
		if (parent)
		{
			parent.postMessage(JSON.stringify(e),"*");
		}
			
	}
	//session超时，ajax请求跳cas登录页处理，http会是整个cas登陆页
	if (response.responseText.indexOf('<title>平台</title>')!=-1)
	{
		var e = {event:"login"};
		if (parent)
		{
			parent.postMessage(JSON.stringify(e),"*");
		}

	}
     if (response.responseText.indexOf('<title>身份认证</title>')!=-1)
    {
        var e = {event:"login"};
        if (parent)
        {
            parent.postMessage(JSON.stringify(e),"*");
        }

    }


    if (response.status == 501) {
        if ("null"!=response.responseText) {
            alert(response.responseText);
        }
        var e = {event:"login"};
        parent.postMessage(JSON.stringify(e),"*");
        }
    if (response.status == 401) {
        alert('您不能访问未授权的内容');
    }
    if (response.status == 500) {
       //alert("网络繁忙，请稍候再试!");
        if ("null"!=response.responseText) {
            alert(response.responseText);
        }

    }
}, 'beforerequest':function (conn, options) {

    //单点登录filter需要判断是否ajax请求，由于有jsonp的访问，不能在http header中设置
    Ext.Ajax.extraParams = {'X-Requested-With':'XMLHttpRequest'};


}, 'requestcomplete':function (conn, response, options) {
	//session超时，ajax请求跳cas登录页处理，http会是整个cas登陆页,且返回状态是200（生产环境）
	if (response.responseText.indexOf('<title>平台</title>')!=-1)
	{
		var e = {event:"login"};
		if (parent)
		{
			parent.postMessage(JSON.stringify(e),"*");
		}

	}
	 
}
})

//给不允许为空字段增加星号
Ext.override(Ext.form.field.Base, {
    initComponent:function () {
        this.callParent(arguments);
        this.on('beforerender', function (target) {
            if (target && !target.rendered && target.isFieldLabelable && target.fieldLabel && target.allowBlank == false) {
                target.fieldLabel += '<span class="req" style="color:red">*</span>';
            }
        })

    }
})
Ext.override(Ext.form.CheckboxGroup, {
    initComponent:function () {
        this.callParent(arguments);
        this.on('beforerender', function (target) {
            if (target && !target.rendered && target.isFieldLabelable && target.fieldLabel && target.allowBlank == false) {
                target.fieldLabel += '<span class="req" style="color:red">*</span>';
            }
        })

    }
})


//表头默认不带菜单，排序
Ext.override(Ext.grid.column.Column, {

    sortable:false,
    menuDisabled:true

})


Ext.override(Ext.panel.Table, {
    sortableColumns:false
})

Ext.override(Ext.toolbar.Paging, {

    onLoad:function () {
        var me = this,
            pageData,
            currPage,
            pageCount,
            afterText,
            count,
            isEmpty;

        count = me.store.getCount();
        isEmpty = count === 0;
        if (!isEmpty) {
            pageData = me.getPageData();
            currPage = pageData.currentPage;
            pageCount = pageData.pageCount;
            afterText = Ext.String.format(me.afterPageText, isNaN(pageCount) ? 1 : pageCount);
        } else {
            //删除掉最后一页所有记录后，重新加载最后页情况
            if (me.store.getTotalCount() > 0) {
                me.store.loadPage(Math.ceil(me.store.getTotalCount() / me.store.pageSize));
                return;
            } else {
                currPage = 0;
                pageCount = 0;
                afterText = Ext.String.format(me.afterPageText, 0);
            }
        }

        Ext.suspendLayouts();
        me.child('#afterTextItem').setText(afterText);
        me.child('#inputItem').setDisabled(isEmpty).setValue(currPage);
        me.child('#first').setDisabled(currPage === 1 || isEmpty);
        me.child('#prev').setDisabled(currPage === 1 || isEmpty);
        me.child('#next').setDisabled(currPage === pageCount || isEmpty);
        me.child('#last').setDisabled(currPage === pageCount || isEmpty);
        me.child('#refresh').enable();
        me.updateInfo();
        Ext.resumeLayouts(true);

        if (me.rendered) {
            me.fireEvent('change', me, pageData);
        }
    }

})

Ext.override(Ext.tree.Panel, {
    useArrows:true
})

String.prototype.escapeHTML = function () {//替换字符串中的HTML标签
    return this.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
};

//VType验证特殊字符
Ext.apply(Ext.form.VTypes, {
    specialCharVal:/^[^≈≡≠＝≤≥＜＞≮≯∷±＋－×÷／∫∮∝∞∧∨∑∏∪∩∈∵∴⊥∥∠⌒⊙≌∽√∟∣∶≒≦≧⊕⊿°′″＄￡￥‰％℃¤￠]*$/,
    specialCharText:'您的输入包含如下无效字符之一：≈≡≠＝≤≥＜＞≮≯∷±＋－×÷／∫∮∝∞∧∨∑∏∪∩∈∵∴⊥∥∠⌒⊙≌∽√ ∟ ∣∶≒ ≦ ≧ ⊕⊿°′″＄￡￥‰％℃¤￠',
    specialChar:function (v) {
        return this.specialCharVal.test(v);
    },
    daterange:function (val, field) {
        var date = field.parseDate(val);

        if (!date) {
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


Ext.override(Ext.grid.header.Container, {
	sortable:false,
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

            //避免html字符引起显示不正常
            if (Ext.isString(value)) {
                var value = Ext.String.htmlEncode(value);
            }
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


            // <debug>
            if (metaData.css) {
                // This warning attribute is used by the compat layer
                obj.cssWarning = true;
				
                metaData.tdCls = metaData.css;
                debugger;

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
})

/*grid默认表头居中对齐，body左对齐*/
Ext.override(Ext.grid.column.Column, {
    align:'center',
    bodyAlign:'left'
})

/**
 * @class Sh.widget.TreePicker
 * @extends Ext.form.field.Picker
 *
 * A Picker field that contains a tree panel on its popup, enabling selection of tree nodes.
 */
Ext.define('ExtFPS.widget.TreePicker', {
    extend:'Ext.form.field.Picker',
    xtype:'shtreepicker',

    triggerCls:Ext.baseCSSPrefix + 'form-arrow-trigger',

    config:{
        /**
         * @cfg {Ext.data.TreeStore} store
         * A tree store that the tree picker will be bound to
         */
        store:null,

        /**
         * @cfg {String} displayField
         * The field inside the model that will be used as the node's text.
         * Defaults to the default value of {@link Ext.tree.Panel}'s `displayField` configuration.
         */
        displayField:null,

        /**
         * @cfg {Array} columns
         * An optional array of columns for multi-column trees
         */
        columns:null,

        /**
         * @cfg {Boolean} selectOnTab
         * Whether the Tab key should select the currently highlighted item. Defaults to `true`.
         */
        selectOnTab:true,

        /**
         * @cfg {Number} maxPickerHeight
         * The maximum height of the tree dropdown. Defaults to 300.
         */
        maxPickerHeight:300,

        /**
         * @cfg {Number} minPickerHeight
         * The minimum height of the tree dropdown. Defaults to 100.
         */
        minPickerHeight:100
    },

    editable:false,

    initComponent:function () {
        var me = this;
        me.callParent(arguments);

        this.addEvents(
            /**
             * @event select
             * Fires when a tree node is selected
             * @param {Ext.ux.TreePicker} picker        This tree picker
             * @param {Ext.data.Model} record           The selected record
             */
            'select'
        );

        me.store.on('load', me.onLoad, me);
    },

    /**
     * Creates and returns the tree panel to be used as this field's picker.
     * @private
     */
    createPicker:function () {
        var me = this,
            picker = Ext.create('Ext.tree.Panel', {
                store:me.store,
                floating:true,
                hidden:true,
                displayField:me.displayField,
                columns:me.columns,
                maxHeight:me.maxTreeHeight,
                shadow:false,
                manageHeight:false,
                rootVisible:false,
                listeners:{
                    itemclick:Ext.bind(me.onItemClick, me)
                },
                viewConfig:{
                    listeners:{
                        render:function (view) {
                            view.getEl().on('keypress', me.onPickerKeypress, me);
                        }
                    }
                }
            }),
            view = picker.getView();

        view.on('render', me.setPickerViewStyles, me);

        if (Ext.isIE9 && Ext.isStrict) {
            // In IE9 strict mode, the tree view grows by the height of the horizontal scroll bar when the items are highlighted or unhighlighted.
            // Also when items are collapsed or expanded the height of the view is off. Forcing a repaint fixes the problem.
            view.on('highlightitem', me.repaintPickerView, me);
            view.on('unhighlightitem', me.repaintPickerView, me);
            view.on('afteritemexpand', me.repaintPickerView, me);
            view.on('afteritemcollapse', me.repaintPickerView, me);
        }
        return picker;
    },

    /**
     * Sets min/max height styles on the tree picker's view element after it is rendered.
     * @param {Ext.tree.View} view
     * @private
     */
    setPickerViewStyles:function (view) {
        view.getEl().setStyle({
            'min-height':this.minPickerHeight + 'px',
            'max-height':this.maxPickerHeight + 'px'
        });
    },

    /**
     * repaints the tree view
     */
    repaintPickerView:function () {
        var style = this.picker.getView().getEl().dom.style;

        // can't use Element.repaint because it contains a setTimeout, which results in a flicker effect
        style.display = style.display;
    },

    /**
     * Aligns the picker to the input element
     * @private
     */
    alignPicker:function () {
        var me = this,
            picker;

        if (me.isExpanded) {
            picker = me.getPicker();
            if (me.matchFieldWidth) {
                // Auto the height (it will be constrained by max height)
                picker.setWidth(me.bodyEl.getWidth());
            }
            if (picker.isFloating()) {
                me.doAlign();
            }
        }
    },

    /**
     * Handles a click even on a tree node
     * @private
     * @param {Ext.tree.View} view
     * @param {Ext.data.Model} record
     * @param {HTMLElement} node
     * @param {Number} rowIndex
     * @param {Ext.EventObject} e
     */
    onItemClick:function (view, record, node, rowIndex, e) {
        this.selectItem(record);
    },

    /**
     * Handles a keypress event on the picker element
     * @private
     * @param {Ext.EventObject} e
     * @param {HTMLElement} el
     */
    onPickerKeypress:function (e, el) {
        var key = e.getKey();

        if (key === e.ENTER || (key === e.TAB && this.selectOnTab)) {
            this.selectItem(this.picker.getSelectionModel().getSelection()[0]);
        }
    },

    /**
     * Changes the selection to a given record and closes the picker
     * @private
     * @param {Ext.data.Model} record
     */
    selectItem:function (record) {
        var me = this;
        me.setValue(record.get('id'));
        me.picker.hide();
        me.inputEl.focus();
        me.fireEvent('select', me, record)

    },

    /**
     * Runs when the picker is expanded.  Selects the appropriate tree node based on the value of the input element,
     * and focuses the picker so that keyboard navigation will work.
     * @private
     */
    onExpand:function () {
        var me = this,
            picker = me.picker,
            store = picker.store,
            value = me.value;

        if (value){
            if(store.getNodeById(value)){
                picker.selectPath(store.getNodeById(value).getPath());
            }            
        } else {
            picker.getSelectionModel().select(store.getRootNode());
        }

        Ext.defer(function () {
            picker.getView().focus();
        }, 1);
    },

    /**
     * Sets the specified value into the field
     * @param {Mixed} value
     * @return {Ext.ux.TreePicker} this
     */
    setValue:function (value) {
        var me = this,
            record;

        me.value = value;
        me.checkChange();

        if (me.store.loading) {
            // Called while the Store is loading. Ensure it is processed by the onLoad method.
            return me;
        }

        // try to find a record in the store that matches the value
        record = value ? me.store.getNodeById(value) : me.store.getRootNode();

        // set the raw value to the record's display field if a record was found
        me.setRawValue(record ? record.get(this.displayField) : '');

        return me;
    },
    clearValue:function () {
        this.setValue();
    },
    getSubmitValue:function () {
        return this.getValue();
    },
    /**
     * Returns the current data value of the field (the idProperty of the record)
     * @return {Number}
     */
    getValue:function () {
        return this.value;
    },

    /**
     * Handles the store's load event.
     * @private
     */
    onLoad:function () {
        var value = this.value;

        if (value) {
            this.setValue(value);
        }
    }

});

Ext.override(
    Ext.form.field.Trigger, {
         cls:'x-combobox',
        readOnlyCls:'x-combobox-ro'
    }
)

Ext.override(
    Ext.form.field.Text, {
        initComponent:function () {
            //当不允许为空时，也不允许前后后空格
            var me = this;
            if (me.allowBlank === false && me.stripCharsRe == undefined) {
                me.stripCharsRe = /(^\s+|\s+$)/g;
            }
            me.callParent();
        }
    }
)
Ext.override(Ext.LoadMask,{
    setZIndex: function(index) {
        var me = this,
            owner = me.activeOwner;

        if (owner) {
            // it seems silly to add 1 to have it subtracted in the call below,
            // but this allows the x-mask el to have the correct z-index (same as the component)
            // so instead of directly changing the zIndexStack just get the z-index of the owner comp
            index = parseInt(owner.el.getStyle('zIndex'), 10) + 1;
        }

        try {//解决ie8下将zindex设为NaN造成的问题
            me.getMaskEl().setStyle('zIndex', index - 1);
        } catch(e) {

        }
        return me.mixins.floating.setZIndex.apply(me, arguments);
    }
})

Ext.override(Ext.util.Floating, {
    setZIndex:function (index) {
        var me = this;

        try {
            //解决ie8下将zindex设为NaN造成的问题
            if (!isNaN(index)) {
                me.el.setZIndex(index);
            }
        } catch (e) {

        }



        // Next item goes 10 above;
        index += 10;

        // When a Container with floating descendants has its z-index set, it rebases any floating descendants it is managing.
        // The returned value is a round number approximately 10000 above the last z-index used.
        if (me.floatingDescendants) {
            index = Math.floor(me.floatingDescendants.setBase(index) / 100) * 100 + 10000;
        }
        return index;

    }
})


/**当setReadOnyl时避免右侧边框线不出现*/
Ext.override(Ext.form.field.Trigger,{
    setReadOnly: function(readOnly) {
        if (readOnly != this.readOnly) {
            this.readOnly = readOnly;
            this.updateLayout();
            if (readOnly) {
                this.getEl().addCls('x-combobox-ro');
            } else {
                this.getEl().removeCls('x-combobox-ro');
            }
        }

    }

})

