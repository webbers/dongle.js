module('WInputfile');
test("Basic tests", function ()
{
	equal($('#winputfile').next().attr('class'), 'winputfilediv', 'Verifing if element was created');
});

test("Hover tests", function ()
{
	$('.winputfilediv').trigger('hover');	
	ok($('.winputfile-panel-hover').length > 0, 'Creating hover effect');
	
});