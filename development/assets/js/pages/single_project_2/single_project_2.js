import '../index.js';
import '../../plugins/jquery.social-buttons.min';

$(function () {

// initialize flexslider
    $('.project_images').flexslider({
        directionNav: false,
        controlNav: false
    });
    // initialize social buttons
    $("[data-social]").socialButtons();

});
