/***
 * This file replaces wgbh_kimbia_comboTrackerV2.js
 * It provides actions to take once Kimbia fires the onComplete callback for the form
 * As of 8/3/2015 it contains calls for 3 services:
 * - Passport membership link
 * - Rocket Fuel
 * - Google Analytics
**/

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

function showFinalModal(ctaHeader, ctaMsg, ctaLabel, nextUrl) {
  console.log('Showing final');
  if (true === true ) {
    // Remove loading spinner
    $('#mvaultModal').empty().append('<div id="mvaultResponse"></div>');
    $('#mvaultResponse').html("<div id='membershipVaultRtProvResp' class='mVRtPR'><img src='https://rmpbs.secure.force.com/support/resource/1455151540000/RMPBSPassportLogo' style='max-width:100%; height:auto' /><h3> " + ctaHeader + " </h3><p> " + ctaMsg + " </p> <a class='button button-activate' href='" + nextUrl + "' target='_blank'  >" + ctaLabel + "</a></div>");
    $('#mvaultResponse').css({ backgroundColor: '#fff', width: '33%', minWidth: '300px', margin: '30px auto', borderRadius: '0.5em', padding: '15px'});
  }
}

function sendObj(obj) {
  console.log('Sending');
  $('.output').text('Using test URL');
  $("body").append('<div id="mvaultModal"></div>');
  $('#mvaultModal').css({ backgroundColor:'rgba(0,0,0,0.8)', position: 'absolute', left: '0', top: '0', width: '100%', height: '100%' });
  $('#mvaultModal').html('<div class="loading"><i class="fa fa-spinner fa-2x fa-spin"></i></div>');
  $('#mvaultModal .loading').css({ color: 'white', position: 'absolute', left: '49%', top: '49%' });
  var actualUrl = "https://rmpbs.secure.force.com/support/services/apexrest/mvconnext_rtprv/v1.0/provision/kimbia";
  var actualData = obj;
  var testUrl   = "https://uat-mywgbh.cs25.force.com/tm/services/apexrest/mvcms/v2.0/provision/a4D1b000000Cx2EEAS?email=cate.twohill@gmail.com&confirmationCode=FJ5SNS0"
  var testData = {};
  console.log('Ajax request');
  $.ajax({
    url: testUrl,
    data: testData,
    method: "GET",
  }).done(function(json) {
    var retObj = JSON.parse(json);
    console.log('Ajax request done');
    console.log(retObj);
    if (retObj['provisioning'] === 'undefined') {
      Rollbar.error("Provisioning failed: ", json);
      showFinalModal("Communications problem with server", "Sorry, there was a problem creating your account. Please contact our support department.<br/> +1 855-782-0628 ", "Contact Support", "http://help.pbs.org/");
      console.log('Ajax request bad data');
      return false;
    } else {
      showFinalModal(retObj['ctaHeader'], retObj['ctaMsg'], retObj['ctaLabel'], retObj['nextUrl']);
      console.log('Ajax request success');
    }
  }).fail(function(json) {
      Rollbar.error("Total failure: ", json);
      showFinalModal("No response from  server", "Sorry, there was a problem creating your account. Please contact our support department.<br/> +1 855-782-0628 ", "Contact Support", "http://help.pbs.org/");
      console.log('Ajax request failure');
  });
}

/* MVaultConnect function */
var mVaultConnect = function(obj) {
  console.log('MVault called');
  if (winHasJSON(obj) !== 'undefined') {
    var confirmationObject = {};
    confirmationObject['confirmationCode'] = obj['confirmationCode'];
    try {
      console.log(confirmationObject);
      if (true === true ) {
        sendObj(confirmationObject);
      } 
    } catch (err) { 
      console.log('Utter failure');
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

