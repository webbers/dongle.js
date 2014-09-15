/*
* WGrid 1.0
* Copyright (c) 2012 Webers
*
* Depends:
*   - jQuery 1.4.2+
*   - jQuery UI 1.8.16+
*   - jQuery DateTimePicker 1.2 (http://trentrichardson.com/examples/timepicker/)
*
* The MIT License
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

(function ($)
{
    $.Wgrid = function (element, options)
    {
        var $element = $(element);
        $element.data('wgrid', this);

        var plugin = this;
        plugin.settings = {};

        var data;
        var rowsDataArray = [];
        var filters = {};
        var orderby;
        var eventFilter;
        var sort;
		var maxRegisters;
        var skip = 0;
        var params = null;
        var lastId = 0;
        var totalDisplayingItems = 0;
        var totalItems = 0;
        var selectedRowsElements = [];
        var selectedCheckRowsElements = [];
        var selectedRowsIndex = [];
        var defaults =
        {
            listItemCount: 100,
            jsonUrl: null,
            method: "POST",
            hasMoreAfterUrl: null,
            lastId: 0,
            totalItems: 0,
            autoLoad: true,
            useUrlQuerystring: false,
            advancedFilter: 'equals',
            checkboxRowSelect: true,
            showStatusIcon: true,
            additionalParameters: null,
            statusPanel: null,
            complete: null,
            sort: "ASC",
			maxRegisters: false,
            showPaging: true,
            dictionary:
            {
                yes: "Yes",
                no: "No",
                filter: "Filter",
                advancedOptions: "Advanced Options",
                removeFilter: "Remove filter",
                exactlyEqual: "Identical",
                contain: "Contains",
                startWith: "Starts with",
                endWith: "Ends with",
                of: "of",
                items: "items",
                showing: "Showing",
                reload: "Reload",
                many: "many",
                dateFormat: "mm/dd/yyyy",
                from: "From",
                to: "To",
                shortcut: "Shortcut",
				shortcutTitle: "Shortcuts",
				refreshShortcutDescription: "Refresh"
            },
			hour: "Hour",
			second: "Second",
			minute: "Minute",
			time: "Time",
            getId: function(elementData)
				{
					return elementData;
				},
            onError: function ()
				{
					return;
				},
            parseError: function ()
				{
					return;
				},
            refreshShortcut:  
			{
				modifier: 'ctrl',
				keyCode: 82,
				description: "Refresh"
			},
            setShortcut:
            {
                defaultShortcut: 
                {
                    keyCode: null,
                    modifier: null,
                    description: null,
                    callback: function () 
                    {
                        return;    
                    }
                }
            }
        };

        var loadingShow = function ()
        {
            var $loading = $element.find('.wgrid-loader-overlay');
            if ($loading != [])
            {
                setTimeout(function ()
                {
                    $loading.width($element.width());
                }, 50);

            }
            $loading.show();
        };

        var loadingHide = function ()
        {
            var $loading = $element.find('.wgrid-loader-overlay');
            if ($.browser.version == '8.0') {
                $loading = $('.wgrid-loader-overlay');
                setTimeout(function() {
                    $loading.hide();
                }, 200);
            } else {
                $loading.hide();
            }
        };
		
		var verifyMaxRegisters = function() {
            if (plugin.settings.maxRegisters == true) {
                plugin.settings.statusPanel.find('.maxRegisterNumber').show();
                plugin.settings.statusPanel.find('.more-items-button').hide();
				plugin.settings.statusPanel.find('.get-more-items').css("margin-right", "10px");
            }
        };

        //plugin configurations
        plugin.settings = $.extend({}, defaults, options);
		
		plugin.settings.refreshShortcut.description = plugin.settings.dictionary.refreshShortcutDescription;
        if (plugin.settings.loadOverlay !== null)
        {
            loadingHide();
        }
        
        if (!!plugin.settings.eventFilter){
            eventFilter = plugin.settings.eventFilter;
        }
		
		var datetimepickerOptions = {
			showSecond: true,
			timeFormat: 'HH:mm:ss',
			stepHour: 1,
			stepMinute: 1,
			stepSecond: 1,
			showButtonPanel: false,
			hourText: plugin.settings.hour,
			secondText: plugin.settings.second,
			minuteText: plugin.settings.minute,
			timeText: plugin.settings.time
		};

        /*------------------ INTERNAL FUNCTIONS ------------*/
        var getScrollBarWidth = function ()
        {
            var scrollbarWidth;

            if ($.browser.msie)
            {
                var $textarea1 = $('<textarea cols="10" rows="2"></textarea>')
                    .css({ position: 'absolute', top: -1000, left: -1000 })
                    .appendTo('body');
                var $textarea2 = $('<textarea cols="10" rows="2" style="overflow: hidden;"></textarea>')
                        .css({ position: 'absolute', top: -1000, left: -1000 }).appendTo('body');
                scrollbarWidth = $textarea1.width() - $textarea2.width();
                $textarea1.add($textarea2).remove();

                return scrollbarWidth;
            }
            var $div = $('<div />')
                    .css({ width: 100, height: 100, overflow: 'auto', position: 'absolute', top: -1000, left: -1000 })
                    .prependTo('body').append('<div />').find('div')
                    .css({ width: '100%', height: 200 });
            scrollbarWidth = 100 - $div.width();
            $div.parent().remove();
            return scrollbarWidth;
        };

        var getQuerystring = function ()
        {
            var filterParams = $.param(filters);
            var querystring = "?skip=" + skip;
            var additional = "";
            if (plugin.settings.keyColumn !== "" && plugin.settings.keyColumn !== null && plugin.settings.keyColumn !== undefined)
            {
                querystring = querystring + "&keyColumn=" + plugin.settings.keyColumn;
            }

            if (orderby === "" || orderby === null || orderby === undefined)
            {
                orderby = plugin.settings.orderby;
            }

            if (sort === "" || sort === null || sort === undefined)
            {
                sort = plugin.settings.sort;
            }
            
            if(!!plugin.settings.additionalParameters) 
            {
                for (var param in plugin.settings.additionalParameters) 
                {
                    var p;
                    if(typeof plugin.settings.additionalParameters[param] == "object") 
                    {
                        p = plugin.settings.additionalParameters[param].Value;
                    } 
                    else 
                    {
                        p = plugin.settings.additionalParameters[param];
                    }                    
					additional = additional + "&" + param + "=" + p;
                }
            }

            querystring = filterParams === "" ? querystring : querystring + "&" + filterParams;
            querystring = orderby === undefined ? querystring : querystring + "&orderby=" + orderby + "&sort=" + sort + "&listItemCount=" + plugin.settings.listItemCount;
            querystring = lastId === 0 ? querystring : querystring + "&lastId=" + lastId;
            querystring = eventFilter === undefined ? querystring : querystring + "&eventFilter=" + eventFilter;
            querystring = !additional ? querystring : querystring + additional;

            if (plugin.settings.useUrlQuerystring)
            {
                querystring = window.location.search.indexOf('?') === 0 ?
                    querystring + "&" + window.location.search.substr(1) :
                    querystring;
            }
            return querystring;
        };

        var moreMargin = '<div id="more-margin" style="width:10px; float:right;">&nbsp</div>';

		var createLinkHtml = function(linkString)
		{
			var separatedLink = linkString.split('|');
			var link = separatedLink.length >= 2 ? separatedLink[1] : separatedLink[0];
			var description = separatedLink[0];
		    var target = " target=\"_blank\"";
		    if(separatedLink.length == 3 && separatedLink[2] == '0') 
		    {
		        target = "";
		    }
			
			return '<a href="' + link + '"'+ target + '>' + description + '</a>';
		}
		
        var checkIfNotExistsOldItems = function (itemsCount)
        {
            var moreItemsButton = plugin.settings.statusPanel.find('.more-items-button');
			
			if (itemsCount < plugin.settings.listItemCount || itemsCount === 0)
            {
                moreItemsButton.hide();
				plugin.settings.statusPanel.find('.get-more-items').css("margin-right", "10px");
                return;
            }
            else
            {
                moreItemsButton.width("41");
            }
        };

        var getElementId = function (elementData, i)
        {
            var elementId = elementData.Id;
            if (elementId === null || elementId === undefined)
            {
                elementId = elementData.rownum;
				if (elementId === null || elementId === undefined) {
                    elementId = i;
                }
            }

            return elementId;
        };

        var getRowClass = function (elementData)
        {
            var rowClass = plugin.settings.classRowObjectField !== null ? elementData[plugin.settings.classRowObjectField] : "";

            if (plugin.settings.colorizeItems === false)
            {
                rowClass = 1;
            }

            return rowClass;
        };

        var getCheckTableRow = function (elementData, i)
        {
            var tableRow = '<tr item-id="' + getElementId(elementData, i) + '" class="class-' + getRowClass(elementData) + '"><td class="wgrid-checkbox-column"><input type="checkbox" class="wgrid-checkbox-item" value="' + getElementId(elementData, i) + '" name="selectedIds"></td>';
            tableRow += plugin.settings.showStatusIcon ? '<td><span class="wgrid-status-icon"></span></td>' : "";
            tableRow += '</tr>';
            return tableRow;
        };

        var fromDateToString = function (date, mask)
        {
            if (!!date)
            {
                mask = mask ? mask : plugin.settings.dictionary.dateFormat + ' HH:MM:ss';
                return dateFormat(parseInt(date.match(/\d+/), 10), mask);
            } return "";
        };

        var getTableRow = function (elementData, i)
        {
            var rowToInsert = [];
            rowToInsert.push("<tr item-id='" + getElementId(elementData, i) + "' class='class-" + getRowClass(elementData) + "'>");
            var i = 0;
            for (var column in data.columns)
            {
                var columnType = data.columns[column];
                var columnValue = elementData[column];

                if (columnType == "tag")
                {
                    columnValue = creteTagBox(columnValue);
                }

                columnValue = (columnType === "datetime" || columnType === "daterange") ? fromDateToString(columnValue) : columnValue;
                columnValue = columnType === "bool" ? (columnValue ? plugin.settings.dictionary.yes : plugin.settings.dictionary.no) : columnValue;
				columnValue = columnValue === null || columnValue === undefined ? "" : columnValue;
				
				var columnCleanedValue = columnValue;
				
                columnValue = columnType === "link" ? createLinkHtml(columnValue) : columnValue;
				
				var title = 'title="' + columnCleanedValue + '"';
				if (data.headerColumns[i].getAttribute("disable_title") === "true") {
				    title = "";
				}

                if (i === 0 || column === "MachineId")
                {
                    rowToInsert.push('<td>' + columnValue + '</td>');
                }
				else if (data.headerColumns[i].getAttribute("ellipsis") === "true" || data.headerColumns[i].getAttribute("ellipsis") === true)
                {
				    rowToInsert.push('<td ' + title + '><div class="wgrid-ellipsis">' + columnValue + '</div></td>');
                }
                else
                {
				    rowToInsert.push('<td ' + title + '>' + columnValue + '</td>');
                }
				i++;
            }
            rowToInsert.push("</tr>");

            return rowToInsert.join('');
        };

        var hideMoreItems = function ()
        {
            var moreItemsButton = plugin.settings.statusPanel.find('.more-items-button');
			$(this).closest("#more-margin").remove();
            moreItemsButton.hide();
			plugin.settings.statusPanel.find('.get-more-items').css("margin-right", "10px");
        };

        var insertJsonItems = function (completeUrl, callback)
        {
            //plugin.settings.statusPanel.find('.reload-button').wbutton('disable');
            loadingShow();
            var totalInserted = 0;

            $.ajax({
                url: completeUrl,
                type: plugin.settings.method,
                dataType: 'json',
                async: true,
                data: params,
                cache: false,
                success: function (json)
                {
                    loadingShow();
                    var jsonData = json.Data;
                    if (jsonData !== null && jsonData.length > 0)
                    {
                        totalInserted = jsonData.length;
                        var rowsToInsert = [];
                        var checkRowsToInsert = [];

                        //INSERT DATA COMMING FROM JSON
                        var i;
                        for (i = 0; i < jsonData.length; i++)
                        {
                            var elementData = jsonData[i];
                            rowsDataArray.push(elementData);

                            lastId = getElementId(elementData, i) > lastId ? getElementId(elementData, i) : lastId;
                            rowsToInsert.push(getTableRow(elementData, i));
                            checkRowsToInsert.push(getCheckTableRow(elementData, i));
                        }

                        data.table.append(rowsToInsert.join(''));
                        data.checkTable.append(checkRowsToInsert.join(''));

                        resizeColumns();
                        checkIfNotExistsOldItems(totalInserted);

                        totalDisplayingItems += totalInserted;

                        var totalParsed = parseInt(plugin.settings.statusPanel.find('.wgrid-total').text(), 10);
                        if (typeof totalParsed == "number" && totalParsed != -1)
                        {
                            totalItems = plugin.settings.statusPanel.find('.wgrid-total').text();
                        }
                        else
                        {
                            totalItems = json.TotalCount;
                        }

                        data.tableRows = $element.find('.wgrid-table tr');
                    }
                    else
                    {
                        hideMoreItems();
                    }
                    reloadTotalsDisplays(totalInserted);
                    loadingHide();
					verifyMaxRegisters();
										
                    if (typeof callback == 'function')
                    {
                        callback();
                    }
                    if (typeof plugin.settings.complete == 'function')
                    {
                        plugin.settings.complete();
                    }
                },
                error: function (xhr, textStatus, errorThrown) 
                {
                    if(textStatus == "parsererror") 
                    {
                        plugin.settings.parseError();
                    }
                    if(textStatus == "error") 
                    {
                        plugin.settings.onError();
                    }
                }
            });
        };

        var creteTagBox = function (tags)
        {
            if (tags === null || tags === undefined || tags.length === 0) return '  ';

            var tagBox = [];
            var colorClass = tags.length > 1 ? 'multi-color' : 'color-' + tags[0].Color;

            tagBox.push('<div class="tag-div">');

            if (tags.length > 1){
                tagBox.push('<div class="tag-count">');
                tagBox.push(tags.length);
                tagBox.push('</div>');
            }
            else{
                tagBox.push('<div class="tag-count">');
                tagBox.push("   ");
                tagBox.push('</div>');
            }
            tagBox.push('<div class="tag-icon tip ');
            tagBox.push(colorClass);
            tagBox.push('" title="');

            for (var tag in tags)
            {
                var tagElement = tags[tag];
                tagBox.push("<div class='tipsy-tag-name'>");
                tagBox.push(tagElement.Name);
                tagBox.push('</div>');
            }

            tagBox.push('""></div>');
            tagBox.push('</div>');

            return tagBox.join('');
        };

        var reloadGrid = function ()
        {
            loadingShow();
            skip = 0;
            lastId = 0;
            totalDisplayingItems = 0;
			var gridType = params || '';

            if (gridType.queryItensCount == 'queryItensCount') {
                plugin.settings.listItemCount = cookieManager.read($.console.regional.queryItensCount);
            }
            else if (gridType.queryItensCount == 'queryItensCountEv') {
                plugin.settings.listItemCount = cookieManager.read($.console.regional.queryItensCountEv);
            }
            else if(gridType.queryItensCount == 'queryItensCountAc'){
                plugin.settings.listItemCount = cookieManager.read($.console.regional.queryItensCountAc);
            }

            if (plugin.settings.jsonUrl === null) { return; }
            var completeUrl = plugin.settings.jsonUrl + getQuerystring();
            plugin.settings.statusPanel.find('.wgrid-total').html(plugin.settings.dictionary.many);
            clearGrid();
            insertJsonItems(completeUrl);
            resizeColumns();
            if ($.browser.version == '9.0')
            {
                $('.wgrid-main .wgrid-layout').width('auto');
            }
        };

        var retrieveMoreItems = function ()
        {
            var processingData = $element.data("processing");
            if (processingData)
            {
                return;
            }

            $element.data("processing", true);

            skip = data.tableRows.length;

            if (plugin.settings.jsonUrl === null) { return; }
            var completeUrl = plugin.settings.jsonUrl + getQuerystring();

            insertJsonItems(completeUrl, function ()
            {
                $element.data("processing", false);
                $element.find(".wgrid-container").scrollTop($(".wgrid-container").attr("scrollHeight"));
            });
        };

        var getGridColumns = function ()
        {
            var columns = {};
            $element.find('.wgrid-main table th').each(function ()
            {
                var fieldName = $(this).attr('field_name');
                var fieldType = $(this).attr('field_type');

                columns[fieldName] = fieldType;
            });
            return columns;
        };

        var clearGrid = function ()
        {
            rowsDataArray = [];
            data.table.html("");
            data.checkTable.html("");
        };

        var removeSelectedRows = function (removeFromTotal)
        {
            $(selectedRowsElements).remove();
            $(selectedCheckRowsElements).remove();

            data.tableRows = data.table.find('tr');
            totalDisplayingItems = totalDisplayingItems - $(selectedRowsElements).length;

            if (removeFromTotal && totalItems !== null)
            {
                totalItems = totalItems - $(selectedRowsElements).length;
            }

            reloadTotalsDisplays();
			loadingHide();
        };

        var resizeColumns = function ()
        {
            var count = 0;
            data.content.width(90000);

            var firstColumns = $element.find('.wgrid-container table tr:first').find('td');
            firstColumns.width('auto');
            data.headerColumns.width('auto');

            firstColumns.each(function ()
            {
                var columnWidth = $(this).width();
                var columnHeaderWidth = $(data.headerColumns[count]).outerWidth(true);

                if (columnWidth >= columnHeaderWidth)
                {
                    $(data.headerColumns[count]).width(columnWidth);
                    $(this).width(columnWidth);
                }
                else
                {
                    $(data.headerColumns[count]).width(columnHeaderWidth);
                    $(this).width(columnHeaderWidth);
                }
                count++;
            });
            data.content.width(data.table.width());

            if (firstColumns.length === 0)
            {
                data.content.width(data.headerTable.width());
            }
            if ($.browser.msie) $(".wgrid-container").scrollLeft(1);

        };

        var addRowSelection = function ($row)
        {
            checkALine($row, true);
        };

        var clearRowSelection = function ()
        {
            $(selectedRowsElements).removeClass('wgrid-selected-line');
            $(selectedCheckRowsElements).find('input[type=checkbox]').attr('checked', false);

            selectedRowsElements = [];
            selectedRowsIndex = [];
        };

        var setRowSelection = function (row, mousebutton, isMultiSelectKeyPressed)
        {
            if ((mousebutton == 'right' && !row.is('.wgrid-selected-line')) ||
                (mousebutton == 'left' && !isMultiSelectKeyPressed))
            {
                clearRowSelection();
            }
            addRowSelection(row);
        };

        var reloadTotalsDisplays = function (totalInserted)
        {
            loadingShow();
            plugin.settings.statusPanel.find('.wgrid-displaying').html(totalDisplayingItems);

            var totalItemsText = totalItems === null || totalItems === undefined ? plugin.settings.dictionary.many : totalItems;

            if (totalDisplayingItems < plugin.settings.listItemCount && totalItems !== null)
            {
                totalItemsText = totalDisplayingItems;
            }

            if ((totalInserted !== null || totalInserted !== undefined))
            {
                if (totalInserted < plugin.settings.listItemCount)
                {
                    totalItemsText = totalDisplayingItems;
                }
				else 
				{
                    totalItemsText = plugin.settings.dictionary.many;
                }
            }

            plugin.settings.statusPanel.find('.wgrid-total').html(totalItemsText);

            plugin.settings.statusPanel.find('.more-items-button>.content>span').html('+ ' + plugin.settings.listItemCount);

            if (!plugin.settings.showPaging)
            {
				plugin.settings.statusPanel.find('.more-items-button').before(moreMargin).hide();
            }
        };

        var addCheckboxColumns = function ()
        {
            $element.find('.wgrid-table tr').each(function ()
            {
                addCheckboxColumn($(this));
            });
        };

        var addCheckboxColumn = function (row)
        {
            var checkboxLine = $('<tr><td class="wgrid-checkbox-column"><input type="checkbox" class="wgrid-checkbox-item" value="' + row.attr('rowId') + '" name="wgridSelectedIds"></td><td><span class="wgrid-status-icon"></span></td></tr>');
            checkboxLine.attr('class', row.attr('class'));

            data.checkTable.append(checkboxLine);
        };

        this.methods =
        {
            setWidth: function (width)
            {
                $element = $(this);
                var headerCheckWidth = data.headerCheck.width();
                $element.width(width);
                data.main.width(width - headerCheckWidth);

                data.headerContainer.width(width - headerCheckWidth);
                data.container.width(width - headerCheckWidth);
                data.headerContainer.width(data.headerContainer.width());
            },
            setHeight: function (height)
            {
                $element = $(this);

                data.checkContainer.height(height - data.scrollBarWidth - data.headerMain.height() - 1);
                data.container.height(height - data.headerMain.height() - 1);
            },
            getFilters: function ()
            {
                return filters;
            },
            getOrderAndSort: function ()
            {
                if (orderby === null)
                {
                    return null;
                }
                return { order: orderby, sort: sort };
            },
            filter: function ()
            {
                reloadGrid();
            },
            clearGrid: function ()
            {
                clearGrid();
            },
            retrieveMoreItems: function (callback)
            {
                retrieveMoreItems(callback);
            },
            setRowSelection: function (row, mouseButton)
            {
                setRowSelection(row, mouseButton);
            },
            setLastId: function (id)
            {
                lastId = id;
            },
            getLastId: function ()
            {
                return lastId;
            },
            setEventFilter: function (filter)
            {
                eventFilter = filter;
            },
            getRowSelections: function ()
            {
                return selectedRowsElements;
            },
            getSelectedRowsData: function ()
            {
                var returnArray = [];
                var a;
                for (a = 0; a < selectedRowsIndex.length; a++)
                {
                    returnArray.push(rowsDataArray[selectedRowsIndex[a]]);
                }
                return returnArray;
            },
            getRowsData: function ()
            {
                return rowsDataArray;
            },
            removeFilters: function ()
            {
                filters = null;
                filters = {};
                reloadGrid();
            },
            setSelectedRowsDataField: function (field, value)
            {
                var a;
                for (a = 0; a < selectedRowsIndex.length; a++)
                {
                    rowsDataArray[selectedRowsIndex[a]][field] = value;
                }
            },
            removeSelectedRows: function (removeFromTotal)
            {
                removeSelectedRows(removeFromTotal);
            },
            reloadWithNewJsonUrl: function (newJsonUrl)
            {
                plugin.settings.jsonUrl = newJsonUrl;
                reloadGrid();
            },
            reloadWithParameter: function (parameters)
            {
                params = parameters;
                reloadGrid();
            },
            resizeColumns: function ()
            {
                resizeColumns();
            },
            reloadGrid: function ()
            {
                reloadGrid();
            },
            loaderShow: function ()
            {
                loadingShow();
            },
            loaderHide: function ()
            {
                loadingHide();
            },
			verifyMaxRegisters: function() {
                verifyMaxRegisters();
            },
            updateRow: function (elementData)
            {
                var elementId = getElementId(elementData);
                var elementRow = data.table.find('tr[item-id=' + elementId + ']');
                var updatedRow = $(getTableRow(elementData));
                updatedRow.addClass('wgrid-selected-line');

                elementRow.after(updatedRow);
                elementRow.remove();
                updateSelectedElementsArrays();
                resizeColumns();
            },
            getHeaderColumns: function ()
            {
                return data.headerColumns;
            },
            getHeaderColumnIndex: function (columnName)
            {
                return data.headerColumns.index(data.headerColumns.filter('th[field_name="' + columnName + '"]'));
            },
            getQuerystring: function ()
            {
                return getQuerystring();
            }
        };

        //Colocar tabela dentro da estrutura
        if (plugin.settings.full)
        {
            var $elementStructure = $('<div class="wgrid" tabindex="0">' +
            '<div class="wgrid-left">' +
                '<div class="wgrid-header-check">' +
                    '<input type="checkbox" class="wgrid-checkbox-all" />' +
                '</div>' +
                '<div class="wgrid-check-container wgrid-layout">' +
                    '<form class="wgrid-form">' +
                    '<table class="wgrid-check-content">' +
                    '</table>' +
                    '</form>' +
                '</div>' +
            '</div>' +
            '<div class="wgrid-main">' +
                '<div class="wgrid-header-container wgrid-layout">' +
                    '<div class="wgrid-header-content"></div>' +
                '</div>' +
                '<div class="wgrid-container wgrid-layout">' +
                    '<div class="wgrid-content">' +
                        '<table class="wgrid-table">' +
                        '</table>' +
                    '</div>' +
                '</div>' +
            '</div>' +
                '<div class="wgrid-status-panel">' +
                '<div id="retrieve-more-items-bar" class="wgrid-bar">' +
                    '<div class="get-more-items" style="float:right;"><div class="more-items-button">&nbsp;</div><div style="float:right; text-align:right;">' +
                        plugin.settings.dictionary.showing + ' <span class="wgrid-displaying">' + plugin.settings.listItemCount + '</span> ' + plugin.settings.dictionary.of + ' ' +
                        '<span class="wgrid-total">-1</span> ' + plugin.settings.dictionary.items +
                        '</div>' +
                    '</div>' +
                    '<div class="reload-items" style="float:left;">' +
                        '<div class="reload-button">' +
                            plugin.settings.dictionary.reload + '...' +
                        '</div>' +
                     '</div>' +
                '</div>' +
            '</div><div class="wgrid-loader-overlay"></div>' +
            '</div>'
            );

            $element.after($elementStructure);
            $elementStructure.find('.wgrid-header-content').append($element);
            var wgridContextMenu = $element.attr("contextmenuid");

            $element = $elementStructure;

            $element.data('wgrid', plugin);
            $element.attr("contextmenuid", wgridContextMenu);
            plugin.settings.statusPanel = $elementStructure.find('.wgrid-status-panel');

            if(plugin.settings.refreshShortcut.keyCode !== null && plugin.settings.activateRefreshShortcut)  
            {
                var shortcut = plugin.settings.dictionary.shortcut + ': ';

                switch (plugin.settings.refreshShortcut.modifier) 
				{
                case 'ctrl':
                    shortcut += 'Ctrl+';
                    break;
                case 'alt':
                    shortcut += 'Alt+';
                    break;
                case 'shift':
                    shortcut += 'Shift+';
                    break;
                }

                shortcut += String.fromCharCode(plugin.settings.refreshShortcut.keyCode);

                $('.reload-button').attr({'title': shortcut}).addClass('tip');
            }
        }

        data = 
        {
            main: $element.find('.wgrid-main'),
            container: $element.find('.wgrid-container'),
            content: $element.find('.wgrid-content'),
            headerCheck: $element.find('.wgrid-header-check'),
            headerContainer: $element.find('.wgrid-header-container'),
            headerTable: $element.find('.wgrid-header-container table'),
            headerColumns: $element.find('.wgrid-main table').find('th'),
            table: $element.find('.wgrid-table'),
            tableRows: $element.find('.wgrid-table').find('tr'),
            checkTable: $element.find('.wgrid-check-content'),
            checkContainer: $element.find('.wgrid-check-container'),
            checkRows: $element.find('.wgrid-check-content').find('tr'),
            scrollBarWidth: getScrollBarWidth(),
            columns: getGridColumns()
        };

        lastId = plugin.settings.lastId;

        $(this).data('data', data);
        $('.wgrid-horizontal-empty').height(data.scrollBarWidth);

		
        var shortcutDisplayList = $('<table style="margin: 10px"></table>');
        
        for(var key in plugin.settings.setShortcut) 
        {
            if(plugin.settings.setShortcut[key].keyCode !== null) 
            {
                    
                var shortcutString = '';

                if(plugin.settings.setShortcut[key].modifier === 'ctrl' || plugin.settings.setShortcut[key].modifier === 'alt' || plugin.settings.setShortcut[key].modifier === 'shift') 
				{
					shortcutString = plugin.settings.setShortcut[key].modifier;
					shortcutString = shortcutString.charAt(0).toUpperCase() + shortcutString.slice(1);
                }
                
                    
                if(shortcutString !== '') 
                {
                    shortcutString += '+';
                }

                var keyCode = String.fromCharCode(plugin.settings.setShortcut[key].keyCode);

                switch (plugin.settings.setShortcut[key].keyCode) 
				{
                    case 46:
                        keyCode = 'Delete';
                    break;
                    case 45:
                        keyCode = 'Insert';    
                    break;
                }

                shortcutString += keyCode;

                shortcutDisplayList.append('<tr><td><b>'+shortcutString+'</b></td><td>&nbsp;&nbsp;'+plugin.settings.setShortcut[key].description+'</td></tr>');
            }
        }
        
        if(plugin.settings.refreshShortcut.keyCode !== null) 
		{
        
            shortcutString = '';
            
            if(plugin.settings.refreshShortcut.modifier !== undefined && (plugin.settings.refreshShortcut.modifier === 'ctrl' || plugin.settings.refreshShortcut.modifier === 'alt' || plugin.settings.refreshShortcut.modifier === 'shift'))
			{
                shortcutString = plugin.settings.refreshShortcut.modifier;
				shortcutString = shortcutString.charAt(0).toUpperCase() + shortcutString.slice(1);
            }     
                    
            if(shortcutString !== '') 
            {
                shortcutString += '+';
            }

            shortcutString += String.fromCharCode(plugin.settings.refreshShortcut.keyCode);
            
            shortcutDisplayList.append('<tr><td><b>'+shortcutString+'</b></td><td>&nbsp;&nbsp;'+plugin.settings.refreshShortcut.description+'</td></tr>');
        }
		
		this.directionDown = false;
		$element.bind('keydown', function (event) 
		{
			var hasScrollBar = $element.find('.wgrid-container').get(0).scrollHeight > $element.find('.wgrid-container').height();
		
			for(var key in plugin.settings.setShortcut) 
			{
				if(plugin.settings.setShortcut[key].keyCode !== null) 
				{
					
					var ctrl = true;
					var shift = true;
					var alt = true;

					switch (plugin.settings.setShortcut[key].modifier) 
					{
						case 'ctrl':
							ctrl = event.ctrlKey;
							shift = !event.shiftKey;
							alt = !event.altKey;
						break;
						case 'alt':
							ctrl = !event.ctrlKey;
							shift = !event.shiftKey;
							alt = event.altKey;
						break;
						case 'shift':
							ctrl = !event.ctrlKey;
							shift = event.shiftKey;
							alt = !event.altKey;
						break;
						default :
							ctrl = !event.ctrlKey;
							shift = !event.shiftKey;
							alt = !event.altKey;
                        break;
					}
					
					if(event.keyCode === plugin.settings.setShortcut[key].keyCode && ctrl && shift && alt) 
					{
						plugin.settings.setShortcut[key].callback(plugin, selectedRowsElements);
					}
				}
			}
			
			if(plugin.settings.refreshShortcut.keyCode !== null) 
			{

				var modifier = true;

				switch (plugin.settings.refreshShortcut.modifier) 
				{
					case 'ctrl':
						modifier = event.ctrlKey;
					break;
					case 'alt':
						modifier = event.altKey;
					break;
					case 'shift':
						modifier = event.shiftKey;
					break;
				}                
				
				if(modifier && event.keyCode === plugin.settings.refreshShortcut.keyCode) 
				{
					reloadGrid();
					clearRowSelection();

					if(event.preventDefault)
					{
						event.preventDefault();
					}
					else
					{
						return false;
					}
				}
			}
			
			if(event.keyCode === 193 && !$('.ui-dialog:visible')[0] && !event.ctrlKey && event.shiftKey && !event.altKey) 
			{
				shortcutDisplayList.dialog(
				{
					title: plugin.settings.dictionary.shortcutTitle,
					modal: true,
			        close: function () { $('.wgrid:eq(0)').focus(); }
				});
				return false;
			}
			
			var table = $element.find('.wgrid-table');
			var container = $element.find(".wgrid-container");
			
			if(event.keyCode === 36 && !event.ctrlKey && !event.shiftKey && !event.altKey) 
			{
				row = $element.find('table.wgrid-table tr').first();
				
				if(row.attr('item-id') !== table.find('.wgrid-selected-line').first().attr('item-id') && hasScrollBar) 
				{
					container.scrollTop(0);
				}

				clearRowSelection();
				checkALine(row, true);
			}
			else if(event.keyCode === 35 && !event.ctrlKey && !event.shiftKey && !event.altKey) 
			{
				row = table.find('tr').last();
				
				if(row.attr('item-id') !== table.find('.wgrid-selected-line').last().attr('item-id') && hasScrollBar) 
				{
					container.scrollTop(row.position().top+row.offset().top+row.height()*7);
				}

				clearRowSelection();
				checkALine(row, true);
			}
			
			if(event.keyCode === 40) 
			{
				var row = table.find('.wgrid-selected-line');
				
				if(!event.shiftKey) 
				{
					var check = null;
					if(row.length > 1) {
						check = row.last().next();
					}
					if(row.last().next()[0]) 
					{
						clearRowSelection();
					}
					if(check) 
					{
						checkALine(check, true);
					}
				}
				
				if(!row[0]) 
				{
					row = table.find('tr').first();
					checkALine(row, true);
					if(hasScrollBar)
					{
						container.scrollTop(0);
					}
					this.directionDown = true;
				}
				else 
				{
					var lastSelectedRow = row.last();
					
					if(row.length == 1) 
					{
						this.directionDown = true;
					}
					
					if(!this.directionDown) 
					{
						checkALine(row.first(), false);
					}
					else if(lastSelectedRow.next()[0])
					{
						checkALine(lastSelectedRow.next(), true);
					}

					if(lastSelectedRow.position().top > container.height()-lastSelectedRow.height()*2) 
					{
						container.scrollTop(container.scrollTop() + lastSelectedRow.height());
					}
					else if((lastSelectedRow.position().top < 0))
					{
						container.scrollTop(container.scrollTop()+lastSelectedRow.position().top-lastSelectedRow.height()*2);
					}
				}
			}
			else if(event.keyCode === 38) 
			{
				row = table.find('.wgrid-selected-line');
				
				if(!event.shiftKey) 
				{
					check = null;
					if(row.length > 1) 
					{
						check = row.first().prev();
					}
					if(row.first().prev()[0]) 
					{
						clearRowSelection();
					}
					if(check) 
					{
						checkALine(check, true);
					}
				}
				
				if(!row[0]) 
				{
					row = table.find('tr').last();
					checkALine(row, true);
					if(hasScrollBar)
					{
						container.scrollTop(row.offset().top);
					}
					this.directionDown = false;
				}
				else 
				{
					var firstSelectedRow = row.first();
					
					
					if(row.length == 1) 
					{
						this.directionDown = false;
					}
					
					if(this.directionDown) 
					{
						checkALine(row.last(), false);
					}
					else 
					{
						checkALine(firstSelectedRow.prev(), true);
					}
					
					if(firstSelectedRow.position().top < firstSelectedRow.height()) 
					{
						container.scrollTop(container.scrollTop() - firstSelectedRow.height());
					}
					else if(firstSelectedRow.position().top > container.height())
					{
						container.scrollTop(container.scrollTop()+firstSelectedRow.position().top-firstSelectedRow.height()*4);
					}
				}
			}
			
			if(event.keyCode === 40 || event.keyCode === 38 || event.keyCode === 35 || event.keyCode === 36) 
			{
				if(event.preventDefault)
				{
					event.preventDefault();
				}
				else
				{
					return false;
				}
			}
		});
		
        //Para sumir com o filtro quando clica fora
        $(document).bind('click', function (e)
        {
            if (e.srcElement !== null && e.srcElement !== undefined )
            {
                e.stopPropagation();
                if (($(e.srcElement).closest('.wgrid-filter-panel').length === 0) &&
                    (e.srcElement.className.indexOf('wgrid-filter-button') == -1))
                {
                    if (($(e.srcElement).closest('.ui-widget').length === 0) &&
                        ($(e.srcElement).closest('.ui-datepicker-header').length === 0) &&
                            ($(e.srcElement).closest('.ui-datepicker-calendar').length === 0) &&
						($(e.srcElement).closest('.wgrid-filter-panel-element').length === 0))
                    {
                        $('.wgrid-filter-panel').remove();
                    }
                }
            }
        });

        //header filters and orderby
        data.headerColumns.each(function ()
        {
            var $column = $(this);
            var filterType = $column.attr('field_type');
            var fieldValue = $column.attr('field_value');
            var fieldOrderBy = $column.attr('orderby');
			var fieldFilterBy = $column.attr('filterby');

            var fieldName = fieldValue !== undefined && fieldValue !== "" ? $column.attr('field_value') : $column.attr('field_name');
			fieldName = fieldFilterBy !== undefined && fieldOrderBy !== "" ? fieldFilterBy : fieldName;
			
            var filterJsonData = $column.attr('filter_json_data');
            if (filterJsonData !== null)
            {
                filterJsonData = $.parseJSON(filterJsonData);
            }

            var disableManipulating = $column.attr('disable_handling') == 'true' ?
                'true' :
                'false';

            var disableOrder = $column.attr('disable_order') == 'true' ?
                'true' :
                'false';
                
            var disableFilter = $column.attr('disable_filter') == 'true' ?
                'true' :
                'false';

            var headerName = $column.html();
            $column.html('');

            var $div = $('<div class="wgrid-column-title" style="cursor: pointer"/>');
            var orderbyclass = disableOrder != 'true' ? "wgrid-order-button" : "";
            var orderbyIcon = $('<div class="' + orderbyclass + '" style="float:left">' + headerName + '</div>');

            if (disableManipulating == 'true' || filterType === null || filterType == "tag")
            {
                $div = $('<div class="wgrid-column-title">' + headerName + '</div>');
                $column.html($div);
                return;
            }
            var filterIcon = $('<div class="wgrid-header-container-button wgrid-filter-button"></div>')
                    .click(function (e)
                    {
                        e.stopPropagation();

                        $('.wgrid-filter-panel').remove();

                        var filterPanel = $('<div class="wgrid-filter-panel"></div>')
                            .css('top', (e.pageY + 18) + 'px')
                            .css('left', (e.pageX + 5) + 'px');

                        var filterPanelContent = $('<div class="wgrid-content-filter-panel"></div>');
                        filterPanel.append(filterPanelContent);

                        var filterField;
                        var filterAdvancedButton;
                        var optionAdvancedFilter;
                        var filterButton = $('<div class="wgrid-filter-panel-apply-button">&nbsp;</div>');
                        
                        if (filterType == 'daterange')
                        {
                            var fieldFromDiv = $('<div style="display:inline-block"><div>'+ plugin.settings.dictionary.from +'</div></div>');
                            var fieldToDiv = $('<div><div>'+ plugin.settings.dictionary.to +'</div></div>');

                            var maxDate = new Date();
                            var fieldFrom = $('<input type="text" name="filter-' + fieldName + '-from"/>');
                            var fieldTo = $('<input type="text" name="filter-' + fieldName + '-to"/>');

                            var opts = datetimepickerOptions;
                            opts.onClose = function (dateText) {
                                var endDateTextBox = fieldTo;
                                var testStartDate = new Date(dateText);
                                var testEndDate = new Date(endDateTextBox.val());
                                if (testStartDate > testEndDate) {
                                    endDateTextBox.val(dateText);
                                }
                            };
                            opts.onSelect = function(dateText) {
                                fieldTo.datetimepicker('option', 'minDate', fieldFrom.datetimepicker('getDate'));
                            };
                            opts.maxDate = maxDate;
                            fieldFrom.datetimepicker(opts);
                            
                            opts.onClose = function (dateText) {
                                var startDateTextBox = fieldFrom;
                                var testStartDate = new Date(startDateTextBox.val());
                                var testEndDate = new Date(dateText);
                                if (testStartDate > testEndDate) {
                                    startDateTextBox.val(dateText);
                                }
                            };
                            opts.onSelect = function (selectedDateTime) {
                                var date = new Date(fieldTo.datetimepicker('getDate'));
                                fieldFrom.datetimepicker('option', 'maxDate', date);
                            };
                            fieldTo.datetimepicker(opts);

                            fieldFromDiv.append(fieldFrom);
                            fieldToDiv.append(fieldTo);

                            filterField = $('<div></div>').append(fieldFromDiv).append(fieldToDiv);

                            filterButton.click(function ()
                            {
								if (filterField.find('input:eq(0)').val() == '' && filterField.find('input:eq(1)').val() == '') {
                                    return false;
                                }
                                filterIcon.addClass('active');
                                var filterValue = filterField.find('input:eq(0)').val() + '&' + filterField.find('input:eq(1)').val();
                                filters[fieldName] = filterType + '||' + filterValue;

                                $('.wgrid-filter-panel').remove();
                                reloadGrid();
                            });
                            
                            if( filters[fieldName] !== undefined && filters[fieldName] !== null )
                            {
                                var dateFromString = filters[fieldName].replace('daterange||', '').split('&')[0];
                                var dateToString = filters[fieldName].replace('daterange||', '').split('&')[1];

                                fieldFrom.attr('value', dateFromString);
                                fieldTo.attr('value', dateToString);
                            }
                        }
                        else if (filterType == 'bool')
                        {
                            filterField = $('<select><option value="true">' + plugin.settings.dictionary.yes + '</option><option value="false">' + plugin.settings.dictionary.no + '</option></select>');
                            filterButton.click(function ()
                            {
                                filterIcon.addClass('active');
                                filters[fieldName] = filterType + '||' + filterField.val();

                                $('.wgrid-filter-panel').remove();
                                reloadGrid();
                            });
                        }
                        else if (filterType == 'list')
                        {
                            filterField = $('<select></select>');
                            for (var item in filterJsonData)
                            {
                                filterField.append($('<option value="' +
                                    filterJsonData[item].Key + '">' +
                                    filterJsonData[item].Value + '</option>'));
                            }

                            filterButton.click(function ()
                            {
                                filterIcon.addClass('active');
                                filters[fieldName] = filterField.attr('value');
                                $('.wgrid-filter-panel').remove();

                                reloadGrid();
                            });
                            
                            if( filters[fieldName] !== null )
                            {
                                filterField.attr('value', filters[fieldName]);
                            }
                        }
                        else 
                        {
                            if (filterType.toLowerCase() != 'datetime' && filterType.toLowerCase() != 'hexaid' && filterType.toLowerCase() != 'bool' && filterType.toLowerCase() != 'machineid' && filterType.toLowerCase() != 'numeric' && filterType.toLowerCase() != 'pinnumber')
                            {
                                optionAdvancedFilter = $('<div class="advanced-options" style="display: none;"> <input type="radio" name="advancedFilter" value="equals" id="wgrid-equals" checked=checked> <label for="wgrid-equals" >' + plugin.settings.dictionary.exactlyEqual + '</label> <br /><input type="radio" name="advancedFilter" id="wgrid-contains" value="contains"> <label for="wgrid-contains">' + plugin.settings.dictionary.contain + '</label><br /><input type="radio" name="advancedFilter" id="wgrid-startsWith" value="startsWith"> <label for="wgrid-startsWith">' + plugin.settings.dictionary.startWith + '</label><br /><input type="radio" name="advancedFilter" id="wgrid-endsWith" value="endsWith"> <label for="wgrid-endsWith">' + plugin.settings.dictionary.endWith + '</label> </div>');
                                filterAdvancedButton = $('<div class="wgrid-filter-advanced">+ ' + plugin.settings.dictionary.advancedOptions + '</div>');

                                filterAdvancedButton.click(function ()
                                {
                                    $(this).siblings('.advanced-options').toggle();
                                });
                            }
                            filterField = $('<input type="text" name="filter-' + fieldName + '"/>');

                            if (filters[fieldName] !== undefined && filters[fieldName] !== null) {
                                var temp = filters[fieldName];
                                temp = temp.split('|');
                                
                                setTimeout(function() {
                                    filterField.val(temp[2]);
                                    filterField.attr('value', temp[2]);
                                }, 100);
                            }

                            //FILTER CLICK
                            filterButton.click(function ()
                            {
                                var advancedChoicedOption = $(this).siblings('.advanced-options').find('input[name=advancedFilter]:checked').val();
                                if (advancedChoicedOption === null || advancedChoicedOption === "" || !advancedChoicedOption)
                                {
                                    if (filterType == 'datetime' || filterType == 'bool')
                                    {
                                        advancedChoicedOption = '';
                                    }
                                    else
                                    {
                                        advancedChoicedOption = plugin.settings.advancedFilter;
                                    }
                                }
                                filterIcon.addClass('active');

                                if (filterType == 'string')
                                {
                                    filters[fieldName] = filterType + '|' + advancedChoicedOption + '|' + '"' + filterField.val() + '"';
                                }
                                else if (filterType == 'hexaid' || filterType== 'pinnumber')
                                {
                                    filters[fieldName] = filterType + '|' + advancedChoicedOption + '|' + filterField.val();
                                }
                                else
                                {
                                    filters[fieldName] = filterType + '|' + advancedChoicedOption + '|' + filterField.val();
                                }

                                $('.wgrid-filter-panel').remove();

                                reloadGrid();
                                reloadTotalsDisplays();
                            });
                            
                            if (filterType == 'datetime')
                            {
                                filterField.datetimepicker(datetimepickerOptions);
                            }
                        }
                        

                        if (filterIcon.hasClass('active'))
                        {
                            var removedAdvancedFiltersSplit = filters[fieldName];
                            var removedAdvancedFiltersArray = removedAdvancedFiltersSplit.split('|');
                            var removedAdvancedFilters = removedAdvancedFiltersArray[1];

                            var removedFilters = filterField.val();
                            removedFilters = removedFilters.split('|').splice(2);
                            removedFilters = removedFilters.join().replace(/,/g, '|');

                            var removeFilterButton = $('<div class="wgrid-filter-panel-remove-button">&nbsp;</div>').click(function ()
                            {
                                filterIcon.removeClass('active');
                                delete filters[fieldName];
                                $('.wgrid-filter-panel').remove();

                                reloadGrid();
                            });
                            if (optionAdvancedFilter)
                            {
                                optionAdvancedFilter.find('input:checked').removeAttr('checked');
                                optionAdvancedFilter.find('input[value="' + removedAdvancedFilters + '"').trigger('click');
                            }
                            filterPanelContent.append(filterField.val(removedFilters)).append(filterButton).append(removeFilterButton).append(filterAdvancedButton).append(optionAdvancedFilter);
                        }
                        else
                        {
                            filterPanelContent.append(filterField).append(filterButton).append(filterAdvancedButton).append(optionAdvancedFilter);
                        }

                        filterPanel.hide();
                        $('body').append(filterPanel);

                        var rangeWidth = e.pageX + filterPanel.width() + 20;

                        setTimeout(function ()
                        {
                            if (rangeWidth >= $(window).width() + 5)
                            {
                                filterPanel.css('left', e.pageX - filterPanel.width() - 50);
                            }
                            filterPanel.show();
                            filterPanel.width(filterPanel.width() + 3);
                            filterPanel.width('auto');
                        }, 50);


                    });

            $column.hover(function ()
            {
                $column.addClass('hover');
            },
            function ()
            {
                $column.removeClass('hover');
            });

            if (disableOrder != 'true')
            {
                $div.click(function ()
                {
                    orderby = fieldOrderBy !== "" && fieldOrderBy !== undefined ? fieldOrderBy : fieldName;

                    var isDesc = orderbyIcon.hasClass('desc');

                    $('.wgrid-order-button')
                            .removeClass('desc')
                            .removeClass('asc');

                    if(isDesc)
                    {
                        orderbyIcon.removeClass('desc').addClass('asc');
                    }
                    else
                    {
                        orderbyIcon.removeClass('asc').addClass('desc');
                    }
                    sort = orderbyIcon.hasClass('desc') ? 'desc' : 'asc';
                    reloadGrid();
                });
            }
            else
            {
                $div.css('cursor', 'default');
            }

            $column.append($div);

            $div.append(orderbyIcon);
            if (disableFilter != 'true') {
                $div.append(filterIcon);
            }
        });

        //scroll header and check container
        data.container.scroll(function ()
        {
            $('.wgrid-filter-panel').remove();
            data.checkContainer.scrollTop($(this).scrollTop());
            data.headerContainer.scrollLeft($(this).scrollLeft());
        });
        resizeColumns();
        addCheckboxColumns();
        $element.find('.wgrid-checkbox-all').click(function ()
        {
            var isChecked = $(this).is(":checked");
            var allLines = $element.find('.wgrid-table tr');
            $element.find('.wgrid-checkbox-item').attr('checked', isChecked);

            if( isChecked )
            {
                allLines.addClass('wgrid-selected-line');
            }
            else
            {
                allLines.removeClass('wgrid-selected-line');
            }
            updateSelectedElementsArrays();
        });

        var checkALine = function ($row, check)
        {
            var itemId = $row.attr('item-id');
            var checkTableLine = $(data.checkTable.find('tr[item-id=' + itemId + ']'));

            var lineCheckbox = checkTableLine.find('.wgrid-checkbox-item');
            if( check )
            {
                $row.addClass('wgrid-selected-line');
            }
            else
            {
                $row.removeClass('wgrid-selected-line');
            }
            lineCheckbox.attr('checked', check);

            updateSelectedElementsArrays();
        };

        var updateSelectedElementsArrays = function ()
        {
            var checkRows = data.checkTable.find('tr');

            selectedRowsElements = data.table.find('.wgrid-selected-line');

			selectedCheckRowsElements = data.checkContainer.find('input[type=checkbox]:checked').closestByTagName('tr');
            selectedRowsIndex = [];

            var a;
            for (a = 0; a < selectedCheckRowsElements.length; a++)
            {
                var rowIndex = checkRows.index(selectedCheckRowsElements[a]);
                selectedRowsIndex.push(rowIndex);
            }
        };

		var clickBefore = false;
        data.table.delegate('tr', 'mousedown', function (e)
        {
            if (!$(e.target).is('input') && !$(e.target).is('a'))
            {
                var currentElement = $(this);
                if(e.shiftKey) 
                {
                    var prevAll = currentElement.prevAll('.wgrid-selected-line');
                    
                    var lastSelectedRowIndex = prevAll.last().closest('tr').prevAll().length;
                    var currentSelectedRowIndex = currentElement.closest('tr').prevAll().length;

                    if(lastSelectedRowIndex !== 0 || (prevAll.attr('item-id') === currentElement.closest('table').find('tr').first().attr('item-id'))) 
                    {
                        if(!clickBefore) 
                        {
                            lastSelectedRowIndex = prevAll.first().closest('tr').prevAll().length;
                        }
                        clickBefore = true;

                        items = data.tableRows.slice(lastSelectedRowIndex, currentSelectedRowIndex + 1);
                        checks = data.checkTable.find('tr').slice(lastSelectedRowIndex, currentSelectedRowIndex + 1);
                    }
                    else 
                    {
                        var nextAll = currentElement.nextAll('.wgrid-selected-line');
                        if(!clickBefore) 
                        {
                            lastSelectedRowIndex = nextAll.last().closest('tr').prevAll().length;
                        }
                        else 
                        {
                            lastSelectedRowIndex = nextAll.first().closest('tr').prevAll().length;
                        }
                        
                        if(lastSelectedRowIndex === 0) 
                        {
                            items = data.tableRows.slice(lastSelectedRowIndex, currentSelectedRowIndex + 1);
                            checks = data.checkTable.find('tr').slice(lastSelectedRowIndex, currentSelectedRowIndex + 1);
                        }
                        else 
                        {
                            items = data.tableRows.slice(currentSelectedRowIndex, lastSelectedRowIndex+1);
                            checks = data.checkTable.find('tr').slice(currentSelectedRowIndex, lastSelectedRowIndex+1);
                        }
                        
                        clickBefore = false;

                    }

                    if(items !== null && checks !== null) 
                    {
                        clearRowSelection();

                        items.addClass('wgrid-selected-line');
                        checks.find('input[type="checkbox"]').attr('checked', true);
                        
                        updateSelectedElementsArrays();
                    }
                
                    items = null;
                    checks = null;
					
                    document.getSelection().removeAllRanges();
					return false;
                }
                
                if(e.ctrlKey && currentElement.closest('tr').is('.wgrid-selected-line') === true) 
                {
                    $(this).closest('tr').removeClass('wgrid-selected-line');
                    data.checkTable.find('input[value="' + $(this).closest('tr').attr('item-id') + '"]').attr('checked', false);
                    
                    updateSelectedElementsArrays();
                }
                else 
                {
                    var isMultiSelectKeyPressed = e.ctrlKey ? true : false;
                    setRowSelection($(this), e.which == 1 ? 'left' : 'right', isMultiSelectKeyPressed);
                }
                
                items = null;
                checks = null;
            }
        });
        
        data.table.delegate('tr', 'click', function ()
        {
            if (plugin.settings.itemClick !== undefined)
            {
                plugin.settings.itemClick(plugin.methods.getSelectedRowsData());
            }
        });

        data.table.delegate('tr', 'dblclick', function ()
        {
            if (plugin.settings.itemDblClick !== undefined)
            {
                plugin.settings.itemDblClick(plugin.methods.getSelectedRowsData());
            }
        });
		
		$element.find('.wgrid-check-content').delegate('.wgrid-status-icon', 'click', function ()
        {
			var lineIndex = $element.find('.wgrid-check-content tr').index($(this).closestByTagName('tr'));
			var gridTableLine = $(data.table.find('tr')[lineIndex]);
			
			checkALine(gridTableLine, true);
			
            if (plugin.settings.itemClick !== undefined)
            {
                plugin.settings.itemClick(plugin.methods.getSelectedRowsData());
            }
            
            if (plugin.settings.itemDblClick !== undefined)
            {
                plugin.settings.itemDblClick(plugin.methods.getSelectedRowsData());
            }
        });

        $element.find('.wgrid-check-content').delegate('input[type=checkbox]', 'click', function ()
        {
            var lineCheckbox = $(this);
            var isLineChecked = lineCheckbox.is(":checked");
            var lineIndex = $element.find('.wgrid-check-content tr').index($(this).closestByTagName('tr'));
            var gridTableLine = $(data.table.find('tr')[lineIndex]);

            if( isLineChecked )
            {
                checkALine(gridTableLine, true);
            }
            else
            {
                checkALine(gridTableLine, false);
            }
        });
		
		

        //Statuspanel functions
        plugin.settings.statusPanel.find('.more-items-button').click(function ()
        {
            if ($.browser.version == '8.0')
            {
                $('.wgrid-loader-overlay').css('position', 'absolute').css('float', 'left').css('display', 'block');
            }
            retrieveMoreItems();
        });

        plugin.settings.statusPanel.find('.reload-button').click(function ()
        {
            reloadGrid();
        });

        if (plugin.settings.autoLoad)
        {
            reloadGrid();
        }

        if (!plugin.settings.checkboxRowSelect)
        {
            $('.wgrid-left').hide();
            $('.wgrid-header-container').css('left', '0px');
            $('.wgrid-container').css('left', '0px');
        }
        return $element;
    };
    $.fn.extend({
        closestByTagName: function(tagname) {
            var tag = tagname.toUpperCase(), i = this.length, node, found=[], trParents;
            while(i--) {
				node = this[i];
				while((node=node.parentNode) && node.nodeName != tag);
				if(node) {
					found[found.length] = node;
				}
			}
			return $(found);
		}

	});
    $.fn.wgrid = function (options)
    {
        var args = arguments;
        var ret = $(this);

        this.each(function ()
        {
            var plugin = $(this).data('wgrid');

            if (plugin && plugin.methods[options])
            {
                ret = plugin.methods[options].apply(this, Array.prototype.slice.call(args, 1));
                return null;
            }

            if (plugin === undefined)
            {
                return new $.Wgrid(this, options);
            }
        });
        return ret;
    };
})(jQuery);





/*
* Date Format 1.2.3
* (c) 2007-2009 Steven Levithan <stevenlevithan.com>
* MIT license
*
* Includes enhancements by Scott Trenda <scott.trenda.net>
* and Kris Kowal <cixar.com/~kris.kowal/>
*
* Accepts a date, a mask, or a date and a mask.
* Returns a formatted version of the given date.
* The date defaults to the current date/time.
* The mask defaults to dateFormat.masks.default.
*/

var dateFormat = function ()
{
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[\-+]\d{4})?)\b/g,
        timezoneClip = /[^\-+\dA-Z]/g,
        pad = function (val, len)
        {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc)
    {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date))
        {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date();
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:")
        {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d: d,
                dd: pad(d),
                ddd: dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m: m + 1,
                mm: pad(m + 1),
                mmm: dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy: String(y).slice(2),
                yyyy: y,
                h: H % 12 || 12,
                hh: pad(H % 12 || 12),
                H: H,
                HH: pad(H),
                M: M,
                MM: pad(M),
                s: s,
                ss: pad(s),
                l: pad(L, 3),
                L: pad(L > 99 ? Math.round(L / 10) : L),
                t: H < 12 ? "a" : "p",
                tt: H < 12 ? "am" : "pm",
                T: H < 12 ? "A" : "P",
                TT: H < 12 ? "AM" : "PM",
                Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0)
        {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
} ();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.formatString = function (mask, utc)
{
    return dateFormat(this, mask, utc);
};