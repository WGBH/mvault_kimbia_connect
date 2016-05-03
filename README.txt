MSB Passport How-to
-------------------

- Create a page which loads Kimbia donation form, with 'passport' in the name. It must include an oncomplete parameter which specifies the passport function callback. 
  e.g. <script src='https://widgets.kimbia.com/widgets/form.js?channel=pbspassporttest/passporttest&oncomplete=kimbiaOnComplete'></script>


- Just above the body tag, add the following:

<script src="https://msb-static.wgbh.org/msb/mvault_kimbia_complete.js"></script>
<script>
  var options = {
    theme: 'light'
  };
  MSB.init('<YOUR STATION SHORT NAME HERE>', options);  // Argument: this should be your station brand, e.g. Vegas PBS, WGBH, NHPTV 
</script>


- Change <YOUR STATION SHORT NAME HERE> as appropriate: NHPTV, WGBY, etc.

- You have options for two different themes: 
  - 'light' = white message modal with dark overlay
  - 'dark'  = dark message modal with white overlay
  
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

