$(document).ready(function()
{
	$('#wspinbutton-decimal').wspinbutton({decimal:',', step: 0.25, min: 10, max: 12});
});

module('WSpinButon');
test("Basic tests", function ()
{
	equal($('#wspinbutton-default').next().attr('class'), 'wspinbutton-button', 'Verifing if spin button element is correctly created');
	equal($('#wspinbutton-default').data('wspinned'), true, 'Verifying if wspinbutton is wspinned');
});

test('Decimal tests', function()
{
	var $spinDecimal = $('#wspinbutton-decimal').clone();
	$spinDecimal.offset = function()
	{
		return {top: 0};
	};

	$('#wspinbutton-decimal').next().trigger(
	{
		type: 'mousedown',
		pageY: 0
	});
	$('#wspinbutton-decimal').next().trigger('mouseup');
	equal($('#wspinbutton-decimal').val(), '10,25', 'Testing mouseup/mousedown to up value');
	
	$('#wspinbutton-decimal').next().trigger(
	{
		type: 'mousedown',
		pageY: 200000
	});
	$('#wspinbutton-decimal').next().trigger('mouseup');
	equal($('#wspinbutton-decimal').val(), '10', 'Testing mouseup/mousedown to down value');	
});