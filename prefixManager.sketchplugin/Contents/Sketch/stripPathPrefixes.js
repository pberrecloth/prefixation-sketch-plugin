var onRun = function(context) {
    var selectedLayers = context.selection;
    var loop = selectedLayers.objectEnumerator();
    while (layer = loop.nextObject()) {
            var layerName = layer.name();
            layerName = layerName.split("/").pop().trim();
            layer.setName(layerName);
    }
};
