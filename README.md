mediaelement-cuespan
====================

MediaElement.js player plugin for time range based triggers

The cuespans option is an array of objects describing time ranges and callbacks for each range events/status

```js
[{
  start: 5, // in seconds
  stop: 10, // in seconds
  enter: function(player, e) {}, // player enters the time range (called once per range change)
  on: function(player, e) {},    // player is between the time range (called multiple times / s)
  exit: function(player, e) {},  // player exits the time range (called once per range change)
  off: function(player, e) {},   // player is not between the time range (called multiple times / s)
  // you can add your own data and access it using 'this.' in callbacks
}]
```

integration with mediaelementplayer:
 
```js
$('#player').medialementplayer({
  features: [..., 'cuespan'],
    cuespans: [{
        start: 3,
        enter: function(player) {
            // reveal some ad after 3s playback
        }
    }, {
        start: 4.1,
        stop: 5.8,
        on: function(player) {
            // set some image thumb active between 4.1 - 5.8
        },
        off: function(player) {
            // set some image thumb inactive when not between 4.1 - 5.8
        }
    }, {
        htmlCode: '<span>register to see more<span>',
        start: 5,
        enter: function(player) {
            // do something with htmlCode property
            $('#info').html(this.htmlCode).fadeIn();
        },
        exit: function(player) {
            $('#info').fadeOut();
        }
    }]
});
```