module('WInputfile');
test("Basic tests", function ()
{
	equal($('#winputfile').next().attr('class'), 'winputfilediv', 'Verifing if element was created');
});