﻿function runTests()
{
    module("CSS");
    test("Initial CSS Tests", function ()
    {
        $('.reload-items').click();
        var heigth = $('#wgrid-teste').closest('.wgrid').height();
        if (heigth < 200)
        {
            heigth = false;
        }
        else
        {
            heigth = true;
        }
        equal(heigth, true, "Wgrid is greather than 200px");

        var bgWhite = true;
        $(".wgrid-table tbody tr").each(function ()
        {
            if ($(this).css('background-color') != "rgba(0, 0, 0, 0)" && $('.wgrid-checkbox-item:eq(' + $(this).index() + ')').is(':checked') == false)
            {
                bgWhite = false;
            }
        });

        var position = $('#wgrid-teste').closest('.wgrid').css('position');
        equal(position, "relative", "Position relative test!");
        equal(bgWhite, true, "Row background is white when load wgrid");
    });
    
    module("Records");
    test("First 10 records", function ()
    {
        var qtd = $(".wgrid-table tbody tr").length;
        equal(qtd, 10, "Listing 10 items when load Wgrid in first time");
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
    
    test("Event fired when row clicked", function ()
    {
        expect(1);
        $(".wgrid-table").find("tr:eq(3)").click();
        var $clicked = $('#clicked');
        if ($clicked.is(':visible'))
        {
            $clicked.remove();
            ok(true, "Click event fired!");
            return;
        }
        else
        {
            $clicked.remove();
            ok(false, "Click event not fired!");
        }
        $clicked.remove();
    });

    test("Re-order test", function ()
    {
        var firstValue = $(".wgrid-table tr:eq(0) td:eq(0)").text();
        $('.wgrid-order-button').click();
        deepEqual(ajaxReturnValue($(".wgrid-table tr:eq(0) td:eq(0)")) != firstValue, true, "Reordering sucess!");
    });

    test("Paging", function ()
    {
        $(".more-items-button").click();
        stop();
        setTimeout(function ()
        {
            var total = $(".wgrid-total").text();
            var displaying = $(".wgrid-displaying").text();
            var moreItemsButtonShow = $(".more-items-button").is(":visible");
            equal(moreItemsButtonShow, false, "More items buttons hiding when showing all records");
            deepEqual(total == displaying, true, "Get-more-items bar is showing corret number of records");
            deepEqual($(".wgrid-table tr").length == total, true, "Wgrid is showing all " + total + " records");
            start();
        },500);
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
                deepEqual($(".wgrid-table tr:eq(0) td:eq(0):contains('" + checkValue + "')").length > 0, true, "Showing exactly row with value equals filter field value");
                start();
            }, 100);
            start();
        }, 100);
    });

    test("EndsWith", function ()
    {
        $('.wgrid-filter-button').click();
        stop();
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
                deepEqual($(".wgrid-table tr:eq(0) td:eq(0):contains('" + checkValue + "')").length > 0, true, "Showing exactly row with value equals filter field value");
                start();
            }, 100);
            start();
        }, 100);
    });

    test("Contains", function ()
    {
        $('.wgrid-filter-button').click();
        stop();
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
                deepEqual($(".wgrid-table tr:eq(0) td:eq(0):contains('" + checkValue + "')").length > 0, true, "Showing exactly row with value equals filter field value");
                start();
            }, 100);
            start();
        }, 100);
    });

    test("Equals", function ()
    {
        $('.wgrid-filter-button').click();
        stop();
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
                deepEqual($(".wgrid-table tr:eq(0) td:eq(0)").text() == checkValue, true, "Showing exactly row with value equals filter field value");
                start();
            }, 100);
            start();
        }, 100);

    });
    
    $("#testButton").remove();
    $("#tests").fadeIn();
}

function ajaxReturnValue($selector) 
{
    $(document).ajaxComplete(function ()
    {
        return $selector.text();
    });
}