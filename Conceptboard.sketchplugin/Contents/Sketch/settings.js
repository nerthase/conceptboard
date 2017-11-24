@import 'utils.js';

function settings(context) {
  var doc = context.document

  var last_email = NSUserDefaults.standardUserDefaults().objectForKey('email')
  var last_password = NSUserDefaults.standardUserDefaults().objectForKey('password')

  var popup = createSettingsWindow(context, last_email, last_password)

  var alert = popup[0];
  var inputs = popup[1];
  var response = alert.runModal();

  // save button was pressed
  if ( response === 1000 ) {
    var email = inputs[0].stringValue()
    var password = inputs[1].stringValue()
    NSUserDefaults.standardUserDefaults().setObject_forKey(email, 'email')
    NSUserDefaults.standardUserDefaults().setObject_forKey(password, 'password')
  }
}