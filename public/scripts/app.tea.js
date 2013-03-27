var pv = 'scripts/vendor/';
var pl = 'scripts/libs/';
require(["jquery", pv + "dropdown.js", pv + "prettify.js", pl + 'Noduino.js', pl + 'Noduino.Socket.js', pl + 'Logger.HTML.js', './'], function($, dd, p, NoduinoObj, Connector, Logger) {
  var Noduino    = null;
  var button_pin = 6;
  var led_pin    = 12;
  var led        = null;
  var on_to_off  = false;

  var readyLED = function(LED) {
    led = LED;
  };

  function addButton(Button, dir) {
    Button.on('release', function(e) {
      $('#btn').removeClass('btn-warning');
      led.setOff();
      if (on_to_off) {
        on_to_off = false;
        // send mail with defined transport object
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log("Message sent: " + response.message);
            }

            // if you don't want to use this transport object anymore, uncomment following line
            //smtpTransport.close(); // shut down the connection pool, no more messages
        });
      }
    });

    Button.on('push', function(e) {
      Noduino.log('gui', 'Pushed Button ' + e.pin);
      $('#btn').addClass('btn-warning');
      led.setOn();
      on_to_off = true;
    });
  }

  var createObjects = function(board) {
    board.withLED({pin: led_pin}, function(err, LED) { readyLED(LED); });
    board.withButton({pin:  button_pin}, function(err, Button) { addButton(Button); $('#btn').click(function(e) {e.preventDefault(); Button.setOn(); Button.setOff(); }); });
  };

  $(document).ready(function(e) {
    $('#connect').click(function(e) {
      e.preventDefault();

      if (!Noduino || !Noduino.connected) {
        Noduino = new NoduinoObj({debug: false, host: 'http://teapi.local:8090', logger: {container: '#connection-log'}}, Connector, Logger);
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
