var teste = false;
$(document).ready(function ()
{
	$("#myDiv").wcontextmenu({
		menu: 'myMenu',
		select: function (action, el, pos)
		{
			teste = true;
		}
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

test("Show items",function()
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

test("Hover test",function()
{
	$('#myDiv').wcontextmenu('showItems', '#item4');
	
	$('#myDiv').trigger({type:'mousedown', button: 2});
	$('#myDiv').trigger({type:'mouseup', button: 2});
	
	$("a[href='#item4']").trigger('mouseover');
	
	ok($("a[href='#item4']").parent().hasClass('hover')===true);
	
	$("a[href='#item4']").trigger('mouseout');
	
	$("a[href='#subitem1']").trigger('mouseover');
	ok($("a[href='#subitem1']").parent().hasClass('hover')===true);
	
	$("a[href='#subitem1']").trigger('mouseout');
});

test("Hide items by two type",function()
{
	$('#myDiv').wcontextmenu('hideItemsByTypes', 'type1, type2');
	
	$('#myDiv').trigger({type:'mousedown', button: 2});
	$('#myDiv').trigger({type:'mouseup', button: 2});
	
	ok($("a[href='#item2']").is(':visible')===false);
	ok($("a[href='#item1']").is(':visible')===false);
});

test("Submenu click test",function()
{
	$('#myDiv').wcontextmenu('showItems', '#item4');
	
	$('#myDiv').trigger({type:'mousedown', button: 2});
	$('#myDiv').trigger({type:'mouseup', button: 2});
	
	$("a[href='#item4']").trigger('mouseover');
		
	$("a[href='#subitem1']").trigger('mouseover');
	
	$("a[href='#subitem1']").click();
	ok($("#myMenu").is(':visible')===false);
	ok(teste===true);
});