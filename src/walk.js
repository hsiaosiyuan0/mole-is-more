export function walk(node, cb, path) {
  if (!node) return true;
  if (Array.isArray(node))
    return node.every((node, i) => {
      const key = `${path}[${i}]`;
      return walk(node, cb, key);
    });
  if (!cb(node, path)) return false;

  switch (node.type) {
    case "Program":
      return walk(node.body, cb, path + ".body");
    case "Identifier":
    case "Literal":
    case "RegExpLiteral":
    case "EmptyStatement":
    case "DebuggerStatement":
    case "ThisExpression":
    case "Super":
    case "TemplateElementValue":
    case "PrivateIdentifier":
      break;
    case "ExpressionStatement":
      return walk(node.expression, cb, path + ".expression");
    case "BlockStatement":
    case "StaticBlock":
      return walk(node.body, cb, path + ".body");
    case "WithStatement":
      if (!walk(node.expression, cb, path + ".expression")) return false;
      return walk(node.body, cb, path + ".body");
    case "ReturnStatement":
      return walk(node.argument, cb, path + ".argument");
    case "LabeledStatement":
      return walk(node.body, cb, path + ".body");
    case "BreakStatement":
    case "ContinueStatement":
      return walk(node.label, cb, path + ".label");
    case "IfStatement":
    case "ConditionalExpression":
      if (!walk(node.test, cb, path + ".test")) return false;
      if (!walk(node.consequent, cb, path + ".consequent")) return false;
      return walk(node.alternate, cb, path + ".alternate");
    case "SwitchStatement":
      if (!walk(node.discriminant, cb, path + ".discriminant")) return false;
      return walk(node.cases, cb, path + ".cases");
    case "SwitchCase":
      if (!walk(node.test, cb, path + ".test")) return false;
      return walk(node.consequent, cb, path + ".consequent");
    case "ThrowStatement":
    case "UnaryExpression":
    case "UpdateExpression":
    case "SpreadElement":
    case "YieldExpression":
    case "AwaitExpression":
    case "RestElement":
      return walk(node.argument, cb, path + ".argument");
    case "TryStatement":
      if (!walk(node.block, cb, path + ".block")) return false;
      if (!walk(node.handler, cb, path + ".handler")) return false;
      return walk(node.finalizer, cb, path + ".finalizer");
    case "CatchClause":
      if (!walk(node.param, cb, path + ".param")) return false;
      return walk(node.body, cb, path + ".body");
    case "WhileStatement":
      if (!walk(node.test, cb, path + ".test")) return false;
      return walk(node.body, cb, path + ".body");
    case "DoWhileStatement":
      if (!walk(node.test, cb, path + ".test")) return false;
      return walk(node.body, cb, path + ".body");
    case "ForStatement":
      if (!walk(node.init, cb, path + ".init")) return false;
      if (!walk(node.test, cb, path + ".test")) return false;
      if (!walk(node.update, cb, path + ".update")) return false;
      return walk(node.body, cb, path + ".body");
    case "ForOfStatement":
    case "ForInStatement":
      if (!walk(node.left, cb, path + ".left")) return false;
      if (!walk(node.right, cb, path + ".right")) return false;
      return walk(node.body, cb, path + ".body");
    case "FunctionExpression":
    case "FunctionDeclaration":
    case "ArrowFunctionExpression":
      if (!walk(node.id, cb, path + ".id")) return false;
      if (!walk(node.params, cb, path + ".params")) return false;
      return walk(node.body, cb, path + ".body");
    case "VariableDeclaration":
      return walk(node.declarations, cb, path + ".declarations");
    case "VariableDeclarator":
      if (!walk(node.id, cb, path + ".id")) return false;
      return walk(node.init, cb, path + ".init");
    case "ArrayExpression":
      return walk(node.elements, cb, path + ".elements");
    case "ObjectExpression":
      return walk(node.properties, cb, path + ".properties");
    case "BinaryExpression":
    case "AssignmentExpression":
    case "LogicalExpression":
    case "AssignmentPattern":
      if (!walk(node.left, cb, path + ".left")) return false;
      return walk(node.right, cb, path + ".right");
    case "MemberExpression":
      if (!walk(node.object, cb, path + ".object")) return false;
      return walk(node.property, cb, path + ".property");
    case "CallExpression":
    case "NewExpression":
      if (!walk(node.callee, cb, path + ".callee")) return false;
      return walk(node.arguments, cb, path + ".arguments");
    case "SequenceExpression":
      return walk(node.expressions, cb, path + ".expressions");
    case "TemplateLiteral":
      if (!walk(node.quasis, cb, path + ".quasis")) return false;
      return walk(node.expressions, cb, path + ".expressions");
    case "TaggedTemplateExpression":
      if (!walk(node.tag, cb, path + ".tag")) return false;
      return walk(node.quasi, cb, path + ".quasi");
    case "TemplateElement":
      return walk(node.value, cb, path + ".value");
    case "ChainExpression":
      return walk(node.expression, cb, path + ".expression");
    case "ImportExpression":
      return walk(node.source, cb, path + ".source");
    case "Property":
    case "AssignmentProperty":
    case "MethodDefinition":
    case "PropertyDefinition":
      if (!walk(node.key, cb, path + ".key")) return false;
      return walk(node.value, cb, path + ".value");
    case "ObjectPattern":
      return walk(node.properties, cb, path + ".properties");
    case "ArrayPattern":
      return walk(node.elements, cb, path + ".elements");
    case "ClassBody":
      return walk(node.body, cb, path + ".body");
    case "ClassDeclaration":
    case "ClassExpression":
      if (!walk(node.id, cb, path + ".id")) return false;
      if (!walk(node.superClass, cb, path + ".superClass")) return false;
      return walk(node.body, cb, path + ".body");
    case "MetaProperty":
      if (!walk(node.meta, cb, path + ".meta")) return false;
      return walk(node.property, cb, path + ".property");
    case "ImportDeclaration":
      if (!walk(node.specifiers, cb, path + ".specifiers")) return false;
      return walk(node.source, cb, path + ".source");
    case "ImportSpecifier":
      if (!walk(node.local, cb, path + ".label")) return false;
      return walk(node.imported, cb, path + ".imported");
    case "ImportDefaultSpecifier":
    case "ImportNamespaceSpecifier":
      return walk(node.local, cb, path + ".local");
    case "ExportNamedDeclaration":
      if (!walk(node.declaration, cb, path + ".declaration")) return false;
      if (!walk(node.specifiers, cb, path + ".specifiers")) return false;
      return walk(node.source, cb, path + ".source");
    case "ExportSpecifier":
      if (!walk(node.local, cb, path + ".local")) return false;
      return walk(node.exported, cb, path + ".exported");
    case "ExportDefaultDeclaration":
      return walk(node.declaration, cb, path + ".declaration");
    case "ExportAllDeclaration":
      if (!walk(node.exported, cb, path + ".exported")) return false;
      return walk(node.source, cb, path + ".source");

    case "JSXElement":
    case "JSXFragment":
      if (!walk(node.openingElement, cb, path + ".openingElement"))
        return false;
      if (!walk(node.children, cb, path + ".children")) return false;
      return walk(node.closingElement, cb, path + ".closingElement");
    case "JSXOpeningElement":
      if (!walk(node.name, cb, path + ".name")) return false;
      return walk(node.attributes, cb, path + ".attributes");
    case "JSXIdentifier":
      return walk(node.name, cb, path + ".name");
    case "JSXNamespacedName":
      if (!walk(node.namespace, cb, path + ".namespace")) return false;
      return walk(node.name, cb, path + ".name");
    case "JSXMemberExpression":
      if (!walk(node.object, cb, path + ".object")) return false;
      return walk(node.property, cb, path + ".property");
    case "JSXClosingElement":
      return walk(node.name, cb, path + ".name");
    case "JSXOpeningFragment":
    case "JSXClosingFragment":
    case "JSXText":
    case "JSXEmptyExpression":
      break;
    case "JSXExpressionContainer":
    case "JSXSpreadChild":
      return walk(node.expression, cb, path + ".expression");
    case "JSXSpreadAttribute":
      return walk(node.argument, cb, path + ".argument");
    case "JSXAttribute":
      if (!walk(node.name, cb, path + ".name")) return false;
      return walk(node.value, cb, path + ".value");
  }
  return true;
}
