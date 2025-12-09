#!/usr/bin/env node

import { program } from "commander";
import { replaceSecrets } from "../src/index.js";
import { replaceFiles } from "../src/index.js";
import { addUpdateSecret } from "../src/index.js";
import { getSecrets, updateNoteSecret } from "../src/index.js";

program
    .command('replace')
    .description('Replace all repository secrets')
    .option('-g, --groupKey [groupKey]', 'The name of the group')
    .option('-s, --secretKey [secretKey]', 'Secret token for the group name')
    .option('-i, --input [input]', 'Input file or directory')
    .option('-o, --output [output]', 'Output directory')
    .option('-v, --add-variables [addVariables]', 'Variables to be replaced')
    .action(async (options) => {
        const { groupKey, secretKey, input, output, addVariables} = options;
        await replaceSecrets({ 
            groupKey: groupKey, 
            groupSecret: secretKey, 
            input: input || "trellis/**", 
            output: output || ".trellis/", 
            addVariables: addVariables || "{\"trellis\":{\"admin_user\": \"{{ admin_user }}\"}}"
        });
    });

program
    .command('replace-files')
    .description('Replace all repository secrets')
    .option('-i, --input [input]', 'Input file or directory')
    .option('-o, --output [output]', 'Output directory')
    .option('-v, --variables [variables]', 'Variables to be replaced')
    .action(async (options) => {
        const { input, output, variables} = options;
        if (!input || !output || !variables) {
            console.error('Error: input, output, and variables are required for replace-files command');
            process.exit(1);
        }
        await replaceFiles(input, output, JSON.parse(variables));
    });

program
    .command('add-update-secret')
    .description('Add or update a secret')
    .option('-g, --groupKey [groupKey]', 'The name of the group')
    .option('-s, --secretKey [secretKey]', 'Secret token for the group name')
    .option('-n, --note [note]', 'Note of the secret')
    .option('-e, --env [env]', 'Env of the secret')
    .action(async (options) => {
        await addUpdateSecret({ 
            groupKey: options.groupKey, 
            groupSecret: options.secretKey, 
            note: options.note, 
            env: options.env || "site"
        });
    });

program
    .command('get-secrets')
    .description('Get secrets')
    .option('-g, --groupKey [groupKey]', 'The name of the group')
    .option('-s, --secretKey [secretKey]', 'Secret token for the group name')
    .option('-e, --env [env]', 'Env of the secret')
    .option('-n, --name [name]', 'Name of the secret')
    .action(async (options) => {
        const result = await getSecrets({ 
            groupKey: options.groupKey, 
            groupSecret: options.secretKey, 
            env: options.env,
            name: options.name
        });
        console.log(JSON.stringify(result, null, 2));
    });

program
    .command('update-note-secret')
    .description('Update note of a secret')
    .option('-g, --groupKey [groupKey]', 'The name of the group')
    .option('-s, --secretKey [secretKey]', 'Secret token for the group name')
    .option('-na, --name [name]', 'Name of the secret')
    .option('-e, --env [env]', 'Env of the secret')
    .option('-nt, --note [note]', 'Note of the secret')
    .action(async (options) => {
        await updateNoteSecret({ 
            groupKey: options.groupKey, 
            groupSecret: options.secretKey, 
            name: options.name, 
            note: options.note, 
            env: options.env || "site"
        });
    });
    

program.parse(process.argv);
