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
test("Background uncheck changes", function ()
{
    stop(1);
    var bg;
    var result;
    if (navigator.appName != 'Microsoft Internet Explorer')
    {
        bg = $("#yesno3").next().find('.button').css('background-position');
        result = "0px 50%";

    }
    else
    {
        bg = $("#yesno3").next().find('.button').css('background-position-y');
        bg += " " + $("#yesno3").next().find('.button').css('background-position-x');
        result = "0px 0px";
    }
    $("#yesno3").wswitchbutton('uncheck');
    setTimeout(function ()
    {
        deepEqual(bg != $("#yesno3").next().find('.button').css('background-position'), true, "Element has changed background");
        deepEqual(bg, result, "Element is with correct background when unchecked");
        start();
    }, 750);
});

test("Background uncheck changes", function ()
{
    stop(1);
    var bg;
    var result;
    if (navigator.appName != 'Microsoft Internet Explorer')
    {
        bg = $("#yesno3").next().find('.button').css('background-position');
        result = "-25px 50%";

    }
    else
    {
        bg = $("#yesno3").next().find('.button').css('background-position-y');
        bg += " " + $("#yesno3").next().find('.button').css('background-position-x');
        result = "0px -25px";
    }
    $("#yesno3").wswitchbutton('check');
    setTimeout(function ()
    {
        deepEqual(bg != $("#yesno3").next().find('.button').css('background-position'), true, "Element has changed background");
        deepEqual(bg, result, "Element is with correct background when checked");
        start();
    }, 750);
});

test("Background no changes", function ()
{
    stop(1);
    var bgBefore = $("#yesno4").next().find('.button').css('background-position');
    $("#yesno4").wswitchbutton('check');
    setTimeout(function ()
    {
        var bgAfter = $("#yesno4").next().find('.button').css('background-position');
        deepEqual(bgAfter, bgBefore, "Element is with correct background when checked");
        start();
    }, 100);

});

test("Background no changes", function ()
{
    stop(1);
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
test("No label click", function ()
{
    stop(1);
    $("#yesno6").wswitchbutton('check');
    var bgBefore;
    if (navigator.appName != 'Microsoft Internet Explorer')
    {
        bgBefore = $("#yesno6").next().find('.button').css('background-position');
    }
    else
    {
        bgBefore = $("#yesno6").next().find('.button').css('background-position-x');
        bgBefore += " " + $("#yesno6").next().find('.button').css('background-position-y');
    }

    $("#yesno6").next().find('.left').trigger('click');
    setTimeout(function ()
    {
        var bgAfter;
        if (navigator.appName != 'Microsoft Internet Explorer')
        {
            bgBefore = $("#yesno6").next().find('.button').css('background-position');
        }
        else
        {
            bgBefore = $("#yesno6").next().find('.button').css('background-position-x');
            bgBefore += " " + $("#yesno6").next().find('.button').css('background-position-y');
        }

        equal(bgAfter != bgBefore, true, "Element is with correct background when unchecked with click on no label");
        equal($("#yesno6").is(':checked'), false, "Element is unchecked when clicked on no label");
        start();
    }, 750);

});
test("Yes label click", function ()
{
    stop(1);
    $("#yesno2").wswitchbutton('uncheck');
    var bgBefore;
    if (navigator.appName != 'Microsoft Internet Explorer')
    {
        bgBefore = $("#yesno2").next().find('.button').css('background-position');
    }
    else
    {
        bgBefore = $("#yesno2").next().find('.button').css('background-position-x');
        bgBefore += " " + $("#yesno2").next().find('.button').css('background-position-y');
    }

    $("#yesno2").next().find('.right').trigger('click');
    setTimeout(function ()
    {
        var bgAfter = $("#yesno2").next().find('.button').css('background-position');
        equal(bgAfter != bgBefore, true, "Element is with correct background when checked with click on yes label");
        equal($("#yesno2").is(':checked'), true, "Element is checked when clicked on yes label");
        start();
    }, 750);

});

$("#testButton").remove();
$("#tests").fadeIn();