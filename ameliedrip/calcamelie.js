// THIS SCRIPT CALCULATES THE TEST RESULT
/*
    ________     _                                                                      _                      
   /  ____  \   | |                                                  /\                | |                     
  /  / ___|  \  | |     __ _ _ __   __ _ _   _  __ _  __ _  ___     /  \   ___ __ _  __| | ___ _ __ ___  _   _ 
 |  | |       | | |    / _` | '_ \ / _` | | | |/ _` |/ _` |/ _ \   / /\ \ / __/ _` |/ _` |/ _ \ '_ ` _ \| | | |
 |  | |___    | | |___| (_| | | | | (_| | |_| | (_| | (_| |  __/  / ____ \ (_| (_| | (_| |  __/ | | | | | |_| |
  \  \____|  /  |______\__,_|_| |_|\__, |\__,_|\__,_|\__, |\___| /_/    \_\___\__,_|\__,_|\___|_| |_| |_|\__, |
   \________/                       __/ |             __/ |                                               __/ |
                                   |___/             |___/                                               |___/ 
*/

//Open the hidden drip form
$( document ).ready(function() {
    _dcq.push(["showForm", { id: "23953900" }]);
});

// function to calculate amelie

function calculateamelieresult() {
console.log("calculateameliereached");
var q1 = $('.q1:checked').val(); // value of the first question
var q2 = $('.q2:checked').val();
var q3 = $('.q3:checked').val();
var q4 = $('.q4:checked').val(); 
var q5 = $('.q5:checked').val();
var q6 = $('.q6:checked').val();
var q7 = $('.q7:checked').val();
var plresult = 'to-be-determined';
var redirecttarget = 'http://frenchlover.org/mpage/undetermined';
console.log("calculateamelievaluesset");

/*
 What the Values Stand for
 A = C1 on the CERF scale for Languages
 B = B2 on the CERF scale for Languages
 C = B1 on the CERF scale for Languages
 D = A2 on the CERF scale for Languages
 E = A1 on the CERF scale for Languages
*/

// Count times that each value occurs
var qcombined = q1 + q2 + q3 + q4 + q5 + q6 + q7;
console.log(qcombined + ' is the combined answer');
var counta = (qcombined.match(/A/g) || []).length;
console.log(counta + 'x C1 aka A');
var countb = (qcombined.match(/B/g) || []).length;
console.log(countb + 'x B2 aka B');
var countc = (qcombined.match(/C/g) || []).length;
console.log(countc + 'x B1 aka C');
var countd = (qcombined.match(/D/g) || []).length;
console.log(countd + 'x A2 aka D');
var counte = (qcombined.match(/E/g) || []).length;
console.log(counte + 'x A1  aka E');

//now let's start testing for results - bottom up

if ((counte >= 5) || (counte >= 3 && countd >= 3)) {
    console.log("user is in between A1 and A2");
    redirecttarget = 'http://frenchlover.org/mpage/a1a2';
    plresult = 'A1-A2';
} else if (countd >= 5) {
    console.log("user is a flat A2");
    redirecttarget = 'http://frenchlover.org/mpage/a2';
    plresult = 'A2';
} else if (countd >= 3 && countc >= 3) {
    console.log("user is in between A2 and B1");
    redirecttarget = 'http://frenchlover.org/mpage/a2b1';
    plresult = 'A2-B1';
} else if (countc >= 5) {
    console.log("user is a flat B1");
    redirecttarget = 'http://frenchlover.org/mpage/b1';
    plresult = 'B1';
} else if (countc >= 3 && countb >= 3) {
    console.log("user is in between B1 and B2");
    redirecttarget = 'http://frenchlover.org/mpage/b1b2';
    plresult = 'B1-B2';
} else if ((countb >= 5) || (counta >= 5) || (counta >= 3 && countb >= 3)) {
    console.log("user is higher than B2");
    redirecttarget = 'http://frenchlover.org/mpage/b2plus';
    plresult = 'B2+';
} else {
    console.log("result could not be determined");
    plresult = 'result-could-not-be-determined';
}

//write result value into drip result form & submit
$('input[name="fields[pl_result]"]').val(plresult);
$('input[name="fields[email]"]').val($('#mauticform_input_placementtest_please_enter_your_email_a').val());
$("#drip-submit-85656").click();

$("#placementtest_submit").click();
console.log("endofsubmitformreached");

//redirect to proper source after 2s
setTimeout(redirecttoresult, 2000);

function redirecttoresult(){
window.location.href = redirecttarget;
}

}