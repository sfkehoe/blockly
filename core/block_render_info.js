// New constants.
Blockly.BlockSvg.EMPTY_INPUT_X = Blockly.BlockSvg.TAB_WIDTH +
          Blockly.BlockSvg.SEP_SPACE_X * 1.25;

Blockly.BlockSvg.START_PADDING = Blockly.BlockSvg.SEP_SPACE_X - 1;

Blockly.BlockSvg.STATEMENT_BOTTOM_HEIGHT = Blockly.BlockSvg.SEP_SPACE_Y - 1;

Blockly.BlockSvg.EMPTY_INPUT_Y = Blockly.BlockSvg.MIN_BLOCK_Y;//Blockly.BlockSvg.MIN_BLOCK_Y - 5;

Blockly.BlockSvg.RenderInfo = function() {
  /**
   *
   * @type {boolean}
   */
  this.startHat = false;

  /**
   *
   * @type {boolean}
   */
  this.squareTopLeftCorner = false;

  /**
   *
   * @type {boolean}
   */
  this.squareBottomLeftCorner = false;

  /**
   *
   * @type {boolean}
   */
  this.hasValue = false;

  /**
   *
   * @type {boolean}
   */
  this.hasStatement = false;

  /**
   *
   * @type {boolean}
   */
  this.hasDummy = false;

  this.hasIcons = false;

  this.iconCount = 0;

  /**
   *
   * @type {number}
   */
  this.height = 0;

  /**
   *
   * @type {number}
   */
  this.width = 0;

  /**
   *
   * @type {number}
   */
  this.rightEdge = 0;

  /**
   *
   * @type {number}
   */
  this.statementEdge = 0;

  this.startPadding = Blockly.BlockSvg.START_PADDING;

  // topPadding should be unnecessary: this is the height of the first spacer
  // row.
  this.topPadding = Blockly.BlockSvg.SEP_SPACE_X / 2;

  this.rows = [];
};

Blockly.BlockSvg.RenderedRow = function() {
  /**
   *
   * @type {number}
   */
  this.height = 0;

  /**
   *
   * @type {number}
   */
  this.width = 0;

  /**
   *
   * @type {number}
   */
  this.statementWidth = 0;

  /**
   *
   * @type {number}
   */
  this.fieldValueWidth = 0;

  /**
   * 'spacer', Blockly.BlockSvg.INLINE, 'external value', 'dummy', 'statement'
   * @type {string}
   */
  this.type = '';

  this.inputs = [];
};

Blockly.BlockSvg.RenderedInput = function() {
  /**
   *
   * @type {number}
   */
  this.height = 0;

  /**
   *
   * @type {number}
   */
  this.width = 0;

  /**
   *
   * @type {number}
   */
  this.connectedBlockHeight = 0;

  /**
   *
   * @type {number}
   */
  this.connectedBlockHeight = 0;

  /**
   *
   * @type {number}
   */
  this.fieldHeight = 0;

  /**
   *
   * @type {number}
   */
  this.fieldWidth = 0;

  /**
   *
   * @type {boolean}
   */
  this.isVisible = true;

  /**
   * 'spacer', 'icon', 'statement', 'value', or 'dummy'
   * @type {string}
   */
  this.type = '';

  this.fields = [];

  // The actual input on the block.
  // TODO: scrape all information we need from this, rather than storing it
  // directly.
  this.input = null;
};

Blockly.BlockSvg.RenderedField = function() {
  /**
   *
   * @type {number}
   */
  this.height = 0;

  /**
   *
   * @type {number}
   */
  this.width = 0;

  /**
   * 'spacer' or 'block field'
   * @type {string}
   */
  this.type = '';

  /**
   * The source field.
   *
   */
  this.field = null;
};

Blockly.BlockSvg.FieldSpacer = function() {
  this.height = 0;
  this.width = 0;
  this.type = 'spacer';
};

Blockly.BlockSvg.InputSpacer = function() {
  this.height = 0;
  this.width = 0;
  this.type = 'spacer';
};

Blockly.BlockSvg.RowSpacer = function() {
  this.height = 0;
  this.width = 0;
  this.type = 'spacer';
};

Blockly.BlockSvg.renderComputeForRealThough = function(block) {
  var renderInfo = createRenderInfo(block);

  // measure passes:
  for (var r = 0; r < renderInfo.rows.length; r++) {
    var row = renderInfo.rows[r];
    for (var e = 0; e < row.elements.length; e++) {
      var elem = row.elements[e];
      elem.measure();
    }
  }
  addElemSpacing(renderInfo);

  for (var r = 0; r < renderInfo.rows.length; r++) {
    renderInfo.rows[r].measure();
  }
  addRowSpacing(renderInfo);
  console.log(renderInfo);
  return renderInfo;
};

addRowSpacing = function(info) {
  var oldRows = info.rows;
  var newRows = [];
  newRows.push(new RowSpacer(5));

  for (var r = 0; r < oldRows.length; r++) {
    newRows.push(oldRows[r]);
    var spacing = calculateSpacingBetweenRows(oldRows[r], oldRows[r + 1]);
    newRows.push(new RowSpacer(spacing));
  }
  info.rows = newRows;
};

calculateSpacingBetweenRows = function(prev, next) {
  return 5;
}

addElemSpacing = function(info) {
  for (var r = 0; r < info.rows.length; r++) {
    var row = info.rows[r];
    var oldElems = row.elements;
    var newElems = [];
    newElems.push(new ElemSpacer(10));
    for (var e = 0; e < row.elements.length; e++) {
      newElems.push(oldElems[e]);
      var spacing = calculateSpacingBetweenElems(oldElems[e], oldElems[e + 1]);
      newElems.push(new ElemSpacer(spacing));
    }
    row.elements = newElems;
  }
};

calculateSpacingBetweenElems = function(prev, next) {
  if (!prev) {
    return 5;
  }

  if (!prev.isInput && !next) {
    return 10;
  }

  if (prev.isInput && !next) {
    if (prev instanceof ExternalValueInputElement) {
      return 0;
    } else if (prev instanceof InlineInputElement) {
      return 10;
    }
  }

  if (!next) {
    return 5;
  }

  if (!prev.isInput && next.isInput) {
    return 9;
  }

  if (prev instanceof IconElement && !next.isInput) {
    return 10;
  }

  if (prev instanceof InlineInputElement && !next.isInput) {
    return 10;
  }

  return 5;
};

createRenderInfo = function(block) {
  var info = new Blockly.BlockSvg.RenderInfo();
  info.startHat = this.hat ? this.hat === 'cap' : Blockly.BlockSvg.START_HAT;

  setShouldSquareCorners(block, info);
  setHasStuff(block, info);

  createRows(block, info);
  return info;
};

completeInfo = function(info) {
  var statementEdge = 0;
  var rightEdge = 0;
  for (var r = 1; r < info.rows.length - 1; r += 2) {
    var row = info.rows[r];
    // This is the width of a block where statements are nested.
    statementEdge = Math.max(statementEdge, row.statementWidth);
    rightEdge = Math.max(rightEdge, row.fieldValueWidth);
  }

  // The right edge of non-statement rows should extend past the width of the
  // statement notches.
  if (info.hasStatement) {
    rightEdge = Math.max(rightEdge,
        statementEdge + Blockly.BlockSvg.NOTCH_WIDTH);
  }


  // start padding is added equally to everything.
  info.statementEdge = statementEdge + info.startPadding;
  info.rightEdge = rightEdge + info.startPadding;

  // if (hasValue) {
  //   rightEdge = Math.max(rightEdge, fieldValueWidth +
  //       Blockly.BlockSvg.SEP_SPACE_X * 2 + Blockly.BlockSvg.TAB_WIDTH);
  // } else if (hasDummy) {
  //   rightEdge = Math.max(rightEdge, fieldValueWidth +
  //       Blockly.BlockSvg.SEP_SPACE_X * 2);
  // }


  for (var i = 0; i < info.rows.length; i++) {
    var row = info.rows[i];
    info.height += row.height;
    info.width = Math.max(info.width, row.width);
  }
  // Fuck it, add some padding.
  info.width = info.width + info.startPadding;
};

padRows = function(renderInfo) {
  var rowArr = renderInfo.rows;
  if (rowArr.length == 1) {
    // Just a spacer.
    rowArr[0].height = Blockly.BlockSvg.MIN_BLOCK_Y;
  }
  //  else {
  //   // Single input row.
  //   var firstSpacer = rowArr[0];
  //   var renderedRow = rowArr[1];
  //   if (renderedRow.type == 'dummy') {
  //     firstSpacer.height = Blockly.BlockSvg.SEP_SPACE_X / 2;
  //   }
  // }


  if (rowArr.length > 1) {
    for (var r = 1; r < rowArr.length - 1; r += 2) {
      var row = rowArr[r];
      var prevSpacer = rowArr[r - 1];
      var nextSpacer = rowArr[r + 1];

      // Inline rows get extra padding both above and below.
      if (row.type == Blockly.BlockSvg.INLINE || row.type == 'dummy'){
        prevSpacer.height = Blockly.BlockSvg.INLINE_PADDING_Y;
        nextSpacer.height = Blockly.BlockSvg.INLINE_PADDING_Y;
      }

      if ((r == rowArr.length - 2 && row.type == 'statement') ||
          (r < rowArr.length - 2 && rowArr[r + 2].type == 'statement')) {
      // If the final input is a statement stack, add a small row underneath.
      // Consecutive statement stacks are also separated by a small divider.
        nextSpacer.height = 5;
      }
    }

    // If the last rendered row is a statement input, the padding row after it
    // gets a bit taller to draw the bar between the statement input and the next
    // connection.
    var lastRenderedRow = rowArr[rowArr.length  - 2];
    var lastSpacer = rowArr[rowArr.length - 1];
    if (lastRenderedRow.type == 'statement') {
      lastSpacer.height = Blockly.BlockSvg.STATEMENT_BOTTOM_HEIGHT;
    } else if (lastRenderedRow.type == 'dummy') {
      lastSpacer.height = Blockly.BlockSvg.SEP_SPACE_X / 2;
    }
  }
  // // This overrides the spacing around inline rows that is set above.
  // // The first row gets some padding.  TODO: Does this depend on the start hat?
  // // TODO: Does this depend on whether the first row is a dummy input?  I think it does.
  // rowArr[0].height = Blockly.BlockSvg.SEP_SPACE_X / 2;

};

measureRow = function(renderedRow) {
  var height = 0;
  var width = 0;

  var statementWidth = 0;
  var fieldValueWidth = 0;

  if (renderedRow.type == Blockly.BlockSvg.INLINE) {
    // row width is the sum of all input widths.
    // row height is the max of all input heights.
    // statement width doesn't matter.
    // fieldvaluewidth is misnamed, but is rightEdge and is the same as the
    // row width.
    for (var i = 0; i < renderedRow.inputs.length; i++) {
      var input = renderedRow.inputs[i];
      height = Math.max(height, input.height);
      width += input.width;
    }
    statementWidth = 0;
    fieldValueWidth = width;
  } else {
    for (var i = 0; i < renderedRow.inputs.length; i++) {
      var input = renderedRow.inputs[i];
      height = Math.max(height, input.height);
      if (renderedRow.type == 'statement' && input.type == Blockly.NEXT_STATEMENT) {
        width += input.fieldWidth;
        fieldValueWidth = width;
        statementWidth = width;
      } else {
        width += input.width;
        fieldValueWidth = width;
      }
    }
  }

  renderedRow.height = height;
  renderedRow.width = width;
  renderedRow.statementWidth = statementWidth;
  renderedRow.fieldValueWidth = fieldValueWidth;
};

padInputs = function(renderedRow, isInline) {
  // is there any padding?
  // is this the right place to adjust height of inputs down?
  var inputs = renderedRow.inputs;
  // Spacers sit between inputs.
  // for now, spacers stay at zero and we're only looking at the inputs
  // themselves.
  // The first and last ones are skipped (left at zero width).  Can I just
  // delete them?
  // Are these bounds right?
  for (var i = 1; i < inputs.length - 1; i += 2) {
    var cur = inputs[i];
    var prev = inputs[i - 2];
    var next = inputs[i + 2];
    // Blocks have a one pixel shadow that should sometimes overhang.
    if (isInline && !next) {
      // Last value input should overhang.
      cur.connectedBlockHeight--;
    } else if (!isInline && cur.type == Blockly.INPUT_VALUE &&
        next && next.type == Blockly.NEXT_STATEMENT) {
      // Value input above statement input should overhang.
      cur.connectedBlockHeight--;
    }
    // This includes the last spacer but not the first spacer.
    var spacer = inputs[i + 1];
    spacer.width = Blockly.BlockSvg.SEP_SPACE_X;
  }

  // The end of a row with an external input will have a tab rendered.  Add
  // space for that.
  // TODO: Decide if this is the right place to have that spacing live.
  //
  // if (renderedRow.type == 'external value') {
  //   inputs[inputs.length - 1].width = Blockly.BlockSvg.TAB_WIDTH;
  // }
  //  else if (renderedRow.type == 'dummy') {
  //   // dummies get a bit of padding too.
  //   inputs[inputs.length - 1].width = Blockly.BlockSvg.SEP_SPACE_X;
  // }
};

measureInput = function(renderedInput, isInline) {
  var fieldHeight = 0;
  var fieldWidth = 0;
  // If we're setting width on the first and last, maybe here is a good place.
  for (var f = 0; f < renderedInput.fields.length; f++) {
    var field = renderedInput.fields[f];
    fieldHeight = Math.max(fieldHeight, field.height);
    fieldWidth += field.width;
  }

  var blockWidth = 0;
  var blockHeight = 0;
  if (renderedInput.input &&
      renderedInput.input.connection &&
      renderedInput.input.connection.isConnected()) {
    var linkedBlock = renderedInput.input.connection.targetBlock();
    var bBox = linkedBlock.getHeightWidth();
    blockWidth = bBox.width;
    blockHeight = bBox.height;
  }

  // Compute minimum input size.
  var connectedBlockHeight = 0;
  var connectedBlockWidth = 0;

  // For statement inputs, keep track of both width and height.
  if (renderedInput.type == Blockly.NEXT_STATEMENT) {
    connectedBlockWidth = blockWidth;
    connectedBlockHeight = Math.max(Blockly.BlockSvg.MIN_BLOCK_Y, blockHeight);
  } else if (renderedInput.type == Blockly.INPUT_VALUE) {
    // Value input sizing depends on whether or not the block is inline.
    if (isInline) {
      connectedBlockWidth = Math.max(Blockly.BlockSvg.EMPTY_INPUT_X, blockWidth);
      connectedBlockHeight = Math.max(Blockly.BlockSvg.MIN_BLOCK_Y, blockHeight);
    } else {
      connectedBlockWidth = 0;
      connectedBlockHeight = Math.max(Blockly.BlockSvg.EMPTY_INPUT_Y, blockHeight);
    }
  } else {
    // Dummies and icons have no connected blocks.
    connectedBlockWidth = 0;
    connectedBlockHeight = 0;
  }

  renderedInput.fieldHeight = fieldHeight;
  renderedInput.fieldWidth = fieldWidth;
  renderedInput.connectedBlockHeight = connectedBlockHeight;
  renderedInput.connectedBlockWidth = connectedBlockWidth;

  renderedInput.height = Math.max(fieldHeight, connectedBlockHeight);
  renderedInput.width = fieldWidth + connectedBlockWidth;
};

measureField = function(renderedField) {

  if (renderedField.type == 'icon') {
    // renderedField.field is the instance of Blockly.Icon, and should be renamed.
    renderedField.height = 13;//renderedField.field.SIZE - 1;
    renderedField.width = 13;//renderedField.field.SIZE - 1;
  } else {
  // renderedField.field is the instance of Blockly.Field
    var size = renderedField.field.getCorrectedSize();
    // if (renderedField.field instanceof Blockly.FieldDropdown) {
    //   // For some reason dropdown height had a minimum that included the padding.
    //   // TODO: Figure out if this causes a problem when the dropdown is tall
    //   // (contains images?)
    //   renderedField.height = size.height - 5;
    // } else if (renderedField.field instanceof Blockly.FieldImage) {
    //   renderedField.height = size.height - (2 * Blockly.BlockSvg.INLINE_PADDING_Y);
    // } else {
    //   renderedField.height = size.height;
    // }

    renderedField.height = size.height;
    renderedField.width = size.width;
  }
};

padFields = function(renderedInput) {
  var fields = renderedInput.fields;

  // Spacers sit between fields.
  // SEP_SPACE_X is the minimum separation between fields, but two editable
  // fields will get a bit of extra separation.
  // TODO: Check bounds on this loop.
  for (var i = 2; i < fields.length - 2; i += 2) {
    console.log(i);
    var spacer = fields[i];
    var prevField = fields[i - 1];
    var nextField = fields[i + 1];

    if (prevField && nextField && prevField.EDITABLE && nextField.EDITABLE) {
      spacer.width = Blockly.BlockSvg.SEP_SPACE_X * 2;
    } else {
      spacer.width = Blockly.BlockSvg.SEP_SPACE_X;
    }
  }

  // If there is at least one rendered field and there's an input tab, add a
  // spacer between the last field and the input tab.
  if ((renderedInput.type == Blockly.INPUT_VALUE  ||
      renderedInput.type == Blockly.NEXT_STATEMENT) && fields.length > 1) {
    console.log('last spacer before an input');
    fields[fields.length - 1].width = Blockly.BlockSvg.SEP_SPACE_X;
  }
};

createRows = function(block, info) {
  // necessary data
  var isInline = block.getInputsInline() && !block.isCollapsed();
  info.isInline = isInline;

  // algorithm
  var rowArr = [];
  var activeRow = new Row();

  var icons = block.getIcons();
  if (icons.length) {
    for (var i = 0; i < icons.length; i++) {
      activeRow.elements.push(new IconElement(icons[i]));
    }
  }

  for (var i = 0; i < block.inputList.length; i++) {
    var input = block.inputList[i];
    for (var f = 0; f < input.fieldRow.length; f++) {
      var field = input.fieldRow[f];
      activeRow.elements.push(new FieldElement(field));
    }
    if (isInline && input.type == Blockly.INPUT_VALUE) {
      activeRow.elements.push(new InlineInputElement(input));
    } else {
      if (input.type == Blockly.NEXT_STATEMENT) {
        activeRow.elements.push(new StatementInputElement(input));
      } else if (input.type == Blockly.INPUT_VALUE) {
        activeRow.elements.push(new ExternalValueInputElement(input));
      }
      rowArr.push(activeRow);
      activeRow = new Row();
    }
  }

  if (activeRow.elements.length) {
    rowArr.push(activeRow);
  }

  info.rows = rowArr;
};

setShouldSquareCorners = function(block, info) {
  var prevBlock = block.getPreviousBlock();
  var nextBlock = block.getNextBlock();

  info.squareTopLeftCorner =
      !!block.outputConnection ||
      info.startHat ||
      (prevBlock && prevBlock.getNextBlock() == this);

  info.squareBottomLeftCorner = !!block.outputConnection || !!nextBlock;
};

setHasStuff = function(block, info) {
  for (var i = 0; i < block.inputList.length; i++) {
    var input = block.inputList[i];
    if (input.type == Blockly.DUMMY_INPUT) {
      info.hasDummy = true;
    } else if (input.type == Blockly.INPUT_VALUE) {
      info.hasValue = true;
    } else if (input.type == Blockly.NEXT_STATEMENT) {
      info.hasStatement = true;
    } else {
      throw new Error('what why');
    }
  }
};

IconElement = function(icon) {
  this.isInput = false;
  this.width = 0;
  this.height = 0;
  this.icon = icon;
  this.isVisible = icon.isVisible();
  this.renderRect = null;
  this.type = 'icon';
};

IconElement.prototype.measure = function() {
  console.log('measure icon element');
  this.height = 16;
  this.width = 16;
};

FieldElement = function(field) {
  this.isInput = false;
  this.width = 0;
  this.height = 0;
  this.field = field;
  this.renderRect = null;
  this.isEditable = field.isCurrentlyEditable();
  this.type = 'field';
};

FieldElement.prototype.measure = function() {
  console.log('measure field element');
  var size = this.field.getCorrectedSize();
  this.height = size.height;
  this.width = size.width;
};

InlineInputElement = function(input) {
  this.isInput = true;
  this.width = 0;
  this.height = 0;
  this.connectedBlockWidth = 0;
  this.connectedBlockHeight = 0;
  this.input = input;
  this.connectedBlock = input.connection && input.connection.targetBlock() ?
      input.connection.targetBlock() : null;
  this.type = 'inline input';
};

InlineInputElement.prototype.measure = function() {
  console.log('measure inline input');
  this.width = 22;
  this.height = 26;
};

StatementInputElement = function(input) {
  this.isInput = true;
  this.width = 0;
  this.height = 0;
  this.connectedBlockWidth = 0;
  this.connectedBlockHeight = 0;
  this.input = input;
  this.connectedBlock = input.connection && input.connection.targetBlock() ?
      input.connection.targetBlock() : null;
  this.type = 'statement input';
};

StatementInputElement.prototype.measure = function() {
  console.log('measure statement input');
  this.width = 25;
  this.height = 20;
};

ExternalValueInputElement = function(input) {
  this.isInput = true;
  this.width = 0;
  this.height = 0;
  this.connectedBlockWidth = 0;
  this.connectedBlockHeight = 0;
  this.input = input;
  this.connectedBlock = input.connection && input.connection.targetBlock() ?
      input.connection.targetBlock() : null;
  this.type = 'statement input';
};

ExternalValueInputElement.prototype.measure = function() {
  console.log('measure external value input');
  this.width = 10;
  this.height = 20;
};

Row = function() {
  this.elements = [];
  this.width = 0;
  this.height = 0;
};

Row.prototype.measure = function() {
  console.log('measure row');
  for (var e = 0; e < this.elements.length; e++) {
    var elem = this.elements[e];
    this.width += elem.width;
    if (!(elem instanceof ElemSpacer)) {
      this.height = Math.max(this.height, elem.height);
    }
  }
};

RowSpacer = function(height) {
  this.height = height;
  this.rect = null;
};

ElemSpacer = function(width) {
  this.width = width;
  this.rect = null;
};
