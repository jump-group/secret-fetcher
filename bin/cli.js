#!/usr/bin/env node

import { program } from "commander";
import { replaceSecrets } from "../src/index.js"

program
    .command('hello')
    .description('Say hello')
    .action(() => {
        console.log('Hello!');
        console.log(process.argv['3']);
    });

program
    .command('replace')
    .description('Replace all repository secrets')
    .argument('<groupKey>', 'Group key')
    .argument('<secretKey>', 'Secret token for the group')
    .argument('<input>', 'Input file or directory')
    .argument('<output>', 'Output directory')
    .argument('[variables]', 'Variables to be replaced')
    .action((groupKey, secretKey, input, output, addVariables) => {
        replaceSecrets(groupKey, secretKey, input, output, addVariables);
    });

program.parse(process.argv);