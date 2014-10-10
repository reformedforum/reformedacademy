$(document).ready(function() {
    $("#logo").click(function() {
        $('.menu').toggleClass('open');
    });
    {% for message in messages %}
    toastr.{{ message.tags }}('{{ message }}')
    {% endfor %}
});
