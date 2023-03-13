import Handlebars from "handlebars";
import * as fs from 'fs';
import path from "path";
import { globSync } from 'glob';
import fetch from 'node-fetch';
import yaml from 'js-yaml';

// Get the variables from the remote server
const getRemoteKeys = async (groupKey, groupSecret) => {
    const baseUrl = 'https://red-darkness-mkradlyf82jj.vapor-farm-c1.com/api/passwords';

    const params = '?word=' + groupKey + '&encrypted_word=' + groupSecret;

    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
    };

    var result = await fetch(baseUrl + params, requestOptions).then((res)=>{
        return res.json();
    }).then((json)=>{
        return json;
    });

    const tagToObjectMap = {};

    //create a map of tags to objects
    result.forEach(item => {
        item.tags.forEach(tag => {
            if(tag === groupKey + ":staging"){
                tag = "staging";
            }
            if(tag === groupKey + ":production"){
                tag = "production";
            }
            if (!tagToObjectMap[tag]) {
                tagToObjectMap[tag] = {};
            }
            tagToObjectMap[tag] = yaml.loadAll(item.note)[0];
        });
    });

    return tagToObjectMap;
}

//merge the variables with the group variables
const mergeVariables = (variables, addVariables) => {
    const groups = [...new Set([...Object.keys(variables), ...Object.keys(addVariables)])];

    const mergedVariables = {};

    groups.forEach(group => {
        if (variables.hasOwnProperty(group) && addVariables.hasOwnProperty(group)) {
            mergedVariables[group] = {
                ...variables[group],
                ...addVariables[group]
            };
        } else if (variables.hasOwnProperty(group)) {
            mergedVariables[group] = variables[group];
        } else {
            mergedVariables[group] = addVariables[group];
        }
    });

    return mergedVariables;
}

export const replaceSecrets = async (groupKey, groupSecret, input, output = null, addVariables = {}) => {
    
    if (addVariables && typeof addVariables !== 'object') {
        addVariables = JSON.parse(addVariables);
    }

    let variables = await getRemoteKeys(groupKey, groupSecret);

    //merge the variables with the group variables
    const mergedVariables = mergeVariables(variables, addVariables);

    //create a new directory called "output" if not exits yet
    console.log("Creating output directory");

    if (fs.existsSync(output)) {
        fs.readdirSync(output).forEach(file => {
            const filePath = path.join(output, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                fs.rmdirSync(filePath, {
                    recursive: true
                });
            } else {
                fs.unlinkSync(filePath);
            }
        });
        fs.rmdirSync(output);
    }

    fs.mkdirSync(output);

    //get all the files in the input directory
    const configFiles = globSync(input);

    configFiles.forEach(file => {

        if(fs.lstatSync(file).isDirectory()){
            // if the file is a directory, create it in the output directory
            fs.mkdirSync(output + "/" + file);
        }else{
            //read the content of the file and compile it with the variables
            // console.log("Replacing secrets in " + file);
            const content = fs.readFileSync(file).toString();
            const template = Handlebars.compile(content);
            const outputContent = template(mergedVariables);

            //Add the new file with the content to the .trellis directory
            console.log("Adding " + file + " to .trellis directory");
            console.log("\n");
            fs.writeFileSync(output + "/" + file, outputContent);

        }

    });

    console.log("Done!");
};
