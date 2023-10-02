#!/usr/bin/env node

import { program } from "commander";
import { replaceSecrets } from "../src/index.js";
import { replaceFiles } from "../src/index.js";
import { addUpdateSecret } from "../src/index.js";
import { getSecrets } from "../src/index.js";

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
        replaceSecrets({ groupKey: groupKey || "", groupSecret: secretKey || "", input: input || "trellis/**", output: output || ".trellis/", addVariables: addVariables || "{\"trellis\":{\"admin_user\": \"{{ admin_user }}\"}}"});
    });

program
    .command('replace-files')
    .description('Replace all repository secrets')
    .option('-i, --input [input]', 'Input file or directory')
    .option('-o, --output [output]', 'Output directory')
    .option('-v, --variables [variables]', 'Variables to be replaced')
    .action((options) => {
        const { input, output, variables} = options;
        replaceFiles(input, output, JSON.parse(variables));
    });

program
    .command('add-update-secret')
    .description('Add or update a secret')
    .option('-g, --groupKey [groupKey]', 'The name of the group')
    .option('-s, --secretKey [secretKey]', 'Secret token for the group name')
    .option('-n, --note [note]', 'Note of the secret')
    .option('-e, --env [env]', 'Env of the secret')
    .action((options) => {
        addUpdateSecret({ groupKey: options.groupKey || "", groupSecret: options.secretKey || "", note: options.note || "", env: options.env || "site"});
    });

program
    .command('get-secrets')
    .description('Get secrets')
    .option('-g, --groupKey [groupKey]', 'The name of the group')
    .option('-s, --secretKey [secretKey]', 'Secret token for the group name')
    .option('-e, --env [env]', 'Env of the secret')
    .option('-n, --name [name]', 'Name of the secret')
    .action((options) => {
        getSecrets({ groupKey: options.groupKey || "", groupSecret: options.secretKey || "", name: options.name || "", env: options.env || "site", name: options.name || ""});
    });

program.parse(process.argv);
