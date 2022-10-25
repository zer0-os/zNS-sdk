"use strict";

module.exports = {
  exit: true,
  require: "ts-node/register",
  spec: ["test/**/e2e.test.ts"],
  timeout: "25000", 
};