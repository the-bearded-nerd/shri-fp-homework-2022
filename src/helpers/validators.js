/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
  equals,
  allPass,
  prop,
  compose,
  gt,
  filter,
  anyPass,
  map,
  complement,
} from "ramda";

const isGreen = equals("green");
const isWhite = equals("white");
const isRed = equals("red");
const isBlue = equals("blue");
const isOrange = equals("orange");

const getStarColor = prop("star");
const getSquareColor = prop("square");
const getTriangleColor = prop("triangle");
const getCircleColor = prop("circle");

const getLength = prop("length");

const isStarRed = compose(isRed, getStarColor);
const isCircleBlue = compose(isBlue, getCircleColor);
const isSquareGreen = compose(isGreen, getSquareColor);
const isSquareOrange = compose(isOrange, getSquareColor);
const isTriangleGreen = compose(isGreen, getTriangleColor);

const getRedCount = compose(getLength, filter(isRed), Object.values);
const getBlueCount = compose(getLength, filter(isBlue), Object.values);
const getGreenCount = compose(getLength, filter(isGreen), Object.values);
const getOrangeCount = compose(getLength, filter(isOrange), Object.values);

const isMoreThanOne = (count) => gt(count, 1);
const isMoreThanTwo = (count) => gt(count, 2);
const isMoreThanThree = (count) => gt(count, 3);
const isOne = equals(1);
const isTwo = equals(2);

const isMoreThanTwoBlue = compose(isMoreThanTwo, getBlueCount);
const isMoreThanTwoRed = compose(isMoreThanTwo, getRedCount);
const isMoreThanTwoGreen = compose(isMoreThanTwo, getGreenCount);
const isMoreThanTwoOrange = compose(isMoreThanTwo, getOrangeCount);

const isMoreThanThreeOrange = compose(isMoreThanThree, getOrangeCount);
const isMoreThanThreeGreen = compose(isMoreThanThree, getGreenCount);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (figures) => {
  const isTriangleWhite = compose(isWhite, getTriangleColor);
  const isCircleWhite = compose(isWhite, getCircleColor);
  return allPass([isStarRed, isSquareGreen, isTriangleWhite, isCircleWhite])(
    figures
  );
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (figures) => {
  const isMoreThanOneGreen = compose(isMoreThanOne, getLength, filter(isGreen));
  console.log(isMoreThanOneGreen(figures));
  return isMoreThanOneGreen(figures);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (figures) => {
  return equals(getBlueCount(figures))(getRedCount(figures));
};

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = (figures) => {
  return allPass([isCircleBlue, isStarRed, isSquareOrange])(figures);
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (figures) => {
  return anyPass([
    isMoreThanTwoBlue,
    isMoreThanTwoGreen,
    isMoreThanTwoOrange,
    isMoreThanTwoRed,
  ])(figures);
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = (figures) => {
  const isOnlyOneRed = compose(isOne, getRedCount);
  const isOnlyTwoGreen = compose(isTwo, getGreenCount);
  return allPass([isOnlyOneRed, isOnlyTwoGreen, isTriangleGreen])(figures);
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (figures) => {
  return isMoreThanThreeOrange(figures);
};

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = (figures) => {
  return complement(isStarRed)(figures);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = (figures) => {
  return isMoreThanThreeGreen(figures);
};

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = (figures) => {
  return equals(getTriangleColor(figures))(getSquareColor(figures));
};
