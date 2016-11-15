
// Replace path prefix
var onRun = function(context) {
  var doc = context.document
  selection = context.selection
  selectionCount = selection.count()

  if (selectionCount <= 0) {
    doc.showMessage("Select at least one layer.")
    return
  }

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
  var itemsCount = items.length

  var accessory = NSComboBox.alloc().initWithFrame(NSMakeRect(0,0,200,25))
  accessory.addItemsWithObjectValues(items)
  accessory.selectItemAtIndex(selectedItemIndex)

  var alert = NSAlert.alloc().init()
  alert.setMessageText(msg)
  alert.setInformativeText(itemsCount + " prefix(es) found in this document")
  alert.addButtonWithTitle('OK')
  alert.addButtonWithTitle('Cancel')
  alert.setAccessoryView(accessory)

  var responseCode = alert.runModal()
  var sel = accessory.indexOfSelectedItem()
  var value = accessory.objectValue()

  return [responseCode, value]
}

// Look at all layers in doc and spit out a list of prefixes
function collatePrefixes(context){
  var doc = context.document
  var pages = [doc pages];
  var prefixList = []

  // Loop through pages
  for (var i=0; i<[pages count]; i++) {
    var page = pages[i];
    var layers = [page children];
    // Loop through layers
    for (var j=0; j<[layers count]; j++) {
      var layer = layers[j];
      var layerPrefix = layer.name().split("/").slice(0, -1).join("/").trim();
      if (layerPrefix) {
        prefixList.push(layerPrefix + " / ");
      }
    }
  }

  // Removes duplicates and returns list
  return prefixList.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
}
