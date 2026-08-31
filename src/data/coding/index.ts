import type { CodingProblem } from '../../types';

import { jsonSerializerProblem } from './jsonSerializer';
import { curryingProblem } from './currying';
import { deepCopyProblem } from './deepCopy';
import { tableOfContentsProblem } from './tableOfContents';
import { memoizeMultiArgProblem } from './memoizeMultiArg';
import { customSetIntervalProblem } from './customSetInterval';
import { mergeObjectsProblem } from './mergeObjects';
import { recursiveTransformProblem } from './recursiveTransform';
import { deepEqualProblem } from './deepEqual';
import { highlightTextProblem } from './highlightText';
import { resumableIntervalProblem } from './resumableInterval';
import { memoizeSingleArgProblem } from './memoizeSingleArg';
import { eventEmitterProblem } from './eventEmitter';
import { debounceProblem } from './debounce';
import { mergeUserRowsProblem } from './mergeUserRows';
import { flattenArrayProblem } from './flattenArray';
import { removeFalsyProblem } from './removeFalsy';
import { asyncSeriesProblem } from './asyncSeries';
import { promisifyProblem } from './promisify';
import { camelCaseKeysProblem } from './camelCaseKeys';
import { arrayFlatProblem } from './arrayFlat';
import { mergeSortedArraysProblem } from './mergeSortedArrays';
import { calculatorChainingProblem } from './calculatorChaining';
import { calcChainingMethodProblem } from './calcChainingMethod';
import { webVitalsScenariosProblem } from './webVitalsScenarios';
import { promiseAllProblem } from './promiseAll';
import { cachedFetchProblem } from './cachedFetch';
import { fetchWithRetriesProblem } from './fetchWithRetries';
import { fillDomProblem } from './fillDom';
import { bfsObjectProblem } from './bfsObject';
import { dfsObjectProblem } from './dfsObject';
import { removeCircularProblem } from './removeCircular';
import { observerPatternProblem } from './observerPattern';
import {
  htmlCssCodingProblems,
  holyGrailLayoutProblem,
  accessibleToggleSwitchProblem,
  nativeDialogModalProblem,
  cssSkeletonShimmerProblem,
} from './htmlCssProblems';

export const codingProblems: CodingProblem[] = [
  ...htmlCssCodingProblems,
  jsonSerializerProblem,
  curryingProblem,
  deepCopyProblem,
  tableOfContentsProblem,
  memoizeMultiArgProblem,
  customSetIntervalProblem,
  mergeObjectsProblem,
  recursiveTransformProblem,
  deepEqualProblem,
  highlightTextProblem,
  resumableIntervalProblem,
  memoizeSingleArgProblem,
  eventEmitterProblem,
  debounceProblem,
  mergeUserRowsProblem,
  flattenArrayProblem,
  removeFalsyProblem,
  asyncSeriesProblem,
  promisifyProblem,
  camelCaseKeysProblem,
  arrayFlatProblem,
  mergeSortedArraysProblem,
  calculatorChainingProblem,
  calcChainingMethodProblem,
  webVitalsScenariosProblem,
  promiseAllProblem,
  cachedFetchProblem,
  fetchWithRetriesProblem,
  fillDomProblem,
  bfsObjectProblem,
  dfsObjectProblem,
  removeCircularProblem,
  observerPatternProblem,
];

export {
  htmlCssCodingProblems,
  holyGrailLayoutProblem,
  accessibleToggleSwitchProblem,
  nativeDialogModalProblem,
  cssSkeletonShimmerProblem,
  jsonSerializerProblem,
  curryingProblem,
  deepCopyProblem,
  tableOfContentsProblem,
  memoizeMultiArgProblem,
  customSetIntervalProblem,
  mergeObjectsProblem,
  recursiveTransformProblem,
  deepEqualProblem,
  highlightTextProblem,
  resumableIntervalProblem,
  memoizeSingleArgProblem,
  eventEmitterProblem,
  debounceProblem,
  mergeUserRowsProblem,
  flattenArrayProblem,
  removeFalsyProblem,
  asyncSeriesProblem,
  promisifyProblem,
  camelCaseKeysProblem,
  arrayFlatProblem,
  mergeSortedArraysProblem,
  calculatorChainingProblem,
  calcChainingMethodProblem,
  webVitalsScenariosProblem,
  promiseAllProblem,
  cachedFetchProblem,
  fetchWithRetriesProblem,
  fillDomProblem,
  bfsObjectProblem,
  dfsObjectProblem,
  removeCircularProblem,
  observerPatternProblem,
};
