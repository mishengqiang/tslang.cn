$(function () {
    var key = window.location.href.match(/\/\w+\//);
    $(".navbar-nav").find('a[href*="' + key + '"]').parent('li').addClass('active').siblings(".active").removeClass('active');

    $("#carousel-example-generic").carousel({
        interval: 7e3,
        pause: "hover"
    });
    $(".toc-item").click(function () {
        var t = $(this).parent().attr("id");
        localStorage.setItem("activeTOCSection", t)
    });
    $(".panel").click(function () {
        var $this = $(this);
        if ($this.index() == 0) {
            localStorage.setItem("activeTOCSection", 0)
        } else {
            setTimeout(function () {
                setFooterPosition();
            }, 300);
        }
    });
    $(window).resize(function () {
        setFooterPosition();
    });
    // (window.location.pathname.indexOf("/community/index") > -1 || window.location.pathname.indexOf("/docs/") > -1) && 
    setFooterPosition();
    samplesClick();
    setDocTOC();
    if (hljs) {
        hljs.initHighlightingOnLoad();
    }

    $(document).ready(function () {
        $(".video-btn").each(function () {
            $(this).magnificPopup({
                items: {
                    src: '<video class="video-content" src="' + this.href + '" controls="controls" autoplay="autoplay">' + '</video>',
                    type: 'inline'
                },
                disableOn: 700,
                mainClass: 'mfp-fade',
                showCloseBtn: true,
                callbacks: {
                    open: function () {
                        $(this.content[0]).on('play', function () {
                            reportAction('video', 'play');
                        });

                        $(this.content[0]).on('pause', function () {
                            reportAction('video', 'pause');
                        });

                        $(this.content[0]).on('ended', function () {
                            reportAction('video', 'ended');
                        });
                    }
                }
            });
        });

    });
})


function setFooterPosition() {
    var t = $(window).height() - ($("footer").height() + $("header").height() + $(".update-banner").height());
    console.log(window.location.pathname),
        window.location.pathname.indexOf("/samples/index") > -1 ? $(".examples").height() <= t ? $("footer").css("position", "absolute").css("bottom", 0).css("width", "100%") : $("footer").css("position", "relative").css("z-index", 100) : window.location.pathname.indexOf("/community/index") > -1 ? $(".community").height() <= t ? $("footer").css("position", "absolute").css("bottom", 0).css("width", "100%") : $("footer").css("position", "relative").css("z-index", 100) : window.location.pathname.indexOf("/docs/") > -1 ? (console.log("in docs!"),
            $(".docs-container").height() <= t ? ($("footer").css("position", "absolute").css("bottom", 0).css("width", "100%"),
                console.log("docs: " + $(".examples").height() + " ---  window:" + $(window).height())) : $("footer").css("position", "relative").css("z-index", 100)) : $(document).height() < t ? $("footer").css("position", "absolute").css("bottom", 0).css("width", "100%") : $("footer").css("position", "relative").css("z-index", 100);
    window.location.pathname.indexOf("/version.html") > -1 ? $("#version").height() <= t ? $("footer").css("position", "absolute").css("bottom", 0).css("width", "100%") : $("footer").css("position", "relative").css("z-index", 100):null;
}

// 案例效果
function samplesClick() {
    $(".exampleInfo").click(function (event) {
        var $btn = $(event.currentTarget);
        var $item = $btn.closest('.exampleBox');
        $item.toggleClass('hover');
    });
}

function storageSupported() {
    try {
        return "localStorage" in window && null !== window.localStorage
    } catch (t) {
        return !1
    }
}
function setDocTOC() {
    var t = localStorage.getItem("activeTOCSection");
    (storageSupported() || t) && $("#" + t).collapse("toggle"),
        0 == t && $(".panel:first-child").toggleClass("selected");
    $("a[href='" + window.location.pathname + "']").addClass("active");
    setTimeout(function () {
        (window.location.pathname.indexOf("/community/index") > -1 || window.location.pathname.indexOf("/docs/") > -1) && setFooterPosition();
    }, 300);
}
