
// Artboard to Image Data

function layerToImageData(layer) {

	var format = MSExportFormat.formatWithScale_name_fileFormat(1.0, 'export', 'png')
	var request = MSExportRequest.exportRequestsFromExportableLayer_exportFormats_useIDForName(layer, [format], false)[0]

	var colorSpace = NSColorSpace.sRGBColorSpace()
	var data = MSExporter.exporterForRequest_colorSpace(request, colorSpace).data()

	return data
}


// User Interactions

function createLabel( text, fontSize, bold, frame ) {
  var label = NSTextField.alloc().initWithFrame( frame );
  label.setStringValue( text );
  label.setFont( ( bold ) ? NSFont.boldSystemFontOfSize( fontSize ) : NSFont.systemFontOfSize( fontSize ) );
  label.setBezeled( false );
  label.setDrawsBackground( false );
  label.setEditable( false );
  label.setSelectable( false );

  return label;
}

function createBoardWindow(context, board) {
  var alert = COSAlertWindow.new();
  var width = 400;
  var freeSpace = width - 100;

  alert.addButtonWithTitle( 'Upload' );
  alert.addButtonWithTitle( 'Cancel' );
  alert.setMessageText( 'Sketch Conceptboard' );
  alert.setInformativeText( 'Set your Conceptboard Board link to upload all Artboards.' );
  alert.setIcon( NSImage.alloc().initByReferencingFile( context.plugin.urlForResourceNamed( 'icon@2x.png' ).path() ) );

  var mainView = NSView.alloc().initWithFrame( NSMakeRect( 0, 0, width, 100 ) );
  var boardLabel = createLabel( 'Board Link', 12, true, NSMakeRect( 0, 70, freeSpace, 20 ) );
  var boardTextfield = NSTextField.alloc().initWithFrame( NSMakeRect( 0, 45, freeSpace, 50 ) );
  boardTextfield.setStringValue( board || '' );


  mainView.addSubview( boardLabel );
  mainView.addSubview( boardTextfield );

  alert.addAccessoryView( mainView );

  var inputs = [ boardTextfield ];
  return [ alert, inputs ];
}

function createSettingsWindow(context, email, password) {
  var alert = COSAlertWindow.new();
  var width = 400;
  var freeSpace = width - 100;

  alert.addButtonWithTitle( 'Save' );
  alert.addButtonWithTitle( 'Cancel' );
  alert.setMessageText( 'Sketch Conceptboard' );
  alert.setInformativeText( 'Set your Conceptboard Login to sync Sketch with your Conceptboard.' );
  alert.setIcon( NSImage.alloc().initByReferencingFile( context.plugin.urlForResourceNamed( 'icon@2x.png' ).path() ) );

  var mainView = NSView.alloc().initWithFrame( NSMakeRect( 0, 0, width, 150 ) );
  var emailLabel = createLabel( 'Email Address', 12, true, NSMakeRect( 0, 120, freeSpace, 20 ) );
  var emailTextfield = NSTextField.alloc().initWithFrame( NSMakeRect( 0, 95, freeSpace, 25 ) );
  emailTextfield.setStringValue( email || '' );

  var passwordLabel = createLabel( 'Password', 12, true, NSMakeRect( 0, 60, freeSpace, 20 ) );
  var passwordTextfield = NSSecureTextField.alloc().initWithFrame( NSMakeRect( 0, 35, freeSpace, 25 ) );
  passwordTextfield.setStringValue( password || '' );

  mainView.addSubview( emailLabel );
  mainView.addSubview( emailTextfield );

  mainView.addSubview( passwordLabel );
  mainView.addSubview( passwordTextfield );

  alert.addAccessoryView( mainView );

  var inputs = [ emailTextfield, passwordTextfield ];
  return [ alert, inputs ];
}


// App Logs

// function createLogBox(frame) {
//   var logBox = NSTextView.alloc().initWithFrame(frame);

//   logBox.setEditable(false);
//   logBox.setSelectable(true);
//   logBox.string = ''

//   return logBox;
// }

// function createReportWindow(context) {
//   var report = COSAlertWindow.new();
//   var width = 400;
//   var freeSpace = width - 100;

//   report.addButtonWithTitle( 'Ok' );
//   report.setMessageText( 'Sketch Conceptboard' );
//   report.setInformativeText( 'Artboards are being uploaded into your Conceptboard' );
//   report.setIcon( NSImage.alloc().initByReferencingFile( context.plugin.urlForResourceNamed( 'icon@2x.png' ).path() ) );

//   var mainView = NSView.alloc().initWithFrame( NSMakeRect( 0, 0, width, 250 ) );
//   var logBox = createLogBox(NSMakeRect( 0, 0, freeSpace, 250 ) );

//   mainView.addSubview( logBox );
//   report.addAccessoryView( mainView );

//   return [report, logBox];
// }

// function appendToReportWindow(logBox, logLine) {
//   logBox.string += '\n' + logLine
//   log('Adding log ' + logLine)
// }
