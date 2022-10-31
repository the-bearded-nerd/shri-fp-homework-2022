/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import {
  assoc,
  gt,
  length,
  lt,
  mathMod,
  __,
  compose,
  andThen,
  allPass,
  concat,
  tap,
  otherwise,
  partial,
  ifElse,
  prop,
  test,
} from "ramda";
import Api from "../tools/api";

const api = new Api();

const API_NUMBERS_URL = "https://api.tech/numbers/base";
const API_ANIMALS_URL = "https://animals.tech/";

const getApiResult = compose(String, prop("result"));
const afterGetApiResult = andThen(getApiResult);

const longerThanTwo = compose(gt(__, 2), length);
const shorterThanTen = compose(lt(__, 10), length);

const containsOnlyNumbers = test(/^[0-9]+\.?[0-9]+$/);

const isValid = allPass([longerThanTwo, shorterThanTen, containsOnlyNumbers]);

const convertToNumber = compose(Math.round, Number);

const getLength = andThen(length);

const getSquare = andThen((val) => val ** 2);

const getModByThree = andThen(compose(String, mathMod(__, 3)));

const getBinary = compose(
  api.get(API_NUMBERS_URL),
  assoc("number", __, { from: 10, to: 2 })
);

const getAnimal = andThen(compose(api.get(__, {}), concat(API_ANIMALS_URL)));

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const tapLog = tap(writeLog);
  const thenTapLog = andThen(tapLog);

  const afterHandleSuccess = andThen(handleSuccess);

  const otherwideHandleError = otherwise(handleError);
  const handleValidationError = partial(handleError, ["ValidationError"]);

  const doAndLog = (x) => compose(thenTapLog, x);

  const sequenceComposition = compose(
    otherwideHandleError,
    afterHandleSuccess,
    afterGetApiResult,
    getAnimal,
    doAndLog(getModByThree),
    doAndLog(getSquare),
    doAndLog(getLength),
    thenTapLog,
    afterGetApiResult,
    getBinary,
    tapLog,
    convertToNumber
  );

  compose(
    ifElse(isValid, sequenceComposition, handleValidationError),
    tapLog
  )(value);
};

export default processSequence;
