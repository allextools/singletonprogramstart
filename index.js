var npid = require('npid'),
    fs = require('fs'),
    isrunning = require('is-running'),
    path = require('path'),
    pidfn;

function nullPidFile(cb,errorcb){
  try {
    fs.unlinkSync(pidfn);
  } catch (ignore) {
  }
  createPidFile(cb,errorcb);
}

function abort () {
  process.exit(1);
}

function checkRunningPid(cb,errorcb){
  try{
    var pid = parseInt(fs.readFileSync(pidfn).toString()), cbr;
    if(isNaN(pid)){
      nullPidFile();
    }else{
      if (isrunning(pid)) {
        if (errorcb) {
          cbr = errorcb(pid, pidfn);
          if (cbr && ('function' === typeof cbr.then)) {
            cbr.then(
              createPidFile.bind(null, cb, errorcb),
              abort
            );
            return;
          }
          createPidFile(cb,errorcb);
        } else {
          abort();
        }
      } else {
        nullPidFile(cb,errorcb);
      }
    }
  }
  catch(e){
    abort();
  }
}

function createPidFile(cb,errorcb){
  try {
    var pidf = npid.create(pidfn);
    pidf.removeOnExit();
    cb();
  }
  catch(ignore){
    checkRunningPid(cb,errorcb);
  }
}

function startPidControlledProgram(programname,cwd,cb,errorcb){
  pidfn = path.join((cwd||__dirname),(programname||'pidcontrol')+'.pid');
  createPidFile(cb,errorcb);
};

module.exports = startPidControlledProgram;

