const vscode = require('vscode');

const {
  registerCommand,
  getEditor,
  commandQuickPick,

  insertText,
  // getSelectedText,
} = require(`./lib/libVSCode.js`);

const {
  // isUndefined,
  // _dateToString,
  _Year,
  _Month,
  _Day,
} = require(`./parts/parts.js`);

const {
  equalMonth,
  // equalDate,
  // equalToday,
  // monthDayCount,
  dateToStringJp,
  getDateArrayWeeklyMonth,
  textCalendarLineVertical,
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
    if (calendarType === `Square`) {
      for (const [index, setting] of settings.entries()) {
        commands.push({
          label: dateToString(targetDate, setting.title),
          description: ``,
          func: () => {
            const calendarText = textCalendarMonthly(
              {
                targetDate,
                dateToString,
                ...setting
              }
            );
            insertText(editor, calendarText)
          }
        });
      }
    } else if (calendarType === `Vertical`) {
      for (const [index, setting] of settings.entries()) {
        commands.push({
          label: dateToString(targetDate, setting.title),
          description: ``,
          func: () => {
            const targetDates = getDateArrayWeeklyMonth(
              _Day(`today`), setting.startDayOfWeek
            );
            const calendarText = textCalendarLineVertical(
              {
                targetDates,
                dateToString,
                ...setting,
              }
            );
            insertText(editor, calendarText)
          }
        });
      }
    } else {
      throw new Error(`selectCalendarType calendarType`);
    }
  }
  commandQuickPick(
    commands,
    placeHolder
  );
};

const selectMonth = ({
  editor, dateToString
}) => {

  const selectDateRange200Year = () => {

    const dateThisYear = _Year(`this`);
    const dateLastYear = _Year(-1, dateThisYear);
    const dateNextYear = _Year(+1, dateThisYear);

    const yearThis =  dateThisYear.getFullYear();
    commandQuickPick([
      {
        label: `${yearThis - 100} - ${yearThis - 10 - 1} : 100 year before`,
        description: `▸`,
        func: () => { selectTenYear(_Year(-100, dateThisYear)); }
      },
      {
        label: `${yearThis - 10} - ${yearThis - 2} : 10 year before`,
        description: `▸`,
        func: () => { selectOneYear(_Year(-10, dateThisYear), 9); }
      },
      {
        label: `${yearThis - 1} : Last year`,
        description: `▸`,
        func: () => { selectMonthInYear(dateLastYear); }
      },
      {
        label: `${yearThis} : This year`,
        description: `▸`,
        func: () => { selectMonthInYear(dateThisYear); }
      },
      {
        label: `${yearThis + 1} : Next year`,
        description: `▸`,
        func: () => { selectMonthInYear(dateNextYear); }
      },
      {
        label: `${yearThis + 2} - ${yearThis + 10} : 10 year after`,
        description: `▸`,
        func: () => { selectOneYear(_Year(2, dateThisYear), 9); }
      },
      {
        label: `${yearThis + 10 + 1} - ${yearThis + 100} : 100 year after`,
        description: `▸`,
        func: () => { selectTenYear(_Year(11, dateThisYear)); }
      },
    ], `Insert Calendar : Select Month : Select Year range -100 to +100`);
  }

  const selectTenYear = (dateYear) => {
    const commands = [];
    for (let i = 0; i <= 8; i += 1) {
      const targetDate = _Year(i * 10, dateYear);
      commands.push({
        label: `${dateToString(targetDate, `YYYY`)} - ${dateToString(_Year(9, targetDate), `YYYY`)}`,
        description: `▸`,
        func: () => { selectOneYear(targetDate, 10); },
      });
    }
    commandQuickPick(commands,
      `Insert Calendar : Select Month : ` +
      `${dateToString(dateYear, `YYYY`)} - ${dateToString(_Year(89, dateYear), `YYYY`)}`);
  };

  const selectOneYear = (dateYear, count) => {
    const commands = [];
    for (let i = 0; i <= count - 1; i += 1) {
      const targetDate = _Year(i, dateYear);
      commands.push({
        label: dateToString(targetDate, `YYYY`),
        description: `▸`,
        func: () => { selectMonthInYear(targetDate); },
      });
    }
    commandQuickPick(commands,
      `Insert Calendar : Select Month : ` +
      `${dateToString(dateYear, `YYYY`)} - ${dateToString(_Year(9, dateYear), `YYYY`)}`);
  };

  const selectMonthInYear = (dateYear) => {
    const commands = [];
    for (let i = 1; i <= 12; i += 1) {
      const targetDate = _Month(i - 1, dateYear);
      const isThisMonth = equalMonth(targetDate, _Month(`this`));
      commands.push({
        label: dateToString(targetDate, `MM : YYYY-MM : MMM`) +
        (isThisMonth ? ` : This month` : ``),
        description: `▸`,
        func: () => {
          selectCalendarType({
            editor, dateToString,
            targetDate,
            placeHolder: `Insert Calendar : ${dateToString(targetDate, `YYYY-MM`)} : Select Calendar Type`,
            calendarTypes: [`Square`, `Vertical`],
          });
        },
      });
    }
    commandQuickPick(commands,
      `Insert Calendar : Select Month : ` +
      `${dateYear.getFullYear()}`);
  };

  const dateThisYear = _Year(`this`);
  const dateLastYear = _Year(-1, dateThisYear);
  const dateNextYear = _Year(+1, dateThisYear);

  const dateThisMonth = _Month(`this`);
  const dateLastMonth = _Month(-1, dateThisMonth);
  const dateNextMonth = _Month(+1, dateThisMonth);

  commandQuickPick([
    {
      label: `This Month | `
      + `${dateToString(dateThisMonth, `YYYY-MM : MMM`)}`,
      description: `▸`,
      func: () => {
        selectCalendarType({
          editor, dateToString,
          targetDate: dateThisMonth,
          placeHolder: `Insert Calendar : This Month : Select Calendar Type`,
          calendarTypes: [`Square`, `Vertical`],
        });
      }
    },
    {
      label: `-1 Month | Last Month | `
      + `${dateToString(dateLastMonth, `YYYY-MM : MMM`)}`,
      description: `▸`,
      func: () => {
        selectCalendarType({
          editor, dateToString,
          targetDate: dateLastMonth,
          placeHolder: `Insert Calendar : Last Month : Select Calendar Type`,
          calendarTypes: [`Square`, `Vertical`],
        });
      }
    },
    {
      label: `+1 Month | Next Month | `
      + `${dateToString(dateNextMonth, `YYYY-MM : MMM`)}`,
      description: `▸`,
      func: () => {
        selectCalendarType({
          editor, dateToString,
          targetDate: dateNextMonth,
          placeHolder: `Insert Calendar : Next Month : Select Calendar Type`,
          calendarTypes: [`Square`, `Vertical`],
        });
      }
    },
    {label: ``, kind: vscode.QuickPickItemKind.Separator},
    {
      label: `This Year | ${dateThisYear.getFullYear()}`,
      description: `▸`,
      func: () => { selectMonthInYear(dateThisYear); }
    },
    {
      label: `-1 Year | Last Year | ${dateLastYear.getFullYear()}`,
      description: `▸`,
      func: () => { selectMonthInYear(dateLastYear); }
    },
    {
      label: `+1 Year | Next Year | ${dateNextYear.getFullYear()}`,
      description: `▸`,
      func: () => { selectMonthInYear(dateNextYear); }
    },
    {label: ``, kind: vscode.QuickPickItemKind.Separator},
    {
      label: `Select Year range -100 to +100`,
      description: `▸`,
      func: () => { selectDateRange200Year(); }
    },
  ], `Insert Calendar : Select Month`);
}

const extensionMain = (commandName) => {
  const editor = getEditor(); if (!editor) { return; }

  const dateToString = createDateToString();

  switch (commandName) {

    case `SelectCalendarType`: {
      selectCalendarType({
        editor, dateToString,
        targetDate: new Date(),
        placeHolder: `Insert Calendar : This Month : Select Calendar Type`,
        calendarTypes: [`Square`, `Vertical`],
      });
    }; break;

    case `SelectMonth`: {
      selectMonth({
        editor, dateToString,
      });
    }; break;
  }
};

function activate(context) {

  registerCommand(context,
    `vscode-insert-calendar.SelectCalendarType`,
    () => { extensionMain(`SelectCalendarType`); }
  );

  registerCommand(context,
    `vscode-insert-calendar.SelectMonth`,
    () => { extensionMain(`SelectMonth`); }
  );

}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
