# Insert Calendar

[![](https://vsmarketplacebadges.dev/version-short/SatoshiYamamoto.vscode-insert-calendar.png)](https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-insert-calendar)
[![](https://vsmarketplacebadges.dev/installs-short/SatoshiYamamoto.vscode-insert-calendar.png)](https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-insert-calendar)
[![](https://vsmarketplacebadges.dev/rating-short/SatoshiYamamoto.vscode-insert-calendar.png)](https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-insert-calendar)
[![](https://img.shields.io/github/license/standard-software/vscode-insert-calendar.png)](https://github.com/standard-software/vscode-insert-calendar/blob/main/LICENSE)

This extension inserts formatted calendar into the editor.
Month can be selected in years.

## Output Example

Your output can be changed in the settings. You can also output the following by default

### Square Calendar

---
> Space1
```
2024         January
Su Mo Tu We Th Fr Sa
    1  2  3  4  5  6
 7  8  9 10 11 12 13
14 15 16 17 18 19 20
21 22 23 24 25 26 27
28 29 30 31         
```

---
> Space2
```
January                2024
Sun Mon Tue Wed Thu Fri Sat
      1   2   3   4   5   6
  7   8   9  10  11  12  13
 14  15  16  17  18  19  20
 21  22  23  24  25  26  27
 28  29  30  31            
```

---
> Space2 OtherMonth StartMonday
```
Jan.                   2024
Mon Tue Wed Thu Fri Sat Sun
 01  02  03  04  05  06  07
 08  09  10  11  12  13  14
 15  16  17  18  19  20  21
 22  23  24  25  26  27  28
 29  30  31  01  02  03  04
```

---
> Frame
```
+-----------------------------------------+
| January                            2024 |
| Sun : Mon : Tue : Wed : Thu : Fri : Sat |
+-----------------------------------------+
|     :  01 :  02 :  03 :  04 :  05 :  06 |
+ - - - - - - - - - - - - - - - - - - - - +
|  07 :  08 :  09 :  10 :  11 :  12 :  13 |
+ - - - - - - - - - - - - - - - - - - - - +
|  14 :  15 :  16 :  17 :  18 :  19 :  20 |
+ - - - - - - - - - - - - - - - - - - - - +
|  21 :  22 :  23 :  24 :  25 :  26 :  27 |
+ - - - - - - - - - - - - - - - - - - - - +
|  28 :  29 :  30 :  31 :     :     :     |
+-----------------------------------------+
```

### Vertical Calendar

```
2023/12
  31 Sun
2024/01
  01 Mon
  02 Tue
  03 Wed
:
  29 Mon
  30 Tue
  31 Wed
2024/02
  01 Thu
  02 Fri
  03 Sat
```

```
Dec 2023
  2023/12/31 Sun
Jan 2024
  2024/01/01 Mon
  2024/01/02 Tue
  2024/01/03 Wed
:
  2024/01/29 Mon
  2024/01/30 Tue
  2024/01/31 Wed
Feb 2024
  2024/02/01 Thu
  2024/02/02 Fri
  2024/02/03 Sat
```

```
2024/01
  29 Mon
  30 Tue
  31 Wed
2024/02
  01 Thu
  02 Fri
  03 Sat
:
  27 Tue
  28 Wed
  29 Thu
2024/03
  01 Fri
  02 Sat
  03 Sun
```

## Command

```
- Insert Calendar : This Month : Select Calendar Type...
- Insert Calendar : Select Month...
```

![](https://raw.githubusercontent.com/standard-software/vscode-insert-calendar/main/img/readme_command_win.png)

## Usage

### Select Calendar Type

- run [Insert Calendar : This Month : Select Calendar Type...]

![](https://raw.githubusercontent.com/standard-software/vscode-insert-calendar/main/img/readme_selectcalendar1.png)

- The calendar text will be inserted into the editor after selection.

### Select Month

- run [Insert Calendar : Select Month...]

![](https://raw.githubusercontent.com/standard-software/vscode-insert-calendar/main/img/readme_selectmonth1.png)

- Select Month -> Select Calendar Type

- Select Year -> Select Month -> Select Calendar Type

![](https://raw.githubusercontent.com/standard-software/vscode-insert-calendar/main/img/readme_selectmonth2.png)

- Select Year Range -> Select Year -> Select Month -> Select Calendar Type
![](https://raw.githubusercontent.com/standard-software/vscode-insert-calendar/main/img/readme_selectmonth3.png)

## Date Format String

> For example  
>  2023-12-16 Sat 00:26
>  YYYY-MM-DD ddd HH:mm

_ = Space

| Format  | Value     | Memo  |
| -       | -         | -     |
| `YYYY`  | 2022      |
| `YY`    | 22        |
| `MM`    | 01        |
| `M`     | 1         |
| `SM`    | _1        |
| `DD`    | 09        |
| `D`     | 9         |
| `SD`    | _9        | 
| `HH`    | 18        |
| `H`     | 18        | 0-24
| `hh`    | 06        | 0-12,1-23
| `h`     | 6         |
| `mm`    | 05        |
| `m`     | 5         |
| `ss`    | 07        |
| `s`     | 7         |
| `SSS`   | 999       | 000-999 MilliSeconds
| `SS`    | 99        | 00-99  MilliSeconds
| `S`     | 9         | 0-9  MilliSeconds
| `aa`    | pm        | am,pm
| `AA`    | PM        | AM,PM
| `a`     | a         | a,p
| `A`     | A         | A,P
| `dd`    | Su        | Su,Mo,Tu,We,Th,Fr,Sa
| `ddd`   | Sun       | Sun,Mon,Tue,Wed,Thu,Fri,Sat
| `dddd`  | Sunday    | Sunday,Monday,Tuesday,...
| `MMM`   | Jan       | Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec
| `MMMM`  | Jan.      | Jan.,Feb.,Mar.,Apr.,May,June,July,Aug.,Sep.,Oct.,Nov.,Dec.
| `MMMMM` | January   |
| `Z`     | 09:00     | timezone
| `ZZ`    | 0900      | timezone
| `LMMMMM`| January__ | Left align space-filling
| `RMMMMM`| __January | Right align space-filling

## Setting

settings.json

```json
{
  "InsertCalendar.SquareCalendar": [
    {
      "title": "\"Space1\" : YYYY MMMMM : dd D",
      "format": [
        [
          "YYYY       RMMMMM",
          ["","dd", " ", ""]
        ],
        [
          ["", "SD", " ", ""]
        ],
        [],
        []
      ],
      "otherMonthDate": false,
      "startDayOfWeek": "Sun"
    },
    {
      "title": "\"Space2\" : MMMMM YYYY : ddd SD",
      "format": [
        [
          "LMMMMM              YYYY",
          ["","ddd", " ", ""]
        ],
        [
          [" ", "SD", "  ", ""]
        ],
        [],
        []
      ],
      "otherMonthDate": false,
      "startDayOfWeek": "Sun"
    },
    {
      "title": "\"Space2 OtherMonth StartMonday\" : MMMM YYYY : ddd DD",
      "format": [
        [
          "MMMM                   YYYY",
          ["","ddd", " ", ""]
        ],
        [
          [" ", "DD", "  ", ""]
        ],
        [],
        []
      ],
      "otherMonthDate": true,
      "startDayOfWeek": "Mon"
    },
    {
      "title": "\"Frame\" : MMMM YYYY : ddd DD",
      "format": [
        [
          "+-----------------------------------------+",
          "| LMMMMM                          YYYY |",
          ["|"," ddd ", ":", "|"],
          "+-----------------------------------------+"
        ],
        [
          ["|", "  DD  ", ":", "|"]
        ],
        [
          "+ - - - - - - - - - - - - - - - - - - - - +"
        ],
        [
          "+-----------------------------------------+"
        ]
      ],
      "otherMonthDate": false,
      "startDayOfWeek": "Sun"
    }
  ],
  "InsertCalendar.VerticalCalendar": [
    {
      "title": "YYYY/MM|  DD  ddd",
      "headerFormat": "YYYY/MM",
      "lineFormat": "  DD ddd",
      "startDayOfWeek": "Sun"
    },
    {
      "title": "MMM YYYY|  YYYY/MM/DD ddd",
      "headerFormat": "MMM YYYY",
      "lineFormat": "  YYYY/MM/DD ddd",
      "startDayOfWeek": "Sun"
    },
    {
      "title": "\"Start monday : \"YYYY/MM|  DD  ddd",
      "headerFormat": "YYYY/MM",
      "lineFormat": "  DD ddd",
      "startDayOfWeek": "Mon"
    },
    {
      "title": "\"Start monday : \"MMM YYYY|  YYYY/MM/DD ddd",
      "headerFormat": "MMM YYYY",
      "lineFormat": "  YYYY/MM/DD ddd",
      "startDayOfWeek": "Mon"
    }
  ]
}
```

## To Japanese

### Date Format String

| Format  | Value     | Memo  |
| -       | -         | -     |
| `DDD`   | 火        | DayOfWeek text: 日,月,火,水,木,金,土
| `DDDD`  | 火曜日    | DayOfWeek text: 日曜日,月曜日,火曜日,...
| `G`     | R         | Japanese imperial year: R,H,S,T,M 
| `GG`    | 令        | Japanese imperial year: 令,平,昭,大,明 
| `GGG`   | 令和      | Japanese imperial year: 令和,平成,昭和,大正,明治
| `E`     | 6         | A.D.2024 = R6
| `EE`    | 06        | A.D.2024 = R06

### Setting
settings.json

```json
{
  "InsertCalendar.SquareCalendar": [
    {
      "title": "\"空白1\" : YYYY年 M月 : DDD D",
      "format": [
        [
          "YYYY年          SM月",
          ["","DDD", " ", ""]
        ],
        [
          ["", "SD", " ", ""]
        ],
        [],
        []
      ],
      "otherMonthDate": false,
      "startDayOfWeek": "Sun"
    },
    {
      "title": "\"空白2\" : YYYY/MM : DDD SD",
      "format": [
        [
          "YYYY/MM",
          ["","DDD", "  ", ""]
        ],
        [
          ["", "SD", "  ", ""]
        ],
        [],
        []
      ],
      "otherMonthDate": false,
      "startDayOfWeek": "Sun"
    },
    {
      "title": "\"空白3 OtherMonth StartMonday\" : YYYY年(GGGE年)M月 : DDD曜",
      "format": [
        [
          "YYYY年(GGGE年)MM月",
          ["","DDD曜", " ", ""]
        ],
        [
          ["  ", "DD", "   ", ""]
        ],
        [],
        []
      ],
      "otherMonthDate": true,
      "startDayOfWeek": "Mon"
    },
    {
      "title": "\"枠\" : MMMM YYYY : ddd DD",
      "format": [
        [
          "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓",
          "┃ YYYY年(GGGE年)                                 SM月 ┃",
          ["┃","DDDD", "│", "┃"],
          "┠───────────────────────────┨"
        ],
        [
          ["┃", "  DD  ", "│", "┃"]
        ],
        [
          "┠───────────────────────────┨"
        ],
        [
          "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"
        ]
      ],
      "otherMonthDate": false,
      "startDayOfWeek": "Sun"
    }
  ]
}
```



### Output Example

---
> 空白1
```
2024年           1月
日 月 火 水 木 金 土
    1  2  3  4  5  6
 7  8  9 10 11 12 13
14 15 16 17 18 19 20
21 22 23 24 25 26 27
28 29 30 31         
```

---
> 空白2
```
2024/01
日  月  火  水  木  金  土
     1   2   3   4   5   6
 7   8   9  10  11  12  13
14  15  16  17  18  19  20
21  22  23  24  25  26  27
28  29  30  31            
```

---
> 空白3
```
2024年(令和6年)01月
月曜 火曜 水曜 木曜 金曜 土曜 日曜
  01   02   03   04   05   06   07
  08   09   10   11   12   13   14
  15   16   17   18   19   20   21
  22   23   24   25   26   27   28
  29   30   31   01   02   03   04
```

---
> 枠
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 2024年(令和6年)                                  1月 ┃
┃日曜日│月曜日│火曜日│水曜日│木曜日│金曜日│土曜日┃
┠───────────────────────────┨
┃      │  01  │  02  │  03  │  04  │  05  │  06  ┃
┠───────────────────────────┨
┃  07  │  08  │  09  │  10  │  11  │  12  │  13  ┃
┠───────────────────────────┨
┃  14  │  15  │  16  │  17  │  18  │  19  │  20  ┃
┠───────────────────────────┨
┃  21  │  22  │  23  │  24  │  25  │  26  │  27  ┃
┠───────────────────────────┨
┃  28  │  29  │  30  │  31  │      │      │      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```
