/*
* WGrid 1.0
* Copyright (c) 2012 Webers
*
* Depends:
*   - jQuery 1.4.2+
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
            statusPanel: null,
            complete: null,
            dictionary:
            {
                yes: "Sim",
                no: "N�o",
                filter: "Filtro",
                advancedOptions: "Op��es avan�adas",
                removeFilter: "Remover filtro",
                exactlyEqual: "Exatamente igual",
                contain: "Cont�m",
                startWith: "Inicia com",
                endWith: "Termina com",
                of: "de",
                items: "itens",
                showing: "Mostrando",
                reload: "Recarregar",
                many: "muitos"
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
            $loading.hide();
        };


        //plugin configurations
        plugin.settings = $.extend({}, defaults, options);

        if (plugin.settings.loadOverlay != null)
        {
            loadingHide();
        }

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

            if (plugin.settings.keyColumn != "" || plugin.settings.keyColumn != null)
            {
                querystring = querystring + "&keyColumn=" + plugin.settings.keyColumn;
            }

            if (plugin.settings.orderby != "" || plugin.settings.orderby != null)
            {
                orderby = plugin.settings.orderby;
            }

            querystring = filterParams == "" ? querystring : querystring + "&" + filterParams;
            querystring = orderby == null ? querystring : querystring + "&orderby=" + orderby + "&sort=" + sort;
            querystring = lastId == 0 ? querystring : querystring + "&lastId=" + lastId;
            querystring = eventFilter == null ? querystring : querystring + "&eventFilter=" + eventFilter;

            if (plugin.settings.useUrlQuerystring)
            {
                querystring = window.location.search.indexOf('?') == 0 ?
                    querystring + "&" + window.location.search.substr(1) :
                    querystring;
            }
            return querystring;
        };

        var moreMargin = '<div id="more-margin" style="width:10px; float:right;">&nbsp</div>';

        var checkIfNotExistsOldItems = function (itemsCount)
        {
            var moreItemsButton = plugin.settings.statusPanel.find('.more-items-button');
            moreItemsButton.show();
            $("#more-margin").remove();

            if (itemsCount < plugin.settings.listItemCount || itemsCount == 0)
            {
                moreItemsButton.hide();
                moreItemsButton.after(moreMargin);
                return;
            }
        };

        var getElementId = function (elementData)
        {
            var elementId = elementData['Id'];
            if (elementId == null)
            {
                elementId = elementData['rownum'];
            }

            return elementId;
        };

        var getRowClass = function (elementData)
        {
            var rowClass = plugin.settings.classRowObjectField != null ? elementData[plugin.settings.classRowObjectField] : "";

            if (plugin.settings.colorizeItems == false)
            {
                rowClass = 1;
            }

            return rowClass;
        };

        var getCheckTableRow = function (elementData)
        {
            var tableRow = '<tr item-id="' + getElementId(elementData) + '" class="class-' + getRowClass(elementData) + '"><td class="wgrid-checkbox-column"><input type="checkbox" class="wgrid-checkbox-item" value="' + getElementId(elementData) + '" name="selectedIds"></td>';
            tableRow += plugin.settings.showStatusIcon ? '<td><span class="wgrid-status-icon"></span></td>' : "";
            tableRow += '</tr>';
            return tableRow;
        };

        var getTableRow = function (elementData)
        {
            var rowToInsert = [];
            rowToInsert.push("<tr item-id='" + getElementId(elementData) + "' class='class-" + getRowClass(elementData) + "' onmouseover='this.style.background = \"#eeeeee\"' onmouseout='this.style.background = \"#ffffff\"'>");
            var i = 0;
            for (var column in data.columns)
            {
                var columnType = data.columns[column];
                var columnValue = elementData[column];

                if (columnType == "tag")
                {
                    columnValue = creteTagBox(columnValue);
                }

                columnValue = columnType == "datetime" ? fromDateToString(columnValue) : columnValue;
                columnValue = columnType == "bool" ? (columnValue ? plugin.settings.dictionary.yes : plugin.settings.dictionary.no) : columnValue;
                columnValue = columnType == "cron" ? $.cronText(columnValue, plugin.settings.dictionary) : columnValue;
                columnValue = columnValue == null || columnValue == undefined ? "" : columnValue;

                if (i == 0 || column == "MachineId")
                {
                    rowToInsert.push('<td style=\"cursor:pointer\">' + columnValue + '</td>');
                    i++;
                }
                else
                {
                    var cronClass = columnType == "cron" ? "wgrid-column-cron" : "";
                    rowToInsert.push('<td style=\"cursor:pointer\" class="' + cronClass + '" title="' + columnValue + '">' + columnValue + '</td>');
                }
            }
            rowToInsert.push("</tr>");

            return rowToInsert.join('');
        };

        var hideMoreItems = function ()
        {
            var moreItemsButton = plugin.settings.statusPanel.find('.more-items-button');
            $("#more-margin").remove();
            moreItemsButton.after(moreMargin);
            moreItemsButton.hide();
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
                success: function (json)
                {
                    loadingShow();
                    var jsonData = json.Data;
                    if (jsonData != null && jsonData.length > 0)
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

                            lastId = elementData['Id'] > lastId ? elementData['Id'] : lastId;
                            rowsToInsert.push(getTableRow(elementData));
                            checkRowsToInsert.push(getCheckTableRow(elementData));
                        }

                        data.table.append(rowsToInsert.join(''));
                        data.checkTable.append(checkRowsToInsert.join(''));

                        resizeColumns();
                        checkIfNotExistsOldItems(totalInserted);

                        totalDisplayingItems += totalInserted;

                        //totalItems = json.TotalCount != null ? json.TotalCount : totalItems;

                        totalItems = json.TotalCount;
                        data.tableRows = $element.find('.wgrid-table tr');
                        if (totalDisplayingItems >= totalItems && totalItems != null)
                        {
                            hideMoreItems();
                        }
                    }
                    else
                    {
                        hideMoreItems();
                    }
                    reloadTotalsDisplays(totalInserted);
                    loadingHide();
                    //plugin.settings.statusPanel.find('.reload-button').wbutton('enable');

                    if (typeof callback == 'function')
                    {
                        callback();
                    }
                    if (typeof plugin.settings.complete == 'function')
                    {
                        plugin.settings.complete();
                    }
                }
            });
        };

        var creteTagBox = function (tags)
        {
            if (!tags || tags.length == 0) return '';

            var tagBox = [];
            var colorClass = tags.length > 1 ? 'multi-color' : 'color-' + tags[0].Color;

            tagBox.push('<div class="tag-div">');

            if (tags.length > 1)
            {
                tagBox.push('<div class="tag-count">');
                tagBox.push(tags.length);
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

            if (plugin.settings.jsonUrl == null) { return; }
            var completeUrl = plugin.settings.jsonUrl + getQuerystring();

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

            if (plugin.settings.jsonUrl == null) { return; }
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

            if (removeFromTotal)
            {
                totalItems = totalItems - $(selectedRowsElements).length;
            }

            reloadTotalsDisplays();
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
                var columnHeaderWidth = $(data.headerColumns[count]).width();

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

            if (firstColumns.length == 0)
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

        var verifyIfExistsNewItems = function (url, id)
        {
            var completeUrl = url + getQuerystring() + "&lastId=" + id;

            var exists = false;
            $.ajax({
                url: completeUrl,
                type: plugin.settings.method,
                async: false,
                success: function (returnedData)
                {
                    exists = returnedData;
                }
            });
            return exists;
        };

        var fixRightAndBottom = function ($selector)
        {
            $selector.each(function ()
            {
                var closest = $(this).parent().closest('.wgrid');

                if ($(this).css('right') != 'auto')
                {
                    $(this).width(closest.attr('clientWidth') - parseInt($(this).css('right')) - parseInt($(this).css('left')));
                }
                if ($(this).css('bottom') != 'auto')
                {
                    $(this).height(closest.attr('clientHeight') - parseInt($(this).css('bottom')) - parseInt($(this).css('top')));
                }
            });
        };

        var reloadTotalsDisplays = function (totalInserted)
        {
            loadingShow();
            plugin.settings.statusPanel.find('.wgrid-displaying').html(totalDisplayingItems);

            var totalItemsText = totalItems == null ? plugin.settings.dictionary.many : totalItems;

            if (totalItems == null && totalDisplayingItems < plugin.settings.listItemCount)
            {
                totalItemsText = totalDisplayingItems;
            }

            if (totalInserted != null || totalInserted != undefined)
            {
                if (totalInserted < plugin.settings.listItemCount)
                {
                    totalItemsText = totalDisplayingItems;
                }
            }

            plugin.settings.statusPanel.find('.wgrid-total').html(totalItemsText);

            plugin.settings.statusPanel.find('.more-items-button>.content>span').html('+ ' + plugin.settings.listItemCount);
            loadingHide();
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
                if (orderby == null)
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
            updateRow: function (elementData)
            {
                var elementId = elementData['Id'];
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
            var $elementStructure = $('<div class="wgrid">' +
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
                    '<div class="get-more-items">' +
                        plugin.settings.dictionary.showing + ' <span class="wgrid-displaying">100</span> ' + plugin.settings.dictionary.of + ' ' +
                        '<span class="wgrid-total">1000</span> ' + plugin.settings.dictionary.items +
                        '<div class="more-items-button">&nbsp;</div>' +
                    '</div>' +
                    '<div class="reload-items">' +
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
        }

        data = {
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

        //Para sumir com o filtro quando clica fora
        $(document).bind('click', function (e)
        {
            if (e.srcElement != null)
            {
                e.stopPropagation();
                if (($(e.srcElement).closest('.wgrid-filter-panel').length == 0) &&
                    (e.srcElement.className.indexOf('wgrid-filter-button') == -1))
                {
                    if (($(e.srcElement).closest('.ui-widget').length == 0) &&
                        ($(e.srcElement).closest('.ui-datepicker-header').length == 0))
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

            var fieldName = fieldValue != null && fieldValue != "" ? $column.attr('field_value') : $column.attr('field_name');

            var filterJsonData = $column.attr('filter_json_data');
            if (filterJsonData != null)
            {
                filterJsonData = $.parseJSON(filterJsonData);
            }

            var disableManipulating = $column.attr('disable_handling') == 'true' ?
                'true' :
                'false';

            var disableOrder = $column.attr('disable_order') == 'true' ?
                'true' :
                'false';

            var headerName = $column.html();
            $column.html('');

            var $div = $('<div class="wgrid-column-title" style="cursor: pointer"/>');
            var orderbyclass = disableOrder != 'true' ? "wgrid-order-button" : "";
            var orderbyIcon = $('<div class="' + orderbyclass + '" style="float:left">' + headerName + '</div>');

            if (disableManipulating == 'true' || filterType == null || filterType == "tag")
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
                        if (filterType != 'list' && filterType != 'bool')
                        {
                            if (filterType != 'datetime' && filterType != 'hexaid' && filterType != 'bool')
                            {
                                optionAdvancedFilter = $('<div class="hide advanced-options"> <input type="radio" name="advancedFilter" value="equals" checked=checked>' + plugin.settings.dictionary.exactlyEqual + ' <br /><input type="radio" name="advancedFilter" value="contains">' + plugin.settings.dictionary.contain + '<br /><input type="radio" name="advancedFilter" value="startsWith">' + plugin.settings.dictionary.startWith + '<br /><input type="radio" name="advancedFilter" value="endsWith">' + plugin.settings.dictionary.endWith + ' </div>');
                                filterAdvancedButton = $('<div class="wgrid-filter-advanced">+ ' + plugin.settings.dictionary.advancedOptions + '</div>');

                                filterAdvancedButton.click(function ()
                                {
                                    $(this).siblings('.advanced-options').toggle();
                                });
                            }
                            filterField = $('<input type="text" name="filter-' + fieldName + '"/>');

                            //FILTER CLICK
                            filterButton.click(function ()
                            {
                                var advancedChoicedOption = $(this).siblings('.advanced-options').find('input[name=advancedFilter]:checked').val();
                                if (advancedChoicedOption == null || advancedChoicedOption == "" || !advancedChoicedOption)
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
                                else if (filterType == 'hexaid')
                                {
                                    filters[fieldName] = 'text' + '|' + advancedChoicedOption + '|' + '00' + filterField.val();
                                }
                                else
                                {
                                    filters[fieldName] = filterType + '|' + advancedChoicedOption + '|' + filterField.val();
                                }

                                $('.wgrid-filter-panel').remove();

                                reloadGrid();
                                reloadTotalsDisplays();
                            });
                            filters[fieldName] != null ? filterField.val(filters[fieldName]) : "";

                            if (filterType == 'datetime')
                            {
                                filterField.datepicker();
                            }
                        }
                        else if (filterType == 'bool')
                        {
                            filterField = $('<select><option value="true">' + plugin.settings.dictionary.yes + '</option><option value="false">' + plugin.settings.dictionary.no + '</option></select>');
                            filterButton.click(function ()
                            {
                                filterIcon.addClass('active');
                                filters[fieldName] = filterType + '|' + filterField.val();

                                $('.wgrid-filter-panel').remove();

                                reloadGrid();
                            });
                        }
                        else
                        {
                            filterField = $('<select></select>');
                            for (var item in filterJsonData)
                            {
                                filterField.append($('<option value="' +
                                    filterJsonData[item]["key"] + '">' +
                                    filterJsonData[item]["value"] + '</option>'));
                            }

                            filterButton.click(function ()
                            {
                                filterIcon.addClass('active');
                                filters[fieldName] = filterField.attr('value');
                                $('.wgrid-filter-panel').remove();

                                reloadGrid();
                            });
                            filters[fieldName] != null ? filterField.attr('value', filters[fieldName]) : "";
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
                    orderby = fieldOrderBy != "" && fieldOrderBy != undefined ? fieldOrderBy : fieldName;

                    var isDesc = orderbyIcon.hasClass('desc');

                    $('.wgrid-order-button')
                            .removeClass('desc')
                            .removeClass('asc');

                    isDesc ? orderbyIcon.removeClass('desc').addClass('asc') : orderbyIcon.removeClass('asc').addClass('desc');

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
            $div.append(filterIcon);
        });

        //scroll header and check container
        data.container.scroll(function ()
        {
            $('.wgrid-filter-panel').remove();
            data.checkContainer.scrollTop($(this).scrollTop());
            data.headerContainer.scrollLeft($(this).scrollLeft());
        });

        //if hasMoreAfterUrl not null
        if (plugin.settings.hasMoreAfterUrl != null)
        {
            $('body').everyTime(3000, function ()
            {
                if (verifyIfExistsNewItems(plugin.settings.hasMoreAfterUrl, lastId))
                {
                    console.log("Existem novos itens dispon�veis!");
                }
            });
        }

        resizeColumns();
        addCheckboxColumns();

        if ($.browser.msie)
        {
            fixRightAndBottom($('.wgrid-layout'));
            $(window).bind('resize', function ()
            {
                fixRightAndBottom($('.wgrid-layout'));
            });
        }

        $element.find('.wgrid-checkbox-all').click(function ()
        {
            var isChecked = $(this).is(":checked");
            var allLines = $element.find('.wgrid-table tr');
            $element.find('.wgrid-checkbox-item').attr('checked', isChecked);

            isChecked ? allLines.addClass('wgrid-selected-line') : allLines.removeClass('wgrid-selected-line');
            updateSelectedElementsArrays();
        });

        var checkALine = function ($row, check)
        {
            var itemId = $row.attr('item-id');
            var checkTableLine = $(data.checkTable.find('tr[item-id=' + itemId + ']'));

            var lineCheckbox = checkTableLine.find('.wgrid-checkbox-item');
            check ? $row.addClass('wgrid-selected-line') : $row.removeClass('wgrid-selected-line');
            lineCheckbox.attr('checked', check);

            updateSelectedElementsArrays();
        };

        var updateSelectedElementsArrays = function ()
        {
            var checkRows = data.checkTable.find('tr');

            selectedRowsElements = data.table.find('.wgrid-selected-line');
            selectedCheckRowsElements = data.checkContainer.find('input[type=checkbox]:checked').closest('tr');
            selectedRowsIndex = [];

            var a;
            for (a = 0; a < selectedCheckRowsElements.length; a++)
            {
                var rowIndex = checkRows.index(selectedCheckRowsElements[a]);
                selectedRowsIndex.push(rowIndex);
            }
        };

        data.table.delegate('tr', 'mousedown', function (e)
        {
            if (!$(e.target).is('input') && !$(e.target).is('a'))
            {
                var isMultiSelectKeyPressed = e.ctrlKey ? true : false;
                setRowSelection($(this), e.which == 1 ? 'left' : 'right', isMultiSelectKeyPressed);
            }
        });

        data.table.delegate('tr', 'click', function ()
        {
            if (plugin.settings.itemClick != null)
            {
                plugin.settings.itemClick(plugin.methods.getSelectedRowsData());
            }
        });

        $element.find('.wgrid-check-content').delegate('input[type=checkbox]', 'click', function ()
        {
            var lineCheckbox = $(this);
            var isLineChecked = lineCheckbox.attr("checked");
            var lineIndex = $element.find('.wgrid-check-content tr').index($(this).closest('tr'));
            var gridTableLine = $(data.table.find('tr')[lineIndex]);

            isLineChecked ? checkALine(gridTableLine, true) : checkALine(gridTableLine, false);
        });

        //Statuspanel functions
        plugin.settings.statusPanel.find('.more-items-button').click(function ()
        {
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

            if (plugin == undefined)
            {
                return new $.Wgrid(this, options);
            }
        });
        return ret;
    };
})(jQuery);