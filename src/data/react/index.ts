import type { Topic } from "../../types";
import { introTopics } from "./intro";
import { componentTopics } from "./components";
import { stylingTopics } from "./styling";
import { classComponentTopics } from "./classComponents";
import { vdomTopics } from "./vdom";
import { customHookTopics } from "./customHooks";
import { routingTopics } from "./routing";
import { advancedTopics } from "./advanced";
import { optimizationTopics } from "./optimization";

export const reactTopics: Topic[] = [
  ...introTopics,
  ...componentTopics,
  ...stylingTopics,
  ...classComponentTopics,
  ...vdomTopics,
  ...customHookTopics,
  ...routingTopics,
  ...advancedTopics,
  ...optimizationTopics,
];

export {
  introTopics,
  componentTopics,
  stylingTopics,
  classComponentTopics,
  vdomTopics,
  customHookTopics,
  routingTopics,
  advancedTopics,
  optimizationTopics,
};
