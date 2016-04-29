/***
 * This file provides a connection from Kimbia to mvault. Once a Kimbia form is filled, it sends the information to MVault to request an activation code.
**/

/** Set your station here.  **/
var MSB = MSB || (function() {
  this.stationId = '';
  return {
    init : function(arg) {
      this.stationId = arg;
    },
    salesForceURL: function(stationID) {
      return this.data[this.stationId].salesForceUrl;
    },
    data: {
      WGBH: {
        salesForceUrl: 'https://mywgbh.secure.force.com/passport/services/apexrest/mvcms/v2.0/provision/a4531000000RzijAAC'
      },
      NHPTV: {
        salesForceUrl: 'https://mywgbh.secure.force.com/passport/services/apexrest/mvcms/v2.0/provision/a4531000000RzioAAC'
      },
      WGBY: {
        salesForceUrl: 'https://mywgbh.secure.force.com/passport/services/apexrest/mvcms/v2.0/provision/a4531000000RzitAAC'
      },
      TEST: {
        salesForceUrl: 'https://uat-mywgbh.cs25.force.com/tm/services/apexrest/mvcms/v2.0/provision/a4D1b000000Cx2EEAS?email=cate.twohill@gmail.com&confirmationCode=FJ5SNS0'
      }      
    }
  };
}());   


/*************************** DO NOT TOUCH CODE AFTER THIS *******************************/
// Valid values: WGBH, NHPTV, WGBY, TEST


/******* Connection to MVault for Passport *******/
/* Helper functions for MVaultConnect link */
function winHasJSON(obj) {
  var ret;
  try {
    ret = JSON.stringify(obj);
  } catch (err) {
    Rollbar.error("winHasJSON failed: ", err);
  }
  return ret;
}

/* Display overlay */
function displayOverlay() {
  $("body").append('<div id="mvaultModal"></div>');
  $('#mvaultModal').css({ background:'rgba(0,0,0,0.8) url(https://msb-static.wgbh.org/msb/loading.svg) no-repeat 49% 49%', position: 'absolute', left: '0', top: '0', width: '100%', height: '100%', zIndex: 10000 });
}

// Display the result of the activation attempt
function showFinalModal(ctaHeader, ctaMsg, ctaLabel, nextUrl) {
  // Remove loading spinner
  $('#mvaultModal').css({ backgroundImage: 'none' });
  $('#mvaultModal').append('<div id="mvaultResponse"></div>');  
  // Insert response pane with response
  $('#mvaultResponse').html("<div id='membershipVaultRtProvResp' class='mVRtPR'><div style='font-size: 3em;'><img src='https://msb-static.wgbh.org/msb/passport_compass_rose.svg' style='height:1em; vertical-align: text-middle' /><span style='font-weight: bold; display: inline-block; margin-left: 0.25em;'>" + STATION + "</span> | <span style='color: #555;'>Passport</span></div><h3> " + ctaMsg + " </h3><p> " + ctaHeader + " </p> <a class='button button-activate' href='" + nextUrl + "' target='_blank'  >" + ctaLabel + "</a></div>");
  $('#mvaultResponse').css({ backgroundColor: '#fff', width: '40%', minWidth: '300px', margin: '60px auto', borderRadius: '0.5em', padding: '15px'});
}

// Send Kimbia data for activation
function sendObj(obj) {
  console.log(MSB);

  displayOverlay();

//   $("body").append('<div id="mvaultModal"></div>');
//   $('#mvaultModal').css({ background:'rgba(0,0,0,0.8) url(https://msb-static.wgbh.org/msb/loading.svg) no-repeat 49% 49%', position: 'absolute', left: '0', top: '0', width: '100%', height: '100%' });
  STATION = MSB.stationId;
  var clientData = (STATION == 'TEST') ? {} : obj;
  $.ajax({
    url: MSB.data[STATION].salesForceUrl,
    data: clientData,
    method: "GET",
  }).done(function(json) {
    var retObj = JSON.parse(json);
    console.log(retObj);
    if (retObj['provisioning'] === 'undefined') {
      Rollbar.error("Provisioning failed: ", json);
      showFinalModal("Communications problem with server", "Sorry, there was a problem creating your account. Please contact our support department.<br/> +1 855-782-0628 ", "Contact Support", "http://help.pbs.org/");
      return false;
    } else {
      showFinalModal(retObj['ctaHeader'], retObj['ctaMsg'], retObj['ctaLabel'], retObj['nextUrl']);
    }
  }).fail(function(json) {
      Rollbar.error("Total failure: ", json);
      showFinalModal("No response from  server", "Sorry, there was a problem creating your account. Please contact our support department.<br/> +1 855-782-0628 ", "Contact Support", "http://help.pbs.org/");
  });
}

/* MVaultConnect function */
var mVaultConnect = function(kimbiaData) {
  if (winHasJSON(kimbiaData) !== 'undefined') {
    var confirmationObject = {};
    confirmationObject['confirmationCode'] = kimbiaData['confirmationCode'];
    try {
      sendObj(confirmationObject); 
    } catch (err) { 
      Rollbar.error("KIMBIAComplete failed: ", err);
    }
  }

  try {
    if (typeof ga !=='undefined') {
      ga('send', {
        hitType: 'event',
        eventCategory: 'support',
        eventAction: 'donate',
        eventLabel: 'with passport, using overlay'    
      });
    }
  } catch (err) {
    Rollbar.error("ga Event failed: ", err);
  }
}

/*** 
 *   This is the function that should be set as the parameter for oncomplete in the call to the Kimbia form:
 *   <script src='https://widgets.kimbia.com/widgets/formChooser.js?id=#######&oncomplete=kimbiaOnComplete'></script>
 */
function kimbiaOnComplete(kimbiaData){

  // MVaultConnect takes the original Kimbia object, not the massaged one
  mVaultConnect(kimbiaData);
  
 // Insert other functions which should be called after the Kimbia form is completed here (e.g. analytics triggers, etc.) 
 
 
}

