const vscode = require('vscode');

const {
  registerCommand,
  getEditor,
  // commandQuickPick,

  insertText,
  // getSelectedText,
} = require(`./lib/libVSCode.js`);

const {
  // equalMonth,
  // equalDate,
  // equalToday,
  // monthDayCount,
  dateToStringJp,
  // getDateArrayWeeklyMonth,
  // textCalendarLineVertical,
  textCalendarMonthly,
} = require(`./lib/libDate.js`);

const createDateToString = () => {

  const dayOfWeekKeys = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const dayOfWeekCustomNamesShort = [];
  const customDayOfWeekShort = vscode.workspace
    .getConfiguration(`SmartInsertDate`).get(`CustomDayOfWeekShort`)
  for (const key of dayOfWeekKeys) {
    dayOfWeekCustomNamesShort.push(customDayOfWeekShort[key] ?? ``);
  }

  const dayOfWeekCustomNamesLong = [];
  const customDayOfWeekLong = vscode.workspace
    .getConfiguration(`SmartInsertDate`).get(`CustomDayOfWeekLong`)
  for (const key of dayOfWeekKeys) {
    dayOfWeekCustomNamesLong.push(customDayOfWeekLong[key] ?? ``);
  }

  return (date, format) => {
    return dateToStringJp(
      date,
      format,
      dayOfWeekCustomNamesShort,
      dayOfWeekCustomNamesLong,
    );
  };
}

const extensionMain = (commandName) => {
  const editor = getEditor(); if (!editor) { return; }

  const setting = {
    title: "MMMMM YYYY ddd D \"Space2\"",
    headerFormat: "LMMMMM              YYYY",
    dayOfWeekFormat: "ddd",
    dateFormat: "SD",
    space: "  ",
    otherMonthDate: false,
    startDayOfWeek: "Sun"
  };

  const {
    startDayOfWeek,
    headerFormat,
    dayOfWeekFormat,
    dateFormat,
    space,
    otherMonthDate,
  } = setting;

  const targetDate = new Date();

  const dateToString = createDateToString();

  const calendarText = textCalendarMonthly(
    {
      targetDate,
      dateToString,
      startDayOfWeek,
      headerFormat,
      dayOfWeekFormat,
      dateFormat,
      space,
      otherMonthDate,
    }
  );
  insertText(editor, calendarText)

};

function activate(context) {

  registerCommand(context, `vscode-insert-calendar.SquareCalendarThisMonth`, () => {
    extensionMain(`SquareCalendarThisMonth`);
  });
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
