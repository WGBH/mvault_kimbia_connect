/***
 * This file replaces wgbh_kimbia_comboTrackerV2.js
 * It provides actions to take once Kimbia fires the onComplete callback for the form
 * As of 8/3/2015 it contains calls for 3 services:
 * - Passport membership link
 * - Rocket Fuel
 * - Google Analytics
**/

function debugIt(obj) {
  console.log(obj);
}


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

function showFinalModal(loadindic, mvaultContinue, mvaultActionContent, ctaHeader, ctaMsg, ctaLabel, nextUrl) {
  debugIt('Showing final');
  if (true === true ) {
    $(mvaultActionContent).html("<div id='membershipVaultRtProvResp' class='mVRtPR'><img src='https://rmpbs.secure.force.com/support/resource/1455151540000/RMPBSPassportLogo' style='max-width:100%; height:auto' /><h3> " + ctaHeader + " </h3><p> " + ctaMsg + " </p> <a class='button button-activate' href='" + nextUrl + "' target='_blank'  >" + ctaLabel + "</a></div>");
    loadindic.style.visibility = "hidden";
    $(loadindic).remove();
    $(mvaultContinue).detach();
    $("body").prepend(mvaultContinue);
    mvaultContinue.style.visibility = "visible";
  }
}

function sendObj(obj) {
  debugIt('Sending info');
  var loadindic = document.getElementById("mvaultLoading");
  var mvaultContinue = document.getElementById("mvaultContinue");
  var mvaultActionContent = document.getElementById("mvaultActionContent");
  $(loadindic).detach();
  $("body").prepend(loadindic);
  loadindic.style.visibility = "visible";
  $.ajax({
    url: "https://rmpbs.secure.force.com/support/services/apexrest/mvconnext_rtprv/v1.0/provision/kimbia",
    data: obj,
    method: "GET",
  }).done(function(json) {
    var retObj = JSON.parse(json);
    console.log(retObj);
    if (retObj['provisioning'] === 'undefined') {
      Rollbar.error("Provisioning failed: ", json);
      showFinalModal(loadindic, mvaultContinue, mvaultActionContent, "Communications problem with Server", "Sorry, there was a problem creating your account. Please contact our support department.<br/> +1 855-782-0628 ", "Contact Support", "http://help.pbs.org/");
      return false;
    } else {
      showFinalModal(loadindic, mvaultContinue, mvaultActionContent, retObj['ctaHeader'], retObj['ctaMsg'], retObj['ctaLabel'], retObj['nextUrl']);
    }
  }).fail(function(json) {
    console.log(json);
  });
}

/* MVaultConnect function */
var mVaultConnect = function(obj) {
  debugIt('MVault called');
  if (winHasJSON(obj) !== 'undefined') {
    var confirmationObject = {};
    confirmationObject['confirmationCode'] = obj['confirmationCode'];
    try {
      debugIt(confirmationObject);
      if (true === true ) {
        sendObj(confirmationObject);
      } 
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

 
/*** Rocket Fuel tracking function to connect to Kimbia ***/
var rocketFuelTracker = function(kimbiaObj) {

    var donationTypes = {
      donor: '20684247',
      sustainer: '20684249'
    };
    
    var w = window, d = document;
    var s = d.createElement('script');
    s.setAttribute('async', 'true');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', '//c1.rfihub.net/js/tc.min.js');
    var f = d.getElementsByTagName('script')[0];
    f.parentNode.insertBefore(s, f);
    if (typeof w['_rfi'] !== 'function') {
        w['_rfi']=function() {
            w['_rfi'].commands = w['_rfi'].commands || [];
            w['_rfi'].commands.push(arguments);
        };
    }
    _rfi('setArgs', 'ver', '9');
    _rfi('setArgs', 'rb', '4917');
    _rfi('setArgs', 'ca', donationTypes[kimbiaObj.donor]);
    _rfi('track');

    ga('send', 'event', 'Kimbia form', 'Rocketfuel trigger');

};

/* Google Analytics Universal */
var googleAnalyticsUniversalTracker = function(kimbiaObj) {


  // Require e-commerce plugin
  ga('require', 'ecommerce');

  // Add transaction
  ga('ecommerce:addTransaction', {
    'id':           kimbiaObj.confCode,     // transaction ID - required
    'affiliation':  kimbiaObj.formId,       // affiliation or store name
    'revenue':      kimbiaObj.initCharge,   // revenue amount - required
    'city':         kimbiaObj.city,         // city
    'zip':          kimbiaObj.zip,          // zip
    'country':      kimbiaObj.country,      // country
    
    // Custom dimensions
    'dimension1':   kimbiaObj.campaignId,     // CampaignID
    'dimension2':   kimbiaObj.donor,          // DonationType (donor/sustainer)
    'dimension3':   kimbiaObj.donationLevel,  // Premium
    'dimension4':   kimbiaObj.media           // Medium (tv/radio/website)
  });
  ga('ecommerce:addItem', {
    'id':           kimbiaObj.confCode,       // transaction ID - necessary to associate item with transaction
    'sku':          kimbiaObj.donor,          // sku code - DonationType (donor/sustainer)
    'name':         kimbiaObj.donationLevel,  // product name
    'category':     kimbiaObj.media,          // category name
    'price':        kimbiaObj.initCharge,     // unit-price
    'quantity':     '1'                       // quantity
  });

  // Send the e-commerce data
  ga('ecommerce:send');

  ga('send', 'event', 'Kimbia form', 'Google transaction trigger');

};


//HELPER FUNCTIONS FOR WIDGET DATA
function getValueByLabel(aSignup, labelText, sublabelText){
  for(var a = 0; a < aSignup.length; a++){
    var formAnswerObject = aSignup[a];
    if(formAnswerObject.questionLabel === labelText){
      if(sublabelText == null || sublabelText == '' || formAnswerObject.questionSubLabel == sublabelText) {
        return formAnswerObject.data;
      }
    }
  }
  // found none
  return '';
}

function getValidValue(val, opts){
  for(i=0; i<opts.length; i++){
    if(val.toLowerCase() == opts[i].toLowerCase())
      return opts[i];
  }

  return '';
}

function kimbiaComboTracker(widget){

  // MAP WIDGET VALUES TO LOCAL VARIABLES FOR GA & QC  
  var kimbiaObj = {};
  kimbiaObj['confCode']       = widget.confirmationCode;
  
  // REMOVE $ and thousands comma FOR GA & QC
  kimbiaObj['initCharge']     = widget.initialCharge.replace(',',''); // Universal Analytics ignores $ 
  kimbiaObj['donationLevel']  = getValueByLabel(widget.answers[0], 'Donation');
  kimbiaObj['city']           = getValueByLabel(widget.answers[0], 'Mailing Address','city');
  kimbiaObj['zip']            = getValueByLabel(widget.answers[0], 'Mailing Address','zipcode');
  kimbiaObj['country']        = getValueByLabel(widget.answers[0], 'Mailing Address','country');

  //MAPPING EXPECTATIONS FOR CHANNEL ID  = [campaign ID]/[FORM INFO]-[DONOR TYPE]-[MEDIA-TYPE]
  var donorOptions  = new Array('donor', 'sustainer');
  var mediaOptions  = new Array('tv', 'radio', 'website');

  var donor      = '';
  var media      = '';

  var chnlParts    = widget.channelId.split('/');
  kimbiaObj['campaignId']    = chnlParts[0];
  kimbiaObj['formId']      = chnlParts[1];

  var formParts    = kimbiaObj.formId.split('-');

  if(formParts.length >= 2) {
    kimbiaObj['donor'] = getValidValue(formParts[1], donorOptions);
  } else {
    kimbiaObj['donor'] = 'test donor';
  }

  if(formParts.length >= 3) {
    kimbiaObj['media']  = getValidValue(formParts[2], mediaOptions);
  } else {
    kimbiaObj['media'] = 'test media';
  }

//   googleAnalyticsUniversalTracker(kimbiaObj);
//   rocketFuelTracker(kimbiaObj);

// MVaultConnect takes the original Kimbia object, not the massaged one
  mVaultConnect(widget);
}

