/**
 * World's Smallest Bakery — Google Sheets form handler
 *
 * YOUR SPREADSHEET:
 * https://docs.google.com/spreadsheets/d/182M66h0pLeU2CkBM5A9lEMSWFGyCNIdaKxWm0RGRdEU/edit
 *
 * SETUP (one time):
 * 1. Open your spreadsheet (link above).
 * 2. Go to Extensions → Apps Script.
 * 3. Delete any default code and paste this entire file.
 * 4. Click Run on setupSheetHeaders (first time only) → allow permissions.
 * 5. Click Deploy → New deployment → Web app
 *      Execute as: Me
 *      Who has access: Anyone
 * 6. Copy the Web app URL (starts with https://script.google.com/macros/s/...)
 * 7. Paste it into index.html as GOOGLE_SCRIPT_URL and push to GitHub.
 */

var SPREADSHEET_ID = "182M66h0pLeU2CkBM5A9lEMSWFGyCNIdaKxWm0RGRdEU";
var SHEET_NAME = "Sheet1";

function getOrderSheet() {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.getSheets()[0];
  }

  return sheet;
}

function setupSheetHeaders() {
  var sheet = getOrderSheet();
  var headers = ["Timestamp", "Name", "Phone", "Email", "Item", "Message"];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    return;
  }

  var firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  var isEmpty = firstRow.join("").trim() === "";

  if (isEmpty) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function doPost(e) {
  try {
    var sheet = getOrderSheet();
    setupSheetHeaders();

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.name || "",
      data.phone || "",
      data.email || "",
      data.item || "",
      data.message || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "Bakery order form is ready." }))
    .setMimeType(ContentService.MimeType.JSON);
}
