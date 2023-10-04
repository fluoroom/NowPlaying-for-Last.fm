$(document).ready(function() {
    var idleMouseTimer;
    var forceMouseHide = false;
    var canHide = true;

    $("body").css('cursor', 'none');

    $("body").mousemove(function(ev) {
        if(!forceMouseHide) {
            $("body").css('cursor', '');
            $(".settings-div").removeClass('hidden');
            clearTimeout(idleMouseTimer);

            idleMouseTimer = setTimeout(function() {
                $("body").css('cursor', 'none');
                $(".settings-div").addClass('hidden');
                forceMouseHide = true;
                setTimeout(function() {
                    forceMouseHide = false;
                }, 500);
            }, 2000);
        }
    });
});
