const extractOptions = () => {
  const commandLineArgs = process.argv.slice(2);
  const options = {};

  commandLineArgs.forEach((arg, i) => {
    if (arg === "-m" || arg === "-y")
      options[arg[1]] = parseInt(commandLineArgs[i + 1]);
  });
  return options;
};

const createCustomDate = (options) => {
  let customDate = new Date();

  if (options.y) customDate.setFullYear(options.y);
  if (options.m) customDate.setMonth(options.m - 1);
  return customDate;
};

const getLastDay = (date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

const formatMonthCalendar = (dateOjt, lastDay) => {
  for (let day = 1; day <= lastDay; day++) {
    dateOjt.setDate(day);
    const dayString = dateOjt.getDate().toString().padStart(2, " ");
    const formattedDay =
      dateOjt.getDate() === 1
        ? "   ".repeat(dateOjt.getDay()) + dayString
        : dayString;

    const separator = dateOjt.getDay() === 6 ? "\n" : " ";
    process.stdout.write(formattedDay + separator);
  }
};

const outputCal = (displayDate, lastDay) => {
  const formattedMonthHeader = `${
    displayDate.getMonth() + 1
  }月 ${displayDate.getFullYear()}\n`.padStart(15, " ");

  process.stdout.write(formattedMonthHeader);
  process.stdout.write(week.join(" ") + "\n");
  formatMonthCalendar(displayDate, lastDay);
};

const week = ["日", "月", "火", "水", "木", "金", "土"];

const userOptions = extractOptions();

const targetDate = createCustomDate(userOptions);

const MonthLastDay = getLastDay(targetDate);

outputCal(targetDate, MonthLastDay);
