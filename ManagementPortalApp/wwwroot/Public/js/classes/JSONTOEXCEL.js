﻿//Exporting Object
class JSONTOEXCEL {

    constructor() {
        this.excelStrings = {
            "_rels/.rels":
                '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
                '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
                '</Relationships>',

            "xl/_rels/workbook.xml.rels":
                '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
                '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
                '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
                '</Relationships>',

            "[Content_Types].xml":
                '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
                '<Default Extension="xml" ContentType="application/xml" />' +
                '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" />' +
                '<Default Extension="jpeg" ContentType="image/jpeg" />' +
                '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" />' +
                '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" />' +
                '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" />' +
                '</Types>',

            "xl/workbook.xml":
                '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
                '<fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="24816"/>' +
                '<workbookPr showInkAnnotation="0" autoCompressPictures="0"/>' +
                '<bookViews>' +
                '<workbookView xWindow="0" yWindow="0" windowWidth="25600" windowHeight="19020" tabRatio="500"/>' +
                '</bookViews>' +
                '<sheets>' +
                '<sheet name="Sheet1" sheetId="1" r:id="rId1"/>' +
                '</sheets>' +
                '<definedNames/>' +
                '</workbook>',

            "xl/worksheets/sheet1.xml":
                '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">' +
                '<sheetData/>' +
                '<mergeCells count="0"/>' +
                '</worksheet>',

            "xl/styles.xml":
                '<?xml version="1.0" encoding="UTF-8"?>' +
                '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">' +
                '<numFmts count="6">' +
                '<numFmt numFmtId="164" formatCode="#,##0.00_-\ [$$-45C]"/>' +
                '<numFmt numFmtId="165" formatCode="&quot;£&quot;#,##0.00"/>' +
                '<numFmt numFmtId="166" formatCode="[$€-2]\ #,##0.00"/>' +
                '<numFmt numFmtId="167" formatCode="0.0%"/>' +
                '<numFmt numFmtId="168" formatCode="#,##0;(#,##0)"/>' +
                '<numFmt numFmtId="169" formatCode="#,##0.00;(#,##0.00)"/>' +
                '</numFmts>' +
                '<fonts count="5" x14ac:knownFonts="1">' +
                '<font>' +
                '<sz val="11" />' +
                '<name val="Calibri" />' +
                '</font>' +
                '<font>' +
                '<sz val="11" />' +
                '<name val="Calibri" />' +
                '<color rgb="FFFFFFFF" />' +
                '</font>' +
                '<font>' +
                '<sz val="11" />' +
                '<name val="Calibri" />' +
                '<b />' +
                '</font>' +
                '<font>' +
                '<sz val="11" />' +
                '<name val="Calibri" />' +
                '<i />' +
                '</font>' +
                '<font>' +
                '<sz val="11" />' +
                '<name val="Calibri" />' +
                '<u />' +
                '</font>' +
                '</fonts>' +
                '<fills count="6">' +
                '<fill>' +
                '<patternFill patternType="none" />' +
                '</fill>' +
                '<fill>' + // Excel appears to use this as a dotted background regardless of values but
                '<patternFill patternType="none" />' + // to be valid to the schema, use a patternFill
                '</fill>' +
                '<fill>' +
                '<patternFill patternType="solid">' +
                '<fgColor rgb="FFD9D9D9" />' +
                '<bgColor indexed="64" />' +
                '</patternFill>' +
                '</fill>' +
                '<fill>' +
                '<patternFill patternType="solid">' +
                '<fgColor rgb="FFD99795" />' +
                '<bgColor indexed="64" />' +
                '</patternFill>' +
                '</fill>' +
                '<fill>' +
                '<patternFill patternType="solid">' +
                '<fgColor rgb="ffc6efce" />' +
                '<bgColor indexed="64" />' +
                '</patternFill>' +
                '</fill>' +
                '<fill>' +
                '<patternFill patternType="solid">' +
                '<fgColor rgb="ffc6cfef" />' +
                '<bgColor indexed="64" />' +
                '</patternFill>' +
                '</fill>' +
                '</fills>' +
                '<borders count="2">' +
                '<border>' +
                '<left />' +
                '<right />' +
                '<top />' +
                '<bottom />' +
                '<diagonal />' +
                '</border>' +
                '<border diagonalUp="false" diagonalDown="false">' +
                '<left style="thin">' +
                '<color auto="1" />' +
                '</left>' +
                '<right style="thin">' +
                '<color auto="1" />' +
                '</right>' +
                '<top style="thin">' +
                '<color auto="1" />' +
                '</top>' +
                '<bottom style="thin">' +
                '<color auto="1" />' +
                '</bottom>' +
                '<diagonal />' +
                '</border>' +
                '</borders>' +
                '<cellStyleXfs count="1">' +
                '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" />' +
                '</cellStyleXfs>' +
                '<cellXfs count="68">' +
                '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="3" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="4" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="0" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="2" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="3" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="4" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="0" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="1" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="2" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="3" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="4" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="0" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="1" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="2" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="3" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="4" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="0" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="1" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="2" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="3" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="4" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="1" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="2" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="3" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="4" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="0" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="1" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="2" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="3" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="4" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="0" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="1" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="2" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="3" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="4" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="0" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="1" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="2" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="3" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="4" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="0" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="1" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="2" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="3" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="4" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
                '<alignment horizontal="left"/>' +
                '</xf>' +
                '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
                '<alignment horizontal="center"/>' +
                '</xf>' +
                '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
                '<alignment horizontal="right"/>' +
                '</xf>' +
                '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
                '<alignment horizontal="fill"/>' +
                '</xf>' +
                '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
                '<alignment textRotation="90"/>' +
                '</xf>' +
                '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
                '<alignment wrapText="1"/>' +
                '</xf>' +
                '<xf numFmtId="9"   fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '<xf numFmtId="164" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '<xf numFmtId="165" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '<xf numFmtId="166" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '<xf numFmtId="167" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '<xf numFmtId="168" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '<xf numFmtId="169" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '<xf numFmtId="3" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '<xf numFmtId="4" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '<xf numFmtId="1" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '<xf numFmtId="2" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '<xf numFmtId="14" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '</cellXfs>' +
                '<cellStyles count="1">' +
                '<cellStyle name="Normal" xfId="0" builtinId="0" />' +
                '</cellStyles>' +
                '<dxfs count="0" />' +
                '<tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleMedium4" />' +
                '</styleSheet>'
        };
        this._excelSpecials = [
            { match: /^\-?\d+\.\d%$/, style: 60, fmt: function (d) { return d / 100; } }, // Percent with d.p.
            { match: /^\-?\d+\.?\d*%$/, style: 56, fmt: function (d) { return d / 100; } }, // Percent
            { match: /^\-?\$[\d,]+.?\d*$/, style: 57 }, // Dollars
            { match: /^\-?£[\d,]+.?\d*$/, style: 58 }, // Pounds
            { match: /^\-?€[\d,]+.?\d*$/, style: 59 }, // Euros
            { match: /^\-?\d+$/, style: 65 }, // Numbers without thousand separators
            { match: /^\-?\d+\.\d{2}$/, style: 66 }, // Numbers 2 d.p. without thousands separators
            { match: /^\([\d,]+\)$/, style: 61, fmt: function (d) { return -1 * d.replace(/[\(\)]/g, ''); } },  // Negative numbers indicated by brackets
            { match: /^\([\d,]+\.\d{2}\)$/, style: 62, fmt: function (d) { return -1 * d.replace(/[\(\)]/g, ''); } },  // Negative numbers indicated by brackets - 2d.p.
            { match: /^\-?[\d,]+$/, style: 63 }, // Numbers with thousand separators
            { match: /^\-?[\d,]+\.\d{2}$/, style: 64 },
            { match: /^[\d]{4}\-[01][\d]\-[0123][\d]$/, style: 67, fmt: function (d) { return Math.round(25569 + (Date.parse(d) / (86400 * 1000))); } } //Date yyyy-mm-dd
        ];
        try {
            this._serialiser = new XMLSerializer();
            this._ieExcel;
        }
        catch (t) { }
    }

    ParseDataFromJSON(_data, ExcludedColumns) {
        var headers = Object.keys(_data[0]);
        if (Array.isArray(ExcludedColumns)) {

            if (ExcludedColumns.length > 0) {
                headers = headers.filter(function (item) {
                    return ExcludedColumns.indexOf(item) == -1;
                });
            }
        }

        var body = [];
        $.each(_data, function (i, option) {
            var limb = [];
            $.each(headers, function (_i, _option) {
                limb.push(option[_option]);
            });
            body.push(limb);
        });
        return { header: headers, body: body };
    };

    getXml(type) {
        var str = this.excelStrings[type];
        return $.parseXML(str);
    };

    _createNode(doc, nodeName, opts) {
        var tempNode = doc.createElement(nodeName);

        if (opts) {
            if (opts.attr) {
                $(tempNode).attr(opts.attr);
            }

            if (opts.children) {
                $.each(opts.children, function (key, value) {
                    tempNode.appendChild(value);
                });
            }

            if (opts.text !== null && opts.text !== undefined) {
                tempNode.appendChild(doc.createTextNode(opts.text));
            }
        }

        return tempNode;
    };

    createCellPos(n) {
        var ordA = 'A'.charCodeAt(0);
        var ordZ = 'Z'.charCodeAt(0);
        var len = ordZ - ordA + 1;
        var s = "";

        while (n >= 0) {
            s = String.fromCharCode(n % len + ordA) + s;
            n = Math.floor(n / len) - 1;
        }

        return s;
    };

    addRow(row, rowPos, rels, relsGet) {
        var currentRow, rowNode;

        currentRow = rowPos + 1;
        rowNode = this._createNode(rels, "row", { attr: { r: currentRow } });

        for (var i = 0, ien = row.length; i < ien; i++) {
            // Concat both the Cell Columns as a letter and the Row of the cell.
            var cellId = this.createCellPos(i) + '' + currentRow;
            var cell = null;

            // For null, undefined of blank cell, continue so it doesn't create the _createNode
            if (row[i] === null || row[i] === undefined || row[i] === '') {
                //if (config.createEmptyCells === true) {
                //	row[i] = '';
                //}
                //else {
                //	continue;
                //}
                row[i] = '';
            }

            var originalContent = row[i];
            row[i] = typeof row[i].trim === 'function'
                ? row[i].trim()
                : row[i];

            // Special number formatting options
            for (var j = 0, jen = this._excelSpecials.length; j < jen; j++) {
                var special = this._excelSpecials[j];

                // TODO Need to provide the ability for the specials to say
                // if they are returning a string, since at the moment it is
                // assumed to be a number
                if (row[i].match && !row[i].match(/^0\d+/) && row[i].match(special.match)) {
                    var val = row[i].replace(/[^\d\.\-]/g, '');

                    if (special.fmt) {
                        val = special.fmt(val);
                    }

                    cell = this._createNode(rels, 'c', {
                        attr: {
                            r: cellId,
                            s: special.style
                        },
                        children: [
                            this._createNode(rels, 'v', { text: val })
                        ]
                    });

                    break;
                }
            }

            if (!cell) {
                if (typeof row[i] === 'number' || (
                    row[i].match &&
                    row[i].match(/^-?\d+(\.\d+)?([eE]\-?\d+)?$/) && // Includes exponential format
                    !row[i].match(/^0\d+/))
                ) {
                    // Detect numbers - don't match numbers with leading zeros
                    // or a negative anywhere but the start
                    cell = this._createNode(rels, 'c', {
                        attr: {
                            t: 'n',
                            r: cellId
                        },
                        children: [
                            this._createNode(rels, 'v', { text: row[i] })
                        ]
                    });
                }
                else {
                    // String output - replace non standard characters for text output
                    var text = !originalContent.replace ?
                        originalContent :
                        originalContent.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');

                    cell = this._createNode(rels, 'c', {
                        attr: {
                            t: 'inlineStr',
                            r: cellId
                        },
                        children: {
                            row: this._createNode(rels, 'is', {
                                children: {
                                    row: this._createNode(rels, 't', {
                                        text: text,
                                        attr: {
                                            'xml:space': 'preserve'
                                        }
                                    })
                                }
                            })
                        }
                    });
                }
            }

            rowNode.appendChild(cell);
        }

        relsGet.appendChild(rowNode);
        rowPos++;
        return rowPos;
    };

    _addToZip(zip, obj, e) {

        if (this._ieExcel === undefined) {
            // Detect if we are dealing with IE's _awful_ serialiser by seeing if it
            // drop attributes
            this._ieExcel = this._serialiser
                .serializeToString(
                    (new window.DOMParser()).parseFromString(this.excelStrings['xl/worksheets/sheet1.xml'], 'text/xml')
                )
                .indexOf('xmlns:r') === -1;
        }

        $.each(obj, function (name, val) {
            if ($.isPlainObject(val)) {
                var newDir = zip.folder(name);
                e._addToZip(newDir, val, e);
            }
            else {
                if (this._ieExcel) {
                    // IE's XML serialiser will drop some name space attributes from
                    // from the root node, so we need to save them. Do this by
                    // replacing the namespace nodes with a regular attribute that
                    // we convert back when serialised. Edge does not have this
                    // issue
                    var worksheet = val.childNodes[0];
                    var i, ien;
                    var attrs = [];

                    for (i = worksheet.attributes.length - 1; i >= 0; i--) {
                        var attrName = worksheet.attributes[i].nodeName;
                        var attrValue = worksheet.attributes[i].nodeValue;

                        if (attrName.indexOf(':') !== -1) {
                            attrs.push({ name: attrName, value: attrValue });

                            worksheet.removeAttribute(attrName);
                        }
                    }

                    for (i = 0, ien = attrs.length; i < ien; i++) {
                        var attr = val.createAttribute(attrs[i].name.replace(':', '_dt_b_namespace_token_'));
                        attr.value = attrs[i].value;
                        worksheet.setAttributeNode(attr);
                    }
                }

                var str = e._serialiser.serializeToString(val);

                // Fix IE's XML
                if (e._ieExcel) {
                    // IE doesn't include the XML declaration
                    if (str.indexOf('<?xml') === -1) {
                        str = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + str;
                    }

                    // Return namespace attributes to being as such
                    str = str.replace(/_dt_b_namespace_token_/g, ':');

                    // Remove testing name space that IE puts into the space preserve attr
                    str = str.replace(/xmlns:NS[\d]+="" NS[\d]+:/g, '');
                }

                // Safari, IE and Edge will put empty name space attributes onto
                // various elements making them useless. This strips them out
                str = str.replace(/<([^<>]*?) xmlns=""([^<>]*?)>/g, '<$1 $2>');

                zip.file(name, str);
            }
        });
    }

    _saveAs() {

        var view = typeof self !== "undefined" && self
            || typeof window !== "undefined" && window
            || this.content;

        "use strict";
        // IE <10 is explicitly unsupported
        if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
            return;
        }
        var doc = view.document
            // only get URL when necessary in case Blob.js hasn't overridden it yet
            , get_URL = function () {
                return view.URL || view.webkitURL || view;
            }
            , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
            , can_use_save_link = "download" in save_link
            , click = function (node) {
                var event = new MouseEvent("click");
                node.dispatchEvent(event);
            }
            , is_safari = /constructor/i.test(view.HTMLElement) || view.safari
            , is_chrome_ios = /CriOS\/[\d]+/.test(navigator.userAgent)
            , throw_outside = function (ex) {
                (view.setImmediate || view.setTimeout)(function () {
                    throw ex;
                }, 0);
            }
            , force_saveable_type = "application/octet-stream"
            // the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
            , arbitrary_revoke_timeout = 1000 * 40 // in ms
            , revoke = function (file) {
                var revoker = function () {
                    if (typeof file === "string") { // file is an object URL
                        get_URL().revokeObjectURL(file);
                    } else { // file is a File
                        file.remove();
                    }
                };
                setTimeout(revoker, arbitrary_revoke_timeout);
            }
            , dispatch = function (filesaver, event_types, event) {
                event_types = [].concat(event_types);
                var i = event_types.length;
                while (i--) {
                    var listener = filesaver["on" + event_types[i]];
                    if (typeof listener === "function") {
                        try {
                            listener.call(filesaver, event || filesaver);
                        } catch (ex) {
                            throw_outside(ex);
                        }
                    }
                }
            }
            , auto_bom = function (blob) {
                // prepend BOM for UTF-8 XML and text/* types (including HTML)
                // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
                if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                    return new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type });
                }
                return blob;
            }
            , FileSaver = function (blob, name, no_auto_bom) {
                if (!no_auto_bom) {
                    blob = auto_bom(blob);
                }
                // First try a.download, then web filesystem, then object URLs
                var
                    filesaver = this
                    , type = blob.type
                    , force = type === force_saveable_type
                    , object_url
                    , dispatch_all = function () {
                        dispatch(filesaver, "writestart progress write writeend".split(" "));
                    }
                    // on any filesys errors revert to saving with object URLs
                    , fs_error = function () {
                        if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
                            // Safari doesn't allow downloading of blob urls
                            var reader = new FileReader();
                            reader.onloadend = function () {
                                var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
                                var popup = view.open(url, '_blank');
                                if (!popup) view.location.href = url;
                                url = undefined; // release reference before dispatching
                                filesaver.readyState = filesaver.DONE;
                                dispatch_all();
                            };
                            reader.readAsDataURL(blob);
                            filesaver.readyState = filesaver.INIT;
                            return;
                        }
                        // don't create more object URLs than needed
                        if (!object_url) {
                            object_url = get_URL().createObjectURL(blob);
                        }
                        if (force) {
                            view.location.href = object_url;
                        } else {
                            var opened = view.open(object_url, "_blank");
                            if (!opened) {
                                // Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
                                view.location.href = object_url;
                            }
                        }
                        filesaver.readyState = filesaver.DONE;
                        dispatch_all();
                        revoke(object_url);
                    }
                    ;
                filesaver.readyState = filesaver.INIT;

                if (can_use_save_link) {
                    object_url = get_URL().createObjectURL(blob);
                    setTimeout(function () {
                        save_link.href = object_url;
                        save_link.download = name;
                        click(save_link);
                        dispatch_all();
                        revoke(object_url);
                        filesaver.readyState = filesaver.DONE;
                    });
                    return;
                }

                fs_error();
            }
            , FS_proto = FileSaver.prototype
            , saveAs = function (blob, name, no_auto_bom) {
                return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
            }
            ;
        // IE 10+ (native saveAs)
        if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
            return function (blob, name, no_auto_bom) {
                name = name || blob.name || "download";

                if (!no_auto_bom) {
                    blob = auto_bom(blob);
                }
                return navigator.msSaveOrOpenBlob(blob, name);
            };
        }

        FS_proto.abort = function () { };
        FS_proto.readyState = FS_proto.INIT = 0;
        FS_proto.WRITING = 1;
        FS_proto.DONE = 2;

        FS_proto.error =
            FS_proto.onwritestart =
            FS_proto.onprogress =
            FS_proto.onwrite =
            FS_proto.onabort =
            FS_proto.onerror =
            FS_proto.onwriteend =
            null;

        return saveAs;
    }

    _excelColWidth(data, col) {
        var max = data.header[col].length;
        var len, lineSplit, str;

        if (data.footer && data.footer[col].length > max) {
            max = data.footer[col].length;
        }

        for (var i = 0, ien = data.body.length; i < ien; i++) {
            var point = data.body[i][col];
            str = point !== null && point !== undefined ?
                point.toString() :
                '';

            // If there is a newline character, workout the width of the column
            // based on the longest line in the string
            if (str.indexOf('\n') !== -1) {
                lineSplit = str.split('\n');
                lineSplit.sort(function (a, b) {
                    return b.length - a.length;
                });

                len = lineSplit[0].length;
            }
            else {
                len = str.length;
            }

            if (len > max) {
                max = len;
            }

            // Max width rather than having potentially massive column widths
            if (max > 40) {
                return 54; // 40 * 1.35
            }
        }

        max *= 1.35;

        // And a min width
        return max > 6 ? max : 6;
    };

    Export(data, workbookname, sheetname, ExcludedColumns) {

        var rowPos = 0;
        var dataStartRow = 0;
        var dataEndRow = 0;
        var rels = this.getXml('xl/worksheets/sheet1.xml');
        var relsGet = rels.getElementsByTagName("sheetData")[0];

        var xlsx = {
            _rels: {
                ".rels": this.getXml('_rels/.rels')
            },
            xl: {
                _rels: {
                    "workbook.xml.rels": this.getXml('xl/_rels/workbook.xml.rels')
                },
                "workbook.xml": this.getXml('xl/workbook.xml'),
                "styles.xml": this.getXml('xl/styles.xml'),
                "worksheets": {
                    "sheet1.xml": rels
                }

            },
            "[Content_Types].xml": this.getXml('[Content_Types].xml')
        };

        var _data = this.ParseDataFromJSON(data, ExcludedColumns);

        var mergeCells = function (row, colspan) {
            var mergeCells = $('mergeCells', rels);

            mergeCells[0].appendChild(this._createNode(rels, 'mergeCell', {
                attr: {
                    ref: 'A' + row + ':' + this.createCellPos(colspan) + row
                }
            }));
            mergeCells.attr('count', parseFloat(mergeCells.attr('count')) + 1);
            $('row:eq(' + (row - 1) + ') c', rels).attr('s', '51'); // centre
        };

        rowPos = this.addRow(_data.header, rowPos, rels, relsGet);
        $('row:last c', rels).attr('s', '2'); // bold

        dataStartRow = rowPos;

        for (var n = 0, ie = _data.body.length; n < ie; n++) {
            rowPos = this.addRow(_data.body[n], rowPos, rels, relsGet);
        }

        dataEndRow = rowPos;

        // Set column widths
        var cols = this._createNode(rels, 'cols');
        $('worksheet', rels).prepend(cols);

        for (var i = 0, ien = _data.header.length; i < ien; i++) {
            cols.appendChild(this._createNode(rels, 'col', {
                attr: {
                    min: i + 1,
                    max: i + 1,
                    width: this._excelColWidth(_data, i),
                    customWidth: 1
                }
            }));
        }

        // Workbook modifications
        var workbook = xlsx.xl['workbook.xml'];

        if (sheetname == undefined || sheetname == null || sheetname == '') sheetname == 'Sheet1';

        $('sheets sheet', workbook).attr('name', sheetname);


        // Excel doesn't like an empty mergeCells tag
        if ($('mergeCells', rels).children().length === 0) {
            $('mergeCells', rels).remove();
        }

        var zip = new JSZip();
        var zipConfig = {
            compression: "DEFLATE",
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };

        this._addToZip(zip, xlsx, this);

        if (workbookname == undefined || workbookname == null || workbookname == '') workbookname == 'ExportToExcel';

        if (workbookname > 175) {
            workbookname = workbookname.substr(0, 175);
        }

        this._saveAs()(zip.generate(zipConfig), workbookname);

    };

}

//JSZip Compression Object
$(
    !function (t) { if ("object" == typeof exports && "undefined" != typeof module) module.exports = t(); else if ("function" == typeof define && define.amd) define([], t); else { var e; "undefined" != typeof window ? e = window : "undefined" != typeof global ? e = global : "undefined" != typeof self && (e = self), e.JSZip = t() } }((function () { return function t(e, r, n) { function i(s, o) { if (!r[s]) { if (!e[s]) { var d = "function" == typeof require && require; if (!o && d) return d(s, !0); if (a) return a(s, !0); throw new Error("Cannot find module '" + s + "'") } var h = r[s] = { exports: {} }; e[s][0].call(h.exports, (function (t) { var r = e[s][1][t]; return i(r || t) }), h, h.exports, t, e, r, n) } return r[s].exports } for (var a = "function" == typeof require && require, s = 0; s < n.length; s++)i(n[s]); return i }({ 1: [function (t, e, r) { "use strict"; var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; r.encode = function (t, e) { for (var r, i, a, s, o, d, h, l = "", f = 0; f < t.length;)s = (r = t.charCodeAt(f++)) >> 2, o = (3 & r) << 4 | (i = t.charCodeAt(f++)) >> 4, d = (15 & i) << 2 | (a = t.charCodeAt(f++)) >> 6, h = 63 & a, isNaN(i) ? d = h = 64 : isNaN(a) && (h = 64), l = l + n.charAt(s) + n.charAt(o) + n.charAt(d) + n.charAt(h); return l }, r.decode = function (t, e) { var r, i, a, s, o, d, h = "", l = 0; for (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, ""); l < t.length;)r = n.indexOf(t.charAt(l++)) << 2 | (s = n.indexOf(t.charAt(l++))) >> 4, i = (15 & s) << 4 | (o = n.indexOf(t.charAt(l++))) >> 2, a = (3 & o) << 6 | (d = n.indexOf(t.charAt(l++))), h += String.fromCharCode(r), 64 != o && (h += String.fromCharCode(i)), 64 != d && (h += String.fromCharCode(a)); return h } }, {}], 2: [function (t, e, r) { "use strict"; function n() { this.compressedSize = 0, this.uncompressedSize = 0, this.crc32 = 0, this.compressionMethod = null, this.compressedContent = null } n.prototype = { getContent: function () { return null }, getCompressedContent: function () { return null } }, e.exports = n }, {}], 3: [function (t, e, r) { "use strict"; r.STORE = { magic: "\0\0", compress: function (t, e) { return t }, uncompress: function (t) { return t }, compressInputType: null, uncompressInputType: null }, r.DEFLATE = t("./flate") }, { "./flate": 8 }], 4: [function (t, e, r) { "use strict"; var n = t("./utils"), i = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918e3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117]; e.exports = function (t, e) { if (void 0 === t || !t.length) return 0; var r = "string" !== n.getTypeOf(t); void 0 === e && (e = 0); var a = 0; e ^= -1; for (var s = 0, o = t.length; s < o; s++)a = r ? t[s] : t.charCodeAt(s), e = e >>> 8 ^ i[255 & (e ^ a)]; return -1 ^ e } }, { "./utils": 21 }], 5: [function (t, e, r) { "use strict"; var n = t("./utils"); function i(t) { this.data = null, this.length = 0, this.index = 0 } i.prototype = { checkOffset: function (t) { this.checkIndex(this.index + t) }, checkIndex: function (t) { if (this.length < t || t < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + t + "). Corrupted zip ?") }, setIndex: function (t) { this.checkIndex(t), this.index = t }, skip: function (t) { this.setIndex(this.index + t) }, byteAt: function (t) { }, readInt: function (t) { var e, r = 0; for (this.checkOffset(t), e = this.index + t - 1; e >= this.index; e--)r = (r << 8) + this.byteAt(e); return this.index += t, r }, readString: function (t) { return n.transformTo("string", this.readData(t)) }, readData: function (t) { }, lastIndexOfSignature: function (t) { }, readDate: function () { var t = this.readInt(4); return new Date(1980 + (t >> 25 & 127), (t >> 21 & 15) - 1, t >> 16 & 31, t >> 11 & 31, t >> 5 & 63, (31 & t) << 1) } }, e.exports = i }, { "./utils": 21 }], 6: [function (t, e, r) { "use strict"; r.base64 = !1, r.binary = !1, r.dir = !1, r.createFolders = !1, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null }, {}], 7: [function (t, e, r) { "use strict"; var n = t("./utils"); r.string2binary = function (t) { return n.string2binary(t) }, r.string2Uint8Array = function (t) { return n.transformTo("uint8array", t) }, r.uint8Array2String = function (t) { return n.transformTo("string", t) }, r.string2Blob = function (t) { var e = n.transformTo("arraybuffer", t); return n.arrayBuffer2Blob(e) }, r.arrayBuffer2Blob = function (t) { return n.arrayBuffer2Blob(t) }, r.transformTo = function (t, e) { return n.transformTo(t, e) }, r.getTypeOf = function (t) { return n.getTypeOf(t) }, r.checkSupport = function (t) { return n.checkSupport(t) }, r.MAX_VALUE_16BITS = n.MAX_VALUE_16BITS, r.MAX_VALUE_32BITS = n.MAX_VALUE_32BITS, r.pretty = function (t) { return n.pretty(t) }, r.findCompression = function (t) { return n.findCompression(t) }, r.isRegExp = function (t) { return n.isRegExp(t) } }, { "./utils": 21 }], 8: [function (t, e, r) { "use strict"; var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array, i = t("pako"); r.uncompressInputType = n ? "uint8array" : "array", r.compressInputType = n ? "uint8array" : "array", r.magic = "\b\0", r.compress = function (t, e) { return i.deflateRaw(t, { level: e.level || -1 }) }, r.uncompress = function (t) { return i.inflateRaw(t) } }, { pako: 24 }], 9: [function (t, e, r) { "use strict"; var n = t("./base64"); function i(t, e) { if (!(this instanceof i)) return new i(t, e); this.files = {}, this.comment = null, this.root = "", t && this.load(t, e), this.clone = function () { var t = new i; for (var e in this) "function" != typeof this[e] && (t[e] = this[e]); return t } } i.prototype = t("./object"), i.prototype.load = t("./load"), i.support = t("./support"), i.defaults = t("./defaults"), i.utils = t("./deprecatedPublicUtils"), i.base64 = { encode: function (t) { return n.encode(t) }, decode: function (t) { return n.decode(t) } }, i.compressions = t("./compressions"), e.exports = i }, { "./base64": 1, "./compressions": 3, "./defaults": 6, "./deprecatedPublicUtils": 7, "./load": 10, "./object": 13, "./support": 17 }], 10: [function (t, e, r) { "use strict"; var n = t("./base64"), i = t("./zipEntries"); e.exports = function (t, e) { var r, a, s, o; for ((e = e || {}).base64 && (t = n.decode(t)), r = (a = new i(t, e)).files, s = 0; s < r.length; s++)o = r[s], this.file(o.fileName, o.decompressed, { binary: !0, optimizedBinaryString: !0, date: o.date, dir: o.dir, comment: o.fileComment.length ? o.fileComment : null, unixPermissions: o.unixPermissions, dosPermissions: o.dosPermissions, createFolders: e.createFolders }); return a.zipComment.length && (this.comment = a.zipComment), this } }, { "./base64": 1, "./zipEntries": 22 }], 11: [function (t, e, r) { (function (t) { "use strict"; e.exports = function (e, r) { return new t(e, r) }, e.exports.test = function (e) { return t.isBuffer(e) } }).call(this, "undefined" != typeof Buffer ? Buffer : void 0) }, {}], 12: [function (t, e, r) { "use strict"; var n = t("./uint8ArrayReader"); function i(t) { this.data = t, this.length = this.data.length, this.index = 0 } i.prototype = new n, i.prototype.readData = function (t) { this.checkOffset(t); var e = this.data.slice(this.index, this.index + t); return this.index += t, e }, e.exports = i }, { "./uint8ArrayReader": 18 }], 13: [function (t, e, r) { "use strict"; var n = t("./support"), i = t("./utils"), a = t("./crc32"), s = t("./signature"), o = t("./defaults"), d = t("./base64"), h = t("./compressions"), l = t("./compressedObject"), f = t("./nodeBuffer"), u = t("./utf8"), c = t("./stringWriter"), p = t("./uint8ArrayWriter"), _ = function (t) { if (t._data instanceof l && (t._data = t._data.getContent(), t.options.binary = !0, t.options.base64 = !1, "uint8array" === i.getTypeOf(t._data))) { var e = t._data; t._data = new Uint8Array(e.length), 0 !== e.length && t._data.set(e, 0) } return t._data }, m = function (t) { var e = _(t); return "string" === i.getTypeOf(e) ? !t.options.binary && n.nodebuffer ? f(e, "utf-8") : t.asBinary() : e }, g = function (t) { var e = _(this); return null == e ? "" : (this.options.base64 && (e = d.decode(e)), e = t && this.options.binary ? E.utf8decode(e) : i.transformTo("string", e), t || this.options.binary || (e = i.transformTo("string", E.utf8encode(e))), e) }, b = function (t, e, r) { this.name = t, this.dir = r.dir, this.date = r.date, this.comment = r.comment, this.unixPermissions = r.unixPermissions, this.dosPermissions = r.dosPermissions, this._data = e, this.options = r, this._initialMetadata = { dir: r.dir, date: r.date } }; b.prototype = { asText: function () { return g.call(this, !0) }, asBinary: function () { return g.call(this, !1) }, asNodeBuffer: function () { var t = m(this); return i.transformTo("nodebuffer", t) }, asUint8Array: function () { var t = m(this); return i.transformTo("uint8array", t) }, asArrayBuffer: function () { return this.asUint8Array().buffer } }; var w = function (t, e) { var r, n = ""; for (r = 0; r < e; r++)n += String.fromCharCode(255 & t), t >>>= 8; return n }, v = function () { var t, e, r = {}; for (t = 0; t < arguments.length; t++)for (e in arguments[t]) arguments[t].hasOwnProperty(e) && void 0 === r[e] && (r[e] = arguments[t][e]); return r }, y = function (t, e, r) { var n, a = i.getTypeOf(e); if ("string" == typeof (r = function (t) { return !0 !== (t = t || {}).base64 || null !== t.binary && void 0 !== t.binary || (t.binary = !0), (t = v(t, o)).date = t.date || new Date, null !== t.compression && (t.compression = t.compression.toUpperCase()), t }(r)).unixPermissions && (r.unixPermissions = parseInt(r.unixPermissions, 8)), r.unixPermissions && 16384 & r.unixPermissions && (r.dir = !0), r.dosPermissions && 16 & r.dosPermissions && (r.dir = !0), r.dir && (t = x(t)), r.createFolders && (n = k(t)) && z.call(this, n, !0), r.dir || null == e) r.base64 = !1, r.binary = !1, e = null, a = null; else if ("string" === a) r.binary && !r.base64 && !0 !== r.optimizedBinaryString && (e = i.string2binary(e)); else { if (r.base64 = !1, r.binary = !0, !(a || e instanceof l)) throw new Error("The data of '" + t + "' is in an unsupported format !"); "arraybuffer" === a && (e = i.transformTo("uint8array", e)) } var s = new b(t, e, r); return this.files[t] = s, s }, k = function (t) { "/" == t.slice(-1) && (t = t.substring(0, t.length - 1)); var e = t.lastIndexOf("/"); return e > 0 ? t.substring(0, e) : "" }, x = function (t) { return "/" != t.slice(-1) && (t += "/"), t }, z = function (t, e) { return e = void 0 !== e && e, t = x(t), this.files[t] || y.call(this, t, null, { dir: !0, createFolders: e }), this.files[t] }, C = function (t, e, r) { var n, s = new l; return t._data instanceof l ? (s.uncompressedSize = t._data.uncompressedSize, s.crc32 = t._data.crc32, 0 === s.uncompressedSize || t.dir ? (e = h.STORE, s.compressedContent = "", s.crc32 = 0) : t._data.compressionMethod === e.magic ? s.compressedContent = t._data.getCompressedContent() : (n = t._data.getContent(), s.compressedContent = e.compress(i.transformTo(e.compressInputType, n), r))) : ((n = m(t)) && 0 !== n.length && !t.dir || (e = h.STORE, n = ""), s.uncompressedSize = n.length, s.crc32 = a(n), s.compressedContent = e.compress(i.transformTo(e.compressInputType, n), r)), s.compressedSize = s.compressedContent.length, s.compressionMethod = e.magic, s }, A = function (t, e, r, n, o) { r.compressedContent; var d, h, l, f, c = i.transformTo("string", u.utf8encode(e.name)), p = e.comment || "", _ = i.transformTo("string", u.utf8encode(p)), m = c.length !== e.name.length, g = _.length !== p.length, b = e.options, v = "", y = "", k = ""; l = e._initialMetadata.dir !== e.dir ? e.dir : b.dir, f = e._initialMetadata.date !== e.date ? e.date : b.date; var x, z, C, A = 0, E = 0; l && (A |= 16), "UNIX" === o ? (E = 798, A |= (x = e.unixPermissions, z = l, C = x, x || (C = z ? 16893 : 33204), (65535 & C) << 16)) : (E = 20, A |= 63 & (e.dosPermissions || 0)), d = f.getHours(), d <<= 6, d |= f.getMinutes(), d <<= 5, d |= f.getSeconds() / 2, h = f.getFullYear() - 1980, h <<= 4, h |= f.getMonth() + 1, h <<= 5, h |= f.getDate(), m && (y = w(1, 1) + w(a(c), 4) + c, v += "up" + w(y.length, 2) + y), g && (k = w(1, 1) + w(this.crc32(_), 4) + _, v += "uc" + w(k.length, 2) + k); var S = ""; return S += "\n\0", S += m || g ? "\0\b" : "\0\0", S += r.compressionMethod, S += w(d, 2), S += w(h, 2), S += w(r.crc32, 4), S += w(r.compressedSize, 4), S += w(r.uncompressedSize, 4), S += w(c.length, 2), S += w(v.length, 2), { fileRecord: s.LOCAL_FILE_HEADER + S + c + v, dirRecord: s.CENTRAL_FILE_HEADER + w(E, 2) + S + w(_.length, 2) + "\0\0\0\0" + w(A, 4) + w(n, 4) + c + v + _, compressedObject: r } }, E = { load: function (t, e) { throw new Error("Load method is not defined. Is the file jszip-load.js included ?") }, filter: function (t) { var e, r, n, i, a = []; for (e in this.files) this.files.hasOwnProperty(e) && (n = this.files[e], i = new b(n.name, n._data, v(n.options)), r = e.slice(this.root.length, e.length), e.slice(0, this.root.length) === this.root && t(r, i) && a.push(i)); return a }, file: function (t, e, r) { if (1 === arguments.length) { if (i.isRegExp(t)) { var n = t; return this.filter((function (t, e) { return !e.dir && n.test(t) })) } return this.filter((function (e, r) { return !r.dir && e === t }))[0] || null } return t = this.root + t, y.call(this, t, e, r), this }, folder: function (t) { if (!t) return this; if (i.isRegExp(t)) return this.filter((function (e, r) { return r.dir && t.test(e) })); var e = this.root + t, r = z.call(this, e), n = this.clone(); return n.root = r.name, n }, remove: function (t) { t = this.root + t; var e = this.files[t]; if (e || ("/" != t.slice(-1) && (t += "/"), e = this.files[t]), e && !e.dir) delete this.files[t]; else for (var r = this.filter((function (e, r) { return r.name.slice(0, t.length) === t })), n = 0; n < r.length; n++)delete this.files[r[n].name]; return this }, generate: function (t) { t = v(t || {}, { base64: !0, compression: "STORE", compressionOptions: null, type: "base64", platform: "DOS", comment: null, mimeType: "application/zip" }), i.checkSupport(t.type), "darwin" !== t.platform && "freebsd" !== t.platform && "linux" !== t.platform && "sunos" !== t.platform || (t.platform = "UNIX"), "win32" === t.platform && (t.platform = "DOS"); var e, r, n = [], a = 0, o = 0, l = i.transformTo("string", this.utf8encode(t.comment || this.comment || "")); for (var f in this.files) if (this.files.hasOwnProperty(f)) { var u = this.files[f], _ = u.options.compression || t.compression.toUpperCase(), m = h[_]; if (!m) throw new Error(_ + " is not a valid compression method !"); var g = u.options.compressionOptions || t.compressionOptions || {}, b = C.call(this, u, m, g), y = A.call(this, f, u, b, a, t.platform); a += y.fileRecord.length + b.compressedSize, o += y.dirRecord.length, n.push(y) } var k; k = s.CENTRAL_DIRECTORY_END + "\0\0\0\0" + w(n.length, 2) + w(n.length, 2) + w(o, 4) + w(a, 4) + w(l.length, 2) + l; var x = t.type.toLowerCase(); for (e = "uint8array" === x || "arraybuffer" === x || "blob" === x || "nodebuffer" === x ? new p(a + o + k.length) : new c(a + o + k.length), r = 0; r < n.length; r++)e.append(n[r].fileRecord), e.append(n[r].compressedObject.compressedContent); for (r = 0; r < n.length; r++)e.append(n[r].dirRecord); e.append(k); var z = e.finalize(); switch (t.type.toLowerCase()) { case "uint8array": case "arraybuffer": case "nodebuffer": return i.transformTo(t.type.toLowerCase(), z); case "blob": return i.arrayBuffer2Blob(i.transformTo("arraybuffer", z), t.mimeType); case "base64": return t.base64 ? d.encode(z) : z; default: return z } }, crc32: function (t, e) { return a(t, e) }, utf8encode: function (t) { return i.transformTo("string", u.utf8encode(t)) }, utf8decode: function (t) { return u.utf8decode(t) } }; e.exports = E }, { "./base64": 1, "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./defaults": 6, "./nodeBuffer": 11, "./signature": 14, "./stringWriter": 16, "./support": 17, "./uint8ArrayWriter": 19, "./utf8": 20, "./utils": 21 }], 14: [function (t, e, r) { "use strict"; r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\b" }, {}], 15: [function (t, e, r) { "use strict"; var n = t("./dataReader"), i = t("./utils"); function a(t, e) { this.data = t, e || (this.data = i.string2binary(this.data)), this.length = this.data.length, this.index = 0 } a.prototype = new n, a.prototype.byteAt = function (t) { return this.data.charCodeAt(t) }, a.prototype.lastIndexOfSignature = function (t) { return this.data.lastIndexOf(t) }, a.prototype.readData = function (t) { this.checkOffset(t); var e = this.data.slice(this.index, this.index + t); return this.index += t, e }, e.exports = a }, { "./dataReader": 5, "./utils": 21 }], 16: [function (t, e, r) { "use strict"; var n = t("./utils"), i = function () { this.data = [] }; i.prototype = { append: function (t) { t = n.transformTo("string", t), this.data.push(t) }, finalize: function () { return this.data.join("") } }, e.exports = i }, { "./utils": 21 }], 17: [function (t, e, r) { (function (t) { "use strict"; if (r.base64 = !0, r.array = !0, r.string = !0, r.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, r.nodebuffer = void 0 !== t, r.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer) r.blob = !1; else { var e = new ArrayBuffer(0); try { r.blob = 0 === new Blob([e], { type: "application/zip" }).size } catch (t) { try { var n = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder); n.append(e), r.blob = 0 === n.getBlob("application/zip").size } catch (t) { r.blob = !1 } } } }).call(this, "undefined" != typeof Buffer ? Buffer : void 0) }, {}], 18: [function (t, e, r) { "use strict"; var n = t("./dataReader"); function i(t) { t && (this.data = t, this.length = this.data.length, this.index = 0) } i.prototype = new n, i.prototype.byteAt = function (t) { return this.data[t] }, i.prototype.lastIndexOfSignature = function (t) { for (var e = t.charCodeAt(0), r = t.charCodeAt(1), n = t.charCodeAt(2), i = t.charCodeAt(3), a = this.length - 4; a >= 0; --a)if (this.data[a] === e && this.data[a + 1] === r && this.data[a + 2] === n && this.data[a + 3] === i) return a; return -1 }, i.prototype.readData = function (t) { if (this.checkOffset(t), 0 === t) return new Uint8Array(0); var e = this.data.subarray(this.index, this.index + t); return this.index += t, e }, e.exports = i }, { "./dataReader": 5 }], 19: [function (t, e, r) { "use strict"; var n = t("./utils"), i = function (t) { this.data = new Uint8Array(t), this.index = 0 }; i.prototype = { append: function (t) { 0 !== t.length && (t = n.transformTo("uint8array", t), this.data.set(t, this.index), this.index += t.length) }, finalize: function () { return this.data } }, e.exports = i }, { "./utils": 21 }], 20: [function (t, e, r) { "use strict"; for (var n = t("./utils"), i = t("./support"), a = t("./nodeBuffer"), s = new Array(256), o = 0; o < 256; o++)s[o] = o >= 252 ? 6 : o >= 248 ? 5 : o >= 240 ? 4 : o >= 224 ? 3 : o >= 192 ? 2 : 1; s[254] = s[254] = 1; var d = function (t, e) { var r; for ((e = e || t.length) > t.length && (e = t.length), r = e - 1; r >= 0 && 128 == (192 & t[r]);)r--; return r < 0 || 0 === r ? e : r + s[t[r]] > e ? r : e }, h = function (t) { var e, r, i, a, o = t.length, d = new Array(2 * o); for (r = 0, e = 0; e < o;)if ((i = t[e++]) < 128) d[r++] = i; else if ((a = s[i]) > 4) d[r++] = 65533, e += a - 1; else { for (i &= 2 === a ? 31 : 3 === a ? 15 : 7; a > 1 && e < o;)i = i << 6 | 63 & t[e++], a--; a > 1 ? d[r++] = 65533 : i < 65536 ? d[r++] = i : (i -= 65536, d[r++] = 55296 | i >> 10 & 1023, d[r++] = 56320 | 1023 & i) } return d.length !== r && (d.subarray ? d = d.subarray(0, r) : d.length = r), n.applyFromCharCode(d) }; r.utf8encode = function (t) { return i.nodebuffer ? a(t, "utf-8") : function (t) { var e, r, n, a, s, o = t.length, d = 0; for (a = 0; a < o; a++)55296 == (64512 & (r = t.charCodeAt(a))) && a + 1 < o && 56320 == (64512 & (n = t.charCodeAt(a + 1))) && (r = 65536 + (r - 55296 << 10) + (n - 56320), a++), d += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4; for (e = i.uint8array ? new Uint8Array(d) : new Array(d), s = 0, a = 0; s < d; a++)55296 == (64512 & (r = t.charCodeAt(a))) && a + 1 < o && 56320 == (64512 & (n = t.charCodeAt(a + 1))) && (r = 65536 + (r - 55296 << 10) + (n - 56320), a++), r < 128 ? e[s++] = r : r < 2048 ? (e[s++] = 192 | r >>> 6, e[s++] = 128 | 63 & r) : r < 65536 ? (e[s++] = 224 | r >>> 12, e[s++] = 128 | r >>> 6 & 63, e[s++] = 128 | 63 & r) : (e[s++] = 240 | r >>> 18, e[s++] = 128 | r >>> 12 & 63, e[s++] = 128 | r >>> 6 & 63, e[s++] = 128 | 63 & r); return e }(t) }, r.utf8decode = function (t) { if (i.nodebuffer) return n.transformTo("nodebuffer", t).toString("utf-8"); for (var e = [], r = 0, a = (t = n.transformTo(i.uint8array ? "uint8array" : "array", t)).length; r < a;) { var s = d(t, Math.min(r + 65536, a)); i.uint8array ? e.push(h(t.subarray(r, s))) : e.push(h(t.slice(r, s))), r = s } return e.join("") } }, { "./nodeBuffer": 11, "./support": 17, "./utils": 21 }], 21: [function (t, e, r) { "use strict"; var n = t("./support"), i = t("./compressions"), a = t("./nodeBuffer"); function s(t) { return t } function o(t, e) { for (var r = 0; r < t.length; ++r)e[r] = 255 & t.charCodeAt(r); return e } function d(t) { var e = 65536, n = [], i = t.length, s = r.getTypeOf(t), o = 0, d = !0; try { switch (s) { case "uint8array": String.fromCharCode.apply(null, new Uint8Array(0)); break; case "nodebuffer": String.fromCharCode.apply(null, a(0)) } } catch (t) { d = !1 } if (!d) { for (var h = "", l = 0; l < t.length; l++)h += String.fromCharCode(t[l]); return h } for (; o < i && e > 1;)try { "array" === s || "nodebuffer" === s ? n.push(String.fromCharCode.apply(null, t.slice(o, Math.min(o + e, i)))) : n.push(String.fromCharCode.apply(null, t.subarray(o, Math.min(o + e, i)))), o += e } catch (t) { e = Math.floor(e / 2) } return n.join("") } function h(t, e) { for (var r = 0; r < t.length; r++)e[r] = t[r]; return e } r.string2binary = function (t) { for (var e = "", r = 0; r < t.length; r++)e += String.fromCharCode(255 & t.charCodeAt(r)); return e }, r.arrayBuffer2Blob = function (t, e) { r.checkSupport("blob"), e = e || "application/zip"; try { return new Blob([t], { type: e }) } catch (r) { try { var n = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder); return n.append(t), n.getBlob(e) } catch (t) { throw new Error("Bug : can't construct the Blob.") } } }, r.applyFromCharCode = d; var l = {}; l.string = { string: s, array: function (t) { return o(t, new Array(t.length)) }, arraybuffer: function (t) { return l.string.uint8array(t).buffer }, uint8array: function (t) { return o(t, new Uint8Array(t.length)) }, nodebuffer: function (t) { return o(t, a(t.length)) } }, l.array = { string: d, array: s, arraybuffer: function (t) { return new Uint8Array(t).buffer }, uint8array: function (t) { return new Uint8Array(t) }, nodebuffer: function (t) { return a(t) } }, l.arraybuffer = { string: function (t) { return d(new Uint8Array(t)) }, array: function (t) { return h(new Uint8Array(t), new Array(t.byteLength)) }, arraybuffer: s, uint8array: function (t) { return new Uint8Array(t) }, nodebuffer: function (t) { return a(new Uint8Array(t)) } }, l.uint8array = { string: d, array: function (t) { return h(t, new Array(t.length)) }, arraybuffer: function (t) { return t.buffer }, uint8array: s, nodebuffer: function (t) { return a(t) } }, l.nodebuffer = { string: d, array: function (t) { return h(t, new Array(t.length)) }, arraybuffer: function (t) { return l.nodebuffer.uint8array(t).buffer }, uint8array: function (t) { return h(t, new Uint8Array(t.length)) }, nodebuffer: s }, r.transformTo = function (t, e) { if (e || (e = ""), !t) return e; r.checkSupport(t); var n = r.getTypeOf(e); return l[n][t](e) }, r.getTypeOf = function (t) { return "string" == typeof t ? "string" : "[object Array]" === Object.prototype.toString.call(t) ? "array" : n.nodebuffer && a.test(t) ? "nodebuffer" : n.uint8array && t instanceof Uint8Array ? "uint8array" : n.arraybuffer && t instanceof ArrayBuffer ? "arraybuffer" : void 0 }, r.checkSupport = function (t) { if (!n[t.toLowerCase()]) throw new Error(t + " is not supported by this browser") }, r.MAX_VALUE_16BITS = 65535, r.MAX_VALUE_32BITS = -1, r.pretty = function (t) { var e, r, n = ""; for (r = 0; r < (t || "").length; r++)n += "\\x" + ((e = t.charCodeAt(r)) < 16 ? "0" : "") + e.toString(16).toUpperCase(); return n }, r.findCompression = function (t) { for (var e in i) if (i.hasOwnProperty(e) && i[e].magic === t) return i[e]; return null }, r.isRegExp = function (t) { return "[object RegExp]" === Object.prototype.toString.call(t) } }, { "./compressions": 3, "./nodeBuffer": 11, "./support": 17 }], 22: [function (t, e, r) { "use strict"; var n = t("./stringReader"), i = t("./nodeBufferReader"), a = t("./uint8ArrayReader"), s = t("./utils"), o = t("./signature"), d = t("./zipEntry"), h = t("./support"), l = t("./object"); function f(t, e) { this.files = [], this.loadOptions = e, t && this.load(t) } f.prototype = { checkSignature: function (t) { var e = this.reader.readString(4); if (e !== t) throw new Error("Corrupted zip or bug : unexpected signature (" + s.pretty(e) + ", expected " + s.pretty(t) + ")") }, readBlockEndOfCentral: function () { this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2), this.zipComment = this.reader.readString(this.zipCommentLength), this.zipComment = l.utf8decode(this.zipComment) }, readBlockZip64EndOfCentral: function () { this.zip64EndOfCentralSize = this.reader.readInt(8), this.versionMadeBy = this.reader.readString(2), this.versionNeeded = this.reader.readInt(2), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {}; for (var t, e, r, n = this.zip64EndOfCentralSize - 44; 0 < n;)t = this.reader.readInt(2), e = this.reader.readInt(4), r = this.reader.readString(e), this.zip64ExtensibleData[t] = { id: t, length: e, value: r } }, readBlockZip64EndOfCentralLocator: function () { if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), this.disksCount > 1) throw new Error("Multi-volumes zip are not supported") }, readLocalFiles: function () { var t, e; for (t = 0; t < this.files.length; t++)e = this.files[t], this.reader.setIndex(e.localHeaderOffset), this.checkSignature(o.LOCAL_FILE_HEADER), e.readLocalPart(this.reader), e.handleUTF8(), e.processAttributes() }, readCentralDir: function () { var t; for (this.reader.setIndex(this.centralDirOffset); this.reader.readString(4) === o.CENTRAL_FILE_HEADER;)(t = new d({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(t) }, readEndOfCentral: function () { var t = this.reader.lastIndexOfSignature(o.CENTRAL_DIRECTORY_END); if (-1 === t) { var e = !0; try { this.reader.setIndex(0), this.checkSignature(o.LOCAL_FILE_HEADER), e = !1 } catch (t) { } throw e ? new Error("Can't find end of central directory : is this a zip file ? If it is, see http://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip : can't find end of central directory") } if (this.reader.setIndex(t), this.checkSignature(o.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === s.MAX_VALUE_16BITS || this.diskWithCentralDirStart === s.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === s.MAX_VALUE_16BITS || this.centralDirRecords === s.MAX_VALUE_16BITS || this.centralDirSize === s.MAX_VALUE_32BITS || this.centralDirOffset === s.MAX_VALUE_32BITS) { if (this.zip64 = !0, -1 === (t = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR))) throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator"); this.reader.setIndex(t), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral() } }, prepareReader: function (t) { var e = s.getTypeOf(t); "string" !== e || h.uint8array ? this.reader = "nodebuffer" === e ? new i(t) : new a(s.transformTo("uint8array", t)) : this.reader = new n(t, this.loadOptions.optimizedBinaryString) }, load: function (t) { this.prepareReader(t), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles() } }, e.exports = f }, { "./nodeBufferReader": 12, "./object": 13, "./signature": 14, "./stringReader": 15, "./support": 17, "./uint8ArrayReader": 18, "./utils": 21, "./zipEntry": 23 }], 23: [function (t, e, r) { "use strict"; var n = t("./stringReader"), i = t("./utils"), a = t("./compressedObject"), s = t("./object"); function o(t, e) { this.options = t, this.loadOptions = e } o.prototype = { isEncrypted: function () { return 1 == (1 & this.bitFlag) }, useUTF8: function () { return 2048 == (2048 & this.bitFlag) }, prepareCompressedContent: function (t, e, r) { return function () { var n = t.index; t.setIndex(e); var i = t.readData(r); return t.setIndex(n), i } }, prepareContent: function (t, e, r, n, a) { return function () { var t = i.transformTo(n.uncompressInputType, this.getCompressedContent()), e = n.uncompress(t); if (e.length !== a) throw new Error("Bug : uncompressed data size mismatch"); return e } }, readLocalPart: function (t) { var e, r; if (t.skip(22), this.fileNameLength = t.readInt(2), r = t.readInt(2), this.fileName = t.readString(this.fileNameLength), t.skip(r), -1 == this.compressedSize || -1 == this.uncompressedSize) throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize == -1 || uncompressedSize == -1)"); if (null === (e = i.findCompression(this.compressionMethod))) throw new Error("Corrupted zip : compression " + i.pretty(this.compressionMethod) + " unknown (inner file : " + this.fileName + ")"); if (this.decompressed = new a, this.decompressed.compressedSize = this.compressedSize, this.decompressed.uncompressedSize = this.uncompressedSize, this.decompressed.crc32 = this.crc32, this.decompressed.compressionMethod = this.compressionMethod, this.decompressed.getCompressedContent = this.prepareCompressedContent(t, t.index, this.compressedSize, e), this.decompressed.getContent = this.prepareContent(t, t.index, this.compressedSize, e, this.uncompressedSize), this.loadOptions.checkCRC32 && (this.decompressed = i.transformTo("string", this.decompressed.getContent()), s.crc32(this.decompressed) !== this.crc32)) throw new Error("Corrupted zip : CRC32 mismatch") }, readCentralPart: function (t) { if (this.versionMadeBy = t.readInt(2), this.versionNeeded = t.readInt(2), this.bitFlag = t.readInt(2), this.compressionMethod = t.readString(2), this.date = t.readDate(), this.crc32 = t.readInt(4), this.compressedSize = t.readInt(4), this.uncompressedSize = t.readInt(4), this.fileNameLength = t.readInt(2), this.extraFieldsLength = t.readInt(2), this.fileCommentLength = t.readInt(2), this.diskNumberStart = t.readInt(2), this.internalFileAttributes = t.readInt(2), this.externalFileAttributes = t.readInt(4), this.localHeaderOffset = t.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported"); this.fileName = t.readString(this.fileNameLength), this.readExtraFields(t), this.parseZIP64ExtraField(t), this.fileComment = t.readString(this.fileCommentLength) }, processAttributes: function () { this.unixPermissions = null, this.dosPermissions = null; var t = this.versionMadeBy >> 8; this.dir = !!(16 & this.externalFileAttributes), 0 === t && (this.dosPermissions = 63 & this.externalFileAttributes), 3 === t && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileName.slice(-1) || (this.dir = !0) }, parseZIP64ExtraField: function (t) { if (this.extraFields[1]) { var e = new n(this.extraFields[1].value); this.uncompressedSize === i.MAX_VALUE_32BITS && (this.uncompressedSize = e.readInt(8)), this.compressedSize === i.MAX_VALUE_32BITS && (this.compressedSize = e.readInt(8)), this.localHeaderOffset === i.MAX_VALUE_32BITS && (this.localHeaderOffset = e.readInt(8)), this.diskNumberStart === i.MAX_VALUE_32BITS && (this.diskNumberStart = e.readInt(4)) } }, readExtraFields: function (t) { var e, r, n, i = t.index; for (this.extraFields = this.extraFields || {}; t.index < i + this.extraFieldsLength;)e = t.readInt(2), r = t.readInt(2), n = t.readString(r), this.extraFields[e] = { id: e, length: r, value: n } }, handleUTF8: function () { if (this.useUTF8()) this.fileName = s.utf8decode(this.fileName), this.fileComment = s.utf8decode(this.fileComment); else { var t = this.findExtraFieldUnicodePath(); null !== t && (this.fileName = t); var e = this.findExtraFieldUnicodeComment(); null !== e && (this.fileComment = e) } }, findExtraFieldUnicodePath: function () { var t = this.extraFields[28789]; if (t) { var e = new n(t.value); return 1 !== e.readInt(1) || s.crc32(this.fileName) !== e.readInt(4) ? null : s.utf8decode(e.readString(t.length - 5)) } return null }, findExtraFieldUnicodeComment: function () { var t = this.extraFields[25461]; if (t) { var e = new n(t.value); return 1 !== e.readInt(1) || s.crc32(this.fileComment) !== e.readInt(4) ? null : s.utf8decode(e.readString(t.length - 5)) } return null } }, e.exports = o }, { "./compressedObject": 2, "./object": 13, "./stringReader": 15, "./utils": 21 }], 24: [function (t, e, r) { "use strict"; var n = {}; (0, t("./lib/utils/common").assign)(n, t("./lib/deflate"), t("./lib/inflate"), t("./lib/zlib/constants")), e.exports = n }, { "./lib/deflate": 25, "./lib/inflate": 26, "./lib/utils/common": 27, "./lib/zlib/constants": 30 }], 25: [function (t, e, r) { "use strict"; var n = t("./zlib/deflate.js"), i = t("./utils/common"), a = t("./utils/strings"), s = t("./zlib/messages"), o = t("./zlib/zstream"), d = function (t) { this.options = i.assign({ level: -1, method: 8, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: 0, to: "" }, t || {}); var e = this.options; e.raw && e.windowBits > 0 ? e.windowBits = -e.windowBits : e.gzip && e.windowBits > 0 && e.windowBits < 16 && (e.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new o, this.strm.avail_out = 0; var r = n.deflateInit2(this.strm, e.level, e.method, e.windowBits, e.memLevel, e.strategy); if (0 !== r) throw new Error(s[r]); e.header && n.deflateSetHeader(this.strm, e.header) }; function h(t, e) { var r = new d(e); if (r.push(t, !0), r.err) throw r.msg; return r.result } d.prototype.push = function (t, e) { var r, s, o = this.strm, d = this.options.chunkSize; if (this.ended) return !1; s = e === ~~e ? e : !0 === e ? 4 : 0, o.input = "string" == typeof t ? a.string2buf(t) : t, o.next_in = 0, o.avail_in = o.input.length; do { if (0 === o.avail_out && (o.output = new i.Buf8(d), o.next_out = 0, o.avail_out = d), 1 !== (r = n.deflate(o, s)) && 0 !== r) return this.onEnd(r), this.ended = !0, !1; (0 === o.avail_out || 0 === o.avail_in && 4 === s) && ("string" === this.options.to ? this.onData(a.buf2binstring(i.shrinkBuf(o.output, o.next_out))) : this.onData(i.shrinkBuf(o.output, o.next_out))) } while ((o.avail_in > 0 || 0 === o.avail_out) && 1 !== r); return 4 !== s || (r = n.deflateEnd(this.strm), this.onEnd(r), this.ended = !0, 0 === r) }, d.prototype.onData = function (t) { this.chunks.push(t) }, d.prototype.onEnd = function (t) { 0 === t && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg }, r.Deflate = d, r.deflate = h, r.deflateRaw = function (t, e) { return (e = e || {}).raw = !0, h(t, e) }, r.gzip = function (t, e) { return (e = e || {}).gzip = !0, h(t, e) } }, { "./utils/common": 27, "./utils/strings": 28, "./zlib/deflate.js": 32, "./zlib/messages": 37, "./zlib/zstream": 39 }], 26: [function (t, e, r) { "use strict"; var n = t("./zlib/inflate.js"), i = t("./utils/common"), a = t("./utils/strings"), s = t("./zlib/constants"), o = t("./zlib/messages"), d = t("./zlib/zstream"), h = t("./zlib/gzheader"), l = function (t) { this.options = i.assign({ chunkSize: 16384, windowBits: 0, to: "" }, t || {}); var e = this.options; e.raw && e.windowBits >= 0 && e.windowBits < 16 && (e.windowBits = -e.windowBits, 0 === e.windowBits && (e.windowBits = -15)), !(e.windowBits >= 0 && e.windowBits < 16) || t && t.windowBits || (e.windowBits += 32), e.windowBits > 15 && e.windowBits < 48 && 0 == (15 & e.windowBits) && (e.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new d, this.strm.avail_out = 0; var r = n.inflateInit2(this.strm, e.windowBits); if (r !== s.Z_OK) throw new Error(o[r]); this.header = new h, n.inflateGetHeader(this.strm, this.header) }; function f(t, e) { var r = new l(e); if (r.push(t, !0), r.err) throw r.msg; return r.result } l.prototype.push = function (t, e) { var r, o, d, h, l, f = this.strm, u = this.options.chunkSize; if (this.ended) return !1; o = e === ~~e ? e : !0 === e ? s.Z_FINISH : s.Z_NO_FLUSH, f.input = "string" == typeof t ? a.binstring2buf(t) : t, f.next_in = 0, f.avail_in = f.input.length; do { if (0 === f.avail_out && (f.output = new i.Buf8(u), f.next_out = 0, f.avail_out = u), (r = n.inflate(f, s.Z_NO_FLUSH)) !== s.Z_STREAM_END && r !== s.Z_OK) return this.onEnd(r), this.ended = !0, !1; f.next_out && (0 === f.avail_out || r === s.Z_STREAM_END || 0 === f.avail_in && o === s.Z_FINISH) && ("string" === this.options.to ? (d = a.utf8border(f.output, f.next_out), h = f.next_out - d, l = a.buf2string(f.output, d), f.next_out = h, f.avail_out = u - h, h && i.arraySet(f.output, f.output, d, h, 0), this.onData(l)) : this.onData(i.shrinkBuf(f.output, f.next_out))) } while (f.avail_in > 0 && r !== s.Z_STREAM_END); return r === s.Z_STREAM_END && (o = s.Z_FINISH), o !== s.Z_FINISH || (r = n.inflateEnd(this.strm), this.onEnd(r), this.ended = !0, r === s.Z_OK) }, l.prototype.onData = function (t) { this.chunks.push(t) }, l.prototype.onEnd = function (t) { t === s.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg }, r.Inflate = l, r.inflate = f, r.inflateRaw = function (t, e) { return (e = e || {}).raw = !0, f(t, e) }, r.ungzip = f }, { "./utils/common": 27, "./utils/strings": 28, "./zlib/constants": 30, "./zlib/gzheader": 33, "./zlib/inflate.js": 35, "./zlib/messages": 37, "./zlib/zstream": 39 }], 27: [function (t, e, r) { "use strict"; var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array; r.assign = function (t) { for (var e = Array.prototype.slice.call(arguments, 1); e.length;) { var r = e.shift(); if (r) { if ("object" != typeof r) throw new TypeError(r + "must be non-object"); for (var n in r) r.hasOwnProperty(n) && (t[n] = r[n]) } } return t }, r.shrinkBuf = function (t, e) { return t.length === e ? t : t.subarray ? t.subarray(0, e) : (t.length = e, t) }; var i = { arraySet: function (t, e, r, n, i) { if (e.subarray && t.subarray) t.set(e.subarray(r, r + n), i); else for (var a = 0; a < n; a++)t[i + a] = e[r + a] }, flattenChunks: function (t) { var e, r, n, i, a, s; for (n = 0, e = 0, r = t.length; e < r; e++)n += t[e].length; for (s = new Uint8Array(n), i = 0, e = 0, r = t.length; e < r; e++)a = t[e], s.set(a, i), i += a.length; return s } }, a = { arraySet: function (t, e, r, n, i) { for (var a = 0; a < n; a++)t[i + a] = e[r + a] }, flattenChunks: function (t) { return [].concat.apply([], t) } }; r.setTyped = function (t) { t ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, i)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, a)) }, r.setTyped(n) }, {}], 28: [function (t, e, r) { "use strict"; var n = t("./common"), i = !0, a = !0; try { String.fromCharCode.apply(null, [0]) } catch (t) { i = !1 } try { String.fromCharCode.apply(null, new Uint8Array(1)) } catch (t) { a = !1 } for (var s = new n.Buf8(256), o = 0; o < 256; o++)s[o] = o >= 252 ? 6 : o >= 248 ? 5 : o >= 240 ? 4 : o >= 224 ? 3 : o >= 192 ? 2 : 1; function d(t, e) { if (e < 65537 && (t.subarray && a || !t.subarray && i)) return String.fromCharCode.apply(null, n.shrinkBuf(t, e)); for (var r = "", s = 0; s < e; s++)r += String.fromCharCode(t[s]); return r } s[254] = s[254] = 1, r.string2buf = function (t) { var e, r, i, a, s, o = t.length, d = 0; for (a = 0; a < o; a++)55296 == (64512 & (r = t.charCodeAt(a))) && a + 1 < o && 56320 == (64512 & (i = t.charCodeAt(a + 1))) && (r = 65536 + (r - 55296 << 10) + (i - 56320), a++), d += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4; for (e = new n.Buf8(d), s = 0, a = 0; s < d; a++)55296 == (64512 & (r = t.charCodeAt(a))) && a + 1 < o && 56320 == (64512 & (i = t.charCodeAt(a + 1))) && (r = 65536 + (r - 55296 << 10) + (i - 56320), a++), r < 128 ? e[s++] = r : r < 2048 ? (e[s++] = 192 | r >>> 6, e[s++] = 128 | 63 & r) : r < 65536 ? (e[s++] = 224 | r >>> 12, e[s++] = 128 | r >>> 6 & 63, e[s++] = 128 | 63 & r) : (e[s++] = 240 | r >>> 18, e[s++] = 128 | r >>> 12 & 63, e[s++] = 128 | r >>> 6 & 63, e[s++] = 128 | 63 & r); return e }, r.buf2binstring = function (t) { return d(t, t.length) }, r.binstring2buf = function (t) { for (var e = new n.Buf8(t.length), r = 0, i = e.length; r < i; r++)e[r] = t.charCodeAt(r); return e }, r.buf2string = function (t, e) { var r, n, i, a, o = e || t.length, h = new Array(2 * o); for (n = 0, r = 0; r < o;)if ((i = t[r++]) < 128) h[n++] = i; else if ((a = s[i]) > 4) h[n++] = 65533, r += a - 1; else { for (i &= 2 === a ? 31 : 3 === a ? 15 : 7; a > 1 && r < o;)i = i << 6 | 63 & t[r++], a--; a > 1 ? h[n++] = 65533 : i < 65536 ? h[n++] = i : (i -= 65536, h[n++] = 55296 | i >> 10 & 1023, h[n++] = 56320 | 1023 & i) } return d(h, n) }, r.utf8border = function (t, e) { var r; for ((e = e || t.length) > t.length && (e = t.length), r = e - 1; r >= 0 && 128 == (192 & t[r]);)r--; return r < 0 || 0 === r ? e : r + s[t[r]] > e ? r : e } }, { "./common": 27 }], 29: [function (t, e, r) { "use strict"; e.exports = function (t, e, r, n) { for (var i = 65535 & t | 0, a = t >>> 16 & 65535 | 0, s = 0; 0 !== r;) { r -= s = r > 2e3 ? 2e3 : r; do { a = a + (i = i + e[n++] | 0) | 0 } while (--s); i %= 65521, a %= 65521 } return i | a << 16 | 0 } }, {}], 30: [function (t, e, r) { e.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 } }, {}], 31: [function (t, e, r) { "use strict"; var n = function () { for (var t, e = [], r = 0; r < 256; r++) { t = r; for (var n = 0; n < 8; n++)t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1; e[r] = t } return e }(); e.exports = function (t, e, r, i) { var a = n, s = i + r; t ^= -1; for (var o = i; o < s; o++)t = t >>> 8 ^ a[255 & (t ^ e[o])]; return -1 ^ t } }, {}], 32: [function (t, e, r) { "use strict"; var n = t("../utils/common"), i = t("./trees"), a = t("./adler32"), s = t("./crc32"), o = t("./messages"), d = 0, h = 4, l = 0, f = -2, u = -1, c = 4, p = 2, _ = 8, m = 9, g = 286, b = 30, w = 19, v = 2 * g + 1, y = 15, k = 3, x = 258, z = x + k + 1, C = 42, A = 103, E = 113, S = 666, B = 1, I = 2, T = 3, O = 4; function R(t, e) { return t.msg = o[e], e } function L(t) { return (t << 1) - (t > 4 ? 9 : 0) } function D(t) { for (var e = t.length; --e >= 0;)t[e] = 0 } function N(t) { var e = t.state, r = e.pending; r > t.avail_out && (r = t.avail_out), 0 !== r && (n.arraySet(t.output, e.pending_buf, e.pending_out, r, t.next_out), t.next_out += r, e.pending_out += r, t.total_out += r, t.avail_out -= r, e.pending -= r, 0 === e.pending && (e.pending_out = 0)) } function U(t, e) { i._tr_flush_block(t, t.block_start >= 0 ? t.block_start : -1, t.strstart - t.block_start, e), t.block_start = t.strstart, N(t.strm) } function F(t, e) { t.pending_buf[t.pending++] = e } function Z(t, e) { t.pending_buf[t.pending++] = e >>> 8 & 255, t.pending_buf[t.pending++] = 255 & e } function P(t, e) { var r, n, i = t.max_chain_length, a = t.strstart, s = t.prev_length, o = t.nice_match, d = t.strstart > t.w_size - z ? t.strstart - (t.w_size - z) : 0, h = t.window, l = t.w_mask, f = t.prev, u = t.strstart + x, c = h[a + s - 1], p = h[a + s]; t.prev_length >= t.good_match && (i >>= 2), o > t.lookahead && (o = t.lookahead); do { if (h[(r = e) + s] === p && h[r + s - 1] === c && h[r] === h[a] && h[++r] === h[a + 1]) { a += 2, r++; do { } while (h[++a] === h[++r] && h[++a] === h[++r] && h[++a] === h[++r] && h[++a] === h[++r] && h[++a] === h[++r] && h[++a] === h[++r] && h[++a] === h[++r] && h[++a] === h[++r] && a < u); if (n = x - (u - a), a = u - x, n > s) { if (t.match_start = e, s = n, n >= o) break; c = h[a + s - 1], p = h[a + s] } } } while ((e = f[e & l]) > d && 0 != --i); return s <= t.lookahead ? s : t.lookahead } function M(t) { var e, r, i, o, d, h, l, f, u, c, p = t.w_size; do { if (o = t.window_size - t.lookahead - t.strstart, t.strstart >= p + (p - z)) { n.arraySet(t.window, t.window, p, p, 0), t.match_start -= p, t.strstart -= p, t.block_start -= p, e = r = t.hash_size; do { i = t.head[--e], t.head[e] = i >= p ? i - p : 0 } while (--r); e = r = p; do { i = t.prev[--e], t.prev[e] = i >= p ? i - p : 0 } while (--r); o += p } if (0 === t.strm.avail_in) break; if (h = t.strm, l = t.window, f = t.strstart + t.lookahead, u = o, c = void 0, (c = h.avail_in) > u && (c = u), r = 0 === c ? 0 : (h.avail_in -= c, n.arraySet(l, h.input, h.next_in, c, f), 1 === h.state.wrap ? h.adler = a(h.adler, l, c, f) : 2 === h.state.wrap && (h.adler = s(h.adler, l, c, f)), h.next_in += c, h.total_in += c, c), t.lookahead += r, t.lookahead + t.insert >= k) for (d = t.strstart - t.insert, t.ins_h = t.window[d], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[d + 1]) & t.hash_mask; t.insert && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[d + k - 1]) & t.hash_mask, t.prev[d & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = d, d++, t.insert--, !(t.lookahead + t.insert < k));); } while (t.lookahead < z && 0 !== t.strm.avail_in) } function j(t, e) { for (var r, n; ;) { if (t.lookahead < z) { if (M(t), t.lookahead < z && e === d) return B; if (0 === t.lookahead) break } if (r = 0, t.lookahead >= k && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + k - 1]) & t.hash_mask, r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), 0 !== r && t.strstart - r <= t.w_size - z && (t.match_length = P(t, r)), t.match_length >= k) if (n = i._tr_tally(t, t.strstart - t.match_start, t.match_length - k), t.lookahead -= t.match_length, t.match_length <= t.max_lazy_match && t.lookahead >= k) { t.match_length--; do { t.strstart++, t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + k - 1]) & t.hash_mask, r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart } while (0 != --t.match_length); t.strstart++ } else t.strstart += t.match_length, t.match_length = 0, t.ins_h = t.window[t.strstart], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 1]) & t.hash_mask; else n = i._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++; if (n && (U(t, !1), 0 === t.strm.avail_out)) return B } return t.insert = t.strstart < k - 1 ? t.strstart : k - 1, e === h ? (U(t, !0), 0 === t.strm.avail_out ? T : O) : t.last_lit && (U(t, !1), 0 === t.strm.avail_out) ? B : I } function H(t, e) { for (var r, n, a; ;) { if (t.lookahead < z) { if (M(t), t.lookahead < z && e === d) return B; if (0 === t.lookahead) break } if (r = 0, t.lookahead >= k && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + k - 1]) & t.hash_mask, r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), t.prev_length = t.match_length, t.prev_match = t.match_start, t.match_length = k - 1, 0 !== r && t.prev_length < t.max_lazy_match && t.strstart - r <= t.w_size - z && (t.match_length = P(t, r), t.match_length <= 5 && (1 === t.strategy || t.match_length === k && t.strstart - t.match_start > 4096) && (t.match_length = k - 1)), t.prev_length >= k && t.match_length <= t.prev_length) { a = t.strstart + t.lookahead - k, n = i._tr_tally(t, t.strstart - 1 - t.prev_match, t.prev_length - k), t.lookahead -= t.prev_length - 1, t.prev_length -= 2; do { ++t.strstart <= a && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + k - 1]) & t.hash_mask, r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart) } while (0 != --t.prev_length); if (t.match_available = 0, t.match_length = k - 1, t.strstart++, n && (U(t, !1), 0 === t.strm.avail_out)) return B } else if (t.match_available) { if ((n = i._tr_tally(t, 0, t.window[t.strstart - 1])) && U(t, !1), t.strstart++, t.lookahead--, 0 === t.strm.avail_out) return B } else t.match_available = 1, t.strstart++, t.lookahead-- } return t.match_available && (n = i._tr_tally(t, 0, t.window[t.strstart - 1]), t.match_available = 0), t.insert = t.strstart < k - 1 ? t.strstart : k - 1, e === h ? (U(t, !0), 0 === t.strm.avail_out ? T : O) : t.last_lit && (U(t, !1), 0 === t.strm.avail_out) ? B : I } var X, K = function (t, e, r, n, i) { this.good_length = t, this.max_lazy = e, this.nice_length = r, this.max_chain = n, this.func = i }; function V() { this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = _, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new n.Buf16(2 * v), this.dyn_dtree = new n.Buf16(2 * (2 * b + 1)), this.bl_tree = new n.Buf16(2 * (2 * w + 1)), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new n.Buf16(y + 1), this.heap = new n.Buf16(2 * g + 1), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new n.Buf16(2 * g + 1), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0 } function Y(t) { var e; return t && t.state ? (t.total_in = t.total_out = 0, t.data_type = p, (e = t.state).pending = 0, e.pending_out = 0, e.wrap < 0 && (e.wrap = -e.wrap), e.status = e.wrap ? C : E, t.adler = 2 === e.wrap ? 0 : 1, e.last_flush = d, i._tr_init(e), l) : R(t, f) } function W(t) { var e, r = Y(t); return r === l && ((e = t.state).window_size = 2 * e.w_size, D(e.head), e.max_lazy_match = X[e.level].max_lazy, e.good_match = X[e.level].good_length, e.nice_match = X[e.level].nice_length, e.max_chain_length = X[e.level].max_chain, e.strstart = 0, e.block_start = 0, e.lookahead = 0, e.insert = 0, e.match_length = e.prev_length = k - 1, e.match_available = 0, e.ins_h = 0), r } function q(t, e, r, i, a, s) { if (!t) return f; var o = 1; if (e === u && (e = 6), i < 0 ? (o = 0, i = -i) : i > 15 && (o = 2, i -= 16), a < 1 || a > m || r !== _ || i < 8 || i > 15 || e < 0 || e > 9 || s < 0 || s > c) return R(t, f); 8 === i && (i = 9); var d = new V; return t.state = d, d.strm = t, d.wrap = o, d.gzhead = null, d.w_bits = i, d.w_size = 1 << d.w_bits, d.w_mask = d.w_size - 1, d.hash_bits = a + 7, d.hash_size = 1 << d.hash_bits, d.hash_mask = d.hash_size - 1, d.hash_shift = ~~((d.hash_bits + k - 1) / k), d.window = new n.Buf8(2 * d.w_size), d.head = new n.Buf16(d.hash_size), d.prev = new n.Buf16(d.w_size), d.lit_bufsize = 1 << a + 6, d.pending_buf_size = 4 * d.lit_bufsize, d.pending_buf = new n.Buf8(d.pending_buf_size), d.d_buf = d.lit_bufsize >> 1, d.l_buf = 3 * d.lit_bufsize, d.level = e, d.strategy = s, d.method = r, W(t) } X = [new K(0, 0, 0, 0, (function (t, e) { var r = 65535; for (r > t.pending_buf_size - 5 && (r = t.pending_buf_size - 5); ;) { if (t.lookahead <= 1) { if (M(t), 0 === t.lookahead && e === d) return B; if (0 === t.lookahead) break } t.strstart += t.lookahead, t.lookahead = 0; var n = t.block_start + r; if ((0 === t.strstart || t.strstart >= n) && (t.lookahead = t.strstart - n, t.strstart = n, U(t, !1), 0 === t.strm.avail_out)) return B; if (t.strstart - t.block_start >= t.w_size - z && (U(t, !1), 0 === t.strm.avail_out)) return B } return t.insert = 0, e === h ? (U(t, !0), 0 === t.strm.avail_out ? T : O) : (t.strstart > t.block_start && (U(t, !1), t.strm.avail_out), B) })), new K(4, 4, 8, 4, j), new K(4, 5, 16, 8, j), new K(4, 6, 32, 32, j), new K(4, 4, 16, 16, H), new K(8, 16, 32, 32, H), new K(8, 16, 128, 128, H), new K(8, 32, 128, 256, H), new K(32, 128, 258, 1024, H), new K(32, 258, 258, 4096, H)], r.deflateInit = function (t, e) { return q(t, e, _, 15, 8, 0) }, r.deflateInit2 = q, r.deflateReset = W, r.deflateResetKeep = Y, r.deflateSetHeader = function (t, e) { return t && t.state ? 2 !== t.state.wrap ? f : (t.state.gzhead = e, l) : f }, r.deflate = function (t, e) { var r, n, a, o; if (!t || !t.state || e > 5 || e < 0) return t ? R(t, f) : f; if (n = t.state, !t.output || !t.input && 0 !== t.avail_in || n.status === S && e !== h) return R(t, 0 === t.avail_out ? -5 : f); if (n.strm = t, r = n.last_flush, n.last_flush = e, n.status === C) if (2 === n.wrap) t.adler = 0, F(n, 31), F(n, 139), F(n, 8), n.gzhead ? (F(n, (n.gzhead.text ? 1 : 0) + (n.gzhead.hcrc ? 2 : 0) + (n.gzhead.extra ? 4 : 0) + (n.gzhead.name ? 8 : 0) + (n.gzhead.comment ? 16 : 0)), F(n, 255 & n.gzhead.time), F(n, n.gzhead.time >> 8 & 255), F(n, n.gzhead.time >> 16 & 255), F(n, n.gzhead.time >> 24 & 255), F(n, 9 === n.level ? 2 : n.strategy >= 2 || n.level < 2 ? 4 : 0), F(n, 255 & n.gzhead.os), n.gzhead.extra && n.gzhead.extra.length && (F(n, 255 & n.gzhead.extra.length), F(n, n.gzhead.extra.length >> 8 & 255)), n.gzhead.hcrc && (t.adler = s(t.adler, n.pending_buf, n.pending, 0)), n.gzindex = 0, n.status = 69) : (F(n, 0), F(n, 0), F(n, 0), F(n, 0), F(n, 0), F(n, 9 === n.level ? 2 : n.strategy >= 2 || n.level < 2 ? 4 : 0), F(n, 3), n.status = E); else { var u = _ + (n.w_bits - 8 << 4) << 8; u |= (n.strategy >= 2 || n.level < 2 ? 0 : n.level < 6 ? 1 : 6 === n.level ? 2 : 3) << 6, 0 !== n.strstart && (u |= 32), u += 31 - u % 31, n.status = E, Z(n, u), 0 !== n.strstart && (Z(n, t.adler >>> 16), Z(n, 65535 & t.adler)), t.adler = 1 } if (69 === n.status) if (n.gzhead.extra) { for (a = n.pending; n.gzindex < (65535 & n.gzhead.extra.length) && (n.pending !== n.pending_buf_size || (n.gzhead.hcrc && n.pending > a && (t.adler = s(t.adler, n.pending_buf, n.pending - a, a)), N(t), a = n.pending, n.pending !== n.pending_buf_size));)F(n, 255 & n.gzhead.extra[n.gzindex]), n.gzindex++; n.gzhead.hcrc && n.pending > a && (t.adler = s(t.adler, n.pending_buf, n.pending - a, a)), n.gzindex === n.gzhead.extra.length && (n.gzindex = 0, n.status = 73) } else n.status = 73; if (73 === n.status) if (n.gzhead.name) { a = n.pending; do { if (n.pending === n.pending_buf_size && (n.gzhead.hcrc && n.pending > a && (t.adler = s(t.adler, n.pending_buf, n.pending - a, a)), N(t), a = n.pending, n.pending === n.pending_buf_size)) { o = 1; break } o = n.gzindex < n.gzhead.name.length ? 255 & n.gzhead.name.charCodeAt(n.gzindex++) : 0, F(n, o) } while (0 !== o); n.gzhead.hcrc && n.pending > a && (t.adler = s(t.adler, n.pending_buf, n.pending - a, a)), 0 === o && (n.gzindex = 0, n.status = 91) } else n.status = 91; if (91 === n.status) if (n.gzhead.comment) { a = n.pending; do { if (n.pending === n.pending_buf_size && (n.gzhead.hcrc && n.pending > a && (t.adler = s(t.adler, n.pending_buf, n.pending - a, a)), N(t), a = n.pending, n.pending === n.pending_buf_size)) { o = 1; break } o = n.gzindex < n.gzhead.comment.length ? 255 & n.gzhead.comment.charCodeAt(n.gzindex++) : 0, F(n, o) } while (0 !== o); n.gzhead.hcrc && n.pending > a && (t.adler = s(t.adler, n.pending_buf, n.pending - a, a)), 0 === o && (n.status = A) } else n.status = A; if (n.status === A && (n.gzhead.hcrc ? (n.pending + 2 > n.pending_buf_size && N(t), n.pending + 2 <= n.pending_buf_size && (F(n, 255 & t.adler), F(n, t.adler >> 8 & 255), t.adler = 0, n.status = E)) : n.status = E), 0 !== n.pending) { if (N(t), 0 === t.avail_out) return n.last_flush = -1, l } else if (0 === t.avail_in && L(e) <= L(r) && e !== h) return R(t, -5); if (n.status === S && 0 !== t.avail_in) return R(t, -5); if (0 !== t.avail_in || 0 !== n.lookahead || e !== d && n.status !== S) { var c = 2 === n.strategy ? function (t, e) { for (var r; ;) { if (0 === t.lookahead && (M(t), 0 === t.lookahead)) { if (e === d) return B; break } if (t.match_length = 0, r = i._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++, r && (U(t, !1), 0 === t.strm.avail_out)) return B } return t.insert = 0, e === h ? (U(t, !0), 0 === t.strm.avail_out ? T : O) : t.last_lit && (U(t, !1), 0 === t.strm.avail_out) ? B : I }(n, e) : 3 === n.strategy ? function (t, e) { for (var r, n, a, s, o = t.window; ;) { if (t.lookahead <= x) { if (M(t), t.lookahead <= x && e === d) return B; if (0 === t.lookahead) break } if (t.match_length = 0, t.lookahead >= k && t.strstart > 0 && (n = o[a = t.strstart - 1]) === o[++a] && n === o[++a] && n === o[++a]) { s = t.strstart + x; do { } while (n === o[++a] && n === o[++a] && n === o[++a] && n === o[++a] && n === o[++a] && n === o[++a] && n === o[++a] && n === o[++a] && a < s); t.match_length = x - (s - a), t.match_length > t.lookahead && (t.match_length = t.lookahead) } if (t.match_length >= k ? (r = i._tr_tally(t, 1, t.match_length - k), t.lookahead -= t.match_length, t.strstart += t.match_length, t.match_length = 0) : (r = i._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++), r && (U(t, !1), 0 === t.strm.avail_out)) return B } return t.insert = 0, e === h ? (U(t, !0), 0 === t.strm.avail_out ? T : O) : t.last_lit && (U(t, !1), 0 === t.strm.avail_out) ? B : I }(n, e) : X[n.level].func(n, e); if (c !== T && c !== O || (n.status = S), c === B || c === T) return 0 === t.avail_out && (n.last_flush = -1), l; if (c === I && (1 === e ? i._tr_align(n) : 5 !== e && (i._tr_stored_block(n, 0, 0, !1), 3 === e && (D(n.head), 0 === n.lookahead && (n.strstart = 0, n.block_start = 0, n.insert = 0))), N(t), 0 === t.avail_out)) return n.last_flush = -1, l } return e !== h ? l : n.wrap <= 0 ? 1 : (2 === n.wrap ? (F(n, 255 & t.adler), F(n, t.adler >> 8 & 255), F(n, t.adler >> 16 & 255), F(n, t.adler >> 24 & 255), F(n, 255 & t.total_in), F(n, t.total_in >> 8 & 255), F(n, t.total_in >> 16 & 255), F(n, t.total_in >> 24 & 255)) : (Z(n, t.adler >>> 16), Z(n, 65535 & t.adler)), N(t), n.wrap > 0 && (n.wrap = -n.wrap), 0 !== n.pending ? l : 1) }, r.deflateEnd = function (t) { var e; return t && t.state ? (e = t.state.status) !== C && 69 !== e && 73 !== e && 91 !== e && e !== A && e !== E && e !== S ? R(t, f) : (t.state = null, e === E ? R(t, -3) : l) : f }, r.deflateInfo = "pako deflate (from Nodeca project)" }, { "../utils/common": 27, "./adler32": 29, "./crc32": 31, "./messages": 37, "./trees": 38 }], 33: [function (t, e, r) { "use strict"; e.exports = function () { this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1 } }, {}], 34: [function (t, e, r) { "use strict"; e.exports = function (t, e) { var r, n, i, a, s, o, d, h, l, f, u, c, p, _, m, g, b, w, v, y, k, x, z, C, A; r = t.state, n = t.next_in, C = t.input, i = n + (t.avail_in - 5), a = t.next_out, A = t.output, s = a - (e - t.avail_out), o = a + (t.avail_out - 257), d = r.dmax, h = r.wsize, l = r.whave, f = r.wnext, u = r.window, c = r.hold, p = r.bits, _ = r.lencode, m = r.distcode, g = (1 << r.lenbits) - 1, b = (1 << r.distbits) - 1; t: do { p < 15 && (c += C[n++] << p, p += 8, c += C[n++] << p, p += 8), w = _[c & g]; e: for (; ;) { if (c >>>= v = w >>> 24, p -= v, 0 === (v = w >>> 16 & 255)) A[a++] = 65535 & w; else { if (!(16 & v)) { if (0 == (64 & v)) { w = _[(65535 & w) + (c & (1 << v) - 1)]; continue e } if (32 & v) { r.mode = 12; break t } t.msg = "invalid literal/length code", r.mode = 30; break t } y = 65535 & w, (v &= 15) && (p < v && (c += C[n++] << p, p += 8), y += c & (1 << v) - 1, c >>>= v, p -= v), p < 15 && (c += C[n++] << p, p += 8, c += C[n++] << p, p += 8), w = m[c & b]; r: for (; ;) { if (c >>>= v = w >>> 24, p -= v, !(16 & (v = w >>> 16 & 255))) { if (0 == (64 & v)) { w = m[(65535 & w) + (c & (1 << v) - 1)]; continue r } t.msg = "invalid distance code", r.mode = 30; break t } if (k = 65535 & w, p < (v &= 15) && (c += C[n++] << p, (p += 8) < v && (c += C[n++] << p, p += 8)), (k += c & (1 << v) - 1) > d) { t.msg = "invalid distance too far back", r.mode = 30; break t } if (c >>>= v, p -= v, k > (v = a - s)) { if ((v = k - v) > l && r.sane) { t.msg = "invalid distance too far back", r.mode = 30; break t } if (x = 0, z = u, 0 === f) { if (x += h - v, v < y) { y -= v; do { A[a++] = u[x++] } while (--v); x = a - k, z = A } } else if (f < v) { if (x += h + f - v, (v -= f) < y) { y -= v; do { A[a++] = u[x++] } while (--v); if (x = 0, f < y) { y -= v = f; do { A[a++] = u[x++] } while (--v); x = a - k, z = A } } } else if (x += f - v, v < y) { y -= v; do { A[a++] = u[x++] } while (--v); x = a - k, z = A } for (; y > 2;)A[a++] = z[x++], A[a++] = z[x++], A[a++] = z[x++], y -= 3; y && (A[a++] = z[x++], y > 1 && (A[a++] = z[x++])) } else { x = a - k; do { A[a++] = A[x++], A[a++] = A[x++], A[a++] = A[x++], y -= 3 } while (y > 2); y && (A[a++] = A[x++], y > 1 && (A[a++] = A[x++])) } break } } break } } while (n < i && a < o); n -= y = p >> 3, c &= (1 << (p -= y << 3)) - 1, t.next_in = n, t.next_out = a, t.avail_in = n < i ? i - n + 5 : 5 - (n - i), t.avail_out = a < o ? o - a + 257 : 257 - (a - o), r.hold = c, r.bits = p } }, {}], 35: [function (t, e, r) { "use strict"; var n = t("../utils/common"), i = t("./adler32"), a = t("./crc32"), s = t("./inffast"), o = t("./inftrees"), d = 1, h = 2, l = 0, f = -2, u = 1, c = 12, p = 30, _ = 852, m = 592; function g(t) { return (t >>> 24 & 255) + (t >>> 8 & 65280) + ((65280 & t) << 8) + ((255 & t) << 24) } function b() { this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new n.Buf16(320), this.work = new n.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0 } function w(t) { var e; return t && t.state ? (e = t.state, t.total_in = t.total_out = e.total = 0, t.msg = "", e.wrap && (t.adler = 1 & e.wrap), e.mode = u, e.last = 0, e.havedict = 0, e.dmax = 32768, e.head = null, e.hold = 0, e.bits = 0, e.lencode = e.lendyn = new n.Buf32(_), e.distcode = e.distdyn = new n.Buf32(m), e.sane = 1, e.back = -1, l) : f } function v(t) { var e; return t && t.state ? ((e = t.state).wsize = 0, e.whave = 0, e.wnext = 0, w(t)) : f } function y(t, e) { var r, n; return t && t.state ? (n = t.state, e < 0 ? (r = 0, e = -e) : (r = 1 + (e >> 4), e < 48 && (e &= 15)), e && (e < 8 || e > 15) ? f : (null !== n.window && n.wbits !== e && (n.window = null), n.wrap = r, n.wbits = e, v(t))) : f } function k(t, e) { var r, n; return t ? (n = new b, t.state = n, n.window = null, (r = y(t, e)) !== l && (t.state = null), r) : f } var x, z, C = !0; function A(t) { if (C) { var e; for (x = new n.Buf32(512), z = new n.Buf32(32), e = 0; e < 144;)t.lens[e++] = 8; for (; e < 256;)t.lens[e++] = 9; for (; e < 280;)t.lens[e++] = 7; for (; e < 288;)t.lens[e++] = 8; for (o(d, t.lens, 0, 288, x, 0, t.work, { bits: 9 }), e = 0; e < 32;)t.lens[e++] = 5; o(h, t.lens, 0, 32, z, 0, t.work, { bits: 5 }), C = !1 } t.lencode = x, t.lenbits = 9, t.distcode = z, t.distbits = 5 } r.inflateReset = v, r.inflateReset2 = y, r.inflateResetKeep = w, r.inflateInit = function (t) { return k(t, 15) }, r.inflateInit2 = k, r.inflate = function (t, e) { var r, _, m, b, w, v, y, k, x, z, C, E, S, B, I, T, O, R, L, D, N, U, F, Z, P = 0, M = new n.Buf8(4), j = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]; if (!t || !t.state || !t.output || !t.input && 0 !== t.avail_in) return f; (r = t.state).mode === c && (r.mode = 13), w = t.next_out, m = t.output, y = t.avail_out, b = t.next_in, _ = t.input, v = t.avail_in, k = r.hold, x = r.bits, z = v, C = y, U = l; t: for (; ;)switch (r.mode) { case u: if (0 === r.wrap) { r.mode = 13; break } for (; x < 16;) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } if (2 & r.wrap && 35615 === k) { r.check = 0, M[0] = 255 & k, M[1] = k >>> 8 & 255, r.check = a(r.check, M, 2, 0), k = 0, x = 0, r.mode = 2; break } if (r.flags = 0, r.head && (r.head.done = !1), !(1 & r.wrap) || (((255 & k) << 8) + (k >> 8)) % 31) { t.msg = "incorrect header check", r.mode = p; break } if (8 != (15 & k)) { t.msg = "unknown compression method", r.mode = p; break } if (x -= 4, N = 8 + (15 & (k >>>= 4)), 0 === r.wbits) r.wbits = N; else if (N > r.wbits) { t.msg = "invalid window size", r.mode = p; break } r.dmax = 1 << N, t.adler = r.check = 1, r.mode = 512 & k ? 10 : c, k = 0, x = 0; break; case 2: for (; x < 16;) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } if (r.flags = k, 8 != (255 & r.flags)) { t.msg = "unknown compression method", r.mode = p; break } if (57344 & r.flags) { t.msg = "unknown header flags set", r.mode = p; break } r.head && (r.head.text = k >> 8 & 1), 512 & r.flags && (M[0] = 255 & k, M[1] = k >>> 8 & 255, r.check = a(r.check, M, 2, 0)), k = 0, x = 0, r.mode = 3; case 3: for (; x < 32;) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } r.head && (r.head.time = k), 512 & r.flags && (M[0] = 255 & k, M[1] = k >>> 8 & 255, M[2] = k >>> 16 & 255, M[3] = k >>> 24 & 255, r.check = a(r.check, M, 4, 0)), k = 0, x = 0, r.mode = 4; case 4: for (; x < 16;) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } r.head && (r.head.xflags = 255 & k, r.head.os = k >> 8), 512 & r.flags && (M[0] = 255 & k, M[1] = k >>> 8 & 255, r.check = a(r.check, M, 2, 0)), k = 0, x = 0, r.mode = 5; case 5: if (1024 & r.flags) { for (; x < 16;) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } r.length = k, r.head && (r.head.extra_len = k), 512 & r.flags && (M[0] = 255 & k, M[1] = k >>> 8 & 255, r.check = a(r.check, M, 2, 0)), k = 0, x = 0 } else r.head && (r.head.extra = null); r.mode = 6; case 6: if (1024 & r.flags && ((E = r.length) > v && (E = v), E && (r.head && (N = r.head.extra_len - r.length, r.head.extra || (r.head.extra = new Array(r.head.extra_len)), n.arraySet(r.head.extra, _, b, E, N)), 512 & r.flags && (r.check = a(r.check, _, E, b)), v -= E, b += E, r.length -= E), r.length)) break t; r.length = 0, r.mode = 7; case 7: if (2048 & r.flags) { if (0 === v) break t; E = 0; do { N = _[b + E++], r.head && N && r.length < 65536 && (r.head.name += String.fromCharCode(N)) } while (N && E < v); if (512 & r.flags && (r.check = a(r.check, _, E, b)), v -= E, b += E, N) break t } else r.head && (r.head.name = null); r.length = 0, r.mode = 8; case 8: if (4096 & r.flags) { if (0 === v) break t; E = 0; do { N = _[b + E++], r.head && N && r.length < 65536 && (r.head.comment += String.fromCharCode(N)) } while (N && E < v); if (512 & r.flags && (r.check = a(r.check, _, E, b)), v -= E, b += E, N) break t } else r.head && (r.head.comment = null); r.mode = 9; case 9: if (512 & r.flags) { for (; x < 16;) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } if (k !== (65535 & r.check)) { t.msg = "header crc mismatch", r.mode = p; break } k = 0, x = 0 } r.head && (r.head.hcrc = r.flags >> 9 & 1, r.head.done = !0), t.adler = r.check = 0, r.mode = c; break; case 10: for (; x < 32;) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } t.adler = r.check = g(k), k = 0, x = 0, r.mode = 11; case 11: if (0 === r.havedict) return t.next_out = w, t.avail_out = y, t.next_in = b, t.avail_in = v, r.hold = k, r.bits = x, 2; t.adler = r.check = 1, r.mode = c; case c: if (5 === e || 6 === e) break t; case 13: if (r.last) { k >>>= 7 & x, x -= 7 & x, r.mode = 27; break } for (; x < 3;) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } switch (r.last = 1 & k, x -= 1, 3 & (k >>>= 1)) { case 0: r.mode = 14; break; case 1: if (A(r), r.mode = 20, 6 === e) { k >>>= 2, x -= 2; break t } break; case 2: r.mode = 17; break; case 3: t.msg = "invalid block type", r.mode = p }k >>>= 2, x -= 2; break; case 14: for (k >>>= 7 & x, x -= 7 & x; x < 32;) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } if ((65535 & k) != (k >>> 16 ^ 65535)) { t.msg = "invalid stored block lengths", r.mode = p; break } if (r.length = 65535 & k, k = 0, x = 0, r.mode = 15, 6 === e) break t; case 15: r.mode = 16; case 16: if (E = r.length) { if (E > v && (E = v), E > y && (E = y), 0 === E) break t; n.arraySet(m, _, b, E, w), v -= E, b += E, y -= E, w += E, r.length -= E; break } r.mode = c; break; case 17: for (; x < 14;) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } if (r.nlen = 257 + (31 & k), k >>>= 5, x -= 5, r.ndist = 1 + (31 & k), k >>>= 5, x -= 5, r.ncode = 4 + (15 & k), k >>>= 4, x -= 4, r.nlen > 286 || r.ndist > 30) { t.msg = "too many length or distance symbols", r.mode = p; break } r.have = 0, r.mode = 18; case 18: for (; r.have < r.ncode;) { for (; x < 3;) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } r.lens[j[r.have++]] = 7 & k, k >>>= 3, x -= 3 } for (; r.have < 19;)r.lens[j[r.have++]] = 0; if (r.lencode = r.lendyn, r.lenbits = 7, F = { bits: r.lenbits }, U = o(0, r.lens, 0, 19, r.lencode, 0, r.work, F), r.lenbits = F.bits, U) { t.msg = "invalid code lengths set", r.mode = p; break } r.have = 0, r.mode = 19; case 19: for (; r.have < r.nlen + r.ndist;) { for (; T = (P = r.lencode[k & (1 << r.lenbits) - 1]) >>> 16 & 255, O = 65535 & P, !((I = P >>> 24) <= x);) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } if (O < 16) k >>>= I, x -= I, r.lens[r.have++] = O; else { if (16 === O) { for (Z = I + 2; x < Z;) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } if (k >>>= I, x -= I, 0 === r.have) { t.msg = "invalid bit length repeat", r.mode = p; break } N = r.lens[r.have - 1], E = 3 + (3 & k), k >>>= 2, x -= 2 } else if (17 === O) { for (Z = I + 3; x < Z;) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } x -= I, N = 0, E = 3 + (7 & (k >>>= I)), k >>>= 3, x -= 3 } else { for (Z = I + 7; x < Z;) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } x -= I, N = 0, E = 11 + (127 & (k >>>= I)), k >>>= 7, x -= 7 } if (r.have + E > r.nlen + r.ndist) { t.msg = "invalid bit length repeat", r.mode = p; break } for (; E--;)r.lens[r.have++] = N } } if (r.mode === p) break; if (0 === r.lens[256]) { t.msg = "invalid code -- missing end-of-block", r.mode = p; break } if (r.lenbits = 9, F = { bits: r.lenbits }, U = o(d, r.lens, 0, r.nlen, r.lencode, 0, r.work, F), r.lenbits = F.bits, U) { t.msg = "invalid literal/lengths set", r.mode = p; break } if (r.distbits = 6, r.distcode = r.distdyn, F = { bits: r.distbits }, U = o(h, r.lens, r.nlen, r.ndist, r.distcode, 0, r.work, F), r.distbits = F.bits, U) { t.msg = "invalid distances set", r.mode = p; break } if (r.mode = 20, 6 === e) break t; case 20: r.mode = 21; case 21: if (v >= 6 && y >= 258) { t.next_out = w, t.avail_out = y, t.next_in = b, t.avail_in = v, r.hold = k, r.bits = x, s(t, C), w = t.next_out, m = t.output, y = t.avail_out, b = t.next_in, _ = t.input, v = t.avail_in, k = r.hold, x = r.bits, r.mode === c && (r.back = -1); break } for (r.back = 0; T = (P = r.lencode[k & (1 << r.lenbits) - 1]) >>> 16 & 255, O = 65535 & P, !((I = P >>> 24) <= x);) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } if (T && 0 == (240 & T)) { for (R = I, L = T, D = O; T = (P = r.lencode[D + ((k & (1 << R + L) - 1) >> R)]) >>> 16 & 255, O = 65535 & P, !(R + (I = P >>> 24) <= x);) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } k >>>= R, x -= R, r.back += R } if (k >>>= I, x -= I, r.back += I, r.length = O, 0 === T) { r.mode = 26; break } if (32 & T) { r.back = -1, r.mode = c; break } if (64 & T) { t.msg = "invalid literal/length code", r.mode = p; break } r.extra = 15 & T, r.mode = 22; case 22: if (r.extra) { for (Z = r.extra; x < Z;) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } r.length += k & (1 << r.extra) - 1, k >>>= r.extra, x -= r.extra, r.back += r.extra } r.was = r.length, r.mode = 23; case 23: for (; T = (P = r.distcode[k & (1 << r.distbits) - 1]) >>> 16 & 255, O = 65535 & P, !((I = P >>> 24) <= x);) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } if (0 == (240 & T)) { for (R = I, L = T, D = O; T = (P = r.distcode[D + ((k & (1 << R + L) - 1) >> R)]) >>> 16 & 255, O = 65535 & P, !(R + (I = P >>> 24) <= x);) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } k >>>= R, x -= R, r.back += R } if (k >>>= I, x -= I, r.back += I, 64 & T) { t.msg = "invalid distance code", r.mode = p; break } r.offset = O, r.extra = 15 & T, r.mode = 24; case 24: if (r.extra) { for (Z = r.extra; x < Z;) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } r.offset += k & (1 << r.extra) - 1, k >>>= r.extra, x -= r.extra, r.back += r.extra } if (r.offset > r.dmax) { t.msg = "invalid distance too far back", r.mode = p; break } r.mode = 25; case 25: if (0 === y) break t; if (E = C - y, r.offset > E) { if ((E = r.offset - E) > r.whave && r.sane) { t.msg = "invalid distance too far back", r.mode = p; break } E > r.wnext ? (E -= r.wnext, S = r.wsize - E) : S = r.wnext - E, E > r.length && (E = r.length), B = r.window } else B = m, S = w - r.offset, E = r.length; E > y && (E = y), y -= E, r.length -= E; do { m[w++] = B[S++] } while (--E); 0 === r.length && (r.mode = 21); break; case 26: if (0 === y) break t; m[w++] = r.length, y--, r.mode = 21; break; case 27: if (r.wrap) { for (; x < 32;) { if (0 === v) break t; v--, k |= _[b++] << x, x += 8 } if (C -= y, t.total_out += C, r.total += C, C && (t.adler = r.check = r.flags ? a(r.check, m, C, w - C) : i(r.check, m, C, w - C)), C = y, (r.flags ? k : g(k)) !== r.check) { t.msg = "incorrect data check", r.mode = p; break } k = 0, x = 0 } r.mode = 28; case 28: if (r.wrap && r.flags) { for (; x < 32;) { if (0 === v) break t; v--, k += _[b++] << x, x += 8 } if (k !== (4294967295 & r.total)) { t.msg = "incorrect length check", r.mode = p; break } k = 0, x = 0 } r.mode = 29; case 29: U = 1; break t; case p: U = -3; break t; case 31: return -4; default: return f }return t.next_out = w, t.avail_out = y, t.next_in = b, t.avail_in = v, r.hold = k, r.bits = x, (r.wsize || C !== t.avail_out && r.mode < p && (r.mode < 27 || 4 !== e)) && function (t, e, r, i) { var a, s = t.state; return null === s.window && (s.wsize = 1 << s.wbits, s.wnext = 0, s.whave = 0, s.window = new n.Buf8(s.wsize)), i >= s.wsize ? (n.arraySet(s.window, e, r - s.wsize, s.wsize, 0), s.wnext = 0, s.whave = s.wsize) : ((a = s.wsize - s.wnext) > i && (a = i), n.arraySet(s.window, e, r - i, a, s.wnext), (i -= a) ? (n.arraySet(s.window, e, r - i, i, 0), s.wnext = i, s.whave = s.wsize) : (s.wnext += a, s.wnext === s.wsize && (s.wnext = 0), s.whave < s.wsize && (s.whave += a))), 0 }(t, t.output, t.next_out, C - t.avail_out) ? (r.mode = 31, -4) : (z -= t.avail_in, C -= t.avail_out, t.total_in += z, t.total_out += C, r.total += C, r.wrap && C && (t.adler = r.check = r.flags ? a(r.check, m, C, t.next_out - C) : i(r.check, m, C, t.next_out - C)), t.data_type = r.bits + (r.last ? 64 : 0) + (r.mode === c ? 128 : 0) + (20 === r.mode || 15 === r.mode ? 256 : 0), (0 === z && 0 === C || 4 === e) && U === l && (U = -5), U) }, r.inflateEnd = function (t) { if (!t || !t.state) return f; var e = t.state; return e.window && (e.window = null), t.state = null, l }, r.inflateGetHeader = function (t, e) { var r; return t && t.state ? 0 == (2 & (r = t.state).wrap) ? f : (r.head = e, e.done = !1, l) : f }, r.inflateInfo = "pako inflate (from Nodeca project)" }, { "../utils/common": 27, "./adler32": 29, "./crc32": 31, "./inffast": 34, "./inftrees": 36 }], 36: [function (t, e, r) { "use strict"; var n = t("../utils/common"), i = 15, a = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], s = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], o = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], d = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64]; e.exports = function (t, e, r, h, l, f, u, c) { var p, _, m, g, b, w, v, y, k, x = c.bits, z = 0, C = 0, A = 0, E = 0, S = 0, B = 0, I = 0, T = 0, O = 0, R = 0, L = null, D = 0, N = new n.Buf16(16), U = new n.Buf16(16), F = null, Z = 0; for (z = 0; z <= i; z++)N[z] = 0; for (C = 0; C < h; C++)N[e[r + C]]++; for (S = x, E = i; E >= 1 && 0 === N[E]; E--); if (S > E && (S = E), 0 === E) return l[f++] = 20971520, l[f++] = 20971520, c.bits = 1, 0; for (A = 1; A < E && 0 === N[A]; A++); for (S < A && (S = A), T = 1, z = 1; z <= i; z++)if (T <<= 1, (T -= N[z]) < 0) return -1; if (T > 0 && (0 === t || 1 !== E)) return -1; for (U[1] = 0, z = 1; z < i; z++)U[z + 1] = U[z] + N[z]; for (C = 0; C < h; C++)0 !== e[r + C] && (u[U[e[r + C]]++] = C); if (0 === t ? (L = F = u, w = 19) : 1 === t ? (L = a, D -= 257, F = s, Z -= 257, w = 256) : (L = o, F = d, w = -1), R = 0, C = 0, z = A, b = f, B = S, I = 0, m = -1, g = (O = 1 << S) - 1, 1 === t && O > 852 || 2 === t && O > 592) return 1; for (; ;) { v = z - I, u[C] < w ? (y = 0, k = u[C]) : u[C] > w ? (y = F[Z + u[C]], k = L[D + u[C]]) : (y = 96, k = 0), p = 1 << z - I, A = _ = 1 << B; do { l[b + (R >> I) + (_ -= p)] = v << 24 | y << 16 | k | 0 } while (0 !== _); for (p = 1 << z - 1; R & p;)p >>= 1; if (0 !== p ? (R &= p - 1, R += p) : R = 0, C++, 0 == --N[z]) { if (z === E) break; z = e[r + u[C]] } if (z > S && (R & g) !== m) { for (0 === I && (I = S), b += A, T = 1 << (B = z - I); B + I < E && !((T -= N[B + I]) <= 0);)B++, T <<= 1; if (O += 1 << B, 1 === t && O > 852 || 2 === t && O > 592) return 1; l[m = R & g] = S << 24 | B << 16 | b - f | 0 } } return 0 !== R && (l[b + R] = z - I << 24 | 64 << 16 | 0), c.bits = S, 0 } }, { "../utils/common": 27 }], 37: [function (t, e, r) { "use strict"; e.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" } }, {}], 38: [function (t, e, r) { "use strict"; var n = t("../utils/common"), i = 0, a = 1; function s(t) { for (var e = t.length; --e >= 0;)t[e] = 0 } var o = 0, d = 29, h = 256, l = h + 1 + d, f = 30, u = 19, c = 2 * l + 1, p = 15, _ = 16, m = 7, g = 256, b = 16, w = 17, v = 18, y = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], k = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], z = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], C = new Array(2 * (l + 2)); s(C); var A = new Array(2 * f); s(A); var E = new Array(512); s(E); var S = new Array(256); s(S); var B = new Array(d); s(B); var I = new Array(f); s(I); var T, O, R, L = function (t, e, r, n, i) { this.static_tree = t, this.extra_bits = e, this.extra_base = r, this.elems = n, this.max_length = i, this.has_stree = t && t.length }, D = function (t, e) { this.dyn_tree = t, this.max_code = 0, this.stat_desc = e }; function N(t) { return t < 256 ? E[t] : E[256 + (t >>> 7)] } function U(t, e) { t.pending_buf[t.pending++] = 255 & e, t.pending_buf[t.pending++] = e >>> 8 & 255 } function F(t, e, r) { t.bi_valid > _ - r ? (t.bi_buf |= e << t.bi_valid & 65535, U(t, t.bi_buf), t.bi_buf = e >> _ - t.bi_valid, t.bi_valid += r - _) : (t.bi_buf |= e << t.bi_valid & 65535, t.bi_valid += r) } function Z(t, e, r) { F(t, r[2 * e], r[2 * e + 1]) } function P(t, e) { var r = 0; do { r |= 1 & t, t >>>= 1, r <<= 1 } while (--e > 0); return r >>> 1 } function M(t, e, r) { var n, i, a = new Array(p + 1), s = 0; for (n = 1; n <= p; n++)a[n] = s = s + r[n - 1] << 1; for (i = 0; i <= e; i++) { var o = t[2 * i + 1]; 0 !== o && (t[2 * i] = P(a[o]++, o)) } } function j(t) { var e; for (e = 0; e < l; e++)t.dyn_ltree[2 * e] = 0; for (e = 0; e < f; e++)t.dyn_dtree[2 * e] = 0; for (e = 0; e < u; e++)t.bl_tree[2 * e] = 0; t.dyn_ltree[2 * g] = 1, t.opt_len = t.static_len = 0, t.last_lit = t.matches = 0 } function H(t) { t.bi_valid > 8 ? U(t, t.bi_buf) : t.bi_valid > 0 && (t.pending_buf[t.pending++] = t.bi_buf), t.bi_buf = 0, t.bi_valid = 0 } function X(t, e, r, n) { var i = 2 * e, a = 2 * r; return t[i] < t[a] || t[i] === t[a] && n[e] <= n[r] } function K(t, e, r) { for (var n = t.heap[r], i = r << 1; i <= t.heap_len && (i < t.heap_len && X(e, t.heap[i + 1], t.heap[i], t.depth) && i++, !X(e, n, t.heap[i], t.depth));)t.heap[r] = t.heap[i], r = i, i <<= 1; t.heap[r] = n } function V(t, e, r) { var n, i, a, s, o = 0; if (0 !== t.last_lit) do { n = t.pending_buf[t.d_buf + 2 * o] << 8 | t.pending_buf[t.d_buf + 2 * o + 1], i = t.pending_buf[t.l_buf + o], o++, 0 === n ? Z(t, i, e) : (Z(t, (a = S[i]) + h + 1, e), 0 !== (s = y[a]) && F(t, i -= B[a], s), Z(t, a = N(--n), r), 0 !== (s = k[a]) && F(t, n -= I[a], s)) } while (o < t.last_lit); Z(t, g, e) } function Y(t, e) { var r, n, i, a = e.dyn_tree, s = e.stat_desc.static_tree, o = e.stat_desc.has_stree, d = e.stat_desc.elems, h = -1; for (t.heap_len = 0, t.heap_max = c, r = 0; r < d; r++)0 !== a[2 * r] ? (t.heap[++t.heap_len] = h = r, t.depth[r] = 0) : a[2 * r + 1] = 0; for (; t.heap_len < 2;)a[2 * (i = t.heap[++t.heap_len] = h < 2 ? ++h : 0)] = 1, t.depth[i] = 0, t.opt_len--, o && (t.static_len -= s[2 * i + 1]); for (e.max_code = h, r = t.heap_len >> 1; r >= 1; r--)K(t, a, r); i = d; do { r = t.heap[1], t.heap[1] = t.heap[t.heap_len--], K(t, a, 1), n = t.heap[1], t.heap[--t.heap_max] = r, t.heap[--t.heap_max] = n, a[2 * i] = a[2 * r] + a[2 * n], t.depth[i] = (t.depth[r] >= t.depth[n] ? t.depth[r] : t.depth[n]) + 1, a[2 * r + 1] = a[2 * n + 1] = i, t.heap[1] = i++, K(t, a, 1) } while (t.heap_len >= 2); t.heap[--t.heap_max] = t.heap[1], function (t, e) { var r, n, i, a, s, o, d = e.dyn_tree, h = e.max_code, l = e.stat_desc.static_tree, f = e.stat_desc.has_stree, u = e.stat_desc.extra_bits, _ = e.stat_desc.extra_base, m = e.stat_desc.max_length, g = 0; for (a = 0; a <= p; a++)t.bl_count[a] = 0; for (d[2 * t.heap[t.heap_max] + 1] = 0, r = t.heap_max + 1; r < c; r++)(a = d[2 * d[2 * (n = t.heap[r]) + 1] + 1] + 1) > m && (a = m, g++), d[2 * n + 1] = a, n > h || (t.bl_count[a]++, s = 0, n >= _ && (s = u[n - _]), o = d[2 * n], t.opt_len += o * (a + s), f && (t.static_len += o * (l[2 * n + 1] + s))); if (0 !== g) { do { for (a = m - 1; 0 === t.bl_count[a];)a--; t.bl_count[a]--, t.bl_count[a + 1] += 2, t.bl_count[m]--, g -= 2 } while (g > 0); for (a = m; 0 !== a; a--)for (n = t.bl_count[a]; 0 !== n;)(i = t.heap[--r]) > h || (d[2 * i + 1] !== a && (t.opt_len += (a - d[2 * i + 1]) * d[2 * i], d[2 * i + 1] = a), n--) } }(t, e), M(a, h, t.bl_count) } function W(t, e, r) { var n, i, a = -1, s = e[1], o = 0, d = 7, h = 4; for (0 === s && (d = 138, h = 3), e[2 * (r + 1) + 1] = 65535, n = 0; n <= r; n++)i = s, s = e[2 * (n + 1) + 1], ++o < d && i === s || (o < h ? t.bl_tree[2 * i] += o : 0 !== i ? (i !== a && t.bl_tree[2 * i]++, t.bl_tree[2 * b]++) : o <= 10 ? t.bl_tree[2 * w]++ : t.bl_tree[2 * v]++, o = 0, a = i, 0 === s ? (d = 138, h = 3) : i === s ? (d = 6, h = 3) : (d = 7, h = 4)) } function q(t, e, r) { var n, i, a = -1, s = e[1], o = 0, d = 7, h = 4; for (0 === s && (d = 138, h = 3), n = 0; n <= r; n++)if (i = s, s = e[2 * (n + 1) + 1], !(++o < d && i === s)) { if (o < h) do { Z(t, i, t.bl_tree) } while (0 != --o); else 0 !== i ? (i !== a && (Z(t, i, t.bl_tree), o--), Z(t, b, t.bl_tree), F(t, o - 3, 2)) : o <= 10 ? (Z(t, w, t.bl_tree), F(t, o - 3, 3)) : (Z(t, v, t.bl_tree), F(t, o - 11, 7)); o = 0, a = i, 0 === s ? (d = 138, h = 3) : i === s ? (d = 6, h = 3) : (d = 7, h = 4) } } var G = !1; function J(t, e, r, i) { F(t, (o << 1) + (i ? 1 : 0), 3), function (t, e, r, i) { H(t), i && (U(t, r), U(t, ~r)), n.arraySet(t.pending_buf, t.window, e, r, t.pending), t.pending += r }(t, e, r, !0) } r._tr_init = function (t) { G || (!function () { var t, e, r, n, i, a = new Array(p + 1); for (r = 0, n = 0; n < d - 1; n++)for (B[n] = r, t = 0; t < 1 << y[n]; t++)S[r++] = n; for (S[r - 1] = n, i = 0, n = 0; n < 16; n++)for (I[n] = i, t = 0; t < 1 << k[n]; t++)E[i++] = n; for (i >>= 7; n < f; n++)for (I[n] = i << 7, t = 0; t < 1 << k[n] - 7; t++)E[256 + i++] = n; for (e = 0; e <= p; e++)a[e] = 0; for (t = 0; t <= 143;)C[2 * t + 1] = 8, t++, a[8]++; for (; t <= 255;)C[2 * t + 1] = 9, t++, a[9]++; for (; t <= 279;)C[2 * t + 1] = 7, t++, a[7]++; for (; t <= 287;)C[2 * t + 1] = 8, t++, a[8]++; for (M(C, l + 1, a), t = 0; t < f; t++)A[2 * t + 1] = 5, A[2 * t] = P(t, 5); T = new L(C, y, h + 1, l, p), O = new L(A, k, 0, f, p), R = new L(new Array(0), x, 0, u, m) }(), G = !0), t.l_desc = new D(t.dyn_ltree, T), t.d_desc = new D(t.dyn_dtree, O), t.bl_desc = new D(t.bl_tree, R), t.bi_buf = 0, t.bi_valid = 0, j(t) }, r._tr_stored_block = J, r._tr_flush_block = function (t, e, r, n) { var s, o, d = 0; t.level > 0 ? (2 === t.strm.data_type && (t.strm.data_type = function (t) { var e, r = 4093624447; for (e = 0; e <= 31; e++, r >>>= 1)if (1 & r && 0 !== t.dyn_ltree[2 * e]) return i; if (0 !== t.dyn_ltree[18] || 0 !== t.dyn_ltree[20] || 0 !== t.dyn_ltree[26]) return a; for (e = 32; e < h; e++)if (0 !== t.dyn_ltree[2 * e]) return a; return i }(t)), Y(t, t.l_desc), Y(t, t.d_desc), d = function (t) { var e; for (W(t, t.dyn_ltree, t.l_desc.max_code), W(t, t.dyn_dtree, t.d_desc.max_code), Y(t, t.bl_desc), e = u - 1; e >= 3 && 0 === t.bl_tree[2 * z[e] + 1]; e--); return t.opt_len += 3 * (e + 1) + 5 + 5 + 4, e }(t), s = t.opt_len + 3 + 7 >>> 3, (o = t.static_len + 3 + 7 >>> 3) <= s && (s = o)) : s = o = r + 5, r + 4 <= s && -1 !== e ? J(t, e, r, n) : 4 === t.strategy || o === s ? (F(t, 2 + (n ? 1 : 0), 3), V(t, C, A)) : (F(t, 4 + (n ? 1 : 0), 3), function (t, e, r, n) { var i; for (F(t, e - 257, 5), F(t, r - 1, 5), F(t, n - 4, 4), i = 0; i < n; i++)F(t, t.bl_tree[2 * z[i] + 1], 3); q(t, t.dyn_ltree, e - 1), q(t, t.dyn_dtree, r - 1) }(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, d + 1), V(t, t.dyn_ltree, t.dyn_dtree)), j(t), n && H(t) }, r._tr_tally = function (t, e, r) { return t.pending_buf[t.d_buf + 2 * t.last_lit] = e >>> 8 & 255, t.pending_buf[t.d_buf + 2 * t.last_lit + 1] = 255 & e, t.pending_buf[t.l_buf + t.last_lit] = 255 & r, t.last_lit++, 0 === e ? t.dyn_ltree[2 * r]++ : (t.matches++, e--, t.dyn_ltree[2 * (S[r] + h + 1)]++, t.dyn_dtree[2 * N(e)]++), t.last_lit === t.lit_bufsize - 1 }, r._tr_align = function (t) { F(t, 2, 3), Z(t, g, C), function (t) { 16 === t.bi_valid ? (U(t, t.bi_buf), t.bi_buf = 0, t.bi_valid = 0) : t.bi_valid >= 8 && (t.pending_buf[t.pending++] = 255 & t.bi_buf, t.bi_buf >>= 8, t.bi_valid -= 8) }(t) } }, { "../utils/common": 27 }], 39: [function (t, e, r) { "use strict"; e.exports = function () { this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0 } }, {}] }, {}, [9])(9) }))
);