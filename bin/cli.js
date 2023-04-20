#!/usr/bin/env node

import { program } from "commander";
import { replaceSecrets } from "../src/index.js"

program
    .command('replace')
    .description('Replace all repository secrets')
    .option('-g, --groupKey [groupKey]', 'The name of the group')
    .option('-s, --secretKey [secretKey]', 'Secret token for the group name')
    .option('-i, --input [input]', 'Input file or directory')
    .option('-o, --output [output]', 'Output directory')
    .option('-v, --add-variables [addVariables]', 'Variables to be replaced')
    .action((options) => {
        const { groupKey, secretKey, input, output, addVariables} = options;
        replaceSecrets({ groupKey: groupKey || "", groupSecret: secretKey || "", input: input || "trellis/**", output: output || ".trellis", addVariables: addVariables || "{\"trellis\":{\"admin_user\": \"{{ admin_user }}\"}}"});
    });

program.parse(process.argv);