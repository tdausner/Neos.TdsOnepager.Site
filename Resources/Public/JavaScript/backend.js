;(function ($, win) {
    'use strict';
    $(document).ready(function () {

        /**
         * author positioning in TdsOnepager.Site:Content.TextBlock
         */
        $('body.neos-backend').each(function () {
            win.setInterval(function () {
                $('div.author').each(function () {
                    let $span = $('h4 > div span', this);
                    let spanDir = $span.attr('style');
                    if ($span.length > 0 && typeof spanDir !== 'undefined')
                    {
                        let spanClass = 'text-block--' + spanDir.replace(/text-align:(.*);/, '$1');
                        if (!$(this).hasClass(spanClass))
                        {
                            $(this)
                                .addClass(spanClass)
                                .removeClass('text-block--' + (spanClass === 'text-block--center' ? 'right' : 'center'));
                        }
                    }
                    else
                    {
                        $(this).removeClass('text-block--center text-block--right');
                    }
                });
            }, 200);
        });
    });
}(jQuery, window));

/**
 * ImageTextBlock drag and drop
 */
const TdsOnepager = {
    ImageTextBlock: {
        observer: function () {
            const obs = new MutationObserver(TdsOnepager.ImageTextBlock.change);
            obs.observe(document.querySelector('main > div'), {childList: true});
        },
        change: function (mutationsList, observer) {
            let sectionAdded = mutationsList[0].addedNodes[0];
            if (typeof sectionAdded !== 'undefined')
            {
                let ev = {};
                ev.target = sectionAdded;
                TdsOnepager.ImageTextBlock.loaded(ev);
            }
        },
        loaded: function (event) {
            let imagePos = event.target.querySelectorAll('.image-text-block__image-position');
            for (let idx = 0; idx < imagePos.length; idx++)
            {
                let pos = imagePos[idx].children[0].textContent;
                let inputs = imagePos[idx].parentNode.querySelectorAll('.image-text-block__positioner input');
                for (let i = 0; i < inputs.length; i++)
                {
                    if (inputs[i].value === pos)
                    {
                        inputs[i].checked = true;
                    }
                }
            }
        },
        onclick: function (elem) {
            let pos = elem.value;
            let section = elem.closest('section');
            section.querySelector('.image-text-block__image-position div span').textContent = pos;
            let image = section.querySelector('.image-text-block__image');
            image.className = image.className.replace(/(image-text-block__image--)(top|left|right)/, '$1' + pos);
        }
    }
};
TdsOnepager.ImageTextBlock.observer();
document.addEventListener('DOMContentLoaded', TdsOnepager.ImageTextBlock.loaded);
