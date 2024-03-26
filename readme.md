# ProxyLand

ProxyLand is a lightweight and efficient JavaScript library designed to simplify the binding and synchronization of your UI elements with your application's state. By leveraging JavaScript's Proxy objects, ProxyLand ensures that your UI updates seamlessly in real-time as your data changes, providing a reactive experience with minimal effort.

## Features

- **Automatic UI Updates**: Automatically updates your DOM elements when your data changes, keeping your UI in sync with your application state.
- **Deep Proxying**: Offers deep proxy support for objects and arrays, ensuring nested data structures are also reactive.
- **Flexible Binding**: Supports binding DOM elements to data properties using both direct string references and custom transformer functions for complex scenarios.
- **Minimalist API**: Designed with simplicity in mind, the API is easy to use and understand, enabling rapid development with less code.

## Getting Started

To get started with ProxyLand, follow these steps:

### Installation

``` bash
npm install proxy-land
```

### Usage

#### Initialize

``` typescript
/* initialize with your data */
const app = new ProxyLand({
  message: 'Hello, ProxyLand!',
});
```

#### Bind DOM Elements

``` typescript
/* direct property binding */
app.bind('#message', 'message');

/* custom transformer function, for computed properties */
app.bind('#message', data => data.message.toUpperCase());
```

#### Bind DOM Elements with Attribute

``` typescript
/* set value of an attribute */
app.bind({
  selector: '#menu',
  attribute: 'style'
}, data => data.showMenu ? 'display: block' : 'display: none');

/* toggle an attribute ('null' results in the attribute not being rendered) */
app.bind({
  selector: '#menu',
  attribute: 'hidden'
}, data => data.showMenu ? null : '');
```

## API Reference

### Options

| Option    | Description |
| -------- | ------- |
| `root`  | Root element to use for binding. If not provided, the document will be used. |

Options can be passed as an object to the `ProxyLand` constructor.

``` typescript
const app = new ProxyLand(data, options);
```

### Methods

- **`bind(targetSpecifier: string | Element | NodeListOf<Element> | { selector: string | Element | NodeListOf<Element>; attribute?: string }, bindingSource: keyof T | TransformerFunc<T>): void`**
  Binds a DOM element specified by a selector or a selector-attribute combination to a data property or a custom transformer function. The `targetSpecifier` can either be a selector of the DOM element or an object containing both the selector and an optional attribute. The `bindingSource` is either the key of a property within the data being observed or a transformer function that processes the data and returns a string to be bound to the target element.
- **`watch<T extends Binding>(data: T): T`**
  Watches an object or array for changes, making it reactive. This method returns a proxy of the original data, where any modifications to the data will trigger the DOM to update accordingly. It is designed to handle both objects and arrays, ensuring deep reactivity by applying proxies recursively.

## Examples

Here's a simple example to demonstrate how ProxyLand can be used to bind a `div` element to a data property:

``` html
<div id="message"></div>
```

``` typescript
import { ProxyLand } from 'proxy-land';

const app = new ProxyLand({
  message: 'Hello, ProxyLand!'
});

app.bind('#message', 'message');
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Don't forget to give the project a star! Thanks again!

## Contact

Sjoerd Beentjes - [mail@sjoerdbeentjes.nl](mailto:mail@sjoerdbeentjes.nl)

Project Link: [https://github.com/sjoerdbeentjes/proxy-land](https://github.com/sjoerdbeentjes/proxy-land)
