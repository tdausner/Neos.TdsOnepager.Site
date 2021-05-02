;(function ($, win) {
    'use strict';

    let site = win.location.origin + win.location.pathname;
    let headerFixed = document.getElementsByClassName('header--fixed')[0];
    let headerHeight = 0;

    $(document).ready(function () {
        /**
         * scroll handler
         * @param $target
         */
        const scroller = function ($target) {
            let newTop = $target[0].offsetTop - headerHeight;
            $('html,body').animate({scrollTop: newTop}, 700, 'linear');
            /* use jQuery animate() due to no 'behaviour' option in Safari
                    window.scrollTo( {
                        top: newTop,
                        left: 0,
                        behavior: 'smooth'
                    } );
            */
        };

        $('.noscript')
            .removeClass('noscript');
        headerHeight = headerFixed.getBoundingClientRect().height;
        let id = win.location.search.split('id=')[1];
        if (id && id.length > 0)
        {
            $('section[id], h1[id]').each(function () {
                let myId = $(this).attr('id');
                if (myId === id)
                {
                    if (navigator.userAgent.match(/(facebookexternalhit|Bot|Agent)/i) !== null)
                    {
                        window.scrollTo(0, this.offsetTop);
                        return false;
                    }
                    scroller($('[id=' + id + ']'));
                    return false;
                }
            });
        }

        /**
         * menu click & menu scroll handler
         * @param $target
         */
        $('.jump').click(function (e) {
            e.preventDefault();
            let id = $(this).attr('href').substr(1);
            id = id.length > 0 ? id : 'top';
            let $element = $('[id=' + id + ']');
            if ($element.length)
            {
                let parents = 'header, section, footer';
                if (parents.indexOf($element.prop("tagName").toLowerCase()) === -1)
                {
                    $element = $element.parents('header, section, footer')
                }
                scroller($element);
            }
            else
            {
                $(this).css('background-color', 'red');
            }
        });

        /**
         * sounds in TdsOnepager.Site:Content.Citation
         */
        $('.citation__icon i').click(function () {
            if (this.childNodes.length)
            {
                this.childNodes[0].play();
            }
        });

        /**
         * windows resize / scroll handler
         */
        let headerHeightMax = 0;
        let headerHeightMin = 1000;
        $(win).on("resize scroll", function () {
            /*
             * header shrinking
             */
            headerHeight = headerFixed.getBoundingClientRect().height;
            headerHeightMax = headerHeight > headerHeightMax ? headerHeight : headerHeightMax;
            headerHeightMin = headerHeight < headerHeightMin ? headerHeight : headerHeightMin;

            let st = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
            if (st > headerHeightMax * 3 / 4)
            {
                $('header').addClass('header--shrink');
            }
            else if (st < headerHeightMin)
            {
                $('header').removeClass('header--shrink');
            }
            setArrow();
        });
        /**
         * animation
         */
        let observer = new IntersectionObserver(function (entries) {
            for (let e of entries)
            {
                let animClass = 'animate__' + e.target.dataset.animation;
                if (e.intersectionRatio > 0)
                {
                    e.target.classList.add('animate__animated');
                    e.target.classList.add(animClass);
                    e.target.animTime = e.time;
                }
                else
                {
                    if (!e.target.animTime || e.time > (e.target.animTime + 500.0))
                    {
                        e.target.classList.remove('animate__animated');
                        e.target.classList.remove(animClass);
                        e.target.animTime = 0;
                    }
                }
            }
        });
        for (let elem of document.querySelectorAll('.animate'))
        {
            observer.observe(elem);
        }
        /**
         * Prev / next button click handler
         */
        $('.__button.--prev, .__button.--next').click(function () {
            // get all headline's position sorted ASC
            let headlines = [];
            $('.headline h1').parents('section').each(function (idx) {
                let y = this.getBoundingClientRect().top;
                headlines[idx] = {
                    el: this,
                    id: $('h1', this).attr('id'),
                    y: y
                };
            });
            headlines.sort(function (a, b) {
                return a.y - b.y;
            });
            // calc jump section
            const $button = $(this);
            if ($button.hasClass('--prev'))
            {
                for (let i = headlines.length; --i >= 0;)
                {
                    if (headlines[i].y < 0)
                    {
                        scroller([headlines[i].el]);
                        break;
                    }
                }
            }
            else
            {
                for (let i in headlines)
                {
                    if (headlines.hasOwnProperty(i) && headlines[i].y > headerHeight + win.innerHeight / 2)
                    {
                        scroller([headlines[i].el]);
                        break;
                    }
                }
            }

        });

        /**
         * social links common
         */
        String.prototype.substitutePlaceholders = function ($button, buttonUrl, link = '') {
            return this.replace(/%service%/ig, $button.attr('title'))
                .replace(/%link%/ig, link)
                .replace(/href="#service"/ig, 'href="' + buttonUrl + '" target="_blank"')
                .replace(/&nbsp;/, ' ');
        };

        const getSectionId = function ($button) {
            let yPos = $button.offset().top;
            let sectionId = '';
            $('section[id]').each(function () {
                let $section = $(this);
                let myId = $section.attr('id');
                let idPos = this.offsetTop;
                if (idPos > yPos)
                {
                    return false;
                }
                sectionId = myId;
            });
            return sectionId !== '' ? ('?id=' + sectionId) : '';
        };

        const setArrow = function () {
            const $arrow = $(' .share-bubble.' + active + ' .share-bubble__arrow span');
            if ($arrow.length > 0)
            {
                const $bp = $arrow.parents('.--share-funcs, .--visit-funcs');
                $bp.find('.__button.' + active).each(function () {
                    let $btn = $(this);
                    let $p = $btn.parent();
                    let right = $p.width() - ($btn.offset().left - $p.offset().left);
                    let rightCss = $bp.hasClass('--share-funcs')
                        ? 'calc(' + right + 'px - 2.7em)'
                        : (right - 61) + 'px'
                    ;
                    $arrow.css({'right': rightCss});
                });
            }
        };

        const clearArrow = function () {
            const $arrow = $(' .share-bubble .share-bubble__arrow span');
            $arrow.css('right', '');
        };

        const active = '--active';
        const noWrapper = $('.wrapper').length <= 0;

        /**
         * CTA Social Links button click handler
         */
        const $ctaBubble = $('.cta-icons .share-bubble');
        const ctaShareText = $('.--share', $ctaBubble).html();
        const ctaInstructionText = $('.--instruction', $ctaBubble).html();
        if (noWrapper)
        {
            $('.--instruction', $ctaBubble).remove();
        }
        else
        {
            $('footer .--visit-funcs a, .cta-icons .--regular-icons a').click(function (e) {
                e.preventDefault();
            });
        }
        const $ctaActiveBubble = $('.cta-icons .share-bubble__inner.--share');

        $('.cta-icons .--social').click(function () {
            const $button = $(this);
            const $allButtons = $button.parent().find('.--social');
            let buttonUrl = $button.data('url');
            if (typeof buttonUrl !== 'undefined')
            {
                buttonUrl = buttonUrl.trim();
                let isInstruction = buttonUrl.indexOf('+') === 0;
                if (isInstruction)
                {
                    buttonUrl = buttonUrl.slice(1);
                }
                let sectionId = getSectionId($button);
                if ($button.hasClass(active))
                {
                    if (!isInstruction && noWrapper && $(':visible', $ctaBubble).length > 0)
                    {
                        let targetUrl = encodeURIComponent(site + sectionId);
                        window.open(buttonUrl + targetUrl, '_blank');
                    }
                    $allButtons.removeClass(active);
                    $ctaBubble.removeClass(active);
                    clearArrow();
                }
                else
                {
                    // activate clicked button
                    $allButtons.removeClass(active);
                    $button.addClass(active);
                    $ctaBubble.addClass(active);
                    setArrow();
                    if ($('.neos-backend').length === 0)
                    {
                        let link = '<span class="d-flex">'
                            + '<i class="fa fa-copy d-flex align-items-center" style="width: 2em;">'
                            + '</i><span>' + site + sectionId + '</span>'
                            + '</span>';
                        $ctaActiveBubble.html((isInstruction ? ctaInstructionText : ctaShareText).substitutePlaceholders($button, buttonUrl, link));
                    }
                    // copy click handler
                    $('i.fa-copy', $ctaActiveBubble).click(function () {
                        let $link = $(this).siblings('span');
                        let $temp = $('<input>');
                        $(' body').append($temp);
                        $temp.val($link.text()).select();
                        //$link[0].setSelectionRange(0, 99999); /*For mobile devices*/
                        document.execCommand("copy");
                        $temp.remove();
                        $link.addClass('--cc-bgw-lightblue');
                        win.setTimeout(
                            function () {
                                $link.removeClass('--cc-bgw-lightblue');
                            }, 500
                        );
                    });
                }
            }
        });
        // cta close share bubble handler
        $('.--share-funcs').hover(
            null,
            function () {
                $('.cta-fixed .' + active).removeClass(active);
                clearArrow();
            }
        );

        /**
         * footer social icons handler
         */
        const $footerBubble = $('footer .share-bubble');
        const $footerText = $footerBubble.find('.share-bubble__inner');
        const footerShareText = $footerText.html();
        $('footer .--social').click(function () {
            const $button = $(this);
            const $allButtons = $button.parent().find('.--social');
            let buttonUrl = $button.data('url')
            if (typeof buttonUrl !== 'undefined')
            {
                buttonUrl = buttonUrl.trim();
                if (buttonUrl.match(/^tel:|^mailto:/i) === null)
                {
                    if ($button.hasClass(active))
                    {
                        if (noWrapper && $(':visible', $footerBubble).length > 0)
                        {
                            window.open(buttonUrl, '_blank');
                        }
                        $allButtons.removeClass(active);
                        $footerBubble.removeClass(active);
                        clearArrow();
                    }
                    else
                    {
                        // activate clicked button
                        $allButtons.removeClass(active);
                        $button.addClass(active);
                        $footerBubble.addClass(active);
                        setArrow();
                        if ($('.neos-backend').length === 0 && $footerText.length > 0)
                        {
                            $footerText.html(footerShareText.substitutePlaceholders($button, buttonUrl));
                        }
                    }
                }
            }
        });
        // footer close share bubble handler
        $('footer .--visit-funcs').hover(
            null,
            function () {
                $('footer .' + active).removeClass(active);
                clearArrow();
            }
        );

        /**
         * blog more loader
         */
        $('.blog-section__button--load-more').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            let $a = $(this);
            let href = $a.prop('href');
            if (href !== '')
            {
                let $pNode = $a.parent().parent();
                $.ajax({
                    method: 'GET',
                    url: href,
                    success: function (response) {
                        let json = JSON.parse(response)
                        let end = json.teasers.length
                        for (let idx = 0; idx < end; idx++)
                        {
                            $(json.teasers[idx]).insertBefore($pNode);
                        }
                        if (typeof json.moreLink !== "undefined")
                        {
                            $a.prop('href', json.moreLink)
                        }
                        else
                        {
                            $a.remove();
                        }
                    }
                });
            }
        });

    });
}(jQuery, window));

/**
 * TdsOnepager.Video
 */
let TdsOnepager = {
    Video: {
        play: function (playButton) {
            let controls = playButton.closest('.video__controls');
            controls.classList.add('video__controls--hide');
            let video = controls.closest('section').querySelector('video');
            video.onended = (event) => {
                controls.classList.remove('video__controls--hide');
            };
            if (video.paused)
            {
                video.play();
            }
        }
   }
};
