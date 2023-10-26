module.exports = {
  server: {
    input: "../server/build/swagger.json",
    output: {
      target: "./src/api/__generated__/server.ts",
      schemas: "src/api/__generated__/schemas",
      client: "react-query",
    },
  },
};
