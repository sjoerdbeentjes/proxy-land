type Binding = Record<any, any>;
type TransformerFunc<T> = (data: T) => string | null;
type Bindings = Record<
  string,
  { transformer: TransformerFunc<any>; attribute?: string }
>;

export class ProxyLand<T extends Binding> {
  bindings: Bindings;
  data: Binding = {};

  constructor(data: T) {
    this.bindings = {};

    this.watch(data);
  }

  bind(
    targetSpecifier: string,
    bindingSource: keyof T | TransformerFunc<T>
  ): void;
  bind(
    targetSpecifier: { selector: string; attribute?: string },
    bindingSource: keyof T | TransformerFunc<T>
  ): void;
  bind(targetSpecifier: any, bindingSource: any): void {
    let elementId: string;
    let transformer: TransformerFunc<T>;
    let attribute: string | undefined;

    if (typeof targetSpecifier === "object") {
      elementId = targetSpecifier.selector;
      attribute = targetSpecifier.attribute;
    } else {
      elementId = targetSpecifier;
    }

    if (typeof bindingSource === "string") {
      transformer = (data: Binding): string => data[bindingSource];
    } else {
      transformer = bindingSource as TransformerFunc<T>;
    }

    this.bindings[elementId] = { transformer, attribute };

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

  private updateDomWithBinding(elementSelector: string) {
    const binding = this.bindings[elementSelector];
    const elements = document.querySelectorAll(elementSelector);

    elements.forEach((element) => {
      if (element) {
        const newValue = binding.transformer(this.data);

        if (binding.attribute) {
          if (newValue === null) {
            // if newValue is null, remove the attribute
            element.removeAttribute(binding.attribute);
          } else {
            // otherwise, set the attribute to a string representation of newValue
            element.setAttribute(binding.attribute, String(newValue));
          }
        } else {
          element.textContent = newValue;
        }
      }
    })
  }
}
