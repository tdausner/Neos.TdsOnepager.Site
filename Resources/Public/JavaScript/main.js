;( function ( $, win ) {
    'use strict';

    let site = win.location.origin + win.location.pathname;

    let headerHeight = 0;
    $( document ).ready( function () {
        $( '.detectJs' )
            .removeClass( 'detectJs' );
        headerHeight = parseInt( document.getElementsByClassName( 'header--fixed' )[0].getBoundingClientRect().height );
        let id = win.location.search.split( 'id=' )[1];
        $( 'section[id], h1[id]' ).each( function () {
            let myId = $( this ).attr( 'id' );
            if ( myId === id )
            {
                if ( navigator.userAgent.match( /(facebookexternalhit|LinkedInBot|Xing Agent)/i ) !== null )
                {
                    window.scrollTo(0, this.offsetTop );
                    return false;
                }
                scroller( $( '[id=' + id + ']' ) );
                return false;
            }
        } );
    } );

    /**
     * scroll handler
     * @param $target
     */
    const scroller = function ( $target ) {
        let newTop = $target[0].offsetTop - headerHeight;
        $( 'html,body' ).animate( { scrollTop: newTop }, 700, 'linear' );

/* use jQuery animate() due to no 'behaviour' option in Safari
        window.scrollTo( {
            top: newTop,
            left: 0,
            behavior: 'smooth'
        } );
*/
    };

    /**
     * menu click & menu scroll handler
     * @param $target
     */
    $( '.jump' ).click( function ( e ) {
        e.preventDefault();
        let id = $( this ).attr( 'href' ).substr( 1 );
        scroller( $( '[id=' + id + ']' ).parents( 'header, section, footer' ) );
    } );

    /**
     * sounds in TdsOnepager.Site:Content.Citation
     */
    $( '.citation__icon i' ).click( function () {
        if ( this.childNodes.length )
        {
            this.childNodes[0].play();
        }
    } );

    /**
     * windows resize / scroll handler
     */
    let headerHeightMax = 0;
    let headerHeightMin = 1000;
    $( win ).on( "resize scroll", function () {

        /*
         * header shrinking
         */
        headerHeight = parseInt( document.getElementsByClassName( 'header--fixed' )[0].getBoundingClientRect().height );
        headerHeightMax = headerHeight > headerHeightMax ? headerHeight : headerHeightMax;
        headerHeightMin = headerHeight < headerHeightMin ? headerHeight : headerHeightMin;

        let st = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
        if ( st > headerHeightMax * 3 / 4 )
        {
            $( 'header' ).addClass( 'header--shrink' );
        }
        else if ( st < headerHeightMin )
        {
            $( 'header' ).removeClass( 'header--shrink' );
        }
        /*
         * animation
         */
        let $elements = $( '.animate' ).parent(); // containers
        $elements.each( function () {
            let rect = this.getBoundingClientRect();
            let vh = window.innerHeight;
            let $anim = $( this.childNodes[0] );
            let animation = "animate__animated animate__" + $anim.data( 'animation' );
            if ( rect.top > headerHeight && rect.top < vh || rect.bottom > headerHeight && rect.top < vh )
            {
                $anim.addClass( animation );
            }
            else
            {
                $anim.removeClass( animation );
            }
        } );
        setArrow();
    } );

    /**
     * Prev / next button click handler
     */
    $( '.__button.--prev, .__button.--next' ).click( function () {
        // get all headline's position sorted ASC
        let headlines = [];
        $( '.headline h1' ).parents( 'section' ).each( function ( idx ) {
            let y = parseInt( this.getBoundingClientRect().top );
            headlines[idx] = {
                el: this,
                id: $( 'h1', this ).attr( 'id' ),
                y: y
            };
        } );
        headlines.sort( function ( a, b ) {
            return a.y - b.y;
        } );
        // calc jump section
        const $button = $( this );
        if ( $button.hasClass( '--prev' ) )
        {
            for ( let i = headlines.length; --i >= 0; )
            {
                if ( headlines[i].y < 0 )
                {
                    scroller( [headlines[i].el] );
                    break;
                }
            }
        }
        else
        {
            for ( let i in headlines )
            {
                if ( headlines.hasOwnProperty( i ) && headlines[i].y > headerHeight + win.innerHeight / 2 )
                {
                    scroller( [headlines[i].el] );
                    break;
                }
            }
        }

    } );

    /**
     * Social Links button click handler
     */
    const socialShareMessageFooter = $( '.cta-share-bubble' ).find( 'p' ).html();
    let active = '__active';

    let setArrow = function () {
        const $arrow = $( '.cta-share-bubble.' + active + ' .cta-share-bubble--arrow' );
        const $button = $( '.__button.' + active );
        const $shareBtn = $( '.__button.--share' );
        if ( $arrow.length && $button.length )
        {
            $arrow
                .css( { 'right': 'calc(' + parseInt( $shareBtn.offset().left - $button.offset().left ) + 'px - 0.1em)' } );
        }
    };

    $( '.cta-icons .--social' ).click( function () {
        const $button = $( this );
        const $parent = $button.parent();
        const $allButtons = $parent.find( '.--social' );
        const $bubble = $( '.cta-share-bubble' );

        if ( $button.hasClass( active ) )
        {
            if ( $( ':visible', $bubble ).length > 0 )
            {
                let yPos = $button.offset().top;
                let lastId = '';
                $( 'section[id]' ).each( function () {
                    let $section = $( this );
                    let myId = $section.attr( 'id' );
                    let idPos = this.offsetTop;
                    if ( idPos > yPos )
                    {
                        return false;
                    }
                    lastId = myId;
                } );
                let targetUrl = encodeURIComponent( site + ( lastId !== '' ? '?id=' : '' ) + lastId );
                let href = $( 'u', $button ).data( 'url' ) + targetUrl;
                window.open( href, '_blank' );
            }
            $allButtons.removeClass( active );
            $bubble.removeClass( active );
        }
        else
        {
            // activate clicked button
            $allButtons.removeClass( active );
            $button.addClass( active );
            $bubble.addClass( active );
            setArrow();
            if ( $( '.neos-backend' ).length === 0 )
            {
                $bubble.find( 'p' ).html( socialShareMessageFooter.replace( /%/, $button.attr( 'title' ) ) );
            }
        }
    } );
    // close share bubble handler
    $( '.--share-funcs' ).hover(
        null,
        function () {
            $( '.cta-fixed .' + active ).removeClass( active );
        }
    );

}( jQuery, window ) );
