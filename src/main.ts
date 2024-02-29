type Binding = Record<any, any>;
type TransformerFunc<T> = (data: T) => string;
type Bindings = Record<string, { transformer: TransformerFunc<any> }>;

export class ProxyLand<T extends Binding> {
  bindings: Bindings;
  data?: Binding;

  constructor(data: T) {
    this.bindings = {};

    this.watch(data);
  }

  bind(elementId: string, arg: keyof T | TransformerFunc<T>): void {
    let transformer: TransformerFunc<T>;

    if (typeof arg === "string") {
      transformer = (data: Binding): string => String(data[arg]);
    } else {
      transformer = arg as TransformerFunc<T>;
    }

    this.bindings[elementId] = { transformer };

    this.updateDomWithBinding(elementId);
  }

  private watch(data: T): T {
    this.data = this.deepProxy(data);

    return this.data;
  }

  private deepProxy(data: T): T | any[] {
    if (Array.isArray(data)) {
      return this.proxyArray(data);
    } else if (data !== null && typeof data === "object") {
      const handler: ProxyHandler<T> = {
        set: (target: Binding, property: string, value: any): boolean => {
          target[property] =
            Array.isArray(value) || typeof value === "object"
              ? this.deepProxy(value)
              : value;
          this.updateDom();
          return true;
        },
      };

      const entries = Object.entries(data).map(([key, value]) => [
        key,
        this.deepProxy(value),
      ]);

      return new Proxy(Object.fromEntries(entries) as T, handler);
    } else {
      return data;
    }
  }

  private proxyArray(array: any[]): any[] {
    const arrayHandler: ProxyHandler<any[]> = {
      set: (target: any[], property: string, value: any): boolean => {
        target[Number(property)] =
          Array.isArray(value) || typeof value === "object"
            ? this.deepProxy(value)
            : value;

        this.updateDom();

        return true;
      },
      get: (target: any[], property: string, receiver: any): any => {
        if (["push", "pop", "splice", "shift", "unshift"].includes(property)) {
          return (...args: any[]): any => {
            const method = Reflect.get(
              Array.prototype,
              property,
              receiver
            ) as Function;

            const result = method.apply(target, args);

            this.updateDom();

            return result;
          };
        }

        return Reflect.get(target, property, receiver);
      },
    };

    const proxiedArray = new Proxy(
      array.map((item) => this.deepProxy(item)),
      arrayHandler
    );

    return proxiedArray;
  }

  updateDom() {
    for (const elementSelector in this.bindings) {
      this.updateDomWithBinding(elementSelector);
    }
  }

  updateDomWithBinding(elementSelector: string) {
    const binding = this.bindings[elementSelector];
    const element = document.querySelector(elementSelector);

    if (element) {
      const newValue = binding.transformer(this.data);

      element.textContent = newValue;
    }
  }
}
