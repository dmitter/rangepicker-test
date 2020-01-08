import RangePicker from './index.js';

let testRanges = [
  { from: new Date(2019, 9, 2), to: new Date(2019, 10, 5) },
  { from: new Date(2019, 1, 1), to: new Date(2019, 2, 31) }
];

for (let range of testRanges) {
  let initialFrom = range.from;
  let initialTo = range.to;

  describe(`RangePicker (${initialFrom.toLocaleDateString()}, ${initialTo.toLocaleDateString()})`, () => {
    let rangePicker;

    beforeEach(() => {

      rangePicker = new RangePicker({
        from: initialFrom,
        to: initialTo
      });

      document.body.append(rangePicker.elem);
    });

    afterEach(() => {
      rangePicker.destroy();
    });

    it("Initially shows only input", () => {
      expect(document.querySelector('.rangepicker__input')).toBeInstanceOf(HTMLElement);
      expect(document.querySelector('.rangepicker__selector').innerHTML).toEqual("");
    });

    it("Opens on click", () => {
      document.querySelector('.rangepicker__input').dispatchEvent(new MouseEvent("click"));
      expect(document.querySelector('.rangepicker__selector').firstElementChild.offsetHeight).not.toEqual(0);
    });

    it("Closes on second click", function () {
      document.querySelector('.rangepicker__input').dispatchEvent(new MouseEvent("click"));
      document.querySelector('.rangepicker__input').dispatchEvent(new MouseEvent("click"));
      expect(document.querySelector('.rangepicker__selector').firstElementChild.offsetHeight).toEqual(0);
    });

    it("Shows selected dates from-to in input", () => {
      expect(document.querySelector('.rangepicker__input').textContent).toMatch(initialFrom.toLocaleDateString());
      expect(document.querySelector('.rangepicker__input').textContent).toMatch(initialTo.toLocaleDateString());
    });

    it("Closes on click outside", function () {
      document.querySelector('.rangepicker__input').dispatchEvent(new MouseEvent("click"));
      document.querySelector('body').dispatchEvent(new MouseEvent("click"));
      expect(document.querySelector('.rangepicker__selector').firstElementChild.offsetHeight).toEqual(0);
    });

    it("Shows 'to' date's month in right calendar and previous month in left calendar", function () {
      document.querySelector('.rangepicker__input').dispatchEvent(new MouseEvent("click"));
      expect(document.querySelectorAll('.rangepicker__calendar time')[0].textContent).toEqual(getMonthName(initialFrom));
      expect(document.querySelectorAll('.rangepicker__calendar time')[1].textContent).toEqual(getMonthName(initialTo));
    });

    it("Shows 'from' date selected in left calendar", function () {
      document.querySelector('.rangepicker__input').dispatchEvent(new MouseEvent("click"));
      expect(document.querySelectorAll('.rangepicker__calendar')[0].querySelector('.rangepicker__selected-from').dataset.value).toEqual(initialFrom.toISOString());
    });

    it("Shows 'to' date selected in right calendar", function () {
      document.querySelector('.rangepicker__input').dispatchEvent(new MouseEvent("click"));
      expect(document.querySelectorAll('.rangepicker__calendar')[1].querySelector('.rangepicker__selected-to').dataset.value).toEqual(initialTo.toISOString());
    });

    it("Shows cells between 'from' and 'to' dates highlighted", function () {
      document.querySelector('.rangepicker__input').dispatchEvent(new MouseEvent("click"));
      let expected = new Array();
      for (let date = new Date(initialFrom.getFullYear(), initialFrom.getMonth(), initialFrom.getDate() + 1); +date < +initialTo; date.setDate(date.getDate() + 1)) {
        expected.push(+date);
      }
      expect(Array.from(document.querySelectorAll('.rangepicker__selected-between')).map((elem) => Date.parse(elem.dataset.value))).toEqual(expected);
    });

    it("Shows newly selected range in input and closes picker", function () {
      document.querySelector('.rangepicker__input').dispatchEvent(new MouseEvent("click"));
      let newFrom = new Date(initialFrom.getFullYear(), initialFrom.getMonth(), initialFrom.getDate() + 7);
      let newTo = new Date(initialTo.getFullYear(), initialTo.getMonth(), initialTo.getDate() - 3);
      document.querySelector(`.rangepicker__cell[data-value="${newFrom.toISOString()}"]`).dispatchEvent(new MouseEvent("click"));
      document.querySelector(`.rangepicker__cell[data-value="${newTo.toISOString()}"]`).dispatchEvent(new MouseEvent("click"));
      expect(document.querySelector('.rangepicker__input').textContent).toMatch(newFrom.toLocaleDateString());
      expect(document.querySelector('.rangepicker__input').textContent).toMatch(newTo.toLocaleDateString());
      expect(document.querySelector('.rangepicker__selector').firstElementChild.offsetHeight).toEqual(0);
    });

    it("Left arrow click shifts calendars one month left", function () {
      document.querySelector('.rangepicker__input').dispatchEvent(new MouseEvent("click"));
      document.querySelector('.rangepicker__selector-control-left').dispatchEvent(new MouseEvent("click"));
      let leftMonth = getPreviousMonth(initialFrom);
      let rightMonth = getPreviousMonth(initialTo);
      expect(document.querySelectorAll('.rangepicker__calendar time')[0].textContent).toEqual(getMonthName(leftMonth));
      expect(document.querySelectorAll('.rangepicker__calendar time')[1].textContent).toEqual(getMonthName(rightMonth));
    });

    it("Right arrow click shifts calendars one month right", function () {
      document.querySelector('.rangepicker__input').dispatchEvent(new MouseEvent("click"));
      document.querySelector('.rangepicker__selector-control-right').dispatchEvent(new MouseEvent("click"));
      let leftMonth = getNextMonth(initialFrom);
      let rightMonth = getNextMonth(initialTo);
      expect(document.querySelectorAll('.rangepicker__calendar time')[0].textContent).toEqual(getMonthName(leftMonth));
      expect(document.querySelectorAll('.rangepicker__calendar time')[1].textContent).toEqual(getMonthName(rightMonth));
    });
  });
}

function getMonthName(date) {
  return date.toLocaleString('en', { month: 'long' });
}

function getPreviousMonth(date) {
  let d = new Date(date.getFullYear(), date.getMonth(), 0);
  d.setDate(1);
  return d;
}

function getNextMonth(date) {
  let currentMonth = date.getMonth();
  let d = new Date(date.getFullYear(), currentMonth, 1);
  d.setMonth(currentMonth + 1);
  return d;
}