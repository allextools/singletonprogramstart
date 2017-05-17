var npid = require('npid'),
    fs = require('fs'),
    isrunning = require('is-running'),
    path = require('path'),
    pidfn;

function runningChecker(err,live){
  if(err){
    process.exit(2);
  }
  if(live){
    process.exit(1);
  }else{
    nullPidFile();
  }
}

function nullPidFile(){
  fs.unlink(pidfn,createPidFile);
}

function checkRunningPid(){
  try{
    var pid = parseInt(fs.readFileSync(pidfn).toString());
    if(isNaN(pid)){
      nullPidFile();
    }else{
      isrunning(pid,runningChecker);
    }
    console.log(pid);
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

