(function($){

	module("options");

	test("noneSelectedText", function(){
		expect(7);
		var text;
		
		el = $("select").wselect({
			noneSelectedText: 'None Selected'
		});
		
		// read from widget
		text = el.wselect("option", "noneSelectedText");
		
		equal( button().text(), text, 'on init, button reads "None Selected"');
		el.wselect("checkAll");
		ok( button().text() !== text, 'after checkAll, button no longer reads "None Selected"');
		el.wselect("uncheckAll");
		equal( button().text(), text, 'after uncheckAll, button text restored to "None Selected"');
		
		// change the option value
		el.wselect("option", "noneSelectedText", "No Checkboxes Checked");
		equal( el.wselect("option", "noneSelectedText"), "No Checkboxes Checked", "new noneSelectedText value set correctly");
		
		// read updated value from widget
		text = el.wselect("option", "noneSelectedText");
		
		// test against the new value
		equal( button().text(), text, 'after changing the option value, button now reads "No Checkboxes Checked"');
		el.wselect("checkAll");
		ok( button().text() !== text, 'after checkAll, button no longer reads "No Checkboxes Checked"');
		el.wselect("uncheckAll");
		equal( button().text(), text, 'after uncheckAll, button text restored to "No Checkboxes Checked"');
		
		el.wselect("destroy");
	});

	test("selectedText", function(){
		expect(3);
		var numOptions = $("select option").length;
		
		el = $("select").wselect({
			selectedText: '# of # selected'
		});
		
		el.wselect("checkAll");
		equal( button().text(), numOptions+' of '+numOptions+' selected', 'after checkAll, button reflects the total number of checked boxes');
		
		// change option value
		el.wselect("option", "selectedText", function( numChecked ){
			return numChecked + ' options selected';
		});
		
		equal( button().text(), numOptions+' options selected', 'after changing the option to a function value, button reflects the new text');
		
		// uncheck all
		el.wselect("uncheckAll");
		equal( button().text(), el.wselect("option","noneSelectedText"), 'after unchecking all, button text now reflects noneSelectedText option value');

		el.wselect("destroy");
	});

	test("selectedList", function(){
		expect(2);
		
		var html = '<select multiple><option value="foo">foo &quot;with quotes&quot;</option><option value="bar">bar</option><option value="baz">baz</option></select>';
		
		el = $(html).wselect({
			selectedList: 3
		});
		
		el.wselect("checkAll");
		equal( button().text(), 'foo "with quotes", bar, baz', 'after checkAll, button text is a list of all options in the select');
		el.wselect("destroy");
		
		el = $(html).wselect({
			selectedList: 2
		});
		
		el.wselect("checkAll");
		equal( button().text(), '3 selected', 'after checkAll with a limited selectedList value, button value displays number of checked');
		el.wselect("destroy").remove();
	});

	function asyncSelectedList( useTrigger, message ){
		expect(1);
		stop();
		
		var html = '<select multiple><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option></select>',
			checkboxes;
		
		el = $(html).appendTo(body).wselect({
			selectedList: 2
		});
		
		checkboxes = el.wselect("widget").find(":checkbox");
		
		if( useTrigger ){
			checkboxes.eq(0).trigger('click');
			checkboxes.eq(1).trigger('click');
		} else {
			checkboxes.eq(0)[0].click();
			checkboxes.eq(1)[0].click();
		}
		
		setTimeout(function(){
			equal( button().text(), 'foo, bar', message);
			el.wselect("destroy").remove();
			start();
		}, 10);
	}
	
	test("selectedList - manual trigger - jQuery", function(){
		asyncSelectedList( true, 'manually checking items with trigger()' );
	});

	test("selectedList - manual trigger - native", function(){
		asyncSelectedList( false, 'manually checking items with element.click()' );
	});
	
	test("selectedList - encoding", function() {
		el = $('<select><option value="A&amp;E">A&amp;E</option></select>')
			.appendTo(document.body)
			.wselect({ selectedList: 1 });

		equal(button().text(), 'A&E');
		equal(button().find("span").last().html(), 'A&amp;E');
		el.wselect("destroy").remove();
	});

	test("height", function(){
		expect(2);
		
		var height = 234;
		
		el = $("select").wselect({ height: height }).wselect("open");
		equal( height, menu().find("ul.wselect-checkboxes").height(), 'height after opening propertly set to '+height );
		
		// change height and re-test
		height = 333;
		el.wselect("option", "height", height);
		equal( height, menu().find("ul.wselect-checkboxes").height(), 'changing value through api to '+height );
		
		el.wselect("destroy");
	});
	
	test("maxHeight", function(){
		expect(1);
		
		var height = 'auto';
		var maxHeight =  40;
		
		el = $("select").wselect({ height: height, maxHeight: maxHeight }).wselect("open");
		equal( maxHeight, menu().find("ul.wselect-checkboxes").height(), 'Maxheight after opening propertly set to '+maxHeight );
				
		el.wselect("destroy");
	});

	test("minWidth", function(){
		expect(3);
		
		var minWidth = 321;
		
		el = $("select").wselect({ minWidth:minWidth }).wselect("open");
		equal( minWidth, button().outerWidth(), 'outerWidth of button is '+minWidth );
		
		// change height and re-test
		minWidth = 351;
		el.wselect("option", "minWidth", minWidth);
		equal( minWidth, button().outerWidth(), 'changing value through api to '+minWidth);
		
		// change height to something that should fail.
		minWidth = 10;
		el.wselect("option", "minWidth", minWidth);
		var outerWidth = button().outerWidth();
		ok( minWidth !== outerWidth, 'changing value through api to '+minWidth+' (too small), outerWidth is actually ' + outerWidth);
		
		el.wselect("destroy");
	});

	test("checkAllText", function(){
		expect(2);
		var text = "foo";
		
		el = $("select").wselect({ checkAllText:text });
		equal( text, menu().find(".wselect-all").text(), 'check all link reads '+text );
		
		// set through option
		text = "bar";
		el.wselect("option","checkAllText","bar");
		equal( text, menu().find(".wselect-all").text(), 'check all link reads '+text );
		
		el.wselect("destroy");
	});

	test("uncheckAllText", function(){
		expect(2);
		var text = "foo";
		
		el = $("select").wselect({ uncheckAllText:text });
		equal( text, menu().find(".wselect-none").text(), 'check all link reads '+text );
		
		// set through option
		text = "bar";
		el.wselect("option","uncheckAllText","bar");
		equal( text, menu().find(".wselect-none").text(), 'changing value through api to '+text );
		
		el.wselect("destroy");
	});

	test("autoOpen", function(){
		expect(2);
		
		el = $("select").wselect({ autoOpen:false });
		
		ok( menu().is(":hidden"), 'menu is hidden with autoOpen off');
		el.wselect("destroy");
		
		el = $("select").wselect({ autoOpen:true });
		ok( menu().is(":visible"), 'menu is visible with autoOpen on');
		el.wselect("destroy");
		
		// no built in support for change on the fly; not testing it.
	});
	
	test("multiple (false - single select)", function(){
		expect(10);
		
		el = $("select").wselect({ multiple:false });
		
		// get some references
		var $menu = menu(), $header = header();
		
		ok( $header.find('a.wselect-all').is(':hidden'), 'select all link is hidden' );
		ok( $header.find('a.wselect-none').is(':hidden'), 'select none link is hidden' );
		ok( $header.find('a.wselect-close').css('display') !== 'hidden', 'close link is visible' );
		ok( !$menu.find(":checkbox").length, 'no checkboxes are present');
		ok( $menu.find(":radio").length > 0, 'but radio boxes are');
		
		// simulate click on ALL radios
		var radios = $menu.find(":radio").trigger("click");
		
		// at the end of that, only one radio should be checked and the menu closed
		equal( radios.filter(":checked").length, 1, 'After checking all radios, only one is actually checked');
		equal( false, el.wselect('isOpen'), 'Menu is closed' );
		
		// uncheck boxes... should only be one
		radios.filter(":checked").trigger("click");
		
		// method calls
		el.wselect("checkAll");
		equal( $menu.find("input:radio:checked").length, 1, 'After checkAll method call only one is actually checked');
		
		el.wselect("uncheckAll");
		equal( $menu.find("input:radio:checked").length, 0, 'After uncheckAll method nothing is checked');
		
		// check/uncheck all links
		equal( $menu.find(".wselect-all, wselect-none").filter(":visible").length, 0, "Check/uncheck all links don't exist");
		
		el.wselect("destroy");
	});

	test("multiple (changing dynamically)", function(){
		expect(6);
		
		el = $('<select multiple><option value="foo">foo</option></select>')
			.appendTo("body")
			.wselect();
		
		el.wselect("option", "multiple", false);
		equal(el[0].multiple, false, "When changing a multiple select to a single select, the select element no longer has the multiple property");
		equal(menu().hasClass("wselect-single"), true, "...and the menu now has the single select class");
		equal(menu().find('input[type="radio"]').length, 1, "...and the checkbox is now a radio button");

		el.wselect("option", "multiple", true);
		equal(el[0].multiple, true, "When changing a single select to a multiple select, the select element has the multiple property");
		equal(menu().hasClass("wselect-single"), false, "...and the menu doesn't have the single select class");
		equal(menu().find('input[type="checkbox"]').length, 1, "...and the radio button is now a checkbox");

		el.wselect("destroy").remove();
	});

	test("classes", function(){
		expect(6);
		
		var classname = 'foo';
		
		el = $("select").wselect({ classes:classname });
		var $button = button(), $widget = menu();
		
		equal( $widget.hasClass(classname), true, 'menu has the class ' + classname);
		equal( $button.hasClass(classname), true, 'button has the class ' + classname);
		
		// change it up
		var newclass = 'bar';
		el.wselect("option", "classes", newclass);
		equal( $widget.hasClass(newclass), true, 'menu has the new class ' + newclass);
		equal( $button.hasClass(newclass), true, 'button has the new class ' + newclass);
		equal( $button.hasClass(classname), false, 'menu no longer has the class ' + classname);
		equal( $button.hasClass(classname), false, 'button no longer has the class ' + classname);
		el.wselect("destroy");
	});

	test("header", function(){
		expect(7);
		
		function countLinks(){
			return header().find("a").length;
		}
		
		// default
		el = $("select").wselect({ autoOpen:true });
		ok(header().is(':visible'), "default config: header is visible" );
		el.wselect("option", "header", false);
		ok(header().is(':hidden'), "after changing header option on default config: header is no longer visible" );
		
		// test for all links within the default header
		equal(countLinks(), 2, "number of links in the default header config");
		
		el.wselect("destroy");
		
		// create again, this time header false
		el = $("select").wselect({ header:false, autoOpen:true });
		ok(header().is(':hidden'), "init with header false: header is not visible" );
		el.wselect("option", "header", true);
		ok(header().is(':visible'), "after changing header option: header is visible" );
		
		el.wselect("destroy");
		
		// create again, this time custom header
		el = $("select").wselect({ header:"hai guyz", autoOpen:true });
		equal(header().text(), "hai guyz", "header equals custom text");
		equal(countLinks(), 0, "number of links in the custom header config (should be close button)");
		
		el.wselect("destroy");
	});
	
})(jQuery);
