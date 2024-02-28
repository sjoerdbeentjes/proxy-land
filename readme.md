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
const app = new ProxyLand();
```

1. **Watch Your Data**

``` typescript
const data = app.watch({
  message: 'Hello, ProxyLand!',
});
```

1. **Bind DOM Elements**

``` typescript
/* direct property binding */
app.bind('#message', 'message');

/* custom transformer function, for computed properties */
app.bind('#message', data => data.message.toUpperCase());
```

This binds the `#message` DOM element to the `message` property in your data, ensuring the element updates whenever the data changes.

## API Reference

- **`bind(elementId: string, arg: string | TransformerFunc): void`**
  Bind a DOM element to a data property or a custom transformer function.
- **`watch<T extends Binding>(data: T): T`**
  Watch an object or array for changes, making it reactive.

## Examples

Here's a simple example to demonstrate how ProxyLand can be used to bind a `div` element to a data property:

``` html
<div id="message"></div>
```

``` typescript
import { ProxyLand } from 'proxy-land';

const app = new ProxyLand();
const data = app.watch({ message: 'Hello, ProxyLand!' });

app.bind('#message', 'message');
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Don't forget to give the project a star! Thanks again!

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - [your-email@example.com](mailto:your-email@example.com)

Project Link: [https://github.com/yourusername/ProxyLand](https://github.com/yourusername/ProxyLand)
