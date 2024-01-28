const vscode = require('vscode');

const {
  registerCommand,
  getEditor,
  commandQuickPick,

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

const getCalendarSettings = (calendarType) => {
  if (!([`Square`, `Vertical`].includes(calendarType))) {
    throw new Error(`getCalendarSettings calendarType`);
  }
  return vscode.workspace
    .getConfiguration(`InsertCalendar`)
    .get(`${calendarType}Calendar`) ?? [];
};

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
    .getConfiguration(`InsertCalendar`).get(`CustomDayOfWeekShort`)
  for (const key of dayOfWeekKeys) {
    dayOfWeekCustomNamesShort.push(customDayOfWeekShort[key] ?? ``);
  }

  const dayOfWeekCustomNamesLong = [];
  const customDayOfWeekLong = vscode.workspace
    .getConfiguration(`InsertCalendar`).get(`CustomDayOfWeekLong`)
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

const selectCalendarType = ({
  editor, dateToString, targetDate, placeHolder, calendarTypes
}) => {
  const commands = [];
  for (const calendarType of calendarTypes) {
    const settings = getCalendarSettings(calendarType);
    if (settings.length !== 0) {
      commands.push(
        {label: calendarType, kind: vscode.QuickPickItemKind.Separator}
      );
    }
    for (const [index, setting] of settings.entries()) {
      commands.push({
        label: dateToString(targetDate, setting.title),
        description: ``,
        func: () => {
          // _insertDateTime(dateType, targetDate, index, format);

          const {
            startDayOfWeek,
            headerFormat,
            dayOfWeekFormat,
            dateFormat,
            space,
            otherMonthDate,
          } = setting;

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

        }
      });
    }
  }
  commandQuickPick(
    commands,
    placeHolder
  );
};

const extensionMain = (commandName) => {
  const editor = getEditor(); if (!editor) { return; }

  const dateToString = createDateToString();

  switch (commandName) {
    case `SquareCalendarThisMonth`: {
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
    }; break;

    case `SelectCalendarType`: {
      selectCalendarType({
        editor, dateToString,
        targetDate: new Date(),
        placeHolder: `Insert Calendar : Select Calendar Type`,
        calendarTypes: [`Square`, `Vertical`],
      });
    }; break;

  }


};

function activate(context) {

  registerCommand(context,
    `vscode-insert-calendar.SquareCalendarThisMonth`,
    () => {
      extensionMain(`SquareCalendarThisMonth`);
    }
  );

  registerCommand(context,
    `vscode-insert-calendar.SelectCalendarType`,
    () => {
      extensionMain(`SelectCalendarType`);
    }
  );


}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
