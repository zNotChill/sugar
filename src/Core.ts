import { ModuleBase } from "./modules/base/ModuleBase.ts";
import { modules } from "./modules/ModuleCore.ts";
import { Error } from "./utils/Logger.ts";

export class Core {
  private enabledModules: ModuleBase[] = [];

  run() {
    Promise.all(modules).then((resolvedModules) => {
      this.enabledModules = resolvedModules as unknown as ModuleBase[];

      this.initializeModules();
    }).catch((error) => {
      console.log(error);
      
      Error("Failed to initialize modules: " + error);
    });
  }

  private initializeModules() {
    this.enabledModules.forEach((module) => {
      if (typeof module.establishConnection === "function") {
        module.establishConnection();
      } else {
        Error("Module does not have an establishConnection method. Skipping.");
      }
    });
  }

  public addModule(module: ModuleBase) {
    if (this.enabledModules.includes(module)) {
      Error("Module already exists. Skipping addition.");
      return;
    }
    this.enabledModules.push(module);
  }

  public removeModule(module: ModuleBase) {
    const index = this.enabledModules.indexOf(module);
    if (index === -1) {
      Error("Module not found. Skipping removal.");
      return;
    }
    this.enabledModules.splice(index, 1);
  }
}