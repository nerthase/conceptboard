// Login

function webGetHome() {
  var request = NSMutableURLRequest.new();
  [request setURL:[NSURL URLWithString:"https://app.conceptboard.com/login-redirect"]];
  [request setHTTPMethod:@"GET"];

  var error = NSError.new();
  var responseCode = null;

  var oResponseData = [NSURLConnection sendSynchronousRequest:request returningResponse:responseCode error:error];

  var dataString = [[NSString alloc] initWithData:oResponseData encoding:NSUTF8StringEncoding];
  
  return dataString;
}

function webDoLogin(csrfToken, username, password) {
  var body = [NSString stringWithFormat:@"csrftoken=%@&j_username=%@&j_password=%@", csrfToken, username, password];

  var request = NSMutableURLRequest.new();
  [request setURL:[NSURL URLWithString:"https://app.conceptboard.com/login"]];
  [request setHTTPMethod:@"POST"];
  [request setHTTPBody:[body dataUsingEncoding:NSUTF8StringEncoding]];

  var error = NSError.new();
  var responseCode = null;

  var oResponseData = [NSURLConnection sendSynchronousRequest:request returningResponse:responseCode error:error];

  var dataString = [[NSString alloc] initWithData:oResponseData encoding:NSUTF8StringEncoding];

  return dataString;
}


// Board

function webViewBoard(board) {
  var request = NSMutableURLRequest.new();
  [request setURL:[NSURL URLWithString:board]];
  [request setHTTPMethod:@"GET"];

  var error = NSError.new();
  var responseCode = null;

  var oResponseData = [NSURLConnection sendSynchronousRequest:request returningResponse:responseCode error:error];

  var dataString = [[NSString alloc] initWithData:oResponseData encoding:NSUTF8StringEncoding];
  
  return dataString;
}


function webUpload(nonce, board, imageData, name, x, y, z) {
  var boundary = @"----WebKitFormBoundaryOlXZRCFToLUC2Aea";
  
  var body = [NSMutableData data];

  // Add image (stringWithString needed for escaping issues)
  var fieldName = @"file";
  var filename  = name;
  var data      = imageData;
  var mimetype  = @"image/png";

  [body appendData:[[NSString stringWithFormat:@"--%@\r\n", boundary] dataUsingEncoding:NSUTF8StringEncoding]];
  [body appendData:[[NSString stringWithFormat:[NSString stringWithString:'Content-Disposition: form-data; name=\"%@\"; filename=\"%@\"\r\n'], fieldName, filename] dataUsingEncoding:NSUTF8StringEncoding]];
  [body appendData:[[NSString stringWithFormat:@"Content-Type: %@\r\n\r\n", mimetype] dataUsingEncoding:NSUTF8StringEncoding]];
  [body appendData:data];
  [body appendData:[@"\r\n" dataUsingEncoding:NSUTF8StringEncoding]];

  // Add params (stringWithString needed for escaping issues)
  [body appendData:[[NSString stringWithFormat:@"--%@\r\n", boundary] dataUsingEncoding:NSUTF8StringEncoding]];
  [body appendData:[[NSString stringWithString:'Content-Disposition: form-data; name=\"addTo\"\r\n\r\n'] dataUsingEncoding:NSUTF8StringEncoding]];
  [body appendData:[[NSString stringWithFormat:@"%@\r\n", board] dataUsingEncoding:NSUTF8StringEncoding]];

  [body appendData:[[NSString stringWithFormat:@"--%@\r\n", boundary] dataUsingEncoding:NSUTF8StringEncoding]];
  [body appendData:[[NSString stringWithString:'Content-Disposition: form-data; name=\"name\"\r\n\r\n'] dataUsingEncoding:NSUTF8StringEncoding]];
  [body appendData:[[NSString stringWithFormat:@"%@\r\n", name] dataUsingEncoding:NSUTF8StringEncoding]];

  [body appendData:[[NSString stringWithFormat:@"--%@\r\n", boundary] dataUsingEncoding:NSUTF8StringEncoding]];
  [body appendData:[[NSString stringWithString:'Content-Disposition: form-data; name=\"importPositionX\"\r\n\r\n'] dataUsingEncoding:NSUTF8StringEncoding]];
  [body appendData:[[NSString stringWithFormat:@"%@\r\n", x] dataUsingEncoding:NSUTF8StringEncoding]];

  [body appendData:[[NSString stringWithFormat:@"--%@\r\n", boundary] dataUsingEncoding:NSUTF8StringEncoding]];
  [body appendData:[[NSString stringWithString:'Content-Disposition: form-data; name=\"importPositionY\"\r\n\r\n'] dataUsingEncoding:NSUTF8StringEncoding]];
  [body appendData:[[NSString stringWithFormat:@"%@\r\n", y] dataUsingEncoding:NSUTF8StringEncoding]];

  [body appendData:[[NSString stringWithFormat:@"--%@\r\n", boundary] dataUsingEncoding:NSUTF8StringEncoding]];
  [body appendData:[[NSString stringWithString:'Content-Disposition: form-data; name=\"importZIndex\"\r\n\r\n'] dataUsingEncoding:NSUTF8StringEncoding]];
  [body appendData:[[NSString stringWithFormat:@"%@\r\n", z] dataUsingEncoding:NSUTF8StringEncoding]];

  [body appendData:[[NSString stringWithFormat:@"--%@--\r\n", boundary] dataUsingEncoding:NSUTF8StringEncoding]];

  // Request
  var request = NSMutableURLRequest.new();
  [request setURL:[NSURL URLWithString:"https://app.conceptboard.com/__/inbox"]];
  [request setHTTPMethod:@"POST"];
  [request addValue:nonce forHTTPHeaderField:@"X-CB-CSRF"]
  [request addValue:@"true" forHTTPHeaderField:@"X-is-ajax-call"]
  [request setValue:[NSString stringWithFormat:@"multipart/form-data; boundary=%@", boundary] forHTTPHeaderField: @"Content-Type"];
  [request setHTTPBody:body];

  var error = NSError.new();
  var responseCode = null;

  var oResponseData = [NSURLConnection sendSynchronousRequest:request returningResponse:responseCode error:error];

  var dataString = [[NSString alloc] initWithData:oResponseData encoding:NSUTF8StringEncoding];
  dataString = [dataString stringByReplacingOccurrencesOfString:@"{}&&" withString:@""];

  return JSON.parse( dataString );
}
