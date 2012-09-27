(function($){

	module("events");

	test("wselectopen", function(){
		expect(27);
	 
	 	// inject widget
		el = $("<select multiple><option value='foo'>foo</option></select>").appendTo(body);
		el.wselect({
			open: function(e,ui){
				ok( true, 'option: wselect("open") fires open callback' );
				equal(this, el[0], "option: context of callback");
				equal(e.type, 'wselectopen', 'option: event type in callback');
				equal(menu().css("display"), 'block', 'menu display css property equals block'); 
				deepEqual(ui, {}, 'option: ui hash in callback');
			}
		})
		.bind("wselectopen", function(e,ui){
			ok(true, 'event: wselect("open") fires wselectopen event');
			equal(this, el[0], 'event: context of event');
			deepEqual(ui, {}, 'event: ui hash');
		});
		
		// now try to open it..
		el.wselect("open")
		
		// make sure the width of the menu and button are equivalent
		equal( button().outerWidth(), menu().outerWidth(), 'button and menu widths are equivalent');
		
		// close
		el.wselect("close");
		
		// make sure a click event on the button opens the menu as well.
		button().trigger("click");
		el.wselect("close");
		
		// make sure a click event on a span inside the button opens the menu as well.
		button().find("span:first").trigger("click");
		
		// reset for next test
		el.wselect("destroy").remove();
		
		// now try returning false prevent opening
		el = $("<select></select>")
			.appendTo(body)
			.wselect()
			.bind("wselectbeforeopen", function(){
				ok( true, "event: binding wselectbeforeopen to return false (prevent from opening)" );
				return false;
			})
			.wselect("open");
		
		ok( !el.wselect("isOpen"), "wselect is not open after wselect('open')" );
		el.wselect("destroy").remove();
	});

	test("wselectclose", function(){
		expect(25);
	 
	 	// inject widget
		el = $("<select multiple><option>foo</option></select>").appendTo(body);
		el.wselect({
			close: function(e,ui){
				ok( true, 'option: wselect("close") fires close callback' );
				equal(this, el[0], "option: context of callback");
				equal(e.type, 'wselectclose', 'option: event type in callback');
				equal(menu().css("display"), 'none', 'menu display css property equals none'); 
				deepEqual(ui, {}, 'option: ui hash');
			}
		})
		.bind("wselectclose", function(e,ui){
			ok(true, 'wselect("close") fires wselectclose event');
			equal(this, el[0], 'event: context of event');
			deepEqual(ui, {}, 'event: ui hash');
		})
		.wselect("open")
		.wselect("close")
		.wselect("open");
		
		// make sure a click event on the button closes the menu as well.
		button().click();
		el.wselect("open");
		
		// make sure a click event on a span inside the button closes the menu as well.
		button().find("span:first").click();

		// make sure that the menu is actually closed.  see issue #68
		ok( el.wselect('isOpen') === false, 'menu is indeed closed' );

		el.wselect("destroy").remove();
	});
	
	test("wselectbeforeclose", function(){
		expect(8);
	 
	 	// inject widget
		el = $("<select multiple></select>").appendTo(body);
		el.wselect({
			beforeclose: function(e,ui){
				ok( true, 'option: wselect("beforeclose") fires close callback' );
				equal(this, el[0], "option: context of callback");
				equal(e.type, 'wselectbeforeclose', 'option: event type in callback');
				deepEqual(ui, {}, 'option: ui hash');
			}
		})
		.bind("wselectbeforeclose", function(e,ui){
			ok(true, 'wselect("beforeclose") fires wselectclose event');
			equal(this, el[0], 'event: context of event');
			deepEqual(ui, {}, 'event: ui hash');
		})
		.wselect("open")
		.wselect("close");
		
		el.wselect("destroy").remove();
		
		// test 'return false' functionality
		el = $("<select multiple></select>").appendTo(body);
		el.wselect({
			beforeclose: function(){
				return false;
			}
		});
		
		el.wselect('open').wselect('close');
		ok( menu().is(':visible') && el.wselect("isOpen"), "returning false inside callback prevents menu from closing" );
		el.wselect("destroy").remove();
	});
	
	test("wselectclick", function(){
		expect(28);
	 
	 	var times = 0;

	 	// inject widget
		el = $("<select multiple><option value='1'>Option 1</option><option value='2'>Option 2</option></select>")
			.appendTo(body);
		
		el.wselect({
			click: function(e,ui){
				ok(true, 'option: triggering the click event on the second checkbox fires the click callback' );
				equal(this, el[0], "option: context of callback");
				equal(e.type, 'wselectclick', 'option: event type in callback');
				equal(ui.value, "2", "option: ui.value equals");
				equal(ui.text, "Option 2", "option: ui.title equals");

				if(times === 0) {
          equal(ui.checked, true, "option: ui.checked equals");
				} else if(times === 1) {
          equal(ui.checked, false, "option: ui.checked equals");
				}
			}
		})
		.bind("wselectclick", function(e,ui){
			ok(true, 'event: triggering the click event on the second checkbox triggers wselectclick');
			equal(this, el[0], 'event: context of event');
			equal(ui.value, "2", "event: ui.value equals");
			equal(ui.text, "Option 2", "event: ui.title equals");

      if(times === 0) {
        equal(ui.checked, true, "option: ui.checked equals");
      } else if(times === 1) {
        equal(ui.checked, false, "option: ui.checked equals");
      }
		})
		.bind("change", function(e){
			if(++times === 1){
				equal(el.val().join(), "2", "event: select element val() within the change event is correct" );
			} else {
				equal(el.val(), null, "event: select element val() within the change event is correct" );
			}

			ok(true, "event: the select's change event fires");
		})
		.wselect("open");
		
		// trigger a click event on the input
		var lastInput = menu().find("input").last();
		lastInput[0].click();

		// trigger once more.
		lastInput[0].click();
        
        // make sure it has focus
        ok(lastInput.get(0) == document.activeElement, "The input has focus");

		// make sure menu isn't closed automatically
		equal( true, el.wselect('isOpen'), 'menu stays open' );

		el.wselect("destroy").remove();
	});

	test("wselectcheckall", function(){
		expect(10);
	 
	 	// inject widget
		el = $('<select multiple><option value="1">Option 1</option><option value="2">Option 2</option></select>').appendTo(body);

		el.wselect({
			checkAll: function(e,ui){
				ok( true, 'option: wselect("checkAll") fires checkall callback' );
				equal(this, el[0], "option: context of callback");
				equal(e.type, 'wselectcheckall', 'option: event type in callback');
				deepEqual(ui, {}, 'option: ui hash in callback');
			}
		})
		.bind("wselectcheckall", function(e,ui){
			ok( true, 'event: wselect("checkall") fires wselectcheckall event' );
			equal(this, el[0], 'event: context of event');
			deepEqual(ui, {}, 'event: ui hash');
		})
		.bind("change", function(){
			ok(true, "event: the select's change event fires");
			equal( el.val().join(), "1,2", "event: select element val() within the change event is correct" );
		})
		.wselect("open")
		.wselect("checkAll");

		equal(menu().find("input").get(0) == document.activeElement, true, "The first input has focus");
		
		el.wselect("destroy").remove();
	});
	
	test("wselectuncheckall", function(){
		expect(10);
	 
	 	// inject widget
		el = $('<select multiple><option value="1">Option 1</option><option value="2">Option 2</option></select>').appendTo(body);

		el.wselect({
			uncheckAll: function(e,ui){
				ok( true, 'option: wselect("uncheckAll") fires uncheckall callback' );
				equal(this, el[0], "option: context of callback");
				equal(e.type, 'wselectuncheckall', 'option: event type in callback');
				deepEqual(ui, {}, 'option: ui hash in callback');
			}
		})
		.bind("wselectuncheckall", function(e,ui){
			ok( true, 'event: wselect("uncheckall") fires wselectuncheckall event' );
			equal(this, el[0], 'event: context of event');
			deepEqual(ui, {}, 'event: ui hash');
		})
		.bind("change", function(){
			ok(true, "event: the select's change event fires");
			equal( el.val(), null, "event: select element val() within the change event is correct" );
		})
		.wselect("open")
		.wselect("uncheckAll");
		
		equal(menu().find("input").get(0) == document.activeElement, true, "The first input has focus");

		el.wselect("destroy").remove();
	});
	
	
	test("wselectbeforeoptgrouptoggle", function(){
		expect(10);

		// inject widget
		el = $('<select multiple><optgroup label="Set One"><option value="1">Option 1</option><option value="2">Option 2</option></optgroup></select>')
          .appendTo(body);

		el.bind("change", function(){
			ok(true, "the select's change event fires");
		})
		.wselect({
			beforeoptgrouptoggle: function(e,ui){
				equal(this, el[0], "option: context of callback");
				equal(e.type, 'wselectbeforeoptgrouptoggle', 'option: event type in callback');
				equal(ui.label, "Set One", 'option: ui.label equals');
				equal(ui.inputs.length, 2, 'option: number of inputs in the ui.inputs key');
			}
		})
		.bind("wselectbeforeoptgrouptoggle", function(e,ui){
			ok( true, 'option: wselect("uncheckall") fires wselectuncheckall event' );
			equal(this, el[0], 'event: context of event');
			equal(ui.label, "Set One", 'event: ui.label equals');
			equal(ui.inputs.length, 2, 'event: number of inputs in the ui.inputs key');
		})
		.wselect("open");
		
		menu().find("li.wselect-optgroup-label a").click();
		
		el.wselect("destroy").remove();
		el = el.clone();
		
		// test return false preventing checkboxes from activating
		el.bind("change", function(){
			ok( true ); // should not fire
		}).wselect({
			beforeoptgrouptoggle: function(){
				return false;
			},
			// if this fires the expected count will be off.  just a redundant way of checking that return false worked
            optgrouptoggle: function(){
                ok( true );
            }
		}).appendTo( body );

        var label = menu().find("li.wselect-optgroup-label a").click();
        equal( menu().find(":input:checked").length, 0, "when returning false inside the optgrouptoggle handler, no checkboxes are checked" );
        el.wselect("destroy").remove();
	});

	test("wselectoptgrouptoggle", function(){
		expect(12);
		
		// inject widget
		el = $('<select multiple><optgroup label="Set One"><option value="1">Option 1</option><option value="2">Option 2</option></optgroup></select>').appendTo(body);

		el.wselect({
			optgrouptoggle: function(e,ui){
				equal(this, el[0], "option: context of callback");
				equal(e.type, 'wselectoptgrouptoggle', 'option: event type in callback');
				equal(ui.label, "Set One", 'option: ui.label equals');
				equal(ui.inputs.length, 2, 'option: number of inputs in the ui.inputs key');
				equal(ui.checked, true, 'option: ui.checked equals true');
			}
		})
		.bind("wselectoptgrouptoggle", function(e,ui){
			ok( true, 'option: wselect("uncheckall") fires wselectuncheckall event' );
			equal(this, el[0], 'event: context of event');
			equal(ui.label, "Set One", 'event: ui.label equals');
			equal(ui.inputs.length, 2, 'event: number of inputs in the ui.inputs key');
			equal(ui.checked, true, 'event: ui.checked equals true');
		})
		.wselect("open");
		
		// trigger native click event on optgroup
		menu().find("li.wselect-optgroup-label a").click();
		equal(menu().find(":input:checked").length, 2, "both checkboxes are actually checked" );

		equal(menu().find("input").get(0) == document.activeElement, true, "The first input has focus");
		
		el.wselect("destroy").remove();
	});

})(jQuery);
