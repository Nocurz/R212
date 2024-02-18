import file from "./data.json" assert { type: "json" };
console.log(file.version);

const module = await import("./data.json", {
  with: { type: "json" },
});
console.log(module.default.version);