@import 'calls.js'
@import 'utils.js'


function uploadCurrent(context) { 
  var doc = context.document
  var [nonce, board] = prepareUpload(context)

  if (!nonce) {
    doc.showMessage('Error during prepareUpload()')
    return
  }

  // 5. Upload current Page and Artboards/Groups/Layers
  var page = doc.currentPage()
  if (page) {
    uploadPage(nonce, board, page, 0, 0)
  }
}

function uploadAll(context) {
  var doc = context.document
  var [nonce, board] = prepareUpload(context)

  if (!nonce) {
    doc.showMessage('Error during prepareUpload()')
    return
  }

  // 5. Loop all Pages and Artboards/Groups/Layers
  var offsetY = 0

  var pages = doc.pages().objectEnumerator()
  while (page = pages.nextObject()) {
    if (page.name() == 'Symbols' || page.name().startsWith('_')) continue

    var [pageOffsetX, pageOffsetY] = getPageOffset(page)

    uploadPage(nonce, board, page, pageOffsetX, offsetY + pageOffsetY)

    offsetY = offsetY + pageOffsetY + getPageHeight(page) + 250
  }
}

function uploadPage(nonce, board, page, offsetX, offsetY) {
  // 5.1. Draw all Layers
  var layers = page.layers().objectEnumerator()
  while (layer = layers.nextObject()) {

    // 5.1.1. Layer to ImageData
    var imageData = layerToImageData(layer)

    // 5.1.2. Upload on Board
    if (layer.isArtboard) {
      postImage(nonce, board, imageData, layer.name(), layer.frame().x() + offsetX, layer.frame().y() + offsetY, 0)
    } else {
      postImage(nonce, board, imageData, layer.name(), layer.frame().x() + offsetX, layer.frame().y() + offsetY, 1)
    }
  }
}

function prepareUpload(context) {
  var doc = context.document

  // 0. Check for Settings
  var last_email = NSUserDefaults.standardUserDefaults().objectForKey('email')
  var last_password = NSUserDefaults.standardUserDefaults().objectForKey('password')

  if (!last_email || !last_password) {
    doc.showMessage('Setup your Settings before upload')
    return [null, null]
  }
  
  // 1. Get CSRF Token
  var csrfToken = getCSRFToken()

  if (!csrfToken) {
    doc.showMessage('Error during getCSRFToken()')
    return [null, null]
  }
  
  // 2. Get Authentication Token
  var authenticated = getAuthToken(csrfToken, last_email, last_password)

  if (!authenticated) {
    doc.showMessage('Error during getAuthToken()')
    return [null, null]
  }

  // 3. Get Board Link
  var last_board = context.command.valueForKey_onDocument_forPluginIdentifier('board', doc.documentData(), 'conceptboard')
  var popup = createBoardWindow(context, last_board)

  var alert = popup[0]
  var inputs = popup[1]
  var response = alert.runModal()

  if ( response === 1000 ) {
    var board = inputs[0].stringValue()
    context.command.setValue_forKey_onDocument_forPluginIdentifier(board, 'board', doc.documentData(), 'conceptboard')
  } else {
    doc.showMessage('Error during createBoardWindow()')
    return [null, null]
  }

  // 4. Get Board Nonce
  var [nonce, board] = getBoardNonce(board)

  if (!nonce) {
    doc.showMessage('Error during getBoardNonce()')
    return [null, null]
  }

  return [nonce, board]
}

function getPageOffset(page) {
  var offsetX = 0
  var offsetY = 0

  var layers = page.layers().objectEnumerator()
  while (layer = layers.nextObject()) {

    offsetX = Math.min(offsetX, layer.frame().x())
    offsetY = Math.min(offsetY, layer.frame().y())
  }

  return [Math.abs(offsetX), Math.abs(offsetY)]
}

function getPageHeight(page) {
  var minY = 0
  var maxY = 0

  var layers = page.layers().objectEnumerator()
  while (layer = layers.nextObject()) {

    minY = Math.min(minY, layer.frame().y())
    maxY = Math.max(maxY, layer.frame().y() + layer.frame().height())
  }

  return maxY - minY
}

