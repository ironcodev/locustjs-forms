"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setMaxVisiblePages = exports.setMaxPageSize = exports.pagingCalc = void 0;

var _locustjsBase = require("locustjs-base");

var MAX_PAGE_SIZE = 200;
var MAX_VISIBLE_PAGES = 20;

var pagingCalc = function pagingCalc(page, recordCount, pageSize, visiblePages) {
  var result = {
    page: page,
    recordCount: recordCount,
    pageSize: pageSize,
    visiblePages: visiblePages,
    pageCount: 0
  };

  if (!(0, _locustjsBase.isNumeric)(result.page) || result.page < 1) {
    result.page = 1;
  }

  result.page = parseInt(result.page);

  if (!(0, _locustjsBase.isNumeric)(result.pageSize) || result.pageSize < 1 || result.pageSize > MAX_PAGE_SIZE) {
    result.pageSize = 10;
  }

  result.pageSize = parseInt(result.pageSize);

  if (!(0, _locustjsBase.isNumeric)(result.recordCount) || result.recordCount < 0) {
    result.recordCount = 0;
  }

  result.recordCount = parseInt(result.recordCount);
  result.pageCount = Math.floor(result.recordCount / result.pageSize);

  if (result.pageCount == 0) {
    result.pageCount = 1;
  }

  if (result.recordCount > result.pageCount * result.pageSize) {
    result.pageCount++;
  }

  if (result.pageCount > 0 && result.page > result.pageCount) {
    result.page = result.pageCount;
  }

  if (!(0, _locustjsBase.isNumeric)(result.visiblePages) || result.visiblePages < 0 || result.visiblePages > MAX_VISIBLE_PAGES) {
    result.visiblePages = 8;
  }

  result.fromPage = Math.ceil(result.page / result.visiblePages);
  result.fromPage = (result.fromPage - 1) * result.visiblePages + 1;
  result.toPage = result.fromPage + result.visiblePages - 1;

  if (result.toPage > result.pageCount) {
    result.toPage = result.pageCount;
  }

  result.fromRow = (result.page - 1) * result.pageSize + 1;
  result.toRow = result.fromRow + result.pageSize - 1;

  if (result.toRow > result.recordCount) {
    result.toRow = result.recordCount;
  }

  return result;
};

exports.pagingCalc = pagingCalc;

var setMaxPageSize = function setMaxPageSize(pageSize) {
  if ((0, _locustjsBase.isNumeric)(pageSize)) {
    MAX_PAGE_SIZE = parseInt(pageSize);
  }
};

exports.setMaxPageSize = setMaxPageSize;

var setMaxVisiblePages = function setMaxVisiblePages(visiblePages) {
  if ((0, _locustjsBase.isNumeric)(visiblePages)) {
    MAX_VISIBLE_PAGES = parseInt(visiblePages);
  }
};

exports.setMaxVisiblePages = setMaxVisiblePages;