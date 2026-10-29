/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

// The app's route table, read statically from the routing files with the TypeScript compiler:
// `path` values (string literals, templates, enum members and static constants), `children`, and
// `loadChildren` imports followed into the routes they load.
import fs from "node:fs";
import path from "node:path";

import ts from "typescript";

function sourceOf(file) {
  return ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
}

// `Enum.Member` and `Class.STATIC` string values across the app
function constants(srcDir) {
  const values = new Map();
  const files = fs
    .readdirSync(srcDir, { recursive: true })
    .filter((f) => f.endsWith(".ts") && !f.endsWith(".spec.ts"))
    .map((f) => path.join(srcDir, f));
  for (const file of files) {
    const visit = (node) => {
      if (ts.isEnumDeclaration(node)) {
        for (const member of node.members) {
          if (member.initializer && ts.isStringLiteral(member.initializer)) {
            values.set(`${node.name.text}.${member.name.getText()}`, member.initializer.text);
          }
        }
      } else if (ts.isClassDeclaration(node) && node.name) {
        for (const member of node.members) {
          const isStatic = ts.getModifiers(member)?.some((m) => m.kind === ts.SyntaxKind.StaticKeyword);
          if (
            isStatic &&
            ts.isPropertyDeclaration(member) &&
            member.initializer &&
            ts.isStringLiteral(member.initializer)
          ) {
            values.set(`${node.name.text}.${member.name.getText()}`, member.initializer.text);
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceOf(file));
  }
  return values;
}

function evaluate(expr, values) {
  if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return expr.text;
  if (ts.isPropertyAccessExpression(expr)) {
    const value = values.get(expr.getText());
    if (value === undefined) throw new Error(`routes: cannot resolve ${expr.getText()}`);
    return value;
  }
  if (ts.isTemplateExpression(expr)) {
    return expr.head.text + expr.templateSpans.map((s) => evaluate(s.expression, values) + s.literal.text).join("");
  }
  throw new Error(`routes: unsupported path expression ${expr.getText()}`);
}

function property(obj, name) {
  return obj.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText() === name)?.initializer;
}

// The route arrays a file declares, by variable name
function routeArrays(sf) {
  const arrays = new Map();
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
      arrays.set(node.name.getText(), node.initializer);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return arrays;
}

const join = (a, b) => [a, b].filter(Boolean).join("/");

// `() => import("./x-routing").then((m) => m.X_ROUTES)`: the module and the exported array
function lazyTarget(lazy, file) {
  let module = null;
  let exported = null;
  const visit = (node) => {
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      module = node.arguments[0].text;
    } else if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.expression)) {
      exported = node.name.text;
    }
    ts.forEachChild(node, visit);
  };
  visit(lazy);
  if (!module || !exported) throw new Error(`routes: cannot follow ${lazy.getText()} in ${file}`);
  return { module, exported };
}

/**
 * Every route pattern, as the full path below the app root (`:accountName/:datasetName/history`),
 * starting from `src/app/app-routing.ts`.
 */
export function routeTable(root) {
  const values = constants(path.join(root, "src/app"));
  const out = new Set();

  function walkArray(array, prefix, file, arrays) {
    for (const element of array.elements) {
      if (ts.isSpreadElement(element)) {
        walkArray(arrays.get(element.expression.getText()), prefix, file, arrays);
      } else if (ts.isObjectLiteralExpression(element)) {
        walkRoute(element, prefix, file, arrays);
      }
    }
  }

  function walkRoute(obj, prefix, file, arrays) {
    const pathExpr = property(obj, "path");
    const full = pathExpr ? join(prefix, evaluate(pathExpr, values)) : prefix;
    if (!property(obj, "redirectTo")) out.add(full);
    const children = property(obj, "children");
    if (children) {
      if (ts.isArrayLiteralExpression(children)) walkArray(children, full, file, arrays);
      else walkArray(arrays.get(children.getText()), full, file, arrays);
    }
    const lazy = property(obj, "loadChildren");
    if (lazy) {
      const { module, exported } = lazyTarget(lazy, file);
      const resolved = resolveImport(file, module);
      const lazyArrays = routeArrays(sourceOf(resolved));
      if (!lazyArrays.has(exported)) throw new Error(`routes: ${exported} not found in ${resolved}`);
      walkArray(lazyArrays.get(exported), full, resolved, lazyArrays);
    }
  }

  function resolveImport(from, spec) {
    const base = spec.startsWith("src/") ? path.join(root, spec) : path.resolve(path.dirname(from), spec);
    return `${base}.ts`;
  }

  // The root routes: the public ones, the ones anonymous access may be forbidden for, and the
  // catch-all, which is provided on its own so that it comes last
  const appRouting = path.join(root, "src/app/app-routing.ts");
  const arrays = routeArrays(sourceOf(appRouting));
  for (const name of ["PUBLIC_ROUTES", "ANONYMOUS_GUARDED_ROUTES"]) {
    if (!arrays.has(name)) throw new Error(`routes: ${name} not found in ${appRouting}`);
    walkArray(arrays.get(name), "", appRouting, arrays);
  }
  if (/path:\s*"\*\*"/.test(fs.readFileSync(appRouting, "utf8"))) out.add("**");
  return [...out].sort();
}
