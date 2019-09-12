import '../index.js';
import Isotope from 'isotope-layout/dist/isotope.pkgd.min.js';

$(function () {

    // initialize isotope
    new Isotope('.portfolio_container', {
        filter: '*'
    });

    $('.portfolio_filter a').click(function () {
        $('.portfolio_filter .active').removeClass('active');
        $(this).addClass('active');

        var selector = $(this).attr('data-filter');
        new Isotope('.portfolio_container', {
            filter: selector,
            animationOptions: {
                duration: 500,
                animationEngine: "jquery"
            }
        });
        return false;
    });

});
