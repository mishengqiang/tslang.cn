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
        }
    });

    samplesClick();
    setDocTOC();
    copy();

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

    if (hljs) {
        hljs.initHighlightingOnLoad();
    }
});

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
}

function copy() {
    $("pre code").closest("pre").prepend('<button class="btn" data-clipboard-snippet="" title="复制"><img class="clippy" width="13px" src="/assets/images/clippy.svg" alt="复制到剪切板"></button>');
    var clipboardSnippets = new Clipboard('.btn[data-clipboard-snippet]', {
        target: function (trigger) {
            return trigger.nextElementSibling;
        }
    });
    clipboardSnippets.on('success', function (e) {
        e.clearSelection();
        showTooltip(e.trigger, '已复制!');
    });
    clipboardSnippets.on('error', function (e) {
        showTooltip(e.trigger, fallbackMessage(e.action));
    });

    var btns = document.querySelectorAll('.btn[data-clipboard-snippet]');
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener('mouseleave', clearTooltip);
        btns[i].addEventListener('blur', clearTooltip);
    }
    function clearTooltip(e) {
        e.currentTarget.setAttribute('class', 'btn');
        e.currentTarget.removeAttribute('aria-label');
    }
    function showTooltip(elem, msg) {
        elem.setAttribute('class', 'btn tooltipped tooltipped-s');
        elem.setAttribute('aria-label', msg);
    }
    function fallbackMessage(action) {
        var actionMsg = '';
        var actionKey = (action === 'cut' ? 'X' : 'C');
        if (/iPhone|iPad/i.test(navigator.userAgent)) {
            actionMsg = 'No support :(';
        } else if (/Mac/i.test(navigator.userAgent)) {
            actionMsg = 'Press ⌘-' + actionKey + ' to ' + action;
        } else {
            actionMsg = 'Press Ctrl-' + actionKey + ' to ' + action;
        }
        return actionMsg;
    }
}
