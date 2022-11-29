/* eslint-disable @typescript-eslint/no-explicit-any */
export class DomainConnecter {
  static instance: DomainConnecter;
  controllerMap: Map<string, (...arg0: any[]) => any> = new Map();

  static getInstance(): DomainConnecter {
    if (DomainConnecter.instance) {
      return DomainConnecter.instance;
    }

    DomainConnecter.instance = new DomainConnecter();
    return DomainConnecter.instance;
  }

  register(controllerName: string, controller: (...arg0: any[]) => any) {
    this.controllerMap.set(controllerName, controller);
  }

  call(controllerName: string, data: any) {
    const controller = this.controllerMap.get(controllerName);

    if (controller) {
      return controller(data);
    }

    return;
  }
}
