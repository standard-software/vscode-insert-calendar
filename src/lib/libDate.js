const {
  isString,
  _dateToString,
  _dayOfWeek,
  _nameOfMonth,
  _Month,
  _Day,
  _Datetime,
  _getDatetime,
  _unique,
  _subFirst, _subLast,
  _paddingFirst, _paddingLast,
} = require(`../parts/parts.js`);

const dayOfWeekEn2 = (date, timezoneOffset) => {
  return _subFirst(_dayOfWeek.names.EnglishShort()[
    _dateToString.rule.dayOfWeek(date, timezoneOffset)
  ], 2);
};

const date2Space = (date, timezoneOffset) => {
  return _paddingFirst(_dateToString.rule.date1(date, timezoneOffset), 2, ` `);
};

const month2Space = (date, timezoneOffset) => {
  return _paddingFirst(_dateToString.rule.month1(date, timezoneOffset), 2, ` `);
};

const monthEnLongLeft = (date, timezoneOffset) => {
  return _paddingLast(_nameOfMonth.names.EnglishLong()[
    _dateToString.rule.month(date, timezoneOffset)
  ], 9, ` `);
};

const monthEnLongRight = (date, timezoneOffset) => {
  return _paddingFirst(_nameOfMonth.names.EnglishLong()[
    _dateToString.rule.month(date, timezoneOffset)
  ], 9, ` `);
};

const japaneseCalenderYear = (date) => {
  const result = {};
  const reiwaStart = _Datetime(2019, 5, 1);
  const heiseiStart = _Datetime(1989,  1,  8);
  const shouwaStart = _Datetime(1926, 12, 25);
  const taishoStart = _Datetime(1912,  7, 30);
  const meijiStart  = _Datetime(1868,  9,  8);
  if (reiwaStart <= date) {
    result.gengoLong = '令和';
    result.gengoShort = '令';
    result.gengoAlphabet = 'R';
    result.year = (date.getFullYear() - reiwaStart.getFullYear() + 1);
  } else if (heiseiStart <= date) {
    result.gengoLong = '平成';
    result.gengoShort = '平';
    result.gengoAlphabet = 'H';
    result.year = (date.getFullYear() - heiseiStart.getFullYear() + 1);
  } else if (shouwaStart <= date) {
    result.gengoLong = '昭和';
    result.gengoShort = '昭';
    result.gengoAlphabet = 'S';
    result.year = (date.getFullYear() - shouwaStart.getFullYear() + 1);
  } else if (taishoStart <= date) {
    result.gengoLong = '大正';
    result.gengoShort = '大';
    result.gengoAlphabet = 'T';
    result.year = (date.getFullYear() - taishoStart.getFullYear() + 1);
  } else if (meijiStart <= date) {
    result.gengoLong = '明治';
    result.gengoShort = '明';
    result.gengoAlphabet = 'M';
    result.year = (date.getFullYear() - meijiStart.getFullYear() + 1);
  } else {
    result.gengoLong = '';
    result.gengoShort = '';
    result.gengoAlphabet = '';
    result.year = date.getFullYear();
  }
  return result;
};

const dateToStringJp = (date, format,
  dayOfWeekCustomNamesShort,
  dayOfWeekCustomNamesLong,
) => {
  const rule = _dateToString.rule.Default();
  rule[`dd`] = { func: dayOfWeekEn2 };
  rule[`SD`] = { func: date2Space };
  rule[`SM`] = { func: month2Space };
  rule[`LMMMMM`] = { func: monthEnLongLeft };
  rule[`RMMMMM`] = { func: monthEnLongRight };
  rule[`DDD`] = {
    func: (date, timezoneOffset) => dayOfWeekCustomNamesShort[
      _dateToString.rule.dayOfWeek(date, timezoneOffset)
    ]
  };
  rule[`DDDD`] = {
    func: (date, timezoneOffset) => dayOfWeekCustomNamesLong[
      _dateToString.rule.dayOfWeek(date, timezoneOffset)
    ]
  };
  rule[`GGG`] = {
    func: (date) => {
      return japaneseCalenderYear(date).gengoLong;
    }
  };
  rule[`GG`] = {
    func: (date) => {
      return japaneseCalenderYear(date).gengoShort;
    }
  };
  rule[`G`] = {
    func: (date) => {
      return japaneseCalenderYear(date).gengoAlphabet;
    }
  };
  rule[`EE`] = {
    func: (date) => {
      return _paddingFirst(japaneseCalenderYear(date).year.toString(), 2, `0`);
    }
  };
  rule[`E`] = {
    func: (date) => {
      return japaneseCalenderYear(date).year.toString();
    }
  };

  return _dateToString(
    date, format, undefined, rule,
  );
};

const getBeforeDate = (sourceDate, func) => {
  let date = _Day(-1, sourceDate);
  while (true) {
    if (func(date)) {
      return date;
    }
    date = _Day(-1, date);
  }
};

const getBeforeDayOfWeek = (sourceDate, dayOfWeek) => {
  return getBeforeDate(_Day(1, sourceDate), (date) => {
    return date.getDay() === dayOfWeek;
  });
};

const getDateArrayInWeek = (sourceDate, startDayOfWeek) => {
  if (![`Sun`, `Mon`].includes(startDayOfWeek)) {
    throw new Error(`getDateArrayInWeek startDayOfWeek`);
  }
  const result = [];
  const startDate = getBeforeDayOfWeek(
    sourceDate, _dayOfWeek.names.EnglishShort().indexOf(startDayOfWeek)
  );
  result.push(startDate);
  result.push(_Day(1, startDate));
  result.push(_Day(2, startDate));
  result.push(_Day(3, startDate));
  result.push(_Day(4, startDate));
  result.push(_Day(5, startDate));
  result.push(_Day(6, startDate));
  return result;
};

const getDateArrayInMonth = (sourceDate) => {
  const result = [];
  const startDate = _Month(`this`, sourceDate);
  const endDate = _Day(-1, _Month(`next`, sourceDate));
  const {date: dayCount} = _getDatetime(endDate);
  for (let i = 0; i < dayCount; i += 1) {
    result.push(_Day(i, startDate));
  }
  return result;
};

const getDateArrayWeeklyMonth = (sourceDate, startDayOfWeek) => {
  const dateStart = _Month(`this`, sourceDate);
  const dateEnd = _Day(-1, _Month(`next`, dateStart));
  return _unique(
    [
      ...getDateArrayInWeek(dateStart, startDayOfWeek),
      ...getDateArrayInMonth(dateStart),
      ...getDateArrayInWeek(dateEnd, startDayOfWeek),
    ],
    v => v.getTime()
  );
};

const equalDatetime = (sourceDate, targetDate, compareItems) => {
  if (!compareItems.every(
    i => [
      `year`, `month`, `date`, `hours`, `minutes`, `seconds`, `milliseconds`
    ].includes(i)
  )) {
    throw new Error(`equalDate compareItems:${compareItems}`);
  }
  const source = _getDatetime(sourceDate);
  const target = _getDatetime(targetDate);
  return compareItems.every(i => source[i] === target[i]);
};

const equalMonth = (sourceDate, baseDate) => {
  return equalDatetime(sourceDate, baseDate, [`year`, `month`]);
};

const equalDate = (sourceDate, baseDate) => {
  return equalDatetime(sourceDate, baseDate, [`year`, `month`, `date`]);
};

const equalToday = (sourceDate) => {
  return equalDate(sourceDate, new Date());
};

const monthDayCount = (date) => {
  const {year, month } = _getDatetime(date);
  const target = _Datetime(year, month + 1, 1);
  return _getDatetime(_Day(-1, target)).date;
};

// Calendar
const getEndDayOfWeek = (startDayOfWeek) => {
  if (startDayOfWeek === `Sun`) {
    return `Sat`;
  } else if (startDayOfWeek === `Mon`) {
    return `Sun`;
  } else {
    throw new Error(`getEndDayOfWeek startDayOfWeek`);
  }
};

const _textVerticalCalendar = (
  targetDates,
  dateToString,
  {
    pickupDate,
    headerFormat,
    todayFormat,
    lineFormat,
  }
) => {
  let result = ``;
  let headerBuffer = ``;
  for (const date of targetDates) {
    const header = dateToString(date, headerFormat);
    if (headerBuffer !== header) {
      result += `${header}\n`;
    }
    headerBuffer = header;
    if (pickupDate && equalDate(date, pickupDate)) {
      result += dateToString(date, todayFormat);
    } else {
      result += dateToString(date, lineFormat);
    }
    result += `\n`;
  }
  return result;
};

const textVerticalCalendar = (
  targetDate,
  dateToString,
  {
    pickupDate,
    headerFormat,
    todayFormat,
    lineFormat,
    startDayOfWeek,
  }
) => {
  const targetDates = getDateArrayWeeklyMonth(
    targetDate, startDayOfWeek
  );
  return _textVerticalCalendar(
    targetDates,
    dateToString,
    {
      pickupDate,
      headerFormat,
      todayFormat,
      lineFormat,
    }
  );
}

// const _textSquareCalendar = (
//   targetDate,
//   dateToString,
//   {
//     startDayOfWeek,
//     pickupDate,
//     headerFormat,
//     dayOfWeekFormat,
//     dateFormat,
//     indent,
//     spaceDayOfWeek,
//     spaceDate,
//     todayLeft,
//     todayRight,
//     otherMonthDate,
//   }
// ) => {
//   if (![`Sun`, `Mon`].includes(startDayOfWeek)) {
//     throw new Error(`_textSquareCalendar startDayOfWeek`);
//   }
//   const dayOfWeekEnShort = _dayOfWeek.names.EnglishShort();
//   const weekEndDayOfWeek = getEndDayOfWeek(startDayOfWeek);

//   const dateMonthStart = _Month(`this`, targetDate);
//   const dateMonthEnd = _Day(-1, _Month(1, targetDate));

//   let result = `${dateToString(dateMonthStart, headerFormat)}\n`;

//   const weekDates = getDateArrayInWeek(dateMonthStart, startDayOfWeek);

//   const calendarDates = _unique(
//     [
//       ...weekDates,
//       ...getDateArrayInMonth(targetDate),
//       ...getDateArrayInWeek(dateMonthEnd, startDayOfWeek),
//     ],
//     v => v.getTime()
//   );

//   result += indent;
//   for (const date of weekDates) {
//     const dayOfWeek = dateToString(date, dayOfWeekFormat);
//     if (weekDates.indexOf(date) === weekDates.length - 1) {
//       result += dayOfWeek;
//     } else {
//       result += dayOfWeek + spaceDayOfWeek;
//     }
//   }
//   result += `\n`;

//   let todayFlag = false;
//   for (const date of calendarDates) {
//     if (pickupDate && equalDate(date, pickupDate)) {
//       if (dayOfWeekEnShort[date.getDay()] === startDayOfWeek) {
//         result +=
//           _subFirst(indent, indent.length - todayLeft.length) +
//           todayLeft +
//           dateToString(date, dateFormat) +
//           todayRight;
//       } else {
//         result +=
//           _subFirst(spaceDate, spaceDate.length - todayLeft.length) +
//           todayLeft +
//           dateToString(date, dateFormat) +
//           todayRight;
//       }
//       todayFlag = true;
//     } else if (!otherMonthDate && !equalMonth(date, targetDate)) {
//       if (dayOfWeekEnShort[date.getDay()] === startDayOfWeek) {
//         result += indent + `  `;
//       } else {
//         result += (
//           !todayFlag ? spaceDate
//           : _subLast(spaceDate, spaceDate.length - todayRight.length)
//         ) +`  `;
//       }
//       todayFlag = false;
//     } else {
//       if (dayOfWeekEnShort[date.getDay()] === startDayOfWeek) {
//         result += indent + dateToString(date, dateFormat);
//       } else {
//         result += (
//           !todayFlag ? spaceDate
//           : _subLast(spaceDate, spaceDate.length - todayRight.length)
//         ) + dateToString(date, dateFormat);
//       }
//       todayFlag = false;
//     }
//     if (dayOfWeekEnShort[date.getDay()] === weekEndDayOfWeek) {
//       result += `\n`;
//     }
//   }
//   return result;
// };

// const textSquareCalendar = (
//   targetDate,
//   dateToString,
//   {
//     startDayOfWeek,
//     headerFormat,
//     dayOfWeekFormat,
//     dateFormat,
//     spaceDayOfWeek,
//     spaceDate,
//     otherMonthDate,
//   }
// ) => {
//   return _textSquareCalendar(
//     targetDate,
//     dateToString,
//     {
//       startDayOfWeek,
//       headerFormat,
//       dayOfWeekFormat,
//       dateFormat,
//       spaceDayOfWeek,
//       spaceDate,
//       otherMonthDate,

//       pickupDate: undefined,
//       indent: ``,
//       todayLeft: ``,
//       todayRight: ``,
//     }
//   );
// };

const _textSquareCalendar = (
  targetDate,
  dateToString,
  { format, startDayOfWeek, otherMonthDate },
) => {
  if (format.length !== 4) {
    throw new Error(`_textSquareCalendar setting`);
  }
  for (const formatItems of format) {
    if (!Array.isArray(formatItems)) {
      throw new Error(`_textSquareCalendar setting`);
    }
    if (formatItems.length === 0) { continue; }
    if (
      formatItems.every(
        item => isString(item)
        || (Array.isArray(item) && item.length === 4)
      )
    ) { continue; }
    throw new Error(`_textSquareCalendar setting`);
  }

  if (![`Sun`, `Mon`].includes(startDayOfWeek)) {
    throw new Error(`_textSquareCalendar startDayOfWeek`);
  }
  const dayOfWeekEnShort = _dayOfWeek.names.EnglishShort();
  const weekEndDayOfWeek = getEndDayOfWeek(startDayOfWeek);
  const dateMonthStart = _Month(`this`, targetDate);
  const dateMonthEnd = _Day(-1, _Month(1, targetDate));

  const startWeekDates = getDateArrayInWeek(dateMonthStart, startDayOfWeek);

  const calendarDates = _unique(
    [
      ...startWeekDates,
      ...getDateArrayInMonth(targetDate),
      ...getDateArrayInWeek(dateMonthEnd, startDayOfWeek),
    ],
    v => v.getTime()
  );

  const calendarWeeks = [];
  let calendarWeek = [];
  for (const date of calendarDates) {
    calendarWeek.push(date);
    if (dayOfWeekEnShort[date.getDay()] === weekEndDayOfWeek) {
      calendarWeeks.push(calendarWeek);
      calendarWeek = [];
    }
  }

  let result = ``;
  const resultPlusItem = (item, weekDates, otherMonthDate) => {
    if (isString(item)) {
      result += `${dateToString(dateMonthStart, item)}\n`;
    } else {
      result += item[0];
      result += weekDates.map(
        date => {
          const result = dateToString(date, item[1]);
          if (otherMonthDate) {
            return result;
          } else {
            if (equalMonth(date, targetDate)) {
              return result;
            } else {
              return ' '.repeat(result.length)
            }
          }
        }
      ).join(item[2]);
      result += `${item[3]}\n`;
    }
  }
  for (const item of format[0]) {
    resultPlusItem(item, startWeekDates, true);
  }

  for (const weekDates of calendarWeeks) {
    for (const item of format[1]) {
      resultPlusItem(item, weekDates, otherMonthDate);
    }
    if (weekDates === calendarWeeks.at(-1)) { break; }
    for (const item of format[2]) {
      resultPlusItem(item, weekDates, otherMonthDate);
    }
  }
  for (const item of format[3]) {
    resultPlusItem(item, startWeekDates, true);
  }

  return result;
}

const textSquareCalendar = (
  targetDate,
  dateToString,
  { format, startDayOfWeek, otherMonthDate },
) => {
  if (format.length !== 4) {
    return null;
  }
  for (const formatItems of format) {
    if (!Array.isArray(formatItems)) {
      return null;
    }
    if (formatItems.length === 0) { continue; }
    if (
      formatItems.every(
        item => isString(item)
        || (Array.isArray(item) && item.length === 4)
      )
    ) { continue; }
    return null;
  }

  return _textSquareCalendar(
    targetDate,
    dateToString,
    { format, startDayOfWeek, otherMonthDate },
  )
}

module.exports = {
  equalMonth,
  equalDate,
  equalToday,
  monthDayCount,
  dateToStringJp,
  getDateArrayWeeklyMonth,
  textVerticalCalendar,
  textSquareCalendar,
};
