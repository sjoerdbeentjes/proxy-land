type Selector = string | Element | NodeListOf<Element> | null;

type Data = Record<any, any>;

type TransformerFunc<T> = (data: T) => string | null;

type Binding = {
  selector: Selector;
  transformer: TransformerFunc<any>;
  attribute?: string;
};

type Bindings = Array<Binding>;

type Root = Document | Element | ShadowRoot;

type ProxyLandOptions = {
  root: Root;
};

export class ProxyLand<T extends Data> {
  bindings: Bindings = [];
  data: Data = {};
  root: ProxyLandOptions["root"];

  constructor(data: T, options?: ProxyLandOptions) {
    this.root = options?.root || document;

    this.watch(data);
  }

  bind(
    targetSpecifier: Selector,
    bindingSource: keyof T | TransformerFunc<T>
  ): void;
  bind(
    targetSpecifier: { selector: Selector; attribute?: string },
    bindingSource: keyof T | TransformerFunc<T>
  ): void;
  bind(targetSpecifier: any, bindingSource: any): void {
    let selector: string;
    let transformer: TransformerFunc<T>;
    let attribute: string | undefined;

    if (targetSpecifier.selector) {
      selector = targetSpecifier.selector;
      attribute = targetSpecifier.attribute;
    } else {
      selector = targetSpecifier;
    }

    if (typeof bindingSource === "string") {
      transformer = (data: Data): string => data[bindingSource];
    } else {
      transformer = bindingSource as TransformerFunc<T>;
    }

    const binding = { selector, transformer, attribute };

    this.bindings.push(binding);

    this.updateDomWithBinding(binding);
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
        set: (target: Data, property: string, value: any): boolean => {
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
    this.bindings.forEach((binding) => {
      this.updateDomWithBinding(binding);
    });
  }

  private updateDomWithBinding(binding: Binding) {
    const elements = getElementsForSelector(binding.selector, this.root);

    elements?.forEach((element) => {
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
    });
  }
}

function getElementsForSelector(
  selector: Selector,
  root: Root
): NodeListOf<Element> | Array<Element> | null {
  if (typeof selector === "string") {
    return root.querySelectorAll(selector);
  }

  if (selector instanceof Element) {
    return [selector];
  }

  return selector;
}
