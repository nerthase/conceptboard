@import 'requests.js'


// Login

function getCSRFToken() {
  var html = webGetHome()

  var match = /<input type="hidden" name="csrftoken" value="(.*?)"\/>/.exec(html)
  
  if (match.length == 2) {
    return match[1]
  }

  return null
}

function getAuthToken(csrfToken, username, password) {
  var html = webDoLogin(csrfToken, username, password)

  var match = /user-is-logged-in/.exec(html)

  return match.length > 0
}


// Board

function getBoardNonce(board) {
  var html = webViewBoard(board)

  var m1 = /nonce.*?'(.*?)',/.exec(html)  // Nonce
  var m2 = /"id":"(.*?)","title"/.exec(html)  // Board identifier
  
  if (m1.length == 2 && m2.length == 2) {
    return [m1[1], m2[1]]
  }

  return [null, null]
}

function postImage(nonce, board, imageData, name, x, y, z) {
  var json = webUpload(nonce, board, imageData, name, x, y, z)

  return json
}