import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ProxyLand } from "./main"; // Adjust the import path as necessary

describe("ProxyLand", () => {
  beforeEach(() => {
    document.body.innerHTML = ""; // Reset the DOM before each test
  });

  afterEach(() => {
    document.body.innerHTML = ""; // Clean up the DOM after each test
  });

  it("updates DOM when simple object properties change", () => {
    document.body.innerHTML = `<div id="simple"></div>`;
    const data = { value: "initial" };
    const proxyLand = new ProxyLand(data);

    proxyLand.bind("#simple", "value");
    expect(document.getElementById("simple")?.textContent).toBe("initial");

    proxyLand.data.value = "updated";
    expect(document.getElementById("simple")?.textContent).toBe("updated");
  });

  it("updates DOM when nested object properties change", () => {
    document.body.innerHTML = `<div id="nested"></div>`;
    const data = { nested: { value: "initial" } };
    const proxyLand = new ProxyLand(data);

    proxyLand.bind("#nested", (data) => data.nested.value);
    expect(document.getElementById("nested")?.textContent).toBe("initial");

    proxyLand.data.nested.value = "updated";
    expect(document.getElementById("nested")?.textContent).toBe("updated");
  });

  it("updates DOM when array elements are added or removed", () => {
    document.body.innerHTML = `<div id="array"></div>`;
    const data = { list: [1, 2, 3] };
    const proxyLand = new ProxyLand(data);

    proxyLand.bind("#array", (data) => data.list.join(", "));
    expect(document.getElementById("array")?.textContent).toBe("1, 2, 3");

    proxyLand.data.list.push(4);
    expect(document.getElementById("array")?.textContent).toBe("1, 2, 3, 4");

    proxyLand.data.list.pop();
    expect(document.getElementById("array")?.textContent).toBe("1, 2, 3");
  });

  it("updates DOM when array elements are changed", () => {
    document.body.innerHTML = `<div id="array"></div>`;
    const data = { list: [1, 2, 3] };
    const proxyLand = new ProxyLand(data);

    proxyLand.bind("#array", (data) => data.list.join(", "));
    expect(document.getElementById("array")?.textContent).toBe("1, 2, 3");

    proxyLand.data.list[1] = 4;
    expect(document.getElementById("array")?.textContent).toBe("1, 4, 3");
  });

  it("handles array operations like splice correctly", () => {
    document.body.innerHTML = `<div id="splice"></div>`;
    const data = { list: [1, 2, 3, 4, 5] };
    const proxyLand = new ProxyLand(data);

    proxyLand.bind("#splice", (data) => data.list.join(", "));

    proxyLand.data.list.splice(1, 2); // should remove elements 2 and 3
    expect(document.getElementById("splice")?.textContent).toBe("1, 4, 5");
  });

  it("handles array operations like shift correctly", () => {
    document.body.innerHTML = `<div id="shift"></div>`;
    const data = { list: [1, 2, 3] };
    const proxyLand = new ProxyLand(data);

    proxyLand.bind("#shift", (data) => data.list.join(", "));

    proxyLand.data.list.shift(); // should remove element 1
    expect(document.getElementById("shift")?.textContent).toBe("2, 3");
  });
});
