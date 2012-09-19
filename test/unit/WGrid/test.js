/*module("CSS");
test("Initial Tests", function ()
{
    $(".wgrid-table tr:eq(0) td:eq(1)").text("Teste");
    $('.reload-items').click();
    var heigth = $('#wgrid-teste').closest('.wgrid').height();
    if (heigth >= 200)
    {
        heigth = true;
    }
    var position = $('#wgrid-teste').closest('.wgrid').css('position');
    var widthError = 0;
    $("#wgrid-teste tr th").each(function ()
    {
        var index = $(this).index();
        if ($(".wgrid-table tr:eq(0) td:eq(" + index + ")").width() != $(this).width())
        {
            widthError += 1;
        }
    });

    if ($('.wgrid-check-container').css('position') == "absolute" && $('.wgrid-header-container').css('position') == "absolute" && $('.wgrid-container').css('position') == "absolute" && $('.wgrid-status-panel').css('position') == "absolute")
    {
        ok(true, "All wgrid main elements has position absolute");
    }
    equal(widthError, 0, "All <TH> width's is equals of respective <TD> width");
    equal(heigth, true, "Wgrid is greather than 200px");
    equal(position, "relative", "Wgrid have position relative");
    deepEqual($(window).width() >= $('.wgrid').width(), true, 'Wgrid is not more larger than window');
});

module("Records");
test("Listing like ListItemCount", function ()
{
    var qtd = $(".wgrid-table tbody tr").length;
    deepEqual(qtd != 0, true, "Listing items when load Wgrid in first time like listItemCount");
});

test("Disable Handling", function ()
{
    expect(0);
    $("#wgrid-teste th[disable_handling=true]").each(function ()
    {
        var filter = $(this).find('.wgrid-filter-button');
        var order = $(this).find('.wgrid-order-button');

        if (filter.length > 0 || order.length > 0)
        {
            ok(false, "There is some column with disable handling true but still showing filter or order icon");
        }
    });
});

module("Global");
test("Checkboxes tests", function ()
{
    expect(4);
    if (!$('.wgrid-checkbox-all').is(':checked'))
    {
        $('.wgrid-checkbox-all').attr('checked', true);
        $('.wgrid-checkbox-all').trigger('click');
        $('.wgrid-checkbox-all').attr('checked', true);
        deepEqual($(".wgrid-checkbox-all").is(':checked') == true && $(".wgrid-checkbox-item:checked").length == $(".wgrid-displaying").text(), true, "All checkboxes checked when click to select all");
    }
    if ($('.wgrid-checkbox-all').is(':checked'))
    {
        $('.wgrid-checkbox-all').attr('checked', false);
        $('.wgrid-checkbox-all').trigger('click');
        $('.wgrid-checkbox-all').attr('checked', false);
        deepEqual($(".wgrid-checkbox-all").is(':checked') == false && $(".wgrid-checkbox-item:checked").length == 0, true, "All checkboxes unchecked when click to unselect all");
    }

    var correctCheck = true;
    $('.wgrid-checkbox-item').each(function ()
    {
        var indexRow = $(this).index();

        $(this).attr('checked', true);
        $(this).trigger('click');
        $(this).attr('checked', true);
        if ($(this).is(':checked') && $(".wgrid-table tr:eq(" + indexRow + ")").css('background-color') == "rgba(0, 0, 0, 0)")
        {
            correctCheck = false;
        }

    });
    equal(correctCheck, true, "All checkboxes check their respective row in table");

    var correctUncheck = true;
    $('.wgrid-checkbox-item').each(function ()
    {
        var indexRow = $(this).index();

        $(this).attr('checked', false);
        $(this).trigger('click');
        $(this).attr('checked', false);
        if (!$(this).is(':checked') && $(".wgrid-table tr:eq(" + indexRow + ")").css('background-color') != "rgba(0, 0, 0, 0)")
        {
            correctCheck = false;
        }

    });
    equal(correctUncheck, true, "All checkboxes uncheck their respective row in table");
});

test("Re-order test", function ()
{
    var firstValue = $(".wgrid-table tr:eq(0) td:eq(0)").text();
    $('.wgrid-order-button').click();
    deepEqual(ajaxReturnValue($(".wgrid-table tr:eq(0) td:eq(0)")) != firstValue, true, "Reordering records!");
});

test("Paging", function ()
{
    $(".more-items-button").click();
    stop(1);
    setTimeout(function ()
    {
        var total = $(".wgrid-total").text();
        var displaying = $(".wgrid-displaying").text();
        var moreItemsButtonShow = $(".more-items-button").is(":visible");
        equal(moreItemsButtonShow, false, "More items buttons hiding when showing all records");
        deepEqual(total == displaying, true, "Get-more-items bar is showing corret number of records");
        deepEqual($(".wgrid-table tr").length == total, true, "Wgrid is showing all " + total + " records");
        start();
    }, 700);
});

module('Filters');
test("StartsWith", function ()
{
    $('.wgrid-filter-button').click();
    stop();
    setTimeout(function ()
    {
        var checkValue = 2;
        $('input[name=filter-field1]').val(checkValue);
        $('input[type=radio][value=startsWith]').click();
        $('input[type=radio][value=startsWith]').attr('checked', 'checked');
        $('.wgrid-filter-panel-apply-button').click();
        stop();
        setTimeout(function ()
        {
            deepEqual($(".wgrid-table tr:eq(0) td:eq(0):contains('" + checkValue + "')").length > 0, true, "Showing row(s) with value(s) starts with filter value");
            start();
        }, 200);
        start();
    }, 200);
});

test("EndsWith", function ()
{
    $('.wgrid-filter-button').click();
    stop(1);
    setTimeout(function ()
    {
        var checkValue = 6;
        $('input[name=filter-field1]').val(checkValue);
        $('input[type=radio][value=endsWith]').click();
        $('input[type=radio][value=endsWith]').attr('checked', 'checked');
        $('.wgrid-filter-panel-apply-button').click();
        stop();
        setTimeout(function ()
        {
            deepEqual($(".wgrid-table tr:eq(0) td:eq(0):contains('" + checkValue + "')").length > 0, true, "Showing row(s) with value(s) ends with filter value");
            start();
        }, 200);
        start();
    }, 200);
});

test("Contains", function ()
{
    $('.wgrid-filter-button').click();
    stop(1);
    setTimeout(function ()
    {
        var checkValue = 1;
        $('input[name=filter-field1]').val(checkValue);
        $('input[type=radio][value=contains]').click();
        $('input[type=radio][value=contains]').attr('checked', 'checked');
        $('.wgrid-filter-panel-apply-button').click();
        stop();
        setTimeout(function ()
        {
            deepEqual($(".wgrid-table tr:eq(0) td:eq(0):contains('" + checkValue + "')").length > 0, true, "Showing row(s) with value(s) contains filter value");
            start();
        }, 200);
        start();
    }, 200);
});

test("Equals", function ()
{
    $('.wgrid-filter-button').click();
    stop(1);
    setTimeout(function ()
    {
        var checkValue = 20;
        $('input[name=filter-field1]').val(checkValue);
        $('input[type=radio][value=equals]').trigger('click');
        $('input[type=radio][value=equals]').attr('checked', 'checked');
        $('.wgrid-filter-panel-apply-button').click();
        stop();
        setTimeout(function ()
        {
            deepEqual($(".wgrid-table tr:eq(0) td:eq(0)").text() == checkValue, true, "Showing row(s) with value(s) equals filter value");
            start();
        }, 200);
        start();
    }, 200);

});

test("Equals with no result", function ()
{
    $('.wgrid-filter-button').click();
    stop(1);
    setTimeout(function ()
    {
        var checkValue = 99;
        $('input[name=filter-field1]').val(checkValue);
        $('input[type=radio][value=equals]').trigger('click');
        $('input[type=radio][value=equals]').attr('checked', 'checked');
        $('.wgrid-filter-panel-apply-button').click();
        stop();
        setTimeout(function ()
        {
            deepEqual($(".wgrid-table tr:eq(0) td:eq(0)").text() == "", true, "Show no results when filters doens't find any record");
            start();
        }, 200);
        start();
    }, 200);

});

module("Wgrid functions");
test("loaderShow", function ()
{
    $('.wgrid').wgrid('loaderShow');
    equal($('.wgrid-loader-overlay').is(':visible'), true, "Showing loader overlay");
});

test("loaderHide", function ()
{
    $('.wgrid').wgrid('loaderHide');
    equal($('.wgrid-loader-overlay').is(':visible'), false, "Hiding loader overlay");
});

test("getFilters", function ()
{
    equal(typeof ($('.wgrid').wgrid('getFilters')), "object", "getFilter is returning a object");
});

test("getOrderAndSort", function ()
{
    equal(typeof ($('.wgrid').wgrid('getOrderAndSort')), "object", "getOrderAndSort is returning a object");
});

test("clearGrid", function ()
{
    $('.wgrid').wgrid('clearGrid');
    equal($('.wgrid .wgrid-table').html(), "", "clearGrid is clearing grid");
});

test("getHeaderColumns", function ()
{
    var getHeaderColumns = $('.wgrid').wgrid('getHeaderColumns');
    equal(typeof (getHeaderColumns), "object", "getHeaderColumns generates a object");
    equal($(getHeaderColumns[0]).is('th'), true, "getHeaderColumns[0] is a th(column) element");
});

test("getQuerystring", function ()
{
    var getQuerystring = $('.wgrid').wgrid('getQuerystring');
    equal(typeof (getQuerystring), "string", "getQuerystring generates a string");
    equal($('.wgrid').wgrid('getQuerystring').split('&').length >= 2, true, "getQuerystring generates more than 2 query strings");
});

test("getHeaderColumnIndex", function ()
{
    equal(typeof $('.wgrid').wgrid('getHeaderColumnIndex', 'field1'), "number", "getHeaderColumnIndex is returning a numeric value");
    equal($('.wgrid').wgrid('getHeaderColumnIndex', 'field1'), 0, "getHeaderColumnIndex(field1) returning the correct number of column index(0)");
    equal($('.wgrid').wgrid('getHeaderColumnIndex', 'field2'), 1, "getHeaderColumnIndex(field2) returning the correct number of column index(1)");
    equal($('.wgrid').wgrid('getHeaderColumnIndex', 'field3'), 2, "getHeaderColumnIndex(field2) returning the correct number of column index(2)");
});

test("getRowsData", function ()
{
    equal(typeof $('.wgrid').wgrid('getRowsData'), "object", "getRowsData is returning a object");
    deepEqual($('.wgrid').find('.wgrid-table tr').length == $('.wgrid').wgrid('getRowsData').length, true, "getRowsData is returning the correct number of data");
});

$("#testButton").remove();
$("#tests").fadeIn();


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
}*/