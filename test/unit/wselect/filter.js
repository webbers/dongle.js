(function($){
  var el, widget, button, input;

  function getVisible() {
    return widget.find(".wselect-checkboxes input:visible");
  }

  function getChecked() {
    return el.wselect("getChecked");
  }

  function getSelected() {
    return el.children(":selected");
  }

  function searchFor(term) {
    input.val(term).trigger("keyup");
  }

  function triggerClick() {
    this.click();
  }

  function searchTest( term, expected, message ) {
    message || (message = "searching for '#'");
    message = message.replace("#", term);
    searchFor(term);
    equal( getVisible().length, expected, message );
  }

  module("filter widget - multiple select", {
    setup: function() {
      el = $('<select multiple>' +
        '<option></option>' + 
        '<option value="foo">testffoooo</option>' + 
        '<option value="bar">testbbaarr</option>' + 
        '<option value=" baz ">testbbaazz</option>' + 
        '<option value="qux">testquxtest</option>' + 
        '<option value="10">ten</option>' + 
        '<option value="100">one hundred</option>' + 
        '<option value="5">five</option>' + 
        '<option>a test with word boundaries</option>' + 
        '<option>special regex !^$()//-|{}/: characters</option>' + 
        '</option>');

      el.appendTo(document.body);
      el.wselect();
      el.wselectfilter();
      el.wselect("open");

      widget = el.wselect("widget");
      input = widget.find(".wselect-filter input");
      button = el.next();
    },

    teardown: function() {
      el.wselectfilter("destroy");
      el.wselect("destroy");
      el.remove();
    }
  });

  test("defaults", function(){
    expect(1);
    ok( input.is(":visible"), "Filter input box is visible" );
  });

  test("filtering by node text", function(){
    searchTest( "bbaa", 2);
    searchTest( "bbaarr", 1);
    searchTest( "  bbaa  ", 2, "searching for '#' with whitespace");
    searchTest( " ", el.children().length, "searching for an empty string");
    searchTest( "test", 5);
    searchTest( "one hundred", 1);
    searchTest( "with wor", 1);
    searchTest( " with wor  ", 1);

    $.each("$ ^ / : // { } | -".split(" "), function( i, char ){
      searchTest( char, 1 );
    });
  });

  test("filtering & checking", function(){
    searchFor("ba");

    getVisible().each(triggerClick);
    equal(getChecked().length, 2, "Two checkboxes are selected");
    equal(getSelected().length, 2, "Two option tags are selected");

    getVisible().each(triggerClick);
    equal(getChecked().length, 0, "After clicking again, no checkboxes are selected");
    equal(getSelected().length, 0, "After clicking again, no tags are selected");
  });

  test("checkAll / uncheckAll", function(){
    searchFor("ba");

    el.wselect("checkAll");
    equal(getChecked().length, 2, "checkAll: two checkboxes are selected");
    equal(getSelected().length, 2, "checkAll: two option tags are selected");

    el.wselect("uncheckAll");
    equal(getChecked().length, 0, "uncheckAll: no checkboxes are selected");
    equal(getSelected().length, 0, "uncheckAll: no option tags are selected");
  });

  test("combination of filtering/methods/click events", function(){
    searchFor("ba");

    getVisible().first().each(triggerClick);
    equal(getChecked().length, 1, "selecting 1 of multiple results (checked)");
    equal(getSelected().length, 1, "selecting 1 of multiple results (selected)");

    searchFor(" ");
    equal(getChecked().length, 1, "clearing search, only 1 is still selected");
    el.wselect("uncheckAll");
    equal(getChecked().length, 0, "uncheckAll, nothing is selected (checked)");
    equal(getSelected().length, 0, "uncheckedAll, nothing is selected (selected)");

    searchFor("one hundred")
    el.wselect("checkAll");
    equal(getChecked().length, 1, "checkAll on one matching result (checked)");
    equal(getSelected().length, 1, "checkAll on one matching result (selected)");

    searchFor("foo");
    el.wselect("checkAll");
    equal(getChecked().length, 2, "checkAll on one matching result (checked)");
    equal(getSelected().length, 2, "checkAll on one matching result (selected)");
  });
})(jQuery);
