Ext.define("Ext.picker.Date", {
    extend:"Ext.Component",
    requires:["Ext.XTemplate", "Ext.button.Button", "Ext.button.Split", "Ext.util.ClickRepeater", "Ext.util.KeyNav", "Ext.EventObject", "Ext.fx.Manager", "Ext.picker.Month"],
    alias:"widget.datepicker",
    alternateClassName:"Ext.DatePicker",
    childEls:["innerEl", "eventEl", "prevEl", "nextEl", "middleBtnEl", "footerEl"],
    border:true,
    renderTpl:['<div id="{id}-innerEl" role="grid">', '<div role="presentation" class="{baseCls}-header">', '<div class="{baseCls}-prev"><a id="{id}-prevEl" href="#" role="button" title="{prevText}"></a></div>', '<div class="{baseCls}-month" id="{id}-middleBtnEl">{%this.renderMonthBtn(values, out)%}</div>', '<div class="{baseCls}-next"><a id="{id}-nextEl" href="#" role="button" title="{nextText}"></a></div>', "</div>", '<table id="{id}-eventEl" class="{baseCls}-inner" cellspacing="0" role="presentation">', '<thead role="presentation"><tr role="presentation">', '<tpl for="dayNames">', '<th role="columnheader" title="{.}"><span>{.:this.firstInitial}</span></th>', "</tpl>", "</tr></thead>", '<tbody role="presentation"><tr role="presentation">', '<tpl for="days">', "{#:this.isEndOfWeek}", '<td role="gridcell" id="{[Ext.id()]}">', '<a role="presentation" href="#" hidefocus="on" class="{parent.baseCls}-date" tabIndex="1">', '<em role="presentation"><span role="presentation"></span></em>', "</a>", "</td>", "</tpl>", "</tr></tbody>", "</table>", '<tpl if="showTimer">', '<table cellspacing="0" class="x-datepicker-footer" width="100%">', "<tr>", '<td class="y-hour-left">', '<a href="#" title="', this.prevHourText, '">&#160;</a>', "</td>", '<td class="y-hour-middle" align="center">', "</td>", '<td class="y-hour-right">', '<a href="#" title="', this.nextHourText, '">&#160;</a>', "</td>", "<td>&nbsp;:</td>", '<td class="y-minute-left">', '<a href="#" title="', this.prevMinuteText, '">&#160;</a>', "</td>", '<td class="y-minute-middle" align="center">', "</td>", '<td class="y-minute-right">', '<a href="#" title="', this.nextMinuteText, '">&#160;</a>', "</td>", "<td>&nbsp;:</td>", '<td class="y-second-left">', '<a href="#" title="', this.prevMinuteText, '">&#160;</a>', "</td>", '<td class="y-second-middle" align="center">', "</td>", '<td class="y-second-right">', '<a href="#" title="', this.nextMinuteText, '">&#160;</a>', "</td>", "</tr>", "</table>", '<div id="{id}-hour-mp" class="x-monthpicker"></div><div id="{id}-minute-mp" class="x-monthpicker"></div><div id="{id}-second-mp" class="x-monthpicker"></div>', "</tpl>", '<tpl if="showToday">', '<div id="{id}-footerEl" role="presentation" class="{baseCls}-footer">', "{%this.renderTodayBtn(values, out)%}", "</div>", "</tpl>", "</div>", {firstInitial:function (A) {
        return Ext.picker.Date.prototype.getDayInitial(A)
    }, isEndOfWeek:function (B) {
        B--;
        var A = B % 7 === 0 && B !== 0;
        return A ? '</tr><tr role="row">' : ""
    }, renderTodayBtn:function (A, B) {
        Ext.DomHelper.generateMarkup(A.$comp.todayBtn.getRenderTree(), B)
    }, renderMonthBtn:function (A, B) {
        Ext.DomHelper.generateMarkup(A.$comp.monthBtn.getRenderTree(), B)
    }}],
    todayText:"Today",
    stringDate:true,
    showTimer:false,
    hourText:"Hour",
    ariaTitle:"Date Picker: {0}",
    ariaTitleDateFormat:"F d, Y",
    todayTip:"{0} (Spacebar)",
    minText:"This date is before the minimum date",
    maxText:"This date is after the maximum date",
    disabledDaysText:"Disabled",
    disabledDatesText:"Disabled",
    nextText:"Next Month (Control+Right)",
    prevText:"Previous Month (Control+Left)",
    monthYearText:"Choose a month (Control+Up/Down to move years)",
    monthYearFormat:"F Y",
    startDay:0,
    showToday:true,
	defaultShowValue:new Date(),//zzq加入,初始显示日期
    disableAnim:false,
    baseCls:Ext.baseCSSPrefix + "datepicker",
    longDayFormat:"F d, Y",
    focusOnShow:false,
    focusOnSelect:true,
    width:178,
    initHour:12,
    numDays:42,
    field:null,
    initComponent:function () {
        var B = this, A = Ext.Date.clearTime;
        B.selectedCls = B.baseCls + "-selected";
        B.disabledCellCls = B.baseCls + "-disabled";
        B.prevCls = B.baseCls + "-prevday";
        B.activeCls = B.baseCls + "-active";
        B.nextCls = B.baseCls + "-prevday";
        B.todayCls = B.baseCls + "-today";
        B.dayNames = B.dayNames.slice(B.startDay).concat(B.dayNames.slice(0, B.startDay));
        B.listeners = Ext.apply(B.listeners || {}, {mousewheel:{element:"eventEl", fn:B.handleMouseWheel, scope:B}, click:{element:"eventEl", fn:B.handleDateClick, scope:B, delegate:"a." + B.baseCls + "-date"}});
        this.callParent();
        if (this.showTimer) {
			//zzq加入,初始显示日期
            B.value = this.defaultShowValue
        } else {
            B.value = B.value ? A(B.value, true) : A(new Date())
        }
        B.addEvents("select");
        B.initDisabledDays()
    }, beforeRender:function () {
			//zzq修改Ext.Date.format(new Date(), B.format)修改为Ext.Date.format(this.defaultShowValue, B.format)defaultShowValue不传时默认为当前日期
        var B = this, C = new Array(B.numDays), A = Ext.Date.format(this.defaultShowValue, B.format);
        B.monthBtn = new Ext.button.Split({ownerCt:B, ownerLayout:B.getComponentLayout(), text:"", tooltip:B.monthYearText, listeners:{click:B.showMonthPicker, arrowclick:B.showMonthPicker, scope:B}});
        if (this.showToday) {
            B.todayBtn = new Ext.button.Button({ownerCt:B, ownerLayout:B.getComponentLayout(), text:Ext.String.format(B.todayText, A), tooltip:Ext.String.format(B.todayTip, A), handler:B.selectToday, scope:B})
        }
        B.callParent();
        Ext.applyIf(B, {renderData:{}});
        Ext.apply(B.renderData, {dayNames:B.dayNames, showToday:B.showToday, prevText:B.prevText, nextText:B.nextText, days:C, showTimer:B.showTimer})
    }, finishRenderChildren:function () {
        var A = this;
        A.callParent();
        A.monthBtn.finishRender();
        if (A.showToday) {
            A.todayBtn.finishRender()
        }
    }, onRender:function (B, A) {
        var C = this;
        if (this.showTimer) {
            this.hourLabel = this.el.child("div td.y-hour-middle");
            this.minuteLabel = this.el.child("div td.y-minute-middle");
            this.secondLabel = this.el.child("div td.y-second-middle");
            var D = new Date();
            this.theHours = D.getHours();
            this.theMinutes = D.getMinutes();
            this.theSeconds = D.getSeconds();
            if (this.theHours < 10) {
                txt = "0" + this.theHours
            } else {
                txt = this.theHours
            }
            this.hourLabel.update(txt);
            if (this.theMinutes < 10) {
                txt = "0" + this.theMinutes
            } else {
                txt = this.theMinutes
            }
            this.minuteLabel.update(txt);
            if (this.theSeconds < 10) {
                txt = "0" + this.theSeconds
            } else {
                txt = this.theSeconds
            }
            this.secondLabel.update(txt);
            this.setAllValue();
            // zzq 修改,在一个画面中出现多个时间控件时,处理div的id相同
            this.hoursPicker = Ext.get(this.id+"-hour-mp");
            this.hoursPicker.enableDisplayMode("block");
            this.minutesPicker = Ext.get(this.id+"-minute-mp");
            this.minutesPicker.enableDisplayMode("block");
            this.secondPicker = Ext.get(this.id+"-second-mp");
            this.secondPicker.enableDisplayMode("block")
        }
        C.callParent(arguments);
        C.el.unselectable();
        C.cells = C.eventEl.select("tbody td");
        C.textNodes = C.eventEl.query("tbody td span")
    }, initEvents:function () {
        var C = this, A = Ext.Date, B = A.DAY;
        C.callParent();
        C.prevRepeater = new Ext.util.ClickRepeater(C.prevEl, {handler:C.showPrevMonth, scope:C, preventDefault:true, stopDefault:true});
        C.nextRepeater = new Ext.util.ClickRepeater(C.nextEl, {handler:C.showNextMonth, scope:C, preventDefault:true, stopDefault:true});
        if (this.showTimer) {
            C.prevHourRepeater = new Ext.util.ClickRepeater(this.el.child("div td.y-hour-left a"), {handler:function () {
                if (this.theHours > 0) {
                    this.theHours--;
                    this.theHours = this.theHours % 24;
                    var D = "";
                    if (this.theHours < 10) {
                        D = "0" + this.theHours
                    } else {
                        D = this.theHours
                    }
                    this.hourLabel.update(D);
                    this.setAllValue()
                }
            }, scope:this});
            C.nextHourRepeater = new Ext.util.ClickRepeater(this.el.child("div td.y-hour-right a"), {handler:function () {
                this.theHours++;
                this.theHours = this.theHours % 24;
                var D = "";
                if (this.theHours < 10) {
                    D = "0" + this.theHours
                } else {
                    D = this.theHours
                }
                this.hourLabel.update(D);
                this.setAllValue()
            }, scope:this});
            C.prevMinuteRepeater = new Ext.util.ClickRepeater(this.el.child("div td.y-minute-left a"), {handler:function () {
                if (this.theMinutes > 0) {
                    this.theMinutes--;
                    this.theMinutes = this.theMinutes % 60;
                    var D = "";
                    if (this.theMinutes < 10) {
                        D = "0" + this.theMinutes
                    } else {
                        D = this.theMinutes
                    }
                    this.minuteLabel.update(D);
                    this.setAllValue()
                }
            }, scope:this});
            C.nextMinuteRepeater = new Ext.util.ClickRepeater(this.el.child("div td.y-minute-right a"), {handler:function () {
                this.theMinutes++;
                this.theMinutes = this.theMinutes % 60;
                var D = "";
                if (this.theMinutes < 10) {
                    D = "0" + this.theMinutes
                } else {
                    D = this.theMinutes
                }
                this.minuteLabel.update(D);
                this.setAllValue()
            }, scope:this});
            C.prevSecondRepeater = new Ext.util.ClickRepeater(this.el.child("div td.y-second-left a"), {handler:function () {
                if (this.theSeconds > 0) {
                    this.theSeconds--;
                    this.theSeconds = this.theSeconds % 60;
                    var D = "";
                    if (this.theSeconds < 10) {
                        D = "0" + this.theSeconds
                    } else {
                        D = this.theSeconds
                    }
                    this.secondLabel.update(D);
                    this.setAllValue()
                }
            }, scope:this});
            C.nextSecondRepeater = new Ext.util.ClickRepeater(this.el.child("div td.y-second-right a"), {handler:function () {
                this.theSeconds++;
                this.theSeconds = this.theSeconds % 60;
                var D = "";
                if (this.theSeconds < 10) {
                    D = "0" + this.theSeconds
                } else {
                    D = this.theSeconds
                }
                this.secondLabel.update(D);
                this.setAllValue()
            }, scope:this});
            this.hourLabel.on("click", this.showHoursPicker, this);
            this.minuteLabel.on("click", this.showMinutesPicker, this);
            this.secondLabel.on("click", this.showSecondsPicker, this)
        }
        C.keyNav = new Ext.util.KeyNav(C.eventEl, Ext.apply({scope:C, left:function (D) {
            if (D.ctrlKey) {
                C.showPrevMonth()
            } else {
                C.update(A.add(C.activeDate, B, -1))
            }
        }, right:function (D) {
            if (D.ctrlKey) {
                C.showNextMonth()
            } else {
                C.update(A.add(C.activeDate, B, 1))
            }
        }, up:function (D) {
            if (D.ctrlKey) {
                C.showNextYear()
            } else {
                C.update(A.add(C.activeDate, B, -7))
            }
        }, down:function (D) {
            if (D.ctrlKey) {
                C.showPrevYear()
            } else {
                C.update(A.add(C.activeDate, B, 7))
            }
        }, pageUp:C.showNextMonth, pageDown:C.showPrevMonth, enter:function (D) {
            D.stopPropagation();
            return true
        }}, C.keyNavConfig));
        if (C.showToday) {
            C.todayKeyListener = C.eventEl.addKeyListener(Ext.EventObject.SPACE, C.selectToday, C)
        }
        C.update(C.value)
    }, createHoursPicker:function () {
        if (!this.hoursPicker.dom.firstChild) {
            var B = ['<table  border="0" cellspacing="0" cellpadding="0">'];
            B.push('<tr ><td class="x-datepicker-header" align="center" style="text-align:center;"  colspan="4">', '<span style = "color:white!important;">', this.hourText, "</span>", "</td></tr>");
            for (var A = 0; A < 24; A += 4) {
                B.push("<tr>", '<td role = "gridcell" id = "' + Ext.id() + '" class="x-datepicker-active" style="text-align:center;">', '<a role="presentation" hidefocus="on" href="#" class="x-datepicker-date" tabindex="1">', '<em role="presentation"><span role="presentation">', A, "</span></em>", "</a>", "</td>", '<td role = "gridcell" id = "' + Ext.id() + '" class="x-datepicker-active" style="text-align:center;">', '<a role="presentation" hidefocus="on" href="#" class="x-datepicker-date" tabindex="1">', '<em role="presentation"><span role="presentation">', A + 1, "</span></em>", "</a>", "</td>", '<td role = "gridcell" id = "' + Ext.id() + '" class="x-datepicker-active" style="text-align:center;">', '<a role="presentation" hidefocus="on" href="#" class="x-datepicker-date" tabindex="1">', '<em role="presentation"><span role="presentation">', A + 2, "</span></em>", "</a>", "</td>", '<td role = "gridcell" id = "' + Ext.id() + '" class="x-datepicker-active" style="text-align:center;">', '<a role="presentation" hidefocus="on" href="#" class="x-datepicker-date" tabindex="1">', '<em role="presentation"><span role="presentation">', A + 3, "</span></em>", "</a>", "</td>", "</tr>")
            }
            this.hoursPicker.update(B.join(""));
            this.hoursPicker.on("click", this.onHourClick, this);
            this.mpHours = this.hoursPicker.select("td.x-datepicker-active");
            this.mpHours.each(function (E, D, C) {
                E.dom.xhour = C
            })
        }
    }, showHoursPicker:function () {
        this.createHoursPicker();
        var A = {height:184, width:176};
        this.hoursPicker.setSize(A);
        this.hoursPicker.child("table").setSize(A);
        this.updateMPHour(this.theHours);
        this.hoursPicker.slideIn("t", {duration:0.2})
    }, updateMPHour:function (A) {
        this.mpHours.each(function (B, D, C) {
            if (B.dom.xhour == A) {
                B.addCls("x-datepicker-selected");
                B.dom.childNodes[0].childNodes[0].childNodes[0].setAttribute("style", "border: 1px solid #8DB2E3; font-weight: bold; background-color: #DAE5F3; ")
            } else {
                B.removeCls("x-datepicker-selected");
                B.dom.childNodes[0].childNodes[0].childNodes[0].setAttribute("style", "")
            }
        })
    }, onHourClick:function (C, A) {
        C.stopEvent();
        var D = new Ext.Element(A), B;
        if (B = D.up("td.x-datepicker-active", 3)) {
            this.theHours = B.dom.xhour;
            if (this.theHours < 10) {
                txt = "0" + this.theHours
            } else {
                txt = this.theHours
            }
            this.hourLabel.update(txt);
            this.setAllValue();
            this.hideHourPicker()
        }
    }, hideHourPicker:function (A) {
        if (this.hoursPicker) {
            if (A === true) {
                this.hoursPicker.hide()
            } else {
                this.hoursPicker.slideOut("t", {duration:0.2})
            }
        }
    }, createMinutesPicker:function () {
        if (!this.minutesPicker.dom.firstChild) {
            var B = ['<table border="0" cellspacing="0"'];
            for (var A = 0; A < 60; A += 6) {
                B.push('<tr><td class="x-datepicker-active"><a href="#">', '<em role="presentation"><span role="presentation">', A, "</span></em>", "</a></td>", '<td class="x-datepicker-active"><a href="#">', '<em role="presentation"><span role="presentation">', A + 1, "</span></em>", "</a></td>", '<td class="x-datepicker-active"><a href="#">', '<em role="presentation"><span role="presentation">', A + 2, "</span></em>", "</a></td>", '<td class="x-datepicker-active"><a href="#">', '<em role="presentation"><span role="presentation">', A + 3, "</span></em>", "</a></td>", '<td class="x-datepicker-active"><a href="#">', '<em role="presentation"><span role="presentation">', A + 4, "</span></em>", "</a></td>", '<td class="x-datepicker-active"><a href="#">', '<em role="presentation"><span role="presentation">', A + 5, "</span></em>", "</a></td>", "</tr>")
            }
            this.minutesPicker.update(B.join(""));
            this.minutesPicker.on("click", this.onMinuteClick, this);
            this.mpMinutes = this.minutesPicker.select("td.x-datepicker-active");
            this.mpMinutes.each(function (E, D, C) {
                E.dom.xminute = C
            })
        }
    }, showMinutesPicker:function () {
        this.createMinutesPicker();
        var A = {height:184, width:176};
        this.minutesPicker.setSize(A);
        this.minutesPicker.child("table").setSize(A);
        this.mpSelMinute = (this.activeDate || this.value).getHours();
        this.updateMPMinute(this.theMinutes);
        this.minutesPicker.slideIn("t", {duration:0.2})
    }, updateMPMinute:function (A) {
        this.mpMinutes.each(function (B, D, C) {
            if (B.dom.xminute == A) {
                B.addCls("x-datepicker-selected");
                B.dom.childNodes[0].childNodes[0].childNodes[0].setAttribute("style", "border: 1px solid #8DB2E3; font-weight: bold; background-color: #DAE5F3; ")
            } else {
                B.removeCls("x-datepicker-selected");
                B.dom.childNodes[0].childNodes[0].childNodes[0].setAttribute("style", "")
            }
        })
    }, onMinuteClick:function (C, A) {
        C.stopEvent();
        var D = new Ext.Element(A), B;
        if (B = D.up("td.x-datepicker-active", 3)) {
            this.theMinutes = B.dom.xminute;
            if (this.theMinutes < 10) {
                txt = "0" + this.theMinutes
            } else {
                txt = this.theMinutes
            }
            this.minuteLabel.update(txt);
            this.setAllValue();
            this.hideMinutePicker()
        }
    }, hideMinutePicker:function (A) {
        if (this.hoursPicker) {
            if (A === true) {
                this.minutesPicker.hide()
            } else {
                this.minutesPicker.slideOut("t", {duration:0.2})
            }
        }
    }, createSecondsPicker:function () {
        if (!this.secondPicker.dom.firstChild) {
            var B = ['<table border="0" cellspacing="0"'];
            for (var A = 0; A < 60; A += 6) {
                B.push('<tr><td class="x-datepicker-active"><a href="#">', '<em role="presentation"><span role="presentation">', A, "</span></em>", "</a></td>", '<td class="x-datepicker-active"><a href="#">', '<em role="presentation"><span role="presentation">', A + 1, "</span></em>", "</a></td>", '<td class="x-datepicker-active"><a href="#">', '<em role="presentation"><span role="presentation">', A + 2, "</span></em>", "</a></td>", '<td class="x-datepicker-active"><a href="#">', '<em role="presentation"><span role="presentation">', A + 3, "</span></em>", "</a></td>", '<td class="x-datepicker-active"><a href="#">', '<em role="presentation"><span role="presentation">', A + 4, "</span></em>", "</a></td>", '<td class="x-datepicker-active"><a href="#">', '<em role="presentation"><span role="presentation">', A + 5, "</span></em>", "</a></td>", "</tr>")
            }
            this.secondPicker.update(B.join(""));
            this.secondPicker.on("click", this.onSecondClick, this);
            this.mpSeconds = this.secondPicker.select("td.x-datepicker-active");
            this.mpSeconds.each(function (E, D, C) {
                E.dom.xSecond = C
            })
        }
    }, showSecondsPicker:function () {
        this.createSecondsPicker();
        var A = {height:184, width:176};
        this.secondPicker.setSize(A);
        this.secondPicker.child("table").setSize(A);
        this.mpSelSecond = (this.activeDate || this.value).getHours();
        this.updateMPSecond(this.theSeconds);
        this.secondPicker.slideIn("t", {duration:0.2})
    }, updateMPSecond:function (A) {
        this.mpSeconds.each(function (B, D, C) {
            if (B.dom.xSecond == A) {
                B.addCls("x-datepicker-selected");
                B.dom.childNodes[0].childNodes[0].childNodes[0].setAttribute("style", "border: 1px solid #8DB2E3; font-weight: bold; background-color: #DAE5F3; ")
            } else {
                B.removeCls("x-datepicker-selected");
                B.dom.childNodes[0].childNodes[0].childNodes[0].setAttribute("style", "")
            }
        })
    }, onSecondClick:function (C, A) {
        C.stopEvent();
        var D = new Ext.Element(A), B;
        if (B = D.up("td.x-datepicker-active", 3)) {
            this.theSeconds = B.dom.xSecond;
            if (this.theSeconds < 10) {
                txt = "0" + this.theSeconds
            } else {
                txt = this.theSeconds
            }
            this.secondLabel.update(txt);
            this.setAllValue();
            this.hideSecondPicker()
        }
    }, setAllValue:function () {
        this.value = new Date(Date.parse(Ext.Date.format(this.value, "Y/m/d") + " " + this.theHours + ":" + this.theMinutes + ":" + this.theSeconds));
        if (this.field != null) {
            this.field.setValue(this.getValue())
        }
    }, hideSecondPicker:function (A) {
        if (this.hoursPicker) {
            if (A === true) {
                this.secondPicker.hide()
            } else {
                this.secondPicker.slideOut("t", {duration:0.2})
            }
        }
    }, initDisabledDays:function () {
        var F = this, B = F.disabledDates, E = "(?:", A, G, C, D;
        if (!F.disabledDatesRE && B) {
            A = B.length - 1;
            C = B.length;
            for (G = 0; G < C; G++) {
                D = B[G];
                E += Ext.isDate(D) ? "^" + Ext.String.escapeRegex(Ext.Date.dateFormat(D, F.format)) + "$" : D;
                if (G != A) {
                    E += "|"
                }
            }
            F.disabledDatesRE = new RegExp(E + ")")
        }
    }, setDisabledDates:function (A) {
        var B = this;
        if (Ext.isArray(A)) {
            B.disabledDates = A;
            B.disabledDatesRE = null
        } else {
            B.disabledDatesRE = A
        }
        B.initDisabledDays();
        B.update(B.value, true);
        return B
    }, setDisabledDays:function (A) {
        this.disabledDays = A;
        return this.update(this.value, true)
    }, setMinDate:function (A) {
        this.minDate = A;
        return this.update(this.value, true)
    }, setMaxDate:function (A) {
        this.maxDate = A;
        return this.update(this.value, true)
    }, setValue:function (A) {
		//A有为null的情况
		if (A)
		{
			if (!Ext.isDate(A)) {
				if (this.showTimer) {
					if (A.length != 14) {
						this.value = new Date()
					} else {
						this.value = new Date(Date.parse(A.substring(0, 4) + "/" + A.substring(4, 6) + "/" + A.substring(6, 8) + " " + A.substring(8, 10) + ":" + A.substring(10, 12) + ":" + A.substring(12, 14)))
					}
				} else {
					if (A.length != 8) {
						this.value = Ext.Date.clearTime(new Date())
					} else {
						this.value = new Date(Date.parse(A.substring(0, 4) + "/" + A.substring(4, 6) + "/" + A.substring(6, 8)))
					}
				}
			} else {
				if (this.showTimer) {
					this.value = A
				} else {
					this.value = Ext.Date.clearTime(A, true)
				}
			}
			return this.update(this.value)


		}
        
    }, getValue:function () {
        if (this.stringDate) {
            if (this.showTimer) {
                return Ext.Date.format(this.value, "YmdHis")
            } else {
                return Ext.Date.format(this.value, "Ymd")
            }
        } else {
            return this.value
        }
    }, getDayInitial:function (A) {
        return A.substr(0, 1)
    }, focus:function () {
        this.update(this.activeDate)
    }, onEnable:function () {
        this.callParent();
        this.setDisabledStatus(false);
        this.update(this.activeDate)
    }, onDisable:function () {
        this.callParent();
        this.setDisabledStatus(true)
    }, setDisabledStatus:function (A) {
        var B = this;
        B.keyNav.setDisabled(A);
        B.prevRepeater.setDisabled(A);
        B.nextRepeater.setDisabled(A);
        if (B.showToday) {
            B.todayKeyListener.setDisabled(A);
            B.todayBtn.setDisabled(A)
        }
    }, getActive:function () {
        return this.activeDate || this.value
    }, runAnimation:function (C) {
        var B = this.monthPicker, A = {duration:200, callback:function () {
            if (C) {
                B.hide()
            } else {
                B.show()
            }
        }};
        if (C) {
            B.el.slideOut("t", A)
        } else {
            B.el.slideIn("t", A)
        }
    }, hideMonthPicker:function (A) {
        var C = this, B = C.monthPicker;
        if (B) {
            if (C.shouldAnimate(A)) {
                C.runAnimation(true)
            } else {
                B.hide()
            }
        }
        return C
    }, showMonthPicker:function (A) {
        var C = this, B;
        if (C.rendered && !C.disabled) {
            B = C.createMonthPicker();
            B.setValue(C.getActive());
            B.setSize(C.getSize());
            B.setPosition(-1, -1);
            if (C.shouldAnimate(A)) {
                C.runAnimation(false)
            } else {
                B.show()
            }
        }
        return C
    }, shouldAnimate:function (A) {
        return Ext.isDefined(A) ? A : !this.disableAnim
    }, createMonthPicker:function () {
        var B = this, A = B.monthPicker;
        if (!A) {
            B.monthPicker = A = new Ext.picker.Month({renderTo:B.el, floating:true, shadow:false, small:B.showToday === false, listeners:{scope:B, cancelclick:B.onCancelClick, okclick:B.onOkClick, yeardblclick:B.onOkClick, monthdblclick:B.onOkClick}});
            if (!B.disableAnim) {
                A.el.setStyle("display", "none")
            }
            B.on("beforehide", Ext.Function.bind(B.hideMonthPicker, B, [false]))
        }
        return A
    }, onOkClick:function (B, E) {
        var D = this, F = E[0], C = E[1], A = new Date(C, F, D.getActive().getDate());
        if (A.getMonth() !== F) {
            A = Ext.Date.getLastDateOfMonth(new Date(C, F, 1))
        }
        D.update(A);
        D.hideMonthPicker()
    }, onCancelClick:function () {
        this.selectedUpdate(this.activeDate);
        this.hideMonthPicker()
    }, showPrevMonth:function (A) {
        return this.update(Ext.Date.add(this.activeDate, Ext.Date.MONTH, -1))
    }, showNextMonth:function (A) {
        return this.update(Ext.Date.add(this.activeDate, Ext.Date.MONTH, 1))
    }, showPrevYear:function () {
        this.update(Ext.Date.add(this.activeDate, Ext.Date.YEAR, -1))
    }, showNextYear:function () {
        this.update(Ext.Date.add(this.activeDate, Ext.Date.YEAR, 1))
    }, handleMouseWheel:function (A) {
        A.stopEvent();
        if (!this.disabled) {
            var B = A.getWheelDelta();
            if (B > 0) {
                this.showPrevMonth()
            } else {
                if (B < 0) {
                    this.showNextMonth()
                }
            }
        }
    }, handleDateClick:function (D, A) {
        var C = this, B = C.handler;
        D.stopEvent();
        if (!C.disabled && A.dateValue && !Ext.fly(A.parentNode).hasCls(C.disabledCellCls)) {
            C.doCancelFocus = C.focusOnSelect === false;
            var E = Ext.Date.clearTime(new Date((A.dateValue)));
            if (this.showTimer) {
                E.setSeconds(this.theSeconds);
                E.setMinutes(this.theMinutes);
                E.setHours(this.theHours)
            }
            C.setValue(E);
            delete C.doCancelFocus;
            C.fireEvent("select", C, C.value);
            if (B) {
                B.call(C.scope || C, C, C.value)
            }
            C.onSelect()
        }
    }, onSelect:function () {
        if (this.hideOnSelect) {
            this.hide()
        }
    }, selectToday:function () {
        var C = this, A = C.todayBtn, B = C.handler;
        if (A && !A.disabled) {
            var D = Ext.Date.clearTime(new Date());
            if (this.showTimer) {
                D.setSeconds(this.theSeconds);
                D.setMinutes(this.theMinutes);
                D.setHours(this.theHours)
            }
            C.setValue(D);
            C.fireEvent("select", C, C.value);
            if (B) {
                B.call(C.scope || C, C, C.value)
            }
            C.onSelect()
        }
        return C
    }, selectedUpdate:function (A) {
        var C = this, G = A.getTime(), H = C.cells, I = C.selectedCls, E = H.elements, B, D = E.length, F;
        H.removeCls(I);
        for (B = 0; B < D; B++) {
            F = Ext.fly(E[B]);
            if (F.dom.firstChild.dateValue == G) {
                C.fireEvent("highlightitem", C, F);
                F.addCls(I);
                if (C.isVisible() && !C.doCancelFocus) {
                    Ext.fly(F.dom.firstChild).focus(50)
                }
                break
            }
        }
    }, fullUpdate:function (Y) {
        var c = this, F = c.cells.elements, D = c.textNodes, e = c.disabledCellCls, L = Ext.Date, U = 0, b = 0, E = c.isVisible(), S = +L.clearTime(Y, true), X = +L.clearTime(new Date()), R = c.minDate ? L.clearTime(c.minDate, true) : Number.NEGATIVE_INFINITY, T = c.maxDate ? L.clearTime(c.maxDate, true) : Number.POSITIVE_INFINITY, a = c.disabledDatesRE, Q = c.disabledDatesText, f = c.disabledDays ? c.disabledDays.join("") : false, Z = c.disabledDaysText, V = c.format, J = L.getDaysInMonth(Y), N = L.getFirstDateOfMonth(Y), G = N.getDay() - c.startDay, W = L.add(Y, L.MONTH, -1), B = c.longDayFormat, I, O, A, d, K, M, C, H, P;
        if (G < 0) {
            G += 7
        }
        J += G;
        I = L.getDaysInMonth(W) - G;
        O = new Date(W.getFullYear(), W.getMonth(), I, c.initHour);
        if (c.showToday) {
            d = L.clearTime(new Date());
            A = (d < R || d > T || (a && V && a.test(L.dateFormat(d, V))) || (f && f.indexOf(d.getDay()) != -1));
            if (!c.disabled) {
                c.todayBtn.setDisabled(A);
                c.todayKeyListener.setDisabled(A)
            }
        }
        K = function (g) {
            P = +L.clearTime(O, true);
            g.title = L.format(O, B);
            g.firstChild.dateValue = P;
            if (P == X) {
                g.className += " " + c.todayCls;
                g.title = c.todayText
            }
            if (P == S) {
                g.className += " " + c.selectedCls;
                c.fireEvent("highlightitem", c, g);
                if (E && c.floating) {
                    Ext.fly(g.firstChild).focus(50)
                }
            }
            if (P < R) {
                g.className = e;
                g.title = c.minText;
                return
            }
            if (P > T) {
                g.className = e;
                g.title = c.maxText;
                return
            }
            if (f) {
                if (f.indexOf(O.getDay()) != -1) {
                    g.title = Z;
                    g.className = e
                }
            }
            if (a && V) {
                H = L.dateFormat(O, V);
                if (a.test(H)) {
                    g.title = Q.replace("%0", H);
                    g.className = e
                }
            }
        };
        for (; U < c.numDays; ++U) {
            if (U < G) {
                M = (++I);
                C = c.prevCls
            } else {
                if (U >= J) {
                    M = (++b);
                    C = c.nextCls
                } else {
                    M = U - G + 1;
                    C = c.activeCls
                }
            }
            D[U].innerHTML = M;
            F[U].className = C;
            O.setDate(O.getDate() + 1);
            K(F[U])
        }
        c.monthBtn.setText(Ext.Date.format(Y, c.monthYearFormat))
    }, update:function (B, E) {
        var C = this, D = C.activeDate;
        if (C.rendered) {
            C.activeDate = B;
            if (!E && D && C.el && D.getMonth() == B.getMonth() && D.getFullYear() == B.getFullYear()) {
                C.selectedUpdate(B, D)
            } else {
                C.fullUpdate(B, D)
            }
            C.innerEl.dom.title = Ext.String.format(C.ariaTitle, Ext.Date.format(C.activeDate, C.ariaTitleDateFormat))
        }
        if (this.showTimer) {
            var A = "";
            if (B.getHours() < 10) {
                A = "0" + B.getHours()
            } else {
                A = B.getHours()
            }
            this.hourLabel.update(A);
            this.theHours = B.getHours();
            if (B.getMinutes() < 10) {
                A = "0" + B.getMinutes()
            } else {
                A = B.getMinutes()
            }
            this.minuteLabel.update(A);
            this.theMinutes = B.getMinutes();
            if (B.getSeconds() < 10) {
                A = "0" + B.getSeconds()
            } else {
                A = B.getSeconds()
            }
            this.secondLabel.update(A);
            this.theSeconds = B.getSeconds()
        }
        return C
    }, beforeDestroy:function () {
        var A = this;
        if (A.rendered) {
            Ext.destroy(A.todayKeyListener, A.keyNav, A.monthPicker, A.monthBtn, A.nextRepeater, A.prevRepeater, A.todayBtn);
            delete A.textNodes;
            delete A.cells.elements
        }
        A.callParent()
    }, onShow:function () {
        this.callParent(arguments);
        if (this.focusOnShow) {
            this.focus()
        }
    }}, function () {
    var B = this.prototype, A = Ext.Date;
    B.monthNames = A.monthNames;
    B.dayNames = A.dayNames;
    B.format = A.defaultFormat
});

Ext.define("Ext.form.dateTimePicker", {
    extend:"Ext.form.field.Picker",
    alias:"widget.datetimefield",
    requires:["Ext.picker.Date"],
//    alternateClassName:["Ext.form.DateField", "Ext.form.Date"],
    trigger2Cls:Ext.baseCSSPrefix + "form-clear-trigger",
    trigger1Cls:Ext.baseCSSPrefix + "form-date-trigger",
    format:"Y/m/d",
	timeFormat:"H:i:s",
    stringDate:true,
    altFormats:"m/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|n-j|n/j",
    disabledDaysText:"Disabled",
    disabledDatesText:"Disabled",
   // minText:"The date in this field must be equal to or after {0}",
   // maxText:"The date in this field must be equal to or before {0}",
   // invalidText:"{0} is not a valid date - it must be in the format {1}",
	minText:"日期不能小于 {0}",
	maxText:"日期不能大于 {0}",
	invalidText:"{0} 日期必须格式化为 {1}",
    showTimer:true,
    showToday:true,
	defaultShowValue:new Date(),//zzq加入,初始显示日期
    initTime:"24",
    editable:false,
    initTimeFormat:"H",
    matchFieldWidth:false,
    startDay:0,
    initComponent:function () {
        var D = this, B = Ext.isString, C, A;
        C = D.minValue;
        A = D.maxValue;
        if (D.showTimer) {
            D.format += D.timeFormat
        }
        if (B(C)) {
            D.minValue = D.parseDate(C)
        }
        if (B(A)) {
            D.maxValue = D.parseDate(A)
        }
        D.disabledDatesRE = null;
        D.initDisabledDays();
        D.callParent()
    },
    initValue:function () {
        var A = this, B = A.value;
        if (Ext.isString(B)) {
            A.value = A.rawToValue(B)
        }
        A.callParent()
    }, initDisabledDays:function () {
        if (this.disabledDates) {
            var B = this.disabledDates, A = B.length - 1, C = "(?:";
            Ext.each(B, function (E, D) {
                C += Ext.isDate(E) ? "^" + Ext.String.escapeRegex(E.dateFormat(this.format)) + "$" : B[D];
                if (D !== A) {
                    C += "|"
                }
            }, this);
            this.disabledDatesRE = new RegExp(C + ")")
        }
    }, setDisabledDates:function (A) {
        var C = this, B = C.picker;
        C.disabledDates = A;
        C.initDisabledDays();
        if (B) {
            B.setDisabledDates(C.disabledDatesRE)
        }
    }, setDisabledDays:function (A) {
        var B = this.picker;
        this.disabledDays = A;
        if (B) {
            B.setDisabledDays(A)
        }
    }, setMinValue:function (C) {
        var B = this, A = B.picker, D = (Ext.isString(C) ? B.parseDate(C) : C);
        B.minValue = D;
        if (A) {
            A.minText = Ext.String.format(B.minText, B.formatDate(B.minValue));
            A.setMinDate(D)
        }
    }, setMaxValue:function (C) {
        var B = this, A = B.picker, D = (Ext.isString(C) ? B.parseDate(C) : C);
        B.maxValue = D;
        if (A) {
            A.maxText = Ext.String.format(B.maxText, B.formatDate(B.maxValue));
            A.setMaxDate(D)
        }
    }, getErrors:function (O) {
        var H = this, N = Ext.String.format, I = Ext.Date.clearTime, M = H.callParent(arguments), L = H.disabledDays, D = H.disabledDatesRE, K = H.minValue, G = H.maxValue, F = L ? L.length : 0, E = 0, A, B, J, C;
        O = H.formatDate(O || H.processRawValue(H.getRawValue()));
        if (O === null || O.length < 1) {
            return M
        }
        A = O;
        O = H.parseDate(O);
        if (!O) {
            M.push(N(H.invalidText, A, H.format));
            return M
        }
        C = O.getTime();
        if (K && C < K.getTime()) {
            M.push(N(H.minText, H.formatDate(K)))
        }
        if (G && C > G.getTime()) {
            M.push(N(H.maxText, H.formatDate(G)))
        }
        if (L) {
            J = O.getDay();
            for (; E < F; E++) {
                if (J === L[E]) {
                    M.push(H.disabledDaysText);
                    break
                }
            }
        }
        B = H.formatDate(O);
        if (D && D.test(B)) {
            M.push(N(H.disabledDatesText, B))
        }
        return M
    }, getSubmitValue:function () {
        var B = this.submitFormat || this.format, A = this.getRawValue();
        return A ? Ext.Date.parse(A, B) : ""
    },
    createPicker:function () {
        var A = this, C = Ext.String.format;
        var B = Ext.create("Ext.picker.Date", {
            pickerField:A,
            stringDate:false,
			defaultShowValue:A.defaultShowValue,
            showTimer:A.showTimer,
            ownerCt:A.ownerCt, renderTo:document.body, floating:true, hidden:true, focusOnShow:true, minDate:A.minValue, maxDate:A.maxValue, disabledDatesRE:A.disabledDatesRE, disabledDatesText:A.disabledDatesText, disabledDays:A.disabledDays, disabledDaysText:A.disabledDaysText, format:A.format, showToday:A.showToday, startDay:A.startDay, minText:C(A.minText, A.formatDate(A.minValue)), maxText:C(A.maxText, A.formatDate(A.maxValue)), listeners:{scope:A, select:A.onSelect}, keyNavConfig:{esc:function () {
                A.collapse()
            }}});
        B.field = this;
        return B
    }, onSelect:function (A, C) {
        var B = this;
        B.setValue(C);
        B.fireEvent("select", B, C);
        B.collapse()
    }, onExpand:function () {
        var A = this.value;
        //显示优先次序,value,defaultShowValue,new Date
        if (typeof (A) != "undefined") {
            this.picker.setValue(A)
        } else {
            if (this.defaultShowValue) {
                this.picker.setValue(this.defaultShowValue)
            } else {
                this.picker.setValue(new Date())
            }

        }
    }, onCollapse:function () {
        this.focus(false, 60)
    }, beforeBlur:function () {
        var C = this, A = C.parseDate(C.getRawValue()), B = C.focusTask;
        if (B) {
            B.cancel()
        }
        if (A) {
            C.setValue(A)
        }
    }, safeParse:function (E, F) {
        var D = this, B = Ext.Date, C, A = null;
        if (B.formatContainsHourInfo(F)) {
            A = B.parse(E, F)
        } else {
            C = B.parse(E + " " + D.initTime, F + " " + D.initTimeFormat);
            if (C) {
                A = C
            }
        }
        return A
    }, parseDate:function (E) {
        if (!E || Ext.isDate(E)) {
            return E
        }
        var D = this, G = D.safeParse(E, D.format), B = D.altFormats, F = D.altFormatsArray, C = 0, A;
        if (!G && B) {
            F = F || B.split("|");
            A = F.length;
            for (; C < A && !G; ++C) {
                G = D.safeParse(E, F[C])
            }
        }
        return G
    }, formatDate:function (A) {
        return Ext.isDate(A) ? Ext.Date.dateFormat(A, this.format) : A
    }, rawToValue:function (A) {
        if (this.stringDate) {
            if (this.showTimer) {
                return Ext.Date.format(this.parseDate(A) || A || null, "YmdHis")
            } else {
                return Ext.Date.format(this.parseDate(A) || A || null, "Ymd")
            }
        } else {
            return this.parseDate(A) || A || null
        }
    }, valueToRaw:function (A) {
        if (A == null) {
            return""
        }
        if (typeof (A) != "undefined") {
            if (Ext.isDate(A)) {
                return this.formatDate(this.parseDate(A))
            } else {
                if (this.showTimer) {
                    return this.formatDate(new Date(Date.parse(A.substring(0, 4) + "/" + A.substring(4, 6) + "/" + A.substring(6, 8) + " " + A.substring(8, 10) + ":" + A.substring(10, 12) + ":" + A.substring(12, 14))))
                } else {
                    return this.formatDate(new Date(Date.parse(A.substring(0, 4) + "/" + A.substring(4, 6) + "/" + A.substring(6, 8))))
                }
            }
        }
    }, setRawValue:function (B) {
        var A = this;
        B = Ext.value(B, "");
        if (B.length == 0) {
            A.rawValue = ""
        } else {
            A.rawValue = B
        }
        if (A.inputEl) {
            A.inputEl.dom.value = B
        }
        return B
    }, onTrigger2Click:function () {
        this.reset()
    }});