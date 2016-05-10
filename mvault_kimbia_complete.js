/***
 * This file provides a connection from Kimbia to mvault. Once a Kimbia form is filled, it sends the information to MVault to request an activation code.
**/

/***
 * Load jquery if it doesn't exist
 */
if (typeof jQuery === 'undefined') {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = false;
  s.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js";
  document.getElementsByTagName('head')[0].appendChild(s);
}

//Error reporting
var _rollbarConfig = {
    accessToken: "b21be8f1b37d41d8a80cc2be662832ec",
    captureUncaught: true,
    payload: {
        environment: "test"
    }
};
!function(r){function o(e){if(t[e])return t[e].exports;var n=t[e]={exports:{},id:e,loaded:!1};return r[e].call(n.exports,n,n.exports,o),n.loaded=!0,n.exports}var t={};return o.m=r,o.c=t,o.p="",o(0)}([function(r,o,t){"use strict";var e=t(1).Rollbar,n=t(2);_rollbarConfig.rollbarJsUrl=_rollbarConfig.rollbarJsUrl||"https://d37gvrvc0wt4s1.cloudfront.net/js/v1.8/rollbar.min.js";var a=e.init(window,_rollbarConfig),i=n(a,_rollbarConfig);a.loadFull(window,document,!_rollbarConfig.async,_rollbarConfig,i)},function(r,o){"use strict";function t(r){return function(){try{return r.apply(this,arguments)}catch(o){try{console.error("[Rollbar]: Internal error",o)}catch(t){}}}}function e(r,o,t){window._rollbarWrappedError&&(t[4]||(t[4]=window._rollbarWrappedError),t[5]||(t[5]=window._rollbarWrappedError._rollbarContext),window._rollbarWrappedError=null),r.uncaughtError.apply(r,t),o&&o.apply(window,t)}function n(r){var o=function(){var o=Array.prototype.slice.call(arguments,0);e(r,r._rollbarOldOnError,o)};return o.belongsToShim=!0,o}function a(r){this.shimId=++s,this.notifier=null,this.parentShim=r,this._rollbarOldOnError=null}function i(r){var o=a;return t(function(){if(this.notifier)return this.notifier[r].apply(this.notifier,arguments);var t=this,e="scope"===r;e&&(t=new o(this));var n=Array.prototype.slice.call(arguments,0),a={shim:t,method:r,args:n,ts:new Date};return window._rollbarShimQueue.push(a),e?t:void 0})}function l(r,o){if(o.hasOwnProperty&&o.hasOwnProperty("addEventListener")){var t=o.addEventListener;o.addEventListener=function(o,e,n){t.call(this,o,r.wrap(e),n)};var e=o.removeEventListener;o.removeEventListener=function(r,o,t){e.call(this,r,o&&o._wrapped?o._wrapped:o,t)}}}var s=0;a.init=function(r,o){var e=o.globalAlias||"Rollbar";if("object"==typeof r[e])return r[e];r._rollbarShimQueue=[],r._rollbarWrappedError=null,o=o||{};var i=new a;return t(function(){if(i.configure(o),o.captureUncaught){i._rollbarOldOnError=r.onerror,r.onerror=n(i);var t,a,s="EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");for(t=0;t<s.length;++t)a=s[t],r[a]&&r[a].prototype&&l(i,r[a].prototype)}return r[e]=i,i})()},a.prototype.loadFull=function(r,o,e,n,a){var i=function(){var o;if(void 0===r._rollbarPayloadQueue){var t,e,n,i;for(o=new Error("rollbar.js did not load");t=r._rollbarShimQueue.shift();)for(n=t.args,i=0;i<n.length;++i)if(e=n[i],"function"==typeof e){e(o);break}}"function"==typeof a&&a(o)},l=!1,s=o.createElement("script"),u=o.getElementsByTagName("script")[0],p=u.parentNode;s.crossOrigin="",s.src=n.rollbarJsUrl,s.async=!e,s.onload=s.onreadystatechange=t(function(){if(!(l||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState)){s.onload=s.onreadystatechange=null;try{p.removeChild(s)}catch(r){}l=!0,i()}}),p.insertBefore(s,u)},a.prototype.wrap=function(r,o){try{var t;if(t="function"==typeof o?o:function(){return o||{}},"function"!=typeof r)return r;if(r._isWrap)return r;if(!r._wrapped){r._wrapped=function(){try{return r.apply(this,arguments)}catch(o){throw o._rollbarContext=t()||{},o._rollbarContext._wrappedSource=r.toString(),window._rollbarWrappedError=o,o}},r._wrapped._isWrap=!0;for(var e in r)r.hasOwnProperty(e)&&(r._wrapped[e]=r[e])}return r._wrapped}catch(n){return r}};for(var u="log,debug,info,warn,warning,error,critical,global,configure,scope,uncaughtError".split(","),p=0;p<u.length;++p)a.prototype[u[p]]=i(u[p]);r.exports={Rollbar:a,_rollbarWindowOnError:e}},function(r,o){"use strict";r.exports=function(r,o){return function(t){if(!t&&!window._rollbarInitialized){var e=window.RollbarNotifier,n=o||{},a=n.globalAlias||"Rollbar",i=window.Rollbar.init(n,r);i._processShimQueue(window._rollbarShimQueue||[]),window[a]=i,window._rollbarInitialized=!0,e.processPayloads()}}}}]);

/** Station data  **/
var MSB = MSB || (function() {
  var supportMessaging = "Sorry, there was a problem creating your account. <br />Please contact PBS support toll free at ";
  theObject = this;
  this.stationId = '';
  return {
    init : function(stationId, styleConfig) {
      this.stationId = stationId;
      this.styleOptions = {};
      
      // Set default theme to light
      if (typeof(styleConfig) !== 'object' ||
          ['light', 'dark'].indexOf(styleConfig.theme) < 0) {
        this.styleOptions.theme = 'light';
      }  else {
        this.styleOptions.theme = styleConfig.theme;
      }

      this.setTheme();
      if (typeof(styleConfig) === 'object') {
        jQuery.extend(this.styleOptions, styleConfig);
      }
    },
    salesForceURL: function(stationID) {
      return this.data[this.stationId].salesForceUrl;
    },
    data: {
      WGBH: {
        salesForceUrl: 'https://mywgbh.secure.force.com/passport/services/apexrest/mvcms/v2.0/provision/a4531000000RzijAAC',
        phoneSupport:  supportMessaging + '844-421-3579'
      },
      NHPTV: {
        salesForceUrl: 'https://mywgbh.secure.force.com/passport/services/apexrest/mvcms/v2.0/provision/a4531000000RzioAAC',
        phoneSupport: supportMessaging + '844-326-6219'
      },
      WGBY: {
        salesForceUrl: 'https://mywgbh.secure.force.com/passport/services/apexrest/mvcms/v2.0/provision/a4531000000RzitAAC',
        phoneSupport: supportMessaging + '855-329-4292'
      }
    },
    setTheme: function() {
      // Set universal properties
      this.styleOptions.stationFont = 'Helvetica, Arial, sans-serif';
      this.styleOptions.stationFontWeight = 'bold';
      this.styleOptions.textFont = 'Helvetica, Arial, sans-serif';
      this.styleOptions.modalZIndex = 10000;
      
      if (this.styleOptions.theme === 'light') {
        this.styleOptions.stationFontColor      = '#000000';
        this.styleOptions.textFontColor         = '#000000';
        this.styleOptions.panelBackgroundColor  = '#ffffff';
        this.styleOptions.modalBackground       = 'rgba(0,0,0,0.8)';
      } else if (this.styleOptions.theme === 'dark') {
        this.styleOptions.stationFontColor      = '#eeeeee';
        this.styleOptions.textFontColor         = '#eeeeee';
        this.styleOptions.panelBackgroundColor  = '#333333';
        this.styleOptions.modalBackground       = 'rgba(255,255,255,0.8)';
      }
    }, 
    errorMsg:  {
      phone:  function() {
        return 
      },
      helpUrl: "http://help.pbs.org/"
    }
  };
}());   


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
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  jQuery("body").append('<div id="mvaultModal"></div>');
  jQuery('#mvaultModal').css({ background: MSB.styleOptions.modalBackground + ' url(https://msb-static.wgbh.org/msb/loading.svg) no-repeat 49% 49%', position: 'fixed', left: '0', top: '0', width: '100%', height: '100%', zIndex: 10000, textAlign: 'center' });
  document.body.scrollTop = document.documentElement.scrollTop = 0;
}

// Display the result of the activation attempt
function showFinalModal(ctaHeader, ctaMsg, ctaLabel, nextUrl) {
  // Remove loading spinner
  jQuery('#mvaultModal').css({ backgroundImage: 'none' });
  jQuery('#mvaultModal').append('<div id="mvaultResponse"></div>');  
  // Insert response pane with response
  var responsePanel = "<div id='membershipVaultRtProvResp' class='mVRtPR'>";
  responsePanel +=    "  <div style='font-size: 3em; color: " + MSB.styleOptions.stationFontColor + ";'>";
  responsePanel +=    "    <img src='https://msb-static.wgbh.org/msb/passport_compass_rose.svg' style='height:1em; vertical-align: text-middle' />";
  responsePanel +=    "    <span style='display: inline-block; margin-left: 0.25em;font-family: " + MSB.styleOptions.stationFont + "; font-weight: " + MSB.styleOptions.stationFontWeight + "'>" + MSB.stationId + "</span>";
  responsePanel +=    "    | Passport</div>";
  responsePanel +=    "  <h3> " + ctaHeader + " </h3>";
  responsePanel +=    "  <p> " + ctaMsg + " </p>";
  responsePanel +=    "  <a class='button button-activate' href='" + nextUrl + "' target='_blank' style='display: inline-block; padding: 6px 9px; background-color: #00aaeb; color: white; border-radius: 5px; text-transform: uppercase; font-weight: bold; text-decoration: none;' >" + ctaLabel + "</a>";
  responsePanel +=    "</div>";
  jQuery('#mvaultResponse').html(responsePanel);

  if (typeof(nextUrl) !== 'undefined') {
    var arr = nextUrl.match(/(\w+-\w+-\w+-\w+)$/)
    if (arr) {
      jQuery('#membershipVaultRtProvResp').append("<p>OR activate later by entering your activation code: <br /><strong>" + arr[0] + "</strong><br />at <em>pbs.org/passport</em></p>");
    }
  }
  jQuery('#mvaultResponse').css({ color: MSB.styleOptions.textFontColor, backgroundColor: MSB.styleOptions.panelBackgroundColor, width: '40%', minWidth: '300px', margin: '60px auto', lineHeight: '1.6', borderRadius: '0.5em', padding: '15px', boxShadow: '3px 3px 3px rgba(160, 160, 160, 0.5)'});
}

// Send Kimbia data for activation
function sendObj(obj) {

  displayOverlay();

  var station = MSB.stationId;
  var mvaultUrl = MSB.data[station].salesForceUrl;
  var clientData = (station == 'TEST') ? {} : obj;

  jQuery.ajax({
    url: mvaultUrl,
    data: clientData,
    method: "GET",
  }).done(function(json) {
    var retObj = JSON.parse(json);
    
    if (retObj['provisioning'] === 'undefined') {
      Rollbar.error("Provisioning failed: ", json);
      showFinalModal("Communications problem with server", MSB.data[MSB.stationId].phoneSupport, "Online Support", MSB.helpUrl);
      return false;
    } else {
      showFinalModal(retObj['ctaHeader'], retObj['ctaMsg'], retObj['ctaLabel'], retObj['nextUrl']);
    }
  }).fail(function(json) {
      Rollbar.error("Total failure: ", json);
      showFinalModal("No response from  server", MSB.data[MSB.stationId].phoneSupport, "Online Support", MSB.helpUrl);
  });
}

//Get the email from the Kimbia form - it's in the answer array, and we don't know the question order of the array
function getKimbiaEmail(kObj) {
  //Loop over answer labels to get email question
  var email = '';
  for (var i=0; i < kObj.answers[0].length; i++) {
    if (kObj.answers[0][i].questionName.match(/email/i)) {
      email = kObj.answers[0][i].data;
      break;
    }
  }
  return email; 
}

/* MVaultConnect function */
var mVaultConnect = function(kimbiaData) {
  if (winHasJSON(kimbiaData) !== 'undefined') {
    var confirmationObject = {};
    confirmationObject['email'] = getKimbiaEmail(kimbiaData);
    if (confirmationObject['email'] == '') {
      Rollbar.error("No email found in the donation form.");
    }
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

  // MVaultConnect takes the Kimbia object returned by the form
  mVaultConnect(kimbiaData);
  
 // Insert other functions which should be called after the Kimbia form is completed here (e.g. analytics triggers, etc.) 
 
 
}

