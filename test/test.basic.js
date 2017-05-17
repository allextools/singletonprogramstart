var child_process = require('child_process'),
  fs = require('fs'),
  Path = require('path'),
  childproc;


function fileExists (filepath, cb) {
  fs.access(filepath, fs.constants.F_OK, function (err) {
    if (err) {
      cb(err);
    } else {
      cb();
    }
    cb = null;
  });
}

function fileNotExists (filepath, cb) {
  fs.access(filepath, fs.constants.F_OK, function (err) {
    if (err) {
      cb();
    } else {
      cb(Error('File '+filepath+' exists'));
      filepath = null;
    }
    cb = null;
  });
}

describe('Basic tests', function () {
  it('Start a pid-controlled program', function (done) {
    childproc = child_process.fork(Path.join(__dirname, 'lib', 'pidcontrolledprogram.js'), ['TestProgram']);
    childproc.on('message', function () {
      if (done) {
        done();
        done = null;
      }
    });
  });
  it('TestProgram.pid should exist', function (done) {
    fileExists('TestProgram.pid', done);
  });
  it('Ask a pid-controlled program to exit', function (done) {
    childproc.send({die: true});
    childproc.on('exit', function () {
      if (done) {
        done();
        done = null;
      }
    });
  });
  it('TestProgram.pid should NOT exist', function (done) {
    fileNotExists('TestProgram.pid', done);
  });
});

