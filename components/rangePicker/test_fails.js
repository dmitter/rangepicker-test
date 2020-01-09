import RangePicker from './index.js';
let initialFrom = new Date(2019, 9, 2);
let initialTo = new Date(2019, 10, 5);

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
});

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