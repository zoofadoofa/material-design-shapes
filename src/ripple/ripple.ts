import * as svgjs from 'svg.js';
import { RippleDuration, RippleOpacity, RippleRadius } from './ripple.const';

const MDSRipple = svgjs.invent({
    create: 'circle',
    inherit: svgjs.Circle,
    extend: {
        _initialSize: 0,
        _maxDiameter: 0,
        contrast: 'dark',
        updateMinMax: function(width: number, height: number): svgjs.MDSRipple {
            this._maxDiameter = Math.max(height, width);
            this._initialSize = this._maxDiameter * RippleRadius.initialScale;
            return this;
        },
        reset: function(): svgjs.MDSRipple {
            const doc= this.doc();
            const background = doc.select('.mss-ripple-background').members[0];
            background.animate(RippleDuration.fadeOut, '-').attr('opacity', 0);
            return this;
        },
        expand: function(x: number, y: number): svgjs.MDSRipple {
            const doc = this.doc();
            const background = doc.select('.mss-ripple-background').members[0];

            // stop previous animations
            background.stop ? background.stop(false, true) : () => {};
            this.stop ? this.stop(false, true) : () => {};

            background.animate(RippleDuration.fadeIn, '-')
                .attr('opacity', this.contrast === 'light'
                ? RippleOpacity.light.press
                : RippleOpacity.dark.press
            );

            this.radius(this._initialSize, this._initialSize)
                .cx(x)
                .cy(y)
                .animate(RippleDuration.translate, '-', RippleDuration.delay)
                .radius(this._maxDiameter, this._maxDiameter)

            return this;
        },
    },
    construct: {
        ripple: function() {
            this.put(new svgjs.MDSRipple);
        }
    }
})

svgjs.extend(svgjs.Shape, {
    ripple: function(contrast?: svgjs.MDSContrast): svgjs.MDSRipple {
        const doc = this.doc();
        const background = this.addClass('mss-ripple-background').opacity(0);
        const mask = doc.mask().addClass('mss-ripple-mask');

        const maxDiameter = Math.max(background.height(), background.width());
        const initialSize = maxDiameter * RippleRadius.initialScale;
        const ripple: svgjs.MDSRipple = doc.put(new MDSRipple)
            .radius(initialSize, initialSize)
            .addClass('mss-ripple-cricle')
            .fill('#fff');

        mask.add(ripple);
        this.maskWith(mask);

        ripple._initialSize = initialSize;
        ripple._maxDiameter = maxDiameter;
        ripple.contrast = contrast ? contrast : 'dark';

        return ripple;
    }
})