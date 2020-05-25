(function($){
$.gridCreator = function (element, options) {

    var defaults = {
        'gridClass': 'grid-block',
        'activeClass': 'active',
        'cols': '15',
        'rows': '12',
        'startCol': '0',
        'startRow': '0',
        'onUpdate': null
    };

    var plugin = this;
    plugin.settings = {};

    var $element = $(element);
    var element = element;

    plugin.init = function () {
        // Create some defaults, extending them with any options that were provided
        plugin.settings = $.extend({}, defaults, options);

        var row;
        var col;
        var maxCols = plugin.settings.cols;
        var maxRows = plugin.settings.rows;

        //create the grid blocks in rows and columns            
        for (row = 0; row < maxRows; row++) {
            for (col = 0; col < maxCols; col++) {
                var $gridItem = $('<div>');
                $gridItem.addClass(plugin.settings.gridClass)
                                    .attr('row', row)
                                    .attr('col', col);

                //append grid item
                $element.append($gridItem);
            }

            //skip to the next row                    
            $element.append("<div style='clear: both' />");
        }

        //update the grid to the default rows/columns                
        var $startItem = findGridItem(plugin.settings.startRow, plugin.settings.startCol);
        updateGrid($startItem);

        //listen for mouse down and mouse up events
        $element.mousedown(onMouseDown);
        $element.mouseup(onMouseUp);
        $element.mousemove(onMouseMove);
    }

    //plugin specific vars
    var mouseDown = false;
    var prevRow = -1;
    var prevCol = -1;

    //handle when an item is clicked
    var onMouseDown = function (e) {
        mouseDown = true;
        updateGrid(e.target);
    }

    //handle when an item is clicked
    var onMouseUp = function (e) {
        mouseDown = false;
    }

    //handle when an item is clicked
    var onMouseMove = function (e) {
        if (mouseDown == false) return;

        updateGrid(e.target);
    }

    //updates the grid according to the item row and column
    var updateGrid = function (target) {
        var $item = $(target);
        var itemRow = $item.attr('row');
        var itemCol = $item.attr('col');

        if (itemRow == undefined || itemCol == undefined) return
        if (prevRow == itemRow && prevCol == itemCol) return;

        var maxCols = plugin.settings.cols;
        var maxRows = plugin.settings.rows;

        var row;
        var col;
        for (row = 0; row < maxRows; row++) {
            for (col = 0; col < maxCols; col++) {
                var $gridItem = findGridItem(row, col);

                if (row <= itemRow && col <= itemCol) {
                    $gridItem.addClass(plugin.settings.activeClass);
                }
                else {
                    $gridItem.removeClass(plugin.settings.activeClass);
                }
            }
        }

        //raise our update callback if necessary
        if (plugin.settings.onUpdate) {

            plugin.settings.onUpdate.apply(this, [itemRow, itemCol]);
        }
        $("#spnRowNColumn").html((parseInt(itemRow) + 1) + "x" + (parseInt(itemCol) + 1));
        //store our last changes
        prevRow = itemRow;
        prevCol = itemCol;
    }

    //finds the grid item at the specified location
    var findGridItem = function (row, col) {

        return $("." + plugin.settings.gridClass + "[row='" + row + "'][col='" + col + "']", $element);
    }

    plugin.init();
}

$.fn.gridCreator = function (options) {
    return this.each(function () {
        if (undefined == $(this).data('gridCreator')) {
            var plugin = new $.gridCreator(this, options);
            $(this).data('gridCreator', plugin);
        }
    });
}
})(jQuery);