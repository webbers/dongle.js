$(document).ready(function ()
{
    var change = 0;
    $('input[type=checkbox]').change(function ()
    {
        change++;
        $("#change-detect").html('<br />Change ' + change + ' vezes');
    });

    $('.wswitchbutton-persona').each(function ()
    {
        var opt =
        {
            speed: 1
        };
        var yes = 'Sim personalizado';
        var no = 'Nao personalzado';

        if (yes)
        {
            opt.yes = yes;
        }
        if (no)
        {
            opt.no = no;
        }
        $(this).wswitchbutton(opt);
    });
    
    $('.wswitchbutton-default').each(function ()
    {
        var opt =
        {
            speed: 1
        };
        $(this).wswitchbutton(opt);
    });
});

module('SwitchButton');
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

function getPosition($element)
{
   if (navigator.appName != 'Microsoft Internet Explorer')
    {
        var result = $element.next().find('.button').css('background-position').split(' ');
        for(var i = 0; i < result.length; i++ )
        {
            result[i] = parseInt(result[i], 10);
        } 
        return result;
    }
    else
    {
        return [
            parseInt( $element.next().find('.button').css('background-position-y'), 10),
            parseInt( $element.next().find('.button').css('background-position-x'), 10)
        ];
    } 
}

test("Background uncheck changes", function ()
{
    var expected;

    stop();
    
    var result = getPosition($('#yesno3'));
    
    if (navigator.appName != 'Microsoft Internet Explorer')
    {
        expected = [0, 50];
    }
    else
    {
        expected = [0, 0];
    }
    $("#yesno3").wswitchbutton('uncheck');
    
    setTimeout(function ()
    {
        var newPosition = getPosition($('#yesno3'));
        notDeepEqual(newPosition, result, "Element has changed background");
        deepEqual(result, expected, "Element is with correct background when unchecked");
        start();
    }, 100);
});

test("Background uncheck changes", function ()
{
    stop();

    var expected;
    var result = getPosition($('#yesno3'));
    
    if (navigator.appName != 'Microsoft Internet Explorer')
    {
        expected = [-25, 50];
    }
    else
    {
        expected = [0, -25];
    }
    $("#yesno3").wswitchbutton('check');
    setTimeout(function ()
    {
        var newPosition = getPosition($('#yesno3'));
        notDeepEqual(newPosition, result, "Element has changed background");
        deepEqual(result, expected, "Element is with correct background when checked");
        start();
    }, 100);
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
    }, 100);

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
    }, 100);

});

$("#testButton").remove();
$("#tests").fadeIn();