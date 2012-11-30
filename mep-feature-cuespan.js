/**
 * mep-feature-cuespan
 *
 * Time based range event manager for mediaelement.js
 *
 * cuespans option is an array of objects describing time ranges and callbacks for each range events/status
 * 
 * [{
 *    start: 5, // in seconds
 *    stop: 10, // in seconds
 *    enter: function(player, e) {}, // player enters the time range (called once per range change)
 *    on: function(player, e) {},    // player is between the time range (called multiple times / s)
 *    exit: function(player, e) {},  // player exits the time range (called once per range change)
 *    off: function(player, e) {},   // player is not between the time range (called multiple times / s)
 *    // you can add your own data and access it using 'this.' in callbacks
 * }]
 * 
 * integration example:
 *
 *  $('#player').medialementplayer({
 *      features: [..., 'cuespan'],
 *      cuespans: [{
 *          start: 3,
 *          enter: function(player) {
 *              // reveal some ad after 3s playback
 *          }
 *      }, {
 *          start: 4.1,
 *          stop: 5.8,
 *          on: function(player) {
 *              // set some image thumb active between 4.1 - 5.8
 *          },
 *          off: function(player) {
 *              // set some image thumb inactive when not between 4.1 - 5.8
 *          }
 *      }, {
 *          htmlCode: '<span>register to see more<span>',
 *          start: 5,
 *          enter: function(player) {
 *              // do something with htmlCode property
 *              $('#info').html(this.htmlCode).fadeIn();
 *          },
 *          exit: function(player) {
 *              $('#info').fadeOut();
 *          }
 *      }]
 *  });
 *
 *
 */
(function($) {

    $.extend(mejs.MepDefaults, {
        cuespans: []
    });

    $.extend(MediaElementPlayer.prototype, {

        // plugin initiator
        buildcuespan: function(player, controls, layers, media) {

          // listen on media time update
          media.addEventListener('timeupdate', function(e) {
            player.cuespanTimeUpdate(e);
          }, false);

        },

        // timeupdate handler
        cuespanTimeUpdate: function(e) {
          var t = this, currentTime = t.media.currentTime,
            csIndex, cs, active;

          // loop through every cuespan defined
          for (csIndex in t.options.cuespans) {
            cs = t.options.cuespans[csIndex];

            // span active = time between start and stop
            active = (cs.start ? currentTime >= cs.start : true)
                  && (cs.stop ? currentTime < cs.stop : true);

            // span state changed, trigger event callbacks (enter or exit)
            if (active != cs.active)
            {
              active ? (cs.enter && cs.enter.apply(cs, [t, e])) : (cs.exit && cs.exit.apply(cs, [t, e]));
              cs.active = active;
            }

            // trigger state callbacks (on or off)
            active ? (cs.on && cs.on.apply(cs, [t, e])) : (cs.off && cs.off.apply(cs, [t, e]));
          }
        }
    });
})(mejs.$);

