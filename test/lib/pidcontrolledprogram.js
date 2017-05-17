var fs = require('fs');

var pidcontrol = require('../..');

pidcontrol(process.argv[2] || 'pidcontrolledprogram', '.');
process.send({started: true});

process.on('message', function (msgobj) {
  if (msgobj && msgobj.die) {
    process.exit();
  }
});


