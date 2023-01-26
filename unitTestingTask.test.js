let unitTestingTask = require("./unitTestingTask");

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2023-01-01T10:00:00"));
});

// TODO: figure out why cleanup doesn't work
beforeEach(() => {
  unitTestingTask = unitTestingTask.noConflict();
  unitTestingTask.lang("en");
});

describe("formatters", () => {
  describe("predefined formats", () => {
    it.each([
      { format: "ISODate", expected: "2023-01-01" },
      { format: "ISOTime", expected: "10:00:00" },
      { format: "ISODateTime", expected: "2023-01-01T10:00:00" },
      { format: "ISODateTimeTZ", expected: "2023-01-01T10:00:00+01:00" },
    ])("should return date in $format format", ({ format, expected }) => {
      const date = unitTestingTask(format);
      expect(date).toBe(expected);
    });
  });

  describe("custom defined formats", () => {
    it.each([
      {
        format: "DDD, d MMMM YYYY",
        formatName: "format1",
        expectedValue: "Sunday, 1 January 2023",
      },
      {
        format: "DD, dd.MM.YY",
        formatName: "format2",
        expectedValue: "Sun, 01.01.23",
      },
    ])(
      "should return date in $format format",
      ({ format, formatName, expectedValue }) => {
        unitTestingTask.register(formatName, format);
        const date = unitTestingTask(formatName);
        expect(date).toBe(expectedValue);
      }
    );

    it("should add format to formatters array", () => {
      unitTestingTask.register("myFormat", "dd.MM.YYYY");
      const formattersArray = unitTestingTask.formatters();
      expect(formattersArray).toEqual(expect.arrayContaining(["myFormat"]));
    });
  });

  describe("formats passed directly", () => {
    it.each([
      { format: "YYYY", expected: "2022" },
      { format: "YY", expected: "22" },
    ])("should return year in $format format", ({ format, expected }) => {
      const year = unitTestingTask(format, new Date("2022-01-01"));
      expect(year).toBe(expected);
    });

    it.each([
      { format: "MMMM", expected: "January" },
      { format: "MMM", expected: "Jan" },
      { format: "MM", expected: "01" },
      { format: "M", expected: "1" },
    ])("should return month in $format format", ({ format, expected }) => {
      const month = unitTestingTask(format, new Date("2022-01-01"));
      expect(month).toBe(expected);
    });

    it.each([
      { format: "DDD", expected: "Saturday" },
      { format: "DD", expected: "Sat" },
      { format: "D", expected: "Sa" },
      { format: "dd", expected: "01" },
      { format: "d", expected: "1" },
    ])("should return day in $format format", ({ format, expected }) => {
      const day = unitTestingTask(format, new Date("2022-01-01"));
      expect(day).toBe(expected);
    });

    it.each([
      { format: "HH", expected: "13" },
      { format: "H", expected: "13" },
      { format: "hh", expected: "01" },
      { format: "h", expected: "1" },
    ])("should return hour in $format format", ({ format, expected }) => {
      const hour = unitTestingTask(format, new Date("2022-01-01T13:00:00"));
      expect(hour).toBe(expected);
    });

    it.each([
      { format: "mm:ss:ff", expected: "01:01:001" },
      {
        format: "m:s:f",
        expected: "1:1:1",
      },
    ])("should return time in $format format", ({ format, expected }) => {
      const time = unitTestingTask(format, new Date(1640995261001));
      expect(time).toBe(expected);
    });

    it("should return meridiem in a format", () => {
      const expected = "am";
      const meridiem = unitTestingTask("a", new Date("2022-01-01T01:00:00"));
      expect(meridiem).toBe(expected);
    });

    it("should return meridiem in a format", () => {
      const expected = "pm";
      const meridiem = unitTestingTask("a", new Date("2022-01-01T13:00:00"));
      expect(meridiem).toBe(expected);
    });

    it.each([
      { format: "ZZ", expected: "+0100" },
      { format: "Z", expected: "+01:00" },
    ])("should return timezone in $format format", ({ format, expected }) => {
      const date = new Date("2022-01-01T12:00:00+01:00");
      const timezone = unitTestingTask(format, date);
      expect(timezone).toBe(expected);
    });
  });
});

describe("setting language", () => {
  describe("defined languages", () => {
    it.each(["be", "cs", "kk", "pl", "ru", "tr", "tt", "uk"])(
      "should set language to %s",
      (language) => {
        const lang = unitTestingTask.lang(language);
        expect(lang).toBe(language);
      }
    );
  });

  describe("not defined languages", () => {
    it.each(["nl", "cn", "jp", "mk"])(
      "should set language to en",
      (language) => {
        const lang = unitTestingTask.lang(language);
        expect(lang).toBe("en");
      }
    );
  });

  describe("getting long month name", () => {
    it.each([
      { language: "en", firstMonthName: "January" },
      { language: "be", firstMonthName: "студзень" },
      { language: "cs", firstMonthName: "leden" },
      { language: "kk", firstMonthName: "қаңтар" },
      { language: "pl", firstMonthName: "styczeń" },
      { language: "ru", firstMonthName: "январь" },
      { language: "tr", firstMonthName: "Ocak" },
      { language: "tt", firstMonthName: "гыйнвар" },
      { language: "uk", firstMonthName: "січень" },
    ])(
      "should return long name of first month in $language language",
      ({ language, firstMonthName }) => {
        unitTestingTask.lang(language);
        const monthName = unitTestingTask("MMMM", new Date("2022-01-01"));
        expect(monthName).toBe(firstMonthName);
      }
    );
  });

  describe("getting short month name", () => {
    it.each([
      { language: "en", secondMonthName: "Feb" },
      { language: "be", secondMonthName: "лют" },
      { language: "cs", secondMonthName: "úno" },
      { language: "kk", secondMonthName: "ақп" },
      { language: "pl", secondMonthName: "lut" },
      { language: "ru", secondMonthName: "фев" },
      { language: "tr", secondMonthName: "Şub" },
      { language: "tt", secondMonthName: "фев" },
      { language: "uk", secondMonthName: "лют" },
    ])(
      "should return short name of second month in $language language",
      ({ language, secondMonthName }) => {
        unitTestingTask.lang(language);
        const monthName = unitTestingTask("MMM", new Date("2022-02-01"));
        expect(monthName).toBe(secondMonthName);
      }
    );
  });

  describe("getting meridiem in different languages", () => {
    it.each([
      { language: "be", meridiem: "ночы" },
      { language: "ru", meridiem: "ночи" },
      { language: "uk", meridiem: "ночі" },
    ])(
      "should return valid meridiem for night time in $language language",
      ({ language, meridiem }) => {
        unitTestingTask.lang(language);
        const languageMeridiem = unitTestingTask(
          "A",
          new Date("2022-01-01T03:00:00")
        );
        expect(languageMeridiem).toBe(meridiem);
      }
    );

    it.each([
      { language: "be", meridiem: "раніцы" },
      { language: "ru", meridiem: "утра" },
      { language: "uk", meridiem: "ранку" },
    ])(
      "should return valid meridiem for morning time in $language language",
      ({ language, meridiem }) => {
        unitTestingTask.lang(language);
        const languageMeridiem = unitTestingTask(
          "A",
          new Date("2022-01-01T06:00:00")
        );
        expect(languageMeridiem).toBe(meridiem);
      }
    );

    it.each([
      { language: "be", meridiem: "дня" },
      { language: "ru", meridiem: "дня" },
      { language: "uk", meridiem: "дня" },
    ])(
      "should return valid meridiem for day time in $language language",
      ({ language, meridiem }) => {
        unitTestingTask.lang(language);
        const languageMeridiem = unitTestingTask(
          "A",
          new Date("2022-01-01T13:00:00")
        );
        expect(languageMeridiem).toBe(meridiem);
      }
    );

    it.each([
      { language: "be", meridiem: "вечара" },
      { language: "ru", meridiem: "вечера" },
      { language: "uk", meridiem: "вечора" },
    ])(
      "should return valid meridiem for day time in $language language",
      ({ language, meridiem }) => {
        unitTestingTask.lang(language);
        const languageMeridiem = unitTestingTask(
          "A",
          new Date("2022-01-01T18:00:00")
        );
        expect(languageMeridiem).toBe(meridiem);
      }
    );

    it.each([
      { language: "en", meridiem: "AM" },
      { language: "cs", meridiem: "dopoledne" },
      { language: "pl", meridiem: "rano" },
    ])(
      "should return valid meridiem for AM in $language language",
      ({ language, meridiem }) => {
        unitTestingTask.lang(language);
        const languageMeridiem = unitTestingTask(
          "A",
          new Date("2022-01-01T11:00:00")
        );
        expect(languageMeridiem).toBe(meridiem);
      }
    );

    it.each([
      { language: "en", meridiem: "PM" },
      { language: "cs", meridiem: "odpoledne" },
      { language: "pl", meridiem: "" },
    ])(
      "should return valid meridiem for PM in $language language",
      ({ language, meridiem }) => {
        unitTestingTask.lang(language);
        const languageMeridiem = unitTestingTask(
          "A",
          new Date("2022-01-01T13:00:00")
        );
        expect(languageMeridiem).toBe(meridiem);
      }
    );
  });

  describe("passing argument of a wrong type", () => {
    it("should throw an error when format is wrong type", () => {
      const passBadArgument = () => {
        const invalidFormat = true;
        unitTestingTask(invalidFormat);
      };

      expect(passBadArgument).toThrow(
        new TypeError("Argument `format` must be a string")
      );
    });
  });

  it("should throw an error when date is wrong type", () => {
    const passBadArgument = () => {
      const validFormat = "D";
      const invalidDate = true;
      unitTestingTask(validFormat, invalidDate);
    };

    expect(passBadArgument).toThrow(
      new TypeError(
        "Argument `date` must be instance of Date or Unix Timestamp or ISODate String"
      )
    );
  });
});
