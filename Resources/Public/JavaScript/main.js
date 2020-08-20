;( function ( $, win ) {
    'use strict';

    /**
     * menu click & menu scroll handler
     * @param $target
     */
    const scroller = function ( $target ) {
        window.scrollTo( {
            top: $target.offset().top - $( 'header .fixed' )[0].getBoundingClientRect().height,
            left: 0,
            behavior: 'smooth'
        } );
    };

    $( '.menu a' ).click( function ( e ) {
        e.preventDefault();
        let id = $( this ).attr( 'href' ).substr( 1 );
        scroller( $( '[id=' + id + ']' ).parents( 'section' ) );
    } );

    /**
     * sounds in TdsOnepager.Site:Content.Citation
     */
    $( '.citation__icon i' ).click( function () {
        this.childNodes.length && this.childNodes[0].play();
    } );

    /**
     * animation
     */
    const setAnimation = function () {
        let $elements = $( '.animate' ).parent();
        $elements.each( function () {
            let header = $( 'header .fixed' )[0].getBoundingClientRect().height;
            let rect = this.getBoundingClientRect();
            let vh = window.innerHeight;
            let $row = $( this ).find( '.row' );
            let animation = "animate__animated animate__" + $row.data( 'animation' );
            if ( rect.top > header && rect.top < vh || rect.bottom > header && rect.top < vh )
            {
                $row.addClass( animation );
            }
            else
            {
                $row.removeClass( animation );
            }
        } );
    };
    $( win ).on( "resize scroll", setAnimation );

}( jQuery, window ) );
