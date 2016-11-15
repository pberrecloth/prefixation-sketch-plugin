
// Replace path prefix
var onRun = function(context) {
  var doc = context.document

  var options = collatePrefixes(context)

  var selectedLayers = context.selection;
  var loop = selectedLayers.objectEnumerator();

  var prefix = createSelect('Choose or add a path prefix to apply',options, 1)
  if (prefix[0]==1001){ // Cancel button was pressed
    return
  }
  var prefix = prefix[1]

  while (layer = loop.nextObject()) {
    layerName = layer.name().split("/").pop().trim();
    layer.setName(prefix + layerName);
  }
};


function createSelect(msg, items, selectedItemIndex){
  selectedItemIndex = selectedItemIndex || 0

  var accessory = NSComboBox.alloc().initWithFrame(NSMakeRect(0,0,200,25))
  accessory.addItemsWithObjectValues(items)
  accessory.selectItemAtIndex(selectedItemIndex)

  var alert = NSAlert.alloc().init()
  alert.setMessageText(msg)
  alert.addButtonWithTitle('OK')
  alert.addButtonWithTitle('Cancel')
  alert.setAccessoryView(accessory)

  var responseCode = alert.runModal()
  var sel = accessory.indexOfSelectedItem()
  var value = accessory.objectValue()

  return [responseCode, value]
}

// Gather all existing prefixes from doc and spit out a list
function collatePrefixes(context){
  var doc = context.document
  var page = [doc currentPage];
  var layers = [page children];
  var prefixList = []

  // Loop through each layer on the page
  for (var i=0; i<[layers count]; i++) {
    var layer = layers[i];
    // var layerName = layer.name()

    var layerPrefix = layer.name().split("/").slice(0, -1).join("/").trim();
    if (layerPrefix) {
      prefixList.push(layerPrefix + " / ");
    }
  }
  // Return and remove duplicates
  return prefixList.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
}
