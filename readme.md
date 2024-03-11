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

1. **Initialize ProxyLand**

``` typescript
/* initialize with your data */
const app = new ProxyLand({
  message: 'Hello, ProxyLand!',
});
```

1. **Bind DOM Elements**

``` typescript
/* direct property binding */
app.bind('#message', 'message');

/* custom transformer function, for computed properties */
app.bind('#message', data => data.message.toUpperCase());

/* attribute binding */
app.bind({
  selector: '#menu',
  attribute: 'style'
}, data => data.showMenu ? 'display: block' : 'display: none');

```

This binds the `#message` DOM element to the `message` property in your data, ensuring the element updates whenever the data changes.

## API Reference

- **`bind(targetSpecifier: string | { selector: string; attribute?: string }, bindingSource: keyof T | TransformerFunc<T>): void`**
  Binds a DOM element specified by a selector or a selector-attribute combination to a data property or a custom transformer function. The `targetSpecifier` can either be a string representing the selector of the DOM element or an object containing both the selector and an optional attribute. The `bindingSource` is either the key of a property within the data being observed or a transformer function that processes the data and returns a string to be bound to the target element.
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
