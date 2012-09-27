(function($){

	module("methods");

	test("open", function(){
		expect(2);
	 
		el = $("select").wselect().wselect("open");
			ok( el.wselect("isOpen"), "isOpen parameter true" );
			equal( menu().css("display"), "block", "Test display CSS property" );
		el.wselect("destroy");
	});
	
	test("close", function(){
		expect(2);
	 
		el = $("select").wselect().wselect("open").wselect("close");
			ok( !el.wselect("isOpen"), "isOpen parameter false" );
			equal( menu().css("display"), "none", "Test display CSS property" );
		el.wselect("destroy");
	});
	
	test("enable", function(){
		expect(2);
	 
		el = $("select").wselect().wselect("disable").wselect("enable");
			ok( button().is(":disabled") === false, "Button is enabled" );
			ok( el.is(":disabled") === false, "Original select is enabled" );
		el.wselect("destroy");
	});
	
	test("disable", function(){
		expect(2);
	 
	 	// clone this one so the original is not affected
		el = $("select").clone(true).appendTo(body).wselect().wselect("disable");
			ok( button().is(":disabled"), 'Button is disabled');
			ok( el.is(":disabled"), 'Original select is disabled');
		el.wselect("destroy").remove();
	});
	
	test("enabling w/ pre-disabled tags (#216)", function(){
		expect(5);
	 
	 	el = $('<select><option disabled value="foo">foo</option><option value="bar">bar</option>')
			.appendTo(document.body)
			.wselect();

		var boxes = menu().find("input")
		var disabled = boxes.first();
		var enabled = boxes.last();
		var key = "ech-wselect-disabled";

		equal(disabled.is(":disabled"), true, "The first option is disabled");
		el.wselect("disable");
		equal(disabled.data(key), undefined, "After disabling the widget, the pre-disabled option is not flagged to re-enable");
		equal(enabled.data(key), true, "and the enabled option is flagged to be re-enable");
		el.wselect("enable");
		equal(disabled.is(":disabled"), true, "After enabling, the first option is still disabled");
		equal(disabled.data(key), undefined, "and the option no longer has the stored data flag");
		el.wselect("destroy").remove();
	});
	
	test("widget", function(){
		expect(1);
	 
		el = $("select").wselect();
			ok( menu().is("div.wselect-menu"), 'Widget is the menu element');
		el.wselect("destroy");
	});
	
	test("getButton", function(){
		expect(1);
	 
		el = $("select").wselect();
		var button = el.wselect("getButton");
			ok( button.is("button.wselect"), 'Button is the button element');
		el.wselect("destroy");
	});
	
	test("checkAll", function(){
		expect(1);
	 
		el = $("select").wselect().wselect("checkAll");
		var inputs = menu().find("input");
			ok( inputs.filter(":checked").length === inputs.length, 'All inputs selected on the widget?');
		el.wselect("destroy");
	});

	test("uncheckAll", function(){
		expect(1);
	 
		el = $("select").wselect().wselect("checkAll").wselect("uncheckAll");
			ok( menu().find("input:checked").length === 0, 'All inputs unchecked on the widget?');
		el.wselect("destroy");
	});

	test("isOpen", function(){
		expect(2);
	 
		el = $("select").wselect().wselect("open");
			ok( el.wselect("isOpen"), 'Testing isOpen method after calling open method');
		el = $("select").wselect("close");
			ok( !el.wselect("isOpen"), 'Testing isOpen method after calling close method');
		el.wselect("destroy");
	});

	test("destroy", function(){
		expect(2);
	 
		el = $("select").wselect().wselect("destroy");
			ok( !$(".wselect").length , 'button.wselect removed from the DOM');
			ok( !el.data("wselect") , 'no more wselect obj attached to elem');
	});

	test("getChecked", function(){
		expect(2);
	 
		el = $("select").wselect().wselect("checkAll");
			equal( el.wselect("getChecked").length, 9, 'number of checkboxes returned after checking all and calling getChecked');
		el.wselect("uncheckAll");
			equal( el.wselect("getChecked").length, 0, 'number of checkboxes returned after unchecking all and calling getChecked');
		el.wselect("destroy");
	});

	test("refresh", function(){
		expect(4);
		
		el = $("select").clone().appendTo(body).wselect();
		el.empty().html('<option value="foo">foo</option><option value="bar">bar</option>');
		el.wselect('refresh');
		
		var checkboxes, getCheckboxes = (function hai(){
			checkboxes = menu().find('input[type="checkbox"]');
			return hai;
		})();
		
		equal( checkboxes.length, 2, "After clearing the select, adding 2 options, and refresh(), only 2 checkboxes exist");
		equal( checkboxes.eq(0).val(), 'foo', 'first is foo' );
		equal( checkboxes.eq(1).val(), 'bar', 'second is foo' );
		
		// add one more w/ append, just for safety's sake
		el.append('<option value="baz">baz</option>');
		el.wselect('refresh');
		getCheckboxes();
		equal( checkboxes.eq(2).val(), 'baz', 'after an append() call, the third option is now' );
		
		el.wselect("destroy").remove();
	});
})(jQuery);
