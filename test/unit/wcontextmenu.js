$(document).ready(function ()
{

	// Show menu when #myDiv is clicked
	$("#myDiv").wcontextmenu({
		menu: 'myMenu',
		select: function (action, el, pos)
		{
			alert(
					'Action: ' + action + '\n\n' +
						'Element ID: ' + $(el).attr('id') + '\n\n' +
							'X: ' + pos.x + '  Y: ' + pos.y + ' (relative to element)\n\n' +
								'X: ' + pos.docX + '  Y: ' + pos.docY + ' (relative to document)'
				);
		}
	});

	// Disable first internal menu
	$("#disableInternalMenu").click(function ()
	{
		$('#myDiv, #myList UL LI').wcontextmenu('disableItems', "#item5");
		$(this).attr('disabled', true);
		$("#enableInternalMenu").attr('disabled', false);
	});

	// Enable first internal menu
	$("#enableInternalMenu").click(function ()
	{
		$('#myDiv, #myList UL LI').wcontextmenu('enableItems', "#item5");
		$(this).attr('disabled', true);
		$("#disableInternalMenu").attr('disabled', false);
	});

});

module('WContextmenu');
test("Open and close contextmenu", function ()
{
    $('#myDiv').trigger({type:'mousedown', button: 2});
	$('#myDiv').trigger({type:'mouseup', button: 2});
	ok($("#myMenu").is(':visible')===true);
});

test("Disable contextmenu",function()
{
	$('#myDiv').wcontextmenu('disable');
	
	$('#myDiv').trigger({type:'mousedown', button: 2});
	$('#myDiv').trigger({type:'mouseup', button: 2});
	
	ok($("#myMenu").is(':visible')===false);
	
	$('#myDiv').wcontextmenu('enable');
	
});

test("Enable contextmenu", function ()
{
	$('#myDiv').wcontextmenu('enable');
    ok($("#myMenu").is(':visible')===false);
});

test("Disable items",function()
{
	$('#myDiv').wcontextmenu('disableItems', '#item3');
	
	$('#myDiv').trigger({type:'mousedown', button: 2});
	$('#myDiv').trigger({type:'mouseup', button: 2});
	
	ok($("a[href='#item3']").parent().hasClass("disabled")===true);
});

test("Enable items",function()
{
	$('#myDiv').wcontextmenu('enableItems', '#item3');
	
	$('#myDiv').trigger({type:'mousedown', button: 2});
	$('#myDiv').trigger({type:'mouseup', button: 2});
	
	ok($("a[href='#item3']").parent().hasClass("disabled")===false);
});

test("Disable internal items",function()
{
	$('#myDiv').wcontextmenu('disableItems', "#subitem1");
	
	$('#myDiv').trigger({type:'mousedown', button: 2});
	$('#myDiv').trigger({type:'mouseup', button: 2});
	
	ok($("a[href='#subitem1']").parent().hasClass("disabled")===true);
});

test("Enable internal items",function()
{
	$('#myDiv').wcontextmenu('enableItems', '#subitem1');
	
	$('#myDiv').trigger({type:'mousedown', button: 2});
	$('#myDiv').trigger({type:'mouseup', button: 2});
	
	ok($("a[href='#subitem1']").parent().hasClass("disabled")===false);
});

test("Hide items",function()
{
	$('#myDiv').wcontextmenu('hideItems', '#item1');
	
	$('#myDiv').trigger({type:'mousedown', button: 2});
	$('#myDiv').trigger({type:'mouseup', button: 2});
	
	ok($("a[href='#item1']").is(':visible')===false);
});

test("Hide items",function()
{
	$('#myDiv').wcontextmenu('showItems', '#item1');
	
	$('#myDiv').trigger({type:'mousedown', button: 2});
	$('#myDiv').trigger({type:'mouseup', button: 2});
	
	ok($("a[href='#item1']").is(':visible')===true);
});

test("Hide items by type",function()
{
	$('#myDiv').wcontextmenu('hideItemsByTypes', 'type2');
	
	$('#myDiv').trigger({type:'mousedown', button: 2});
	$('#myDiv').trigger({type:'mouseup', button: 2});
	
	ok($("a[href='#item2']").is(':visible')===false);
});