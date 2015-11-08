var timeoutId = 0;
var angleV = 80;
var angle = 80;
var isCamOn = false;

var makeServoCall = function(a,s,d){
    $.get("../hardware/camera/servo_cmd.php?angle="+a+"&sno="+s +"&del="+d, function(output){
        console.log('servo_cmd output: '+ output);
    });
};

var makeCamCall = function(state){
    $.get("../hardware/camera/cam_cmd.php?on="+state, function(output){
        console.log('cam_cmd output: '+ output);
    });
};

var center = function(){
    angle = 80;
    angleV = 80;
    send(1,1,800);
    send(0,1,800);
};

run = function (addr, cmd, del, bri, rgb, tout) {
    var getCmd = "../hardware/lights/lights_cmd.php?cmd=" + cmd + "&del=" + del + "&bri="
        + bri + "&rgb=" + rgb + "&tout=" + tout + '&addr="' + addr + '"';
    console.log('sending command');
    $.get(getCmd, function (d) {
        console.log(d);
    });
};

var on = false;
var laser = function(){
    on = !on;
    run('00 00 00 00 00 00 FF FF','R',on?'R':'O','100','255,0,0','0');
}

var record = function(){
    var rec = $('#record');
    var state = rec.attr('record');
    var cmd;
    if(state === 'false'){
        rec.attr('record','true');
        rec.text('Stop Recording');
        cmd = "ca 1";
    }else{
        rec.attr('record','false');
        rec.text('Start Recording');
        cmd = "ca 0";
    }

    $.get("../hardware/camera/pipe_cmd.php?cmd="+cmd,function(){
        console.log("written to PIPE");
    });
};

var send = function(s,p,d){
    d = d || 300;
    var a = 0;
    if(s === 1){
        if(p==1) {
            a = angleV += 10;
        }else{
            a = angleV -= 10;
        }
    }else{
        if(p==1) {
            a = angle += 10;
        }else{
            a = angle -= 10;
        }
    }

    a = Math.max(s===1?10:0, a);
    a = Math.min(s===1?170:180, a);

    makeServoCall(a,s,d);
};

var toggleCam = function () {
    var checked = $('.camButton').attr('checked');
    if(checked){
        $('.camButton').attr('checked', false);
        clearTimeout(timeoutId);
        isCamOn = false;
        makeCamCall(0);
    }else{
        $('.camButton').attr('checked', true);
        isCamOn = true;
        makeCamCall(1);
        getPic();
    }
};

var getPic = function(){
    if(isCamOn) {
        $("#cam").attr("src", "../../../ram/cam.jpg?" + new Date().getTime());
        timeoutId =  setTimeout(getPic,parseInt($('#slider').val()));
    }
};

center();
