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
var qcombined = q1 + q2 + q3 + q4 + q5 + q6 ;
var counta = (qcombined.match(/A/g) || []).length;
console.log(counta + 'x C1');
var countb = (qcombined.match(/B/g) || []).length;
console.log(countb + 'x B2');
var countc = (qcombined.match(/C/g) || []).length;
console.log(countc + 'x B1');
var countd = (qcombined.match(/D/g) || []).length;
console.log(countd + 'x A2');
var counte = (qcombined.match(/E/g) || []).length;
console.log(counte + 'x A1');

//now let's start testing for results - bottom up

if ((counte >= 5) || (counte >= 3 && countd >= 3)) {
    console.log("user is in between A1 and A2");
    plresult = 'A1-A2';
} else if (countd >= 5) {
    console.log("user is a flat A2");
    plresult = 'A2';
} else if (countd >= 3 && countc >= 3) {
    console.log("user is in between A2 and B1");
    plresult = 'A2-B1';
} else if (countc >= 5) {
    console.log("user is a flat B1");
    plresult = 'B1';
} else if (countc >= 3 && countb >= 3) {
    console.log("user is in between B1 and B2");
    plresult = 'B1-B2';
} else if ((countb >= 5) || (counta >= 5) || (counta >= 3 && countb >= 3)) {
    console.log("user is higher than B2");
    plresult = 'B2+';
} else {
    console.log("result could not be determined");
}

//write result value into result form & submit
$("#mauticform_input_placementtestresults_placementtestresult").val(plresult);
$("#mauticform_input_placementtestresults_identifyuserplresult").val($('#mauticform_input_placementtest_please_enter_your_email_a').val());
$("#mauticform_input_placementtestresults_submit").click();

}