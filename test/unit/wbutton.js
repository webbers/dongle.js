var wbuttonClicked = false;

$(document).ready(function()
{
	$('#wbutton-default').click(function(){ wbuttonClicked = true; });
});

module('WButon');
test("Basic tests", function ()
{
	equal($('#wbutton-default .content, #wbutton-default .final-content').length, 2, 'Verifing if element is correctly strutured');
	
	$('#wbutton-default').wbutton('disable');
	equal($('#wbutton-default').is('.disabled'), true, 'Verifing if element is correctly disabled');
	
	$('#wbutton-default').trigger('click');
	equal(wbuttonClicked, false, 'Verifing if element is NOT abble to execute click function when disabled');
	
	$('#wbutton-default').wbutton('enable');
	equal($('#wbutton-default').is('.disabled'), false, 'Verifing if element is correctly enabled');
	
	$('#wbutton-default').trigger('click');
	equal(wbuttonClicked, true, 'Verifing if element is abble to execute click function when enabled');
});

test('Other events tests', function()
{
	$('#wbutton-default').trigger('mouseenter');
	equal($('#wbutton-default').is('.wbutton-normal-hover'), true, 'Verifing if element is correctly exectuing hover event (enter)');
	
	$('#wbutton-default').trigger('mouseleave');
	equal($('#wbutton-default').is('.wbutton-normal-hover'), false, 'Verifing if element is correctly exectuing hover event (leave)');
	
	$('#wbutton-default').trigger('mousedown');
	equal($('#wbutton-default').is('.wbutton-normal-active'), true, 'Verifing if element is correctly exectuing mousedown event');
	
	$('#wbutton-default').trigger('mouseup');
	equal($('#wbutton-default').is('.wbutton-normal-active'), false, 'Verifing if element is correctly exectuing mouseup event');
});