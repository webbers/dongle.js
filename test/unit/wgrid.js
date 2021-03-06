var obj = {"rownum": "1","field1": "1","field2": "1","field3": "/Date(1224043200000)/", "field4": "Lorem ipsum dolor sit amet","field5": "text"};

function clone(obj)
{
    if (null === obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function ajaxReturnValue($selector)
{
    $(document).ajaxComplete(function ()
    {
        return $selector.text();
    });
}

function sleep(milliseconds)
{
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++)
    {
        if ((new Date().getTime() - start) > milliseconds)
        {
            break;
        }
    }
}

var items = [];
for(var i = 0; i < 5; i++)
{
    var newObj = clone(obj);
    newObj.rownum = i+1;
    newObj.field1 = i+1;
	newObj.field5 = newObj.field + i+1;
    items.push(newObj);
}

//Hack. Thanks to jQuery bug
function checkboxClick($element)
{
    if($element.is(':checked'))
    {
        $element.removeAttr('checked');
        $element.trigger('click');
        $element.removeAttr('checked');
    }
    else
    {
        $element.attr('checked', true);
        $element.trigger('click');
        $element.attr('checked', true);
    }
}


//Ajax inicial
$.mockjax({
    url: 'data.json?skip=0',
    responseTime: 0,
    responseText: {"Data": items,"TotalCount":10},
    log: false
});

//Ajax order by desc
$.mockjax({
    url: 'data.json?skip=0&orderby=field1&sort=desc',
    responseTime: 0,
    responseText: {"Data": items.reverse(),"TotalCount":10},
    log: false
});

//Ajax order by field1 asc
$.mockjax({
    url: 'data.json?skip=0&orderby=field1&sort=asc&eventFilter=undefined',
    responseTime: 0,
    responseText: {"Data": items.reverse(),"TotalCount":10},
    log: false
});

//Ajax order by field1 asc
var items2 = [];
for( var i = 0; i < items.length; i++ )
{
    var newObj = items[i];
    newObj.rownum = (5 + i);
    items2.push(newObj);
}
$.mockjax({
    url: 'data.json?skip=5&lastId=9',
    responseTime: 0,
    responseText: {"Data": items2,"TotalCount":10},
    log: false
});

$.mockjax({
    url: 'data.json?skip=0&orderby=field1&sort=ASC',
    responseTime: 0,
    responseText: {"Data": items2,"TotalCount":10},
    log: false
});

//StartsWith
$.mockjax({
    url: 'data.json?skip=0&field5=text%7CstartsWith%7C2',
    responseTime: 0,
    responseText: {"Data": [items[1]],"TotalCount":10},
    log: false
});

//EndsWith
$.mockjax({
    url: 'data.json?skip=0&field5=text%7CendsWith%7C4',
    responseTime: 0,
    responseText: {"Data": [items[3]],"TotalCount":10},
    log: false
});

//Contains
$.mockjax({
    url: 'data.json?skip=0&field5=text%7Ccontains%7C3',
    responseTime: 0,
    responseText: {"Data": [items[2]],"TotalCount":10},
    log: false
});

//Equals
$.mockjax({
    url: 'data.json?skip=0&field1=numeric%7Cequals%7C5',
    responseTime: 0,
    responseText: {"Data": [items[4]],"TotalCount":10},
    log: false
});

//Equals with no result
$.mockjax({
    url: 'data.json?skip=0&field1=numeric%7Cequals%7C10',
    responseTime: 0,
    responseText: {"Data": [],"TotalCount":10},
    log: false
});

//Datarange
$.mockjax({
    url: 'data.json?skip=0&field4=daterange%7C%7C10%2F10%2F2010%2610%2F10%2F2012',
    responseTime: 0,
    responseText: {"Data": [items[1]],"TotalCount":10},
    log: true
});

//Shortcuts
$.mockjax({
    url: 'data.json?skip=0',
    responseTime: 0,
    responseText: {"Data": items,"TotalCount":10},
    log: false
});

function createHtml(id)
{
    var html = '<table id="'+ id + '"><thead><tr><th field_type="numeric" field_name="field1" field_value="">ID</th><th field_type="int" field_name="field2" field_value="" disable_handling="true">INTEIRO</th><th field_type="datetime" field_name="field3" field_value="" disable_handling="true">DATA</th><th field_type="daterange" field_name="field4" field_value="">DATERANGE</th><th field_type="text" field_name="field5">TESTE DE COLUNA GRANDE</th><th field_type="bool" field_name="field6" field_value="" disable_handling="true">BOOL</th></tr></thead></table>';
    $(document.body).append(html);
}

window.running = false;

function createWGrid(test)
{
    var id = "wgrid-" + parseInt(Math.random() * 100, 10); 
    
    var completed = false;
    
    createHtml(id);
    $('#' + id).wgrid({
        full: true,
        jsonUrl: 'data.json',
        method: "GET",
        totalItems: 20,
        keyColumn: "",
        showStatusIcon: false,
        classRowObjectField: "EventTypeLevel",
        colorizeItems: true,
        listItemCount: 10,
        useUrlQuerystring: true,
        getId: function(line)
        {
            return line.rownum;
        },        
        complete: function()
        {
            if(completed === false)
            {
                completed = true;
                test($('#' + id).closest(".wgrid"), $('#' + id));
            }
        },
		refreshShortcut: 
		{
			modifier: 'ctrl',
			keyCode: 82,
			description: 'Refresh'
		},
		setShortcut:
		{
			detele: 
			{
				keyCode: 46,
				modifier: '',
				description: 'Delete',
				callback: function (api, selectedElements) 
				{
					api.methods.removeSelectedRows(selectedElements);
				}
			}
		},
        itemClick: function (selectedItems)
        {
            $('.wgrid').after('<div id="clicked">Cliked</div>');
            $("#clicked").fadeOut(1000);
        }
    });
    $('#' + id).closest('.wgrid').css({ position: 'relative', height: '300px' });
}

function createWGrid2(test)
{
    var id = "wgrid2-" + parseInt(Math.random() * 100, 10); 
    
    var completed = false;
    
    createHtml(id);
    $('#' + id).wgrid({
        full: true,
        jsonUrl: 'data.json',
        method: "GET",
        totalItems: 20,
        keyColumn: "",
        showStatusIcon: false,
        classRowObjectField: "EventTypeLevel",
        colorizeItems: true,
        listItemCount: 10,
        useUrlQuerystring: true,
        getId: function(line)
        {
            return line.rownum;
        },        
        complete: function()
        {
            if(completed === false)
            {
                completed = true;
                test($('#' + id).closest(".wgrid"), $('#' + id));
            }
        },
		refreshShortcut: 
		{
			modifier: 'ctrl',
			keyCode: 82,
			description: 'Refresh'
		},
		setShortcut:
		{
			detele: 
			{
				keyCode: 46,
				modifier: '',
				description: 'Delete',
				callback: function (api, selectedElements) 
				{
					api.methods.removeSelectedRows(selectedElements);
				}
			}
		}
    });
    $('#' + id).closest('.wgrid').css({ position: 'relative', height: '300px' });
}

createWGrid(function($wgrid)
{
    module("WGrid");
    test("Initial Tests", function ()
    {
        var heigth = $wgrid.closest('.wgrid').height();
        if (heigth >= 200)
        {
            heigth = true;
        }
        equal(heigth, true, "Wgrid is greather than 200px");
                
        //2
        var position = $wgrid.css('position');
        equal(position, "relative", "Wgrid have position relative");
        
        //3
        var widthError = 0;
        $wgrid.find("tr th").each(function ()
        {
            /*if ($wgrid.find(".wgrid-table tr:eq(0) td:eq(" + index + ")").width() != $(this).width())
            {
                widthError += 1;
            }*/
            var index = $(this).index();
            equal($wgrid.find(".wgrid-table tr:eq(0) td:eq(" + index + ")").width(), $(this).width(), "width match column " + index);
        });            
                
        //equal(widthError, 0, "All <TH> width's is equals of respective <TD> width");
        equal($wgrid.find('.wgrid-check-container').css('position'), "absolute", "display absolute wgrid-check-container");
        equal($wgrid.find('.wgrid-header-container').css('position'), "absolute", "display absolute wgrid-header-container");
        equal($wgrid.find('.wgrid-container').css('position'), "absolute", "display absolute wgrid-container");
        equal($wgrid.find('.wgrid-status-panel').css('position'), "absolute", "display absolute wgrid-status-panel");
        
        //5
        deepEqual($(window).width() >= $('.wgrid').width(), true, 'Wgrid is not more larger than window');
    });
});

createWGrid(function($wgrid)
{
    test("Listing like ListItemCount", function ()
    {
        var qtd = $wgrid.find(".wgrid-table tbody tr").length;
        notDeepEqual(qtd, 0, "Listing items when load Wgrid in first time like listItemCount");
    });
});

createWGrid(function($wgrid, $innerGrid)
{
    test("Disable Handling", function ()
    {
        $innerGrid.find("th[disable_handling=true]").each(function ()
        {
            var filter = $(this).find('.wgrid-filter-button');
            var order = $(this).find('.wgrid-order-button');

            ok(filter.length === 0 && order.length === 0, "There is some column with disable handling true but still showing filter or order icon");
        });
    });
});

createWGrid(function($wgrid, $innerGrid)
{
    test("Checkboxes tests", function ()
    {
        var $all = $wgrid.find('.wgrid-checkbox-all');
        
        checkboxClick($all);
        
        ok($all.is(':checked'), "Checkbox all is checked");
        equal($wgrid.find(".wgrid-displaying").text(), $wgrid.find(".wgrid-checkbox-item:checked").length, "All other checkboxes checked when click to select all");
        
        checkboxClick($all);

        ok($all.is(':checked')===false, "Checkbox all is not checked");
        equal(0, $wgrid.find(".wgrid-checkbox-item:checked").length, "All other checkboxes is not checked when click to select all");

        var correctCheck = true;
        $wgrid.find('.wgrid-checkbox-item').each(function ()
        {
            var indexRow = $(this).index();

            checkboxClick($(this));
            if ($(this).is(':checked') && $wgrid.find(".wgrid-table tr:eq(" + indexRow + ")").css('background-color') == "rgba(0, 0, 0, 0)")
            {
                correctCheck = false;
            }
        });
        equal(correctCheck, true, "All checkboxes check their respective row in table");
        
        var correctUncheck = true;
        $wgrid.find('.wgrid-checkbox-item').each(function ()
        {
            var indexRow = $(this).index();

            checkboxClick($(this));
            if (!$(this).is(':checked') && $wgrid.find(".wgrid-table tr:eq(" + indexRow + ")").css('background-color') != "rgba(0, 0, 0, 0)")
            {
                correctCheck = false;
            }
        });
        equal(correctUncheck, true, "All checkboxes uncheck their respective row in table");
    });
});

createWGrid(function($wgrid, $innerGrid)
{
    test("Re-order test", function ()
    {
        var firstValue = $wgrid.find(".wgrid-table tr:eq(0) td:eq(0)").text();
        $wgrid.find('.wgrid-order-button:eq(0)').click();
        
        var value  = $wgrid.find(".wgrid-table tr:eq(0) td:eq(0)").text();
        
        notEqual(value, firstValue, "Reordering records!");
    });
});

createWGrid(function($wgrid, $innerGrid)
{
    test("StartsWith", function ()
    {
        stop();
        $(document.body).hide();
        $wgrid.find('.wgrid-filter-button:eq(2)').click();
        
        var checkValue = 2;
        $('input[name=filter-field5]').val(checkValue);
        
        checkboxClick($('input[type=radio][value=startsWith]'));
        $('.wgrid-filter-panel-apply-button').click();
        
        $(document.body).show();
        
        setTimeout(function()
        {
            start();
            equal($wgrid.find(".wgrid-table tr:eq(0) td:eq(0)").html(), checkValue, "Showing row(s) with value(s) starts with filter value");
        }, 100);
    });
});

createWGrid(function($wgrid, $innerGrid)
{
    test("EndsWith", function ()
    {
        stop();
        $(document.body).hide();
        $wgrid.find('.wgrid-filter-button:eq(2)').click();
        
        var checkValue = 4;
        $('input[name=filter-field5]').val(checkValue);
        
        checkboxClick($('input[type=radio][value=endsWith]'));
        $('.wgrid-filter-panel-apply-button').click();
        
        $(document.body).show();
        
        setTimeout(function()
        {
            start();
            equal($wgrid.find(".wgrid-table tr:eq(0) td:eq(0)").html(), checkValue, "Showing row(s) with value(s) ends with filter value");
        }, 100);
    });
});

createWGrid(function($wgrid, $innerGrid)
{
    test("Contains", function ()
    {
        stop();
        $(document.body).hide();
        $wgrid.find('.wgrid-filter-button:eq(2)').click();
        
        var checkValue = 3;
        $('input[name=filter-field5]').val(checkValue);
        
        checkboxClick($('input[type=radio][value=contains]'));
        $('.wgrid-filter-panel-apply-button').click();
        
        $(document.body).show();
        
        setTimeout(function()
        {
            start();
            equal($wgrid.find(".wgrid-table tr:eq(0) td:eq(0)").html(), checkValue, "Showing row(s) with value(s) contains filter value");
        }, 100);
    });
});

createWGrid(function($wgrid, $innerGrid)
{
    test("Equals", function ()
    {
        stop();
        $(document.body).hide();
        $wgrid.find('.wgrid-filter-button:eq(0)').click();
        
        var checkValue = 5;
        $('input[name=filter-field1]').val(checkValue);
        
        checkboxClick($('input[type=radio][value=equals]'));
        $('.wgrid-filter-panel-apply-button').click();
        
        $(document.body).show();
        
        setTimeout(function()
        {
            start();
            equal($wgrid.find(".wgrid-table tr:eq(0) td:eq(0)").html(), checkValue, "Showing row(s) with value(s) equals filter value");
        }, 100);
    });
});

createWGrid(function($wgrid, $innerGrid)
{
    test("Equals with no result", function ()
    {
        stop();
        $(document.body).hide();
        $wgrid.find('.wgrid-filter-button:eq(0)').click();
        
        var checkValue = 10;
        $('input[name=filter-field1]').val(checkValue);
        
        checkboxClick($('input[type=radio][value=equals]'));
        $('.wgrid-filter-panel-apply-button').click();
        
        $(document.body).show();
        
        setTimeout(function()
        {
            start();
            deepEqual($wgrid.find(".wgrid-table tr").length, 0, "Show no results when filters doens't find any record");
        }, 100);
    });
});

createWGrid(function($wgrid, $innerGrid)
{
    test("Daterange Filter", function ()
    {
        stop();
        $(document.body).hide();
        $wgrid.find('.wgrid-filter-button:eq(1)').click();
        
        $('input[name=filter-field4-from]').val('10/10/2010');
		$('input[name=filter-field4-to]').val('10/10/2012');
        
        $('.wgrid-filter-panel-apply-button').click();
        
        $(document.body).show();
        
        setTimeout(function()
        {
            start();
            deepEqual($wgrid.find(".wgrid-table tr").length, 1, "Verifying if is creating a right ajax request.");
        }, 100);
    });
});

createWGrid(function($wgrid, $innerGrid)
{
    test("loader test", function ()
    {
		$innerGrid.wgrid('loaderShow');
        ok($('.wgrid-loader-overlay').is(':visible'), "Showing loader overlay");
        
		$innerGrid.wgrid('loaderHide');
		
    });
});

createWGrid(function($wgrid, $innerGrid)
{
    test("getFilters", function ()
    {
        equal(typeof ($innerGrid.wgrid('getFilters')), "object", "getFilter is returning a object");
    });
});

createWGrid(function($wgrid, $innerGrid)
{
    test("getOrderAndSort", function ()
    {
        equal(typeof ($innerGrid.wgrid('getOrderAndSort')), "object", "getOrderAndSort is returning a object");
    });
});

createWGrid(function($wgrid, $innerGrid)
{
    test("clearGrid", function ()
    {
        $innerGrid.wgrid('clearGrid');
        equal($wgrid.find('.wgrid-table').html(), "", "clearGrid is clearing grid");
    });
});

createWGrid(function($wgrid, $innerGrid)
{
    test("getLastId", function ()
    {
        var lastId = $innerGrid.wgrid('getLastId');
        equal(typeof lastId, "number", "gatLastId is returning a number");
		equal(lastId, 9, "getLastId is returning correct number of last records");
    });
});

createWGrid(function($wgrid, $innerGrid)
{
    test("getHeaderColumns", function ()
    {
        var getHeaderColumns = $innerGrid.wgrid('getHeaderColumns');
        equal(typeof (getHeaderColumns), "object", "getHeaderColumns generates a object");
        equal($(getHeaderColumns[0]).is('th'), true, "getHeaderColumns[0] is a th(column) element");
    });
});

createWGrid(function($wgrid, $innerGrid)
{
    test("getQuerystring", function ()
    {
        var getQuerystring = $innerGrid.wgrid('getQuerystring');
        equal(typeof (getQuerystring), "string", "getQuerystring generates a string");
        equal(getQuerystring.split('&').length >= 2, true, "getQuerystring generates more than 2 query strings");
    });
});

createWGrid(function($wgrid, $innerGrid)
{
    test("getHeaderColumnIndex", function ()
    {
        equal(typeof $innerGrid.wgrid('getHeaderColumnIndex', 'field1'), "number", "getHeaderColumnIndex is returning a numeric value");
        equal($innerGrid.wgrid('getHeaderColumnIndex', 'field1'), 0, "getHeaderColumnIndex(field1) returning the correct number of column index(0)");
        equal($innerGrid.wgrid('getHeaderColumnIndex', 'field2'), 1, "getHeaderColumnIndex(field2) returning the correct number of column index(1)");
        equal($innerGrid.wgrid('getHeaderColumnIndex', 'field3'), 2, "getHeaderColumnIndex(field2) returning the correct number of column index(2)");
    });
});

createWGrid(function($wgrid, $innerGrid)
{
    test("getRowsData", function ()
    {
        equal(typeof $innerGrid.wgrid('getRowsData'), "object", "getRowsData is returning a object");
        deepEqual($wgrid.find('.wgrid-table tr').length == $wgrid.wgrid('getRowsData').length, true, "getRowsData is returning the correct number of data");
    });
});

createWGrid(function($wgrid, $innerGrid)
{
    test("getSelectedRowsData", function ()
    {
        var $all = $wgrid.find('.wgrid-checkbox-all');
        checkboxClick($all);
		var count = $wgrid.wgrid('getSelectedRowsData').length;
        equal(typeof $all, "object", "getSelectedRowsData is returning a object");
		deepEqual(count, $wgrid.find('.wgrid-checkbox-item:checked').length, "getSelectedRowsData is returning correct number of checked rows");
    });
});

createWGrid2(function($wgrid)
{
    asyncTest("Testing default shortcuts", function ()
    {
		setTimeout(function ()
		{
			var event = jQuery.Event("keydown");
			var row = $wgrid.find('tr').first();
			
			var KEYHOME = 36;
			var KEYEND = 35;
			var KEYR = 82;
			var KEYQUESTION = 193;
			var KEYESC = 27;
			var KEYDELETE = 46;
			
			event.keyCode = KEYHOME;
			$wgrid.focus();
			$wgrid.trigger(event);		
			deepEqual(row.attr('item-id'), $wgrid.find('.wgrid-selected-line').first().attr('item-id'), "'Home' key is selecting the first item");
			
			row = $wgrid.find('tr').last();
			event.keyCode = KEYEND;
			$wgrid.focus();
			$wgrid.trigger(event);
			
			event.keyCode = KEYHOME;
			event.ctrlKey = true;
			event.altKey = false;
			event.shiftKey = false;
			$wgrid.focus();
			$wgrid.trigger(event);		
			deepEqual(row.attr('item-id'), $wgrid.find('.wgrid-selected-line').last().attr('item-id'), "'Home' key with Ctrl key pressed is not selecting the first item");
			
			row = $wgrid.find('tr').last();
			event.keyCode = KEYHOME;
			event.ctrlKey = false;
			event.altKey = true;
			event.shiftKey = false;
			$wgrid.focus();
			$wgrid.trigger(event);
			deepEqual(row.attr('item-id'), $wgrid.find('.wgrid-selected-line').last().attr('item-id'), "'Home' key with Alt key pressed is not selecting the first item");
			
			row = $wgrid.find('tr').last();
			event.keyCode = KEYHOME;
			event.ctrlKey = false;
			event.altKey = false;
			event.shiftKey = true;
			$wgrid.focus();
			$wgrid.trigger(event);
			deepEqual(row.attr('item-id'), $wgrid.find('.wgrid-selected-line').last().attr('item-id'), "'Home' key with Shift key pressed is not selecting the first item");
			
			row = $wgrid.find('tr').last();	
			event = jQuery.Event("keydown");
			event.keyCode = KEYEND;
			$wgrid.focus();
			$wgrid.trigger(event);		
			deepEqual(row.attr('item-id'), $wgrid.find('.wgrid-selected-line').first().attr('item-id'), "'End' key is selecting the last item");
			
			row = $wgrid.find('tr').first();
			event.keyCode = KEYHOME;
			$wgrid.focus();
			$wgrid.trigger(event);
			
			event.keyCode = KEYEND;
			event.ctrlKey = true;
			event.altKey = false;
			event.shiftKey = false;
			$wgrid.focus();
			$wgrid.trigger(event);		
			deepEqual(row.attr('item-id'), $wgrid.find('.wgrid-selected-line').first().attr('item-id'), "'End' key with Ctrl key pressed is not selecting the last item");
			
			row = $wgrid.find('tr').first();
			event.keyCode = KEYEND;
			event.ctrlKey = false;
			event.altKey = true;
			event.shiftKey = false;
			$wgrid.focus();
			$wgrid.trigger(event);
			deepEqual(row.attr('item-id'), $wgrid.find('.wgrid-selected-line').first().attr('item-id'), "'End' key with Alt key pressed is not selecting the last item");
			
			row = $wgrid.find('tr').first();
			event.keyCode = KEYEND;
			event.ctrlKey = false;
			event.altKey = false;
			event.shiftKey = true;
			$wgrid.focus();
			$wgrid.trigger(event);
			deepEqual(row.attr('item-id'), $wgrid.find('.wgrid-selected-line').first().attr('item-id'), "'End' key with Shift key pressed is not selecting the last item");
			
			event = jQuery.Event("keydown");
			event.ctrlKey = true;
			event.keyCode = KEYR;
			$wgrid.focus();
			$wgrid.trigger(event);
			equal(0, $wgrid.find('.wgrid-selected-line').length, "WGrid is refreshing with refreshShortcut");
			
			event = jQuery.Event("keydown");
			event.keyCode = KEYQUESTION;
			event.shiftKey = true;
			$wgrid.focus();
			$wgrid.trigger(event);
			equal(1, $('.ui-dialog:visible').length, "WGrid is displaying Shortcuts List dialog");
			
			event = jQuery.Event("keydown");
			event.keyCode = KEYESC;
			$wgrid.focus();
			$(document).trigger(event);		
			equal(0, $('.ui-dialog:visible').length, "WGrid is closing Shortcuts List dialog");
			
			stop();
			setTimeout( function ()
			{
				row = $wgrid.find('table.wgrid-table tr').get(1);
				event = jQuery.Event("keydown");
				event.ctrlKey = false;
				event.keyCode = KEYHOME;
				$wgrid.focus();
				$wgrid.trigger(event);
				
				event = jQuery.Event("keydown");
				event.ctrlKey = false;
				event.keyCode = KEYDELETE;
				$wgrid.focus();
				$wgrid.trigger(event);
				equal(row.getAttribute('item-id'), $wgrid.find('tr').get(0).getAttribute('item-id'), "Custom shortcut key is calling callback function");
				start();
			}, 500);
			
			$(document).scrollTop(0);
			start();
		}, 1000);
    });
});

createWGrid2(function($wgrid)
{
	asyncTest("Testing item selection with mouse with Shift and Ctrl keys", function ()
	{
		var event = jQuery.Event('mousedown');
		var row = $wgrid.find('table.wgrid-table tr').first();
		
		event.which = 1;
		row.trigger(event);		
		deepEqual(true, row.is('.wgrid-selected-line'), 'Is selecting item with left mouse button click');
		
		var thirdRow = $wgrid.find('tr[item-id="'+$wgrid.find('table.wgrid-table tr').get(2).getAttribute('item-id')+'"]');
		event = jQuery.Event('mousedown');
		event.which = 1;
		event.shiftKey = true;
		thirdRow.trigger(event);
		equal(true, $wgrid.find('table.wgrid-table tr').slice(0, 3).is('.wgrid-selected-line'), 'Is selecting many items with Shift key and a item selected previusly');
		
		row = $wgrid.find('table.wgrid-table tr').first();
		event = jQuery.Event('mousedown');
		event.which = 1;
		event.ctrlKey = true;
		row.trigger(event);
		deepEqual(false, row.is('.wgrid-selected-line'), 'Is unselecting item with Ctrl key and left mouse button click');
		
		$wgrid.wgrid('reloadGrid');
		
		stop();
		setTimeout(function ()
		{
			row = $wgrid.find('tr[item-id="'+$wgrid.find('table.wgrid-table tr').get(2).getAttribute('item-id')+'"]');
			event = jQuery.Event('mousedown');
			event.which = 1;
			row.trigger(event);
			
			row = $wgrid.find('tr[item-id="'+$wgrid.find('table.wgrid-table tr').get(1).getAttribute('item-id')+'"]');
			event = jQuery.Event('mousedown');
			event.which = 1;
			event.shiftKey = true;
			row.trigger(event);
			
			row = $wgrid.find('tr[item-id="'+$wgrid.find('table.wgrid-table tr').get(4).getAttribute('item-id')+'"]');
			event = jQuery.Event('mousedown');
			event.which = 1;
			event.shiftKey = true;
			row.trigger(event);
			
			deepEqual(true, $wgrid.find('table.wgrid-table tr').slice(2, 5).is('.wgrid-selected-line'), 'Is selecting many items with Shift key and a item selected previusly');			
			
			start();
		}, 500);
		
		start();
	});
});

