function runTests()
{
    module('Method tests');
    test("Check and Unckeck tests", function ()
    {
        $("#yesno").wswitchbutton('check');
        equal($("#yesno").is(':checked'), true, "Element being checked");

        $("#yesno2").wswitchbutton('uncheck');
        equal($("#yesno2").is(':checked'), false, "Element being unchecked");

        $("#yesno5").wswitchbutton('check');
        equal($("#yesno5").is(':checked'), false, "Element disabled can't be checked");

        $("#yesno4").wswitchbutton('uncheck');
        equal($("#yesno4").is(':checked'), true, "Element disabled can't be unchecked");
    });

    module('Events tests');
    asyncTest("Background changes", function ()
    {
        $("#yesno3").wswitchbutton('uncheck');
        setTimeout(function ()
        {
            deepEqual($("#yesno3").next().find('.button').css('background-position'), "-25px 50%", "Element is with correct background when unchecked");
            start();
        }, 750);
    });
    asyncTest("Background changes", function ()
    {
        $("#yesno3").wswitchbutton('check');
        setTimeout(function ()
        {
            deepEqual($("#yesno3").next().find('.button').css('background-position'), "0px 50%", "Element is with correct background when checked");
            start();
        }, 750);
    });

    asyncTest("Background no changes", function ()
    {
        var bgBefore = $("#yesno4").next().find('.button').css('background-position');
        $("#yesno4").wswitchbutton('check');
        setTimeout(function ()
        {
            var bgAfter = $("#yesno4").next().find('.button').css('background-position');
            deepEqual(bgAfter, bgBefore, "Element is with correct background when checked");
            start();
        }, 100);

    });

    asyncTest("Background no changes", function ()
    {
        var bgBefore = $("#yesno5").next().find('.button').css('background-position');
        $("#yesno5").wswitchbutton('uncheck');
        setTimeout(function ()
        {
            var bgAfter = $("#yesno5").next().find('.button').css('background-position');
            deepEqual(bgAfter, bgBefore, "Element is with correct background when unchecked");
            start();
        }, 100);

    });

    module('Click events');
    asyncTest("Yes label click", function ()
    {
        $("#yesno6").wswitchbutton('uncheck');
        var bgBefore = $("#yesno6").next().find('.button').css('background-position');
        $("#yesno6").next().find('.right').trigger('click');
        setTimeout(function ()
        {
            var bgAfter = $("#yesno6").next().find('.button').css('background-position');
            equal(bgAfter != bgBefore, true, "Element is with correct background when checked with click on yes label");
            equal($("#yesno6").is(':checked'), true, "Element is checked when clicked on yes label");
            start();
        }, 750);

    });
    asyncTest("No label click", function ()
    {
        $("#yesno7").wswitchbutton('check');
        var bgBefore = $("#yesno7").next().find('.button').css('background-position');
        $("#yesno7").next().find('.left').trigger('click');
        setTimeout(function ()
        {
            var bgAfter = $("#yesno7").next().find('.button').css('background-position');
            equal(bgAfter != bgBefore, true, "Element is with correct background when unchecked with click on no label");
            equal($("#yesno7").is(':checked'), false, "Element is unchecked when clicked on no label");
            start();
        }, 750);

    });

    /*asyncTest("Switchbutton click", function ()
    {
        $("#yesno8").wswitchbutton('check');
        var bgBefore = $("#yesno8").next().find('.button').css('background-position');
        $("#yesno8").next().find('.button').trigger('click');
        setTimeout(function ()
        {
            var bgAfter = $("#yesno8").next().find('.button').css('background-position');
            equal(bgAfter != bgBefore, true, "Element is with correct background when unchecked with click on switchbutton");
            equal($("#yesno8").is(':checked'), false, "Element is unchecked when clicked on switchbutton");
            start();
        }, 750);

    });*/

    $("#testButton").remove();
    $("#tests").fadeIn();
}