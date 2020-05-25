(function($, window, document, undefined) {
    "use strict";
    $.InitiateSideMenu = function() {
        InitiateSideMenu();
    }
})(jQuery, window, document);

/*Sets Themed Colors Based on Themes*/
var themeprimary = getThemeColorFromCss('themeprimary');
var themesecondary = getThemeColorFromCss('themesecondary');
var themethirdcolor = getThemeColorFromCss('themethirdcolor');
var themefourthcolor = getThemeColorFromCss('themefourthcolor');
var themefifthcolor = getThemeColorFromCss('themefifthcolor');

//Gets Theme Colors From Selected Skin To Use For Drawing Charts
function getThemeColorFromCss(style) {
    var $span = $("<span></span>").hide().appendTo("body");
    $span.addClass(style);
    var color = $span.css("color");
    $span.remove();
    return color;
}

/*Handles ToolTips*/
$("[data-toggle=tooltip]")
    .tooltip({
        html: true
    });

function InitiateSideMenu() {
    //Sidebar Toggler
    $(".sidebar-toggler").on('click', function() {
        $("#sidebar").toggleClass("hide");
        $(".sidebar-toggler").toggleClass("active");
        return false;
    });
    //End Sidebar Toggler

    //Sidebar Collapse
    $("#advance-search").on('click', function() {
        if ($("#searchpanel").hasClass("open"))
            $("#searchpanel").slideUp();
        else
            $("#searchpanel").slideDown();
        $("#searchpanel").toggleClass("open");
    });

    var b = $("#sidebar").hasClass("menu-compact");
    $("#sidebar-collapse").on('click', function() {
        if (!$('#sidebar').is(':visible'))
            $("#sidebar").toggleClass("hide");
        $("#sidebar, body").toggleClass("menu-compact");
        $(".favorite").toggleClass("favorite-compact");
        $(".grid-paging").toggleClass("grid-paging-compact");
        $(".sidebar-collapse").toggleClass("active");
        b = $("#sidebar, body").hasClass("menu-compact");

        if ($(".sidebar-menu").closest("div").hasClass("slimScrollDiv")) {
            $(".sidebar-menu").slimScroll({ destroy: true });
            $(".sidebar-menu").attr('style', '');
        }
        $(".page-content").toggleClass("page-content-compact");
        if (b) {
            $(".open > .submenu")
                .removeClass("open");
        } else {
            if ($('.page-sidebar').hasClass('sidebar-fixed')) {
                var position = (readCookie("rtl-support") || location.pathname == "/index-rtl-fa.html" || location.pathname == "/index-rtl-ar.html") ? 'right' : 'left';
                $('.sidebar-menu').slimscroll({
                    height: 'auto',
                    position: position,
                    size: '3px',
                    color: themeprimary
                });
            }
        }
    });
    //End Sidebar Collapse
    $("#btn-setting").click(function() {
        $('.page-setting').toggleClass('open');
        $('#btn-setting').toggleClass('open');
    });

    $(".page-body").click(function() {
        showHide();
    });
    $(".page-sidebar").click(function() {
        showHide();
    });

    function showHide() {
        $('.page-setting').removeClass('open');;
        $('#btn-setting').removeClass('open');;
    }

    $(document).on('scroll', function() {
        if ($(window).scrollTop() > 100) {
            $('.scroll-top-wrapper').addClass('show');
            $('.scroll-top-wrapper').html($($('.widget-buttons')[1]).html());
        } else {
            $('.scroll-top-wrapper').removeClass('show');
        }
    });

    //Sidebar Menu Handle
    $(".sidebar-menu").on('click', function(e) {
        var menuLink = $(e.target).closest("a");
        if (!menuLink || menuLink.length == 0)
            return;
        if (!menuLink.hasClass("menu-dropdown")) {
            if (b && menuLink.get(0).parentNode.parentNode == this) {
                var menuText = menuLink.find(".menu-text").get(0);
                if (e.target != menuText && !$.contains(menuText, e.target)) {
                    return false;
                }
            }
            return;
        }
        var submenu = menuLink.next().get(0);
        if (!$(submenu).is(":visible")) {
            var c = $(submenu.parentNode).closest("ul");
            if (b && c.hasClass("sidebar-menu"))
                return;
            c.find("> .open > .submenu")
                .each(function() {
                    //if (this != submenu && !$(this.parentNode).hasClass("active"))
                    $(this).slideUp(200).parent().removeClass("open");
                });
        }
        if (b && $(submenu.parentNode.parentNode).hasClass("sidebar-menu"))
            return false;
        $(submenu).slideToggle(200).parent().toggleClass("open");
        return false;
    });
    //End Sidebar Menu Handle
}

// Fullscreen Widget
function maximize(widgetbox) {
    if (widgetbox) {
        var windowHeight = $(window).height();
        var headerHeight = widgetbox.find(".widget-header").height();
        widgetbox.find(".widget-body").height(windowHeight - headerHeight);
    }
}

/* Scroll To */
function scrollTo(el, offeset) {
    var pos = (el && el.size() > 0) ? el.offset().top : 0;
    jQuery('html,body').animate({ scrollTop: pos + (offeset ? offeset : 0) }, 'slow');
}

/*Show Notification*/
function Notify(message, position, timeout, theme, icon, closable) {
    toastr.options.positionClass = 'toast-' + position;
    toastr.options.extendedTimeOut = 0; //1000;
    toastr.options.timeOut = timeout;
    toastr.options.closeButton = closable;
    toastr.options.iconClass = icon + ' toast-' + theme;
    toastr['custom'](message);
}

/*#region handle Settings*/
function InitiateSettings() {
    if (readCookie("navbar-fixed-top") != null) {
        if (readCookie("navbar-fixed-top") == "true") {
            $('#checkbox_fixednavbar').prop('checked', true);
            $('.navbar').addClass('navbar-fixed-top');
        }
    }

    if (readCookie("sidebar-fixed") != null) {
        if (readCookie("sidebar-fixed") == "true") {
            $('#checkbox_fixedsidebar').prop('checked', true);
            $('.page-sidebar').addClass('sidebar-fixed');

            //Slim Scrolling for Sidebar Menu in fix state
            if (!$(".page-sidebar").hasClass("menu-compact")) {
                var position = (readCookie("rtl-support") || location.pathname == "/index-rtl-fa.html" || location.pathname == "/index-rtl-ar.html") ? 'right' : 'left';
                $('.sidebar-menu').slimscroll({
                    height: $(window).height() - 90,
                    position: position,
                    size: '3px',
                    color: themeprimary
                });
            }
        }

    }
    if (readCookie("breadcrumbs-fixed") != null) {
        if (readCookie("breadcrumbs-fixed") == "true") {
            $('#checkbox_fixedbreadcrumbs').prop('checked', true);
            $('.page-breadcrumbs').addClass('breadcrumbs-fixed');
        }
    }
    if (readCookie("page-header-fixed") != null) {
        if (readCookie("page-header-fixed") == "true") {
            $('#checkbox_fixedheader').prop('checked', true);
            $('.page-header').addClass('page-header-fixed');
        }
    }


    $('#checkbox_fixednavbar')
        .change(function() {
            $('.navbar')
                .toggleClass('navbar-fixed-top');

            if (($('#checkbox_fixedsidebar')
                    .is(":checked"))) {
                $('#checkbox_fixedsidebar')
                    .prop('checked', false);
                $('.page-sidebar')
                    .toggleClass('sidebar-fixed');
            }

            if (($('#checkbox_fixedbreadcrumbs')
                    .is(":checked")) && !($(this)
                    .is(":checked"))) {
                $('#checkbox_fixedbreadcrumbs')
                    .prop('checked', false);
                $('.page-breadcrumbs')
                    .toggleClass('breadcrumbs-fixed');
            }

            if (($('#checkbox_fixedheader')
                    .is(":checked")) && !($(this)
                    .is(":checked"))) {
                $('#checkbox_fixedheader')
                    .prop('checked', false);
                $('.page-header')
                    .toggleClass('page-header-fixed');
            }
            setCookiesForFixedSettings();
        });

    $('#checkbox_fixedsidebar')
        .change(function() {

            $('.page-sidebar')
                .toggleClass('sidebar-fixed');

            if (!($('#checkbox_fixednavbar')
                    .is(":checked"))) {
                $('#checkbox_fixednavbar')
                    .prop('checked', true);
                $('.navbar')
                    .toggleClass('navbar-fixed-top');
            }
            if (($('#checkbox_fixedbreadcrumbs')
                    .is(":checked")) && !($(this)
                    .is(":checked"))) {
                $('#checkbox_fixedbreadcrumbs')
                    .prop('checked', false);
                $('.page-breadcrumbs')
                    .toggleClass('breadcrumbs-fixed');
            }

            if (($('#checkbox_fixedheader')
                    .is(":checked")) && !($(this)
                    .is(":checked"))) {
                $('#checkbox_fixedheader')
                    .prop('checked', false);
                $('.page-header')
                    .toggleClass('page-header-fixed');
            }
            setCookiesForFixedSettings();

        });
    $('#checkbox_fixedbreadcrumbs')
        .change(function() {

            $('.page-breadcrumbs')
                .toggleClass('breadcrumbs-fixed');


            if (!($('#checkbox_fixedsidebar')
                    .is(":checked"))) {
                $('#checkbox_fixedsidebar')
                    .prop('checked', true);
                $('.page-sidebar')
                    .toggleClass('sidebar-fixed');
            }
            if (!($('#checkbox_fixednavbar')
                    .is(":checked"))) {
                $('#checkbox_fixednavbar')
                    .prop('checked', true);
                $('.navbar')
                    .toggleClass('navbar-fixed-top');
            }
            if (($('#checkbox_fixedheader')
                    .is(":checked")) && !($(this)
                    .is(":checked"))) {
                $('#checkbox_fixedheader')
                    .prop('checked', false);
                $('.page-header')
                    .toggleClass('page-header-fixed');
            }
            setCookiesForFixedSettings();

        });

    $('#checkbox_fixedheader')
        .change(function() {

            $('.page-header')
                .toggleClass('page-header-fixed');


            if (!($('#checkbox_fixedbreadcrumbs')
                    .is(":checked"))) {
                $('#checkbox_fixedbreadcrumbs')
                    .prop('checked', true);
                $('.page-breadcrumbs')
                    .toggleClass('breadcrumbs-fixed');
            }

            if (!($('#checkbox_fixedsidebar')
                    .is(":checked"))) {
                $('#checkbox_fixedsidebar')
                    .prop('checked', true);
                $('.page-sidebar')
                    .toggleClass('sidebar-fixed');
            }
            if (!($('#checkbox_fixednavbar')
                    .is(":checked"))) {
                $('#checkbox_fixednavbar')
                    .prop('checked', true);
                $('.navbar')
                    .toggleClass('navbar-fixed-top');
            }

            setCookiesForFixedSettings();
        });
}


/*#region Get Colors*/
//Get colors from a string base on theme colors
function getcolor(colorString) {
    switch (colorString) {
        case ("themeprimary"):
            return themeprimary;
        case ("themesecondary"):
            return themesecondary;
        case ("themethirdcolor"):
            return themethirdcolor;
        case ("themefourthcolor"):
            return themefourthcolor;
        case ("themefifthcolor"):
            return themefifthcolor;
        default:
            return colorString;
    }
}
/*#endregion Get Colors*/


//Switch Classes Function
function switchClasses(firstClass, secondClass) {

    var firstclasses = document.getElementsByClassName(firstClass);

    for (i = firstclasses.length - 1; i >= 0; i--) {
        if (!hasClass(firstclasses[i], 'dropdown-menu')) {
            addClass(firstclasses[i], firstClass + '-temp');
            removeClass(firstclasses[i], firstClass);
        }
    }

    var secondclasses = document.getElementsByClassName(secondClass);

    for (i = secondclasses.length - 1; i >= 0; i--) {
        if (!hasClass(secondclasses[i], 'dropdown-menu')) {
            addClass(secondclasses[i], firstClass);
            removeClass(secondclasses[i], secondClass);
        }
    }

    tempClasses = document.getElementsByClassName(firstClass + '-temp');

    for (i = tempClasses.length - 1; i >= 0; i--) {
        if (!hasClass(tempClasses[i], 'dropdown-menu')) {
            addClass(tempClasses[i], secondClass);
            removeClass(tempClasses[i], firstClass + '-temp');
        }
    }
}


//Add Classes Function
function addClass(elem, cls) {
    var oldCls = elem.className;
    if (oldCls) {
        oldCls += " ";
    }
    elem.className = oldCls + cls;
}

//Remove Classes Function
function removeClass(elem, cls) {
    var str = " " + elem.className + " ";
    elem.className = str.replace(" " + cls, "").replace(/^\s+/g, "").replace(/\s+$/g, "");
}

//Has Classes Function
function hasClass(elem, cls) {
    var str = " " + elem.className + " ";
    var testCls = " " + cls + " ";
    return (str.indexOf(testCls) != -1);
}