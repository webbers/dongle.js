$(document).ready(function ()
{
    $('#simplegrid').wsimplegrid({columnClass: "filtrar"});
});

module('SimpleGrid');
test("Filtering tests", function ()
{
	$('#simplegrid').find('.wsimplegrid-filter-icon:eq(0)').trigger('click');
	$('input[name=filter]').val("Abacate");
	$('div[name=filter-button]').click();
	
	var filterCount = $('#simplegrid').find('tbody tr:visible').length;
	equal(filterCount,1, 'Verifying if filtering is working');	
	
	$('#simplegrid').find('.wsimplegrid-filter-icon-active:eq(0)').trigger('click');
	$('div[name=remove-filter-button]').click();
	filterCount = $('#simplegrid').find('tbody tr:visible').length;
	equal(filterCount,2, 'Verifying if remove filtering is working');	
});