MSB Passport How-to
-------------------

- Create a page which loads Kimbia donation form, with 'passport' in the name. It must include an oncomplete parameter which specifies the passport function callback. 
  e.g. <script src='https://widgets.kimbia.com/widgets/form.js?channel=pbspassporttest/passporttest&oncomplete=kimbiaOnComplete'></script>


- Just above the body tag, add the following:

<script src="https://msb-static.wgbh.org/msb/mvault_kimbia_complete.js"></script>
<script>
  var stationData = {
    stationId: '<YOUR STATION SHORT NAME HERE>',
    mVaultUrl: '<YOUR MVAULT URL HERE>','https://uat-mywgbh.cs25.force.com/tm/services/apexrest/mvcms/v2.0/provision/a4D1b000000Cx2EEAS?email=cate.twohill@gmail.com&confirmationCode=FJ5SNS0',
    phoneSupport: '<YOUR PBS SUPPORT # HERE>'
  };  
  MSB.init(stationData, options); 
</script>


********************************************

NOTES:

- stationData example:
var stationData = {
  stationId: 'WGBH',
  mVaultUrl: 'https://wgbh.cs77.force.com/tm/services/apexrest/mvcms/v2.0/provision/a4abbbbcc2EEAS',
  phoneSupport: '888-555-1212'
};  

options argument:

The options argument is a javascript object and is NOT REQUIRED

- You have options for two different themes: 
  - 'light' = white message modal with dark overlay (DEFAULT)
  - 'dark'  = dark message modal with white overlay
  
So if the options argument is left out, the light theme is automatically selected.
  
- Customizable CSS options for styling and defaults:
UNIVERSAL
  stationFont:          'Helvetica, Arial, sans-serif'
  stationFontWeight:    'bold'
  textFont:             'Helvetica, Arial, sans-serif'
  modalZIndex:           10000
      
light THEME     
  stationFontColor:     '#000000'
  textFontColor:        '#000000'
  panelBackgroundColor: '#ffffff'
  modalBackground:      'rgba(0,0,0,0.8)'
  
dark THEME     
  stationFontColor:     '#eeeeee'
  textFontColor:        '#eeeeee'
  panelBackgroundColor: '#333333'
  modalBackground:      'rgba(255,255,255,0.8)'

