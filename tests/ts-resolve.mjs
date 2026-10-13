// Lets `node --test` import src/*.ts modules that use extensionless relative
// imports (bundler style). Registered via --import.
import { register } from "node:module";

register(
  "data:text/javascript," +
    encodeURIComponent(`
export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context);
  } catch (err) {
    if (specifier.startsWith(".") && !/\\.[cm]?[jt]sx?$/.test(specifier)) {
      return next(specifier + ".ts", context);
    }
    throw err;
  }
}`),
  import.meta.url,
);
