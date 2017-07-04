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

function checkRunningPid(){
  try{
    var pid = parseInt(fs.readFileSync(pidfn).toString());
    if(isNaN(pid)){
      nullPidFile();
    }else{
      if (isrunning(pid)) {
        process.exit(1);
      } else {
        nullPidFile();
      }
    }
  }
  catch(e){
    process.exit(1);
  }
}

function createPidFile(){
  try {
    var pidf = npid.create(pidfn);
    pidf.removeOnExit();
  }
  catch(e){
    checkRunningPid();
  }
}

function startPidControlledProgram(programname,cwd){
  pidfn = path.join((cwd||__dirname),(programname||'pidcontrol')+'.pid');
  createPidFile();
};

module.exports = startPidControlledProgram;

