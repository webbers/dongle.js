test("Basic Tests", function ()
{
    ok($('form').valid(), "must validate because conditional field is blank and either destiny field");

    $('#check').val('1');
    ok(!$('form').valid(), "must not validade because conditional field is filled with 1");

    $('#title').val('alguma coisa');
    ok($('form').valid(), "must validate because both fields are filled");
});
