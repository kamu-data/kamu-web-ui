const { LICENSE_HEADER } = require("./src/docs/license-header");

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Ensure files have a valid license header",
      recommended: true,
    },
    schema: [],
    messages: {
      missingHeader: "Missing or incorrect license header.",
    },
  },
  create(context) {
    return {
      Program(node) {
        const sourceCode = context.getSourceCode();
        const fileText = sourceCode.text;

        if (!fileText.startsWith(LICENSE_HEADER)) {
          context.report({
            node,
            messageId: "missingHeader",
          });
        }
      },
    };
  },
};
