import Handlebars from "handlebars";
import * as fs from 'fs';
import { globSync } from 'glob';
import fetch from 'node-fetch';
import yaml from 'js-yaml';
import { config } from 'dotenv';

const domain = "https://passwdservice.jumpgroup.it";

// Get the variables from the remote server
const getRemoteKeys = async (groupKey, groupSecret) => {
    const baseUrl = domain + '/api/passwords';

    const params = '?word=' + groupKey + '&encrypted_word=' + groupSecret;

    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
    };

    var result = await fetch(baseUrl + params, requestOptions).then((res) => {
        return res.json();
    }).then((json) => {
        return json;
    });

    const tagToObjectMap = {};

    //create a map of tags to objects
    result.forEach(item => {
        item.tags.forEach(tag => {
            const [tagGroup, tagValue] = tag.split(":");
            if (tagGroup) {
                var newTag = tagGroup;
                if(tagValue) {
                    newTag = tagGroup === groupKey ? tagValue : tag;
                }
                if (!tagToObjectMap[newTag]) {
                    tagToObjectMap[newTag] = {};
                }
                const itemProperties = yaml.loadAll(item.note)[0];
                tagToObjectMap[newTag] = itemProperties;
            }
        });
    });


    return tagToObjectMap;
}

const getSettings = async (options = {}) => {
    const defaults = {
        input: 'trellis/**',
        output: '.trellis/',
        addVariables: {
            "trellis": {
                "admin_user": "{{ admin_user }}"
            }
        },
    };

    const settings = {
        ...defaults,
        ...options
    };

    // validazione delle proprietà obbligatorie
    if (!settings.groupKey || !settings.groupSecret) {
        throw new Error('groupKey e groupSecret devono essere definiti');
    }

    return settings;
}

// Get the variables from the local file
const getLocalKeys = async () => {
    const localFile = globSync(".secret-fetcher")[0];
    if (!localFile) {
        throw new Error("No .secret_fetcher file found");
    }

    const variables = config({
        path: '.secret-fetcher'
    }).parsed;

    return variables;
}

const addUpdateRemoteSecret = async(key, secret, note, env) => {
    const baseUrl = domain + '/api/passwords';

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "word": key,
        "encrypted_word": secret,
        "note": note,
        "environment": env
      });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    var result = await fetch(baseUrl, requestOptions)
        .then(async (res) => {
            if (res.status === 500) {
                // Se lo stato è 500, leggi il messaggio di errore dal corpo della risposta in formato JSON
                const errorResponse = await res.json();
                throw new Error(JSON.stringify(errorResponse));
            } else {
                return res.json();
            }
        })
        .then((json) => {
            return json;
        })
        .catch((error) => {
            console.error(error); 
            return null; // Ritorna null o un altro valore che ritieni opportuno in caso di errore.
        });

    return result;
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

//replace the variables in the files
export const replaceFiles = async (input, output, variables) => {

    //get all the files in the input directory
    console.log("Get all the files in the input directory")
    const configFiles = globSync(input);
    var directory = "";
    // check if the output is a directory or file
    const isDirectory = output.endsWith('/');

    if(isDirectory) {
        directory = input.replace(/.*\/src\//, '').split('/')[0];
    }

    configFiles.forEach(file => {
        // ouput file path

        var outputFile = file.replace(/.*\/src\//, '');
        
        if(isDirectory) {
            outputFile = outputFile.replace(directory, '');
        }

        if(file !== directory) {

            if (fs.lstatSync(file).isDirectory()) {
                // if the file is a directory, create it in the output directory
                fs.mkdirSync(output + outputFile, { recursive: true });
            } else {
                //read the content of the file and compile it with the variables
                console.log("Replacing secrets in " + file);
                const content = fs.readFileSync(file).toString();
                const template = Handlebars.compile(content);
                const outputContent = template(variables);

                //Add the new file with the content to the output directory
                console.log("Adding " + file + " to  output directory");
                console.log("\n");
                if(isDirectory) {
                    console.log("Output file: " + output + outputFile);
                    fs.writeFileSync(output + outputFile, outputContent);
                } else {
                    // create a file with output content
                    console.log("Creating file " + output);
                    fs.writeFileSync(output, outputContent);
                }
                
            }
        }

    });
}

export const replaceSecrets = async (options) => {

    console.log("Starting secret fetcher");
    console.log("\n");

    console.log("Get environment variables from .secret-fetcher file");
    const secretFetcherOptions = await getLocalKeys();

    //Remove from options null, empty and undefined values
    Object.keys(options).forEach(key => {
        if (options[key] === null || options[key] === undefined || options[key] === "") {
            delete options[key];
        }
    });

    options = {
        ...secretFetcherOptions,
        ...options
    };

    // get settings
    console.log("Get all options");
    options = await getSettings(options);

    if (options.addVariables && typeof options.addVariables !== 'object') {
        options.addVariables = JSON.parse(options.addVariables);
    }

    console.log("Get variables from Passwd");
    let variables = await getRemoteKeys(options.groupKey, options.groupSecret);

    //merge the variables with the group variables
    const mergedVariables = mergeVariables(variables, options.addVariables);

    //create a new directory called "output" if not exits yet
    console.log("\n");
    console.log("Creating output directory");

    // if options.output exits and is a directory, remove it
    const isDirectory = options.output.endsWith('/');

    //check if the output is a directory
    if (!fs.existsSync(options.output) && isDirectory) {
        fs.mkdirSync(options.output, { recursive: true });
    }

    //get all the files in the input directory
    replaceFiles(options.input, options.output, mergedVariables);

    console.log("Done!\n");
};

export const addUpdateSecret = async (options) => {

    console.log("Starting secret fetcher");
    console.log("\n");
    console.log("Get environment variables from .secret-fetcher file");
    const secretFetcherOptions = await getLocalKeys();

    //Remove from options null, empty and undefined values
    Object.keys(options).forEach(key => {
        if (options[key] === null || options[key] === undefined || options[key] === "") {
            delete options[key];
        }
    });

    console.log("Get all options");
    options = {
        ...secretFetcherOptions,
        ...options
    };

    console.log("Checking if Note is a valid yaml");

    //check if the note is a valid yaml
    const formattedVariable = options.note.replace(/\\n/g, '\n');
    try {
        yaml.loadAll(formattedVariable)[0];
    }
    catch (e) {
        throw new Error("Note is not a valid yaml");
    }

    console.log("Note is a valid yaml");
    
    console.log("Adding secret to Passwd");
    var result = await addUpdateRemoteSecret(options.groupKey, options.groupSecret, formattedVariable, options.env);

    if(result === null) {
        throw new Error('Error while adding secret to Passwd');
    }

    console.log(result);

    console.log("Done!\n");
}