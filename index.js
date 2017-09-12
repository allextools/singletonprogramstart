var npid = require('npid'),
    fs = require('fs'),
    isrunning = require('is-running'),
    path = require('path'),
    pidfn;

function nullPidFile(){
  try {
    fs.unlinkSync(pidfn);
  } catch (ignore) {
  }
  createPidFile();
}

function abort () {
  process.exit(1);
}

function checkRunningPid(cb){
  try{
    var pid = parseInt(fs.readFileSync(pidfn).toString()), cbr;
    if(isNaN(pid)){
      nullPidFile();
    }else{
      if (isrunning(pid)) {
        if (cb) {
          cbr = cb(pid, pidfn);
          if (cbr && ('function' === typeof cbr.then)) {
            cbr.then(
              createPidFile,
              abort
            );
            return;
          }
          createPidFile();
        } else {
          abort();
        }
      } else {
        nullPidFile();
      }
    }
  }
  catch(e){
    abort();
  }
}

function createPidFile(cb){
  try {
    var pidf = npid.create(pidfn);
    pidf.removeOnExit();
  }
  catch(e){
    checkRunningPid(cb);
  }
}

function startPidControlledProgram(programname,cwd,cb){
  pidfn = path.join((cwd||__dirname),(programname||'pidcontrol')+'.pid');
  createPidFile(cb);
};

module.exports = startPidControlledProgram;

