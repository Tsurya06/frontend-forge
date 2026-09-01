import type { Topic } from "../../types";
import { variablesTopics } from "./variables";
import { typesTopics } from "./types";
import { functionsTopics } from "./functions";
import { asyncTopics } from "./async";
import { oopTopics } from "./oop";
import { functionalTopics } from "./functional";
import { eventsTopics } from "./events";
import { errorsTopics } from "./errors";
import { engineTopics } from "./engine";
import { modulesTopics } from "./modules";
import { dataStructuresTopics } from "./dataStructures";
import { concurrencyTopics } from "./concurrency";

export const javascriptTopics: Topic[] = [
  ...variablesTopics,
  ...typesTopics,
  ...functionsTopics,
  ...asyncTopics,
  ...oopTopics,
  ...functionalTopics,
  ...eventsTopics,
  ...errorsTopics,
  ...engineTopics,
  ...modulesTopics,
  ...dataStructuresTopics,
  ...concurrencyTopics,
];

export {
  variablesTopics,
  typesTopics,
  functionsTopics,
  asyncTopics,
  oopTopics,
  functionalTopics,
  eventsTopics,
  errorsTopics,
  engineTopics,
  modulesTopics,
  dataStructuresTopics,
  concurrencyTopics,
};
