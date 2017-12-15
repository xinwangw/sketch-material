// table.js
MD['Table'] = function () {
  var _generateTable,
    // Functions
    var _generateTable,
        _showTablePanel,
        _makeCheckBoxes;

    // Constants
    var BLACK = MD.hexToNSColor('000000', 0.87),
        LIGHT_GREY = MD.hexToNSColor('cccccc', 1),
        GREY = MD.hexToNSColor('cccccc', 0.54),
        FONT = 'Roboto',
        FONT_MEDIUM = 'Roboto Medium',
        LEFT_ALIGN = 0,
        RIGHT_ALIGN = 1,
        PADDING = 24,

        FONT_SIZE = {
            CAPTION: 20,
            HEADER: 14,
            CONTENT: 14
        },

        ROW_HEIGHT = {
            S: 18,
            M: 22,
            L: 33
        },

        LEADING = {
            S: 2,
            M: 6,
            L: 17.2
        },

        LINE_HEIGHT = {
            CAPTION: 20,
            CONTENT: 16
        },

        CAPTION_HEIGHT = {
            M: 64
        };

    // Styles
    var
        headerStyle = function (rtl, l) {
            var name = rtl == 0 ? '…table-header-' + l : '…table-header-rtl-' + l;

            return MD.sharedTextStyle(name,
                LIGHT_GREY, rtl,
                FONT_MEDIUM, FONT_SIZE.HEADER,
                LINE_HEIGHT.CONTENT, LEADING[l]);
        },

        tableContentStyle = function (rtl, l) {
            var name = rtl == 0 ? '…table-content-' + l : '…table-content-rtl-' + l;
            return MD.sharedTextStyle(name,
                LIGHT_GREY, rtl,
                FONT, FONT_SIZE.CONTENT,
                LINE_HEIGHT.CONTENT, LEADING[l])
        },

        lineStyle = MD.sharedLayerStyle("…table-divider", MD.hexToNSColor('000000', 0.12)),
        colLineStyle = MD.sharedLayerStyle("…table-col-line", MD.hexToNSColor('000000', 0.12)),
        headerBgStyle = MD.sharedLayerStyle("…table-header-bg", MD.hexToNSColor('626262', 1)),
        evenRowBgStyle = MD.sharedLayerStyle("…table-even-bg", MD.hexToNSColor('403e3e', 1)),
        oddRowBgStyle = MD.sharedLayerStyle("…table-odd-bg", MD.hexToNSColor('302e2e', 1)),
        cardBgStyle = MD.sharedLayerStyle("…table-card-bg", MD.hexToNSColor('302e2e', 1), MD.hexToNSColor('A9A9A9', 1)),

        captionStyle = MD.sharedTextStyle('…table-caption',
            BLACK, 0,
            FONT, FONT_SIZE.CAPTION,
            LINE_HEIGHT.CAPTION);

    // Parts
    var headers,
        columns,
        widths,
        metas,
        props;

    // Groups
    var columnGroup,
        tableGroup,
        checkBoxGroup,
        paginationGroup,
        linesGroup,
        rowBgGroup,
        captionGroup;

    // Counts
    var rowCount;

    // Coordinates
    var x = PADDING + 18 + PADDING,
        y = 0;

    // Spacings
    var gapBetweenCols = 24;

    // Captions
    var caption,
        captionRect,
        captionX = PADDING,
        captionY = (CAPTION_HEIGHT.M - FONT_SIZE.CAPTION) / 2;

    _generateTable = function () {
        _showTablePanel();
    }
    _importRequiredSymbols = function () {
        // MD.import('icons', 'symbols', ['Forms/checkbox/unchecked/16']);
        MD.import('tables');
    }

    _showTablePanel = function () {
        if (MD.tablePanel()) {
            _importRequiredSymbols();
            _parseDataFromPanel();
            _getTableSize();
            _createGroups();
            _makeCols();
            _makeLines();
            _makeRowBackground();
            _addCaption();
            _addPagination();
            _addCard();
            _addGroupsToTable();
        }
    }

    _parseDataFromPanel = function () {
        headers = _parseDataFromString(MD.configs.table.headers, '|');
        columns = _parseDataFromString(MD.configs.table.cells, '|');
        widths = _parseDataFromString(MD.configs.table.widths, '|');
        metas = _parseDataFromString(MD.configs.table.metas, '|');
        props = _parseDataFromString(MD.configs.table.props, '|');
        if (props[0] == 'off') {
            CAPTION_HEIGHT = {
                M: 0
            };
        }
    }

    _parseDataFromString = function (str, sep) {
        // nsString = NSString.alloc().initWithUTF8String(str);
        // return nsString.componentsSeparatedByString(sep);
        return str.split(sep);
    }

    _makeCols = function () {

        if (props[4] == 'off') {
            x = PADDING;
        }

        for (var i = 0; i < headers.length; i++) {
            var col = MD.addText(),
                header = MD.addText(),
                lineRect,
                colGroup = MD.addGroup(),
                layoutSize = props[3];

            header.setStringValue(headers[i]);
            col.setStringValue(columns[i]);

            header.setStyle(headerStyle(0, layoutSize));
            col.setStyle(tableContentStyle(0, layoutSize));

            if (metas[i] == 'htRight') {
                header.setStyle(headerStyle(1, layoutSize));
                col.setStyle(tableContentStyle(1, layoutSize));
            }

            headerRect = MD.getRect(header);
            headerRect.setX(x);
            headerRect.setY(CAPTION_HEIGHT.M + (ROW_HEIGHT[layoutSize] - LINE_HEIGHT.CONTENT) / 2);
            headerRect.setWidth(widths[i]);

            colRect = MD.getRect(col);
            colRect.setX(x);
            colRect.setY(CAPTION_HEIGHT.M + ROW_HEIGHT[layoutSize] + (ROW_HEIGHT[layoutSize] - LINE_HEIGHT.CONTENT) / 2 + 1);
            colRect.setWidth(widths[i]);

            line = MD.addLine(x - 5, CAPTION_HEIGHT.M + ROW_HEIGHT[layoutSize], ROW_HEIGHT[layoutSize] * rowsCount, MD.hexToNSColor('000000', 0.12));
            line.setStyle(colLineStyle);

            x = gapBetweenCols + x + parseInt(widths[i]);

            colGroup.setName('col #' + i)
            colGroup.addLayers([col, header, line]);
            colGroup.resizeToFitChildrenWithOption(0);
            columnGroup.addLayers([colGroup]);
        }
    }

    _makeLines = function () {
        var checkBox = MD.findSymbolByName('Forms/checkbox/unchecked/16');

        for (var k = 1; k < rowsCount + 2; k++) {
            var line,
                layoutSize = props[3],
                check = checkBox.newSymbolInstance(),
                checkRect = MD.getRect(check);


            tableHeight = (k * ROW_HEIGHT[layoutSize]) + CAPTION_HEIGHT.M;


            if (props[4] == 'on' && k > 0) {
                checkRect.setY(tableHeight - checkRect.height - (ROW_HEIGHT[layoutSize] - checkRect.height) / 2);
                checkRect.setX(PADDING);
                checkBoxGroup.addLayers([check]);
            }
            line = MD.addHorizLine(0, tableHeight, x, MD.hexToNSColor('000000', 0.12));
            line.setStyle(colLineStyle);
            linesGroup.setName('dividers');
            if (k < rowsCount + 1) {
                linesGroup.addLayers([line]);
            }
        }
    }

    _makeRowBackground = function () {
        for (var k = 0; k < rowsCount + 1; k++) {
            var rowBg = MD.addShape(),
                layoutSize = props[3];
            var rowBgRect = MD.getRect(rowBg);
            if (k === 0 ) {
                rowBg.setStyle(headerBgStyle);
            } else if (k % 2 === 0) {
                rowBg.setStyle(evenRowBgStyle);
            } else {
                rowBg.setStyle(oddRowBgStyle);
            }

            rowBgRect.setX(0);
            rowBgRect.setY(CAPTION_HEIGHT.M + k * ROW_HEIGHT[layoutSize]);
            rowBgRect.setHeight(ROW_HEIGHT[layoutSize]);
            rowBgRect.setWidth(x);
            rowBgGroup.setName('rowByGroups');
            rowBgGroup.addLayers([rowBg]);
        }
    }


    _addCaption = function () {
        if (props[0] == 'off') {
            return
        }
        caption = MD.addText(),
            captionRect = MD.getRect(caption),
            caption.setName('caption');
        caption.setStringValue(MD.configs.table.caption);
        caption.setStyle(captionStyle);
        captionRect.setX(captionX);
        captionRect.setY(captionY);
        captionGroup.addLayers([caption]);
    }

    _addCard = function () {
        bg = MD.addShape();
        bg.setName('card')

        var bgRect = MD.getRect(bg);
        //MD.import('elevation', '…elevation-02dp');

        if (props[1] == 'on') {
            bg.setStyle(cardBgStyle);
            //bg.layers().firstObject().setCornerRadiusFromComponents("2");
        }
        bgRect.setX(-1);
        bgRect.setY(-1);
        bgRect.setWidth(x+2);
        bgRect.setHeight(tableHeight+2);
    }

    _addPagination = function () {
        if (props[2] == 'off') {
            return;
        }

        var pagination = MD.findSymbolByName('…table-pagination');
        paginationInstance = pagination.newSymbolInstance();

        paginationGroup.addLayers([paginationInstance]);
        paginationInstanceRect = MD.getRect(paginationInstance);

        paginationRect = MD.getRect(paginationGroup);
        paginationRect.setY(tableHeight);
        paginationRect.setX(x - paginationInstanceRect.width);
        paginationGroup.resizeToFitChildrenWithOption(0);
        tableHeight = tableHeight + paginationInstanceRect.height;
    }


    _createGroups = function () {
        columnGroup = MD.addGroup();
        columnGroup.setName('columns');

        headerGroup = MD.addGroup();
        headerGroup.setName('headers');

        linesGroup = MD.addGroup();
        linesGroup.setName('dividers');

        rowBgGroup = MD.addGroup();
        rowBgGroup.setName('rowBgGroup');

        captionGroup = MD.addGroup();
        captionGroup.setName('caption');

        checkBoxGroup = MD.addGroup();
        checkBoxGroup.setName('checkboxes');


        paginationGroup = MD.addGroup();
        paginationGroup.setName('pagination');
    }

    _getTableSize = function () {
        rowsCount = columns[0].split('\n').length;
    }

    _addGroupsToTable = function () {
        columnGroup.resizeToFitChildrenWithOption(0);
        columnGroup.setConstrainProportions(false);
        linesGroup.resizeToFitChildrenWithOption(0);
        linesGroup.setConstrainProportions(false);
        rowBgGroup.resizeToFitChildrenWithOption(0);
        rowBgGroup.setConstrainProportions(false);
        captionGroup.resizeToFitChildrenWithOption(0);
        captionGroup.setConstrainProportions(false);
        paginationGroup.resizeToFitChildrenWithOption(0);
        paginationGroup.setConstrainProportions(false);

        tableGroup = MD.addGroup();
        tableGroup.setConstrainProportions(false);
        tableGroup.setName('table');
        tableGroup.addLayers([bg, rowBgGroup, linesGroup, checkBoxGroup, paginationGroup, columnGroup, captionGroup]);
        tableGroup.resizeToFitChildrenWithOption(0);

        var tableGroupRect = MD.getRect(tableGroup);
        tableGroupRect.setX(MD.getCenterOfViewPort().x - (tableGroupRect.width * 0.5));
        tableGroupRect.setY(MD.getCenterOfViewPort().y - (tableGroupRect.height * 0.5));

        MD.current.addLayers([tableGroup]);
    }

    return {
        generateTable: function () {
            _generateTable();
        }
    }
};
