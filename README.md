# TdsOnepager.Site for NEOS
This is the NEOS site code for a one-pager. It's based on [bootstrap v4.5.1](https://getbootstrap.com).
The templates are designed "mobile first".

##  Installation

```
composer require carbon/eel
composer require flowpack/neos-matomo
composer require shel/neos-colorpicker
```

## Intention
The intention of a one-pager is to keep all information in one page. 
You may use this template for example for a blog.

### Color scheme
The colors scheme is restricted to six colors
* five background/foreground colors (black, white, dark blue, light blue and green) and
* one highlight color (yellow)

Each section ([see below](#section-templates)) has an inspector control to select obe of  the color schemes
* white on dark blue
* white on light blue
* white on green
* black on white (default)

The colors are harmonized to reflect a serious and honest content matching color blind people's demands
(Deuteranopia, Protanopia, Tritanopia). 

### Keep it simple small
The section template contains not more than six section templates:
* Image template
* Text box with image
* Citation
* Text block
* Text with formatting
* Headline

### Section templates
The templates do have some options controlled by inspector elements.
#### Image template
Inspector controls
* Color scheme. Background color is set on full **grid** scaling, only.
* The image. Image cutout of is scaled 3 by 1 resp. 4 by 1 if not mobile. 
* Full viewport width or full grid width. A full size image cannot be animated.
Grid sized images are cutout 30 by 11 resp. 40 by 11 if not mobile.
* Animation ([see below](#animations)).

#### Text box with image
Inspector controls
* Text orientation (left: default, centered, right).
* Color scheme.
* The image. A portrait image is cut scaled 1 by one if mobile.
* Image position (left: default, right).
* Animation ([see below](#animations)).

#### Citation
Inspector controls
* Color scheme.
* Citation style (Author and organization left & citation text left: default,
 Citation text right & author and organization right).
* Symbol - optional (topping author and organisation).
* Sound. If you add a symbol and sound, the sound is played when you hit the symbol.  
* Animation ([see below](#animations)).

#### Text block
Inspector controls
* Color scheme.
* Text columns (one: default, two).
* Text orientation (left: default, centered, right).
* Positioning of author (top: default, bottom).
* Animation ([see below](#animations)).

If you leave the title empty it's not rendered.
If you leave the author empty it's not rendered.

In the text you can format bold text, sorted and unsorted lists and insert anchors.

#### Text with formatting
Inspector controls
* Color scheme.
* Text columns (one: default, two).
* Text orientation (left: default, centered, right).
* Animation ([see below](#animations)).

In the text you can format bold text, sorted and unsorted lists, insert anchors and format Headlines 1 to 4.

#### Headline
Inspector controls
* Color scheme.
* Text orientation (left: default, centered, right).
* Animation.

The headlines are collected to the top menu as jump points.

## Animations
Section animation is performed by utlizing [animate.css](https://animate.style).

The animation you define in a section's inspector is applied to the section on load.
To have a "living" animated page the css classes used for animation are removed when
a section gets hidden by scrolling. When a section gets visible again by scrolling 
the css animation classes are set to the section.
  
From the big bunch of animations contained in `animate.css` a selection is defined
in file `NodeTypes.Mixins.Animation.yaml`. Feel free to add more.

## Extension to multi-pager site
To extend this one-pager to a multi-page site would at least need a navigation.