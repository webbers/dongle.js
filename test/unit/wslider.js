module('WSlider');
test("Basic tests", function ()
{
	var applyed = false;
	if ($('#wslider1').find('li:eq(0)').is(':visible') || $('#wslider1').find('li:eq(1)').is(':visible'))
	{
		applyed = true;
	}
	ok(applyed === true, 'Verifing if plugin is working');
});