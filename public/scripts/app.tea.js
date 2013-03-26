var pv = 'scripts/vendor/';
var pl = 'scripts/libs/';
require(["jquery", pv + "dropdown.js", pv + "prettify.js", pl + 'Noduino.js', pl + 'Noduino.Socket.js', pl + 'Logger.HTML.js'], function($, dd, p, NoduinoObj, Connector, Logger) {
  var Noduino    = null;
  var button_pin = 6;
  var led_pin    = 12;

  var readyLED = function(led) {
    walkLED.listLED[walkLED.sorting.indexOf(led.pin)] = led;
    if (walkLED.listLED.length == walkLED.maxLEDs) {
      Noduino.log('success', 'Loaded all LEDs');
      startSequence(-1, walkLED.interval);
    }
  };

  function addButton(Button, dir) {
    Button.on('release', function(e) {
      $('#btn').removeClass('btn-warning');
    });

    Button.on('push', function(e) {
      Noduino.log('gui', 'Pushed Button ' + e.pin);
      $('#btn').addClass('btn-warning');
    });
  }

  function stepper() {
    var next = walkLED.current + walkLED.direction;
    if (next == walkLED.maxLEDs + 1) {
      next = 1; }
    if (next == 0) {
      next = walkLED.maxLEDs; }
    walkLED.current = next;
    $('#leds .btn').removeClass('btn-warning');
    for (var i = 1; i <= walkLED.maxLEDs; i++) {
      walkLED.listLED[i-1].setOff();
    }
    walkLED.listLED[(walkLED.current-1)].setOn();
    Noduino.log('gui', 'setting on LED #led-' + walkLED.current);
    $('#led-' + walkLED.current).addClass('btn-warning');
  }

  function startSequence(step, interval) {
    if (walkLED.listLED.length != walkLED.maxLEDs) {
      return;
    };
    clearInterval(walkLED.currentStepper);
    walkLED.direction = step || 1;
    walkLED.currentStepper = setInterval(function() {
      return stepper();
    }, interval);
  }

  var createObjects = function(board) {
    // board.withLED({pin: led}, function(err, LED) { readyLED(LED); });
    board.withButton({pin:  button}, function(err, Button) { addButton(Button); $('#btn').click(function(e) {e.preventDefault(); Button.setOn(); Button.setOff(); }); });
  };

  $(document).ready(function(e) {
    $('#connect').click(function(e) {
      e.preventDefault();

      if (!Noduino || !Noduino.connected) {
        Noduino = new NoduinoObj({debug: true, host: 'http://teapi.local:8090', logger: {container: '#connection-log'}}, Connector, Logger);
        Noduino.connect(function(err, board) {
          $('#connection-status .alert').addClass('hide');
          if (err) {
            $('#connection-status .alert-error').removeClass('hide'); }
          else {
            $('#connection-status .alert-success').removeClass('hide'); createObjects(board); }
        });
      }
    });
  });
});
