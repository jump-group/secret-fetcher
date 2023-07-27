# Secrets Fetcher

This is a Node.js package that replaces secrets in configuration files. It works by fetching variables from a remote server, merging them with any additional variables provided, and then replacing placeholders in configuration files with the merged variables. The resulting files are then saved to a specified output directory.

## Installation
To install this package, run the following command:

```sh
npm install @jumpgroup/secret-fetcher
```

## Usage

To use this package you can import the:

- 'replaceSecrets', 
- 'replaceFiles' 
- 'addUpdateSecret' 

functions from the package and call it with the necessary parameters or you can use this functions like a command.

### Include as a functions
If you want to use this like a functions has the following signature:

#### replaceSecrets

```js
replaceSecrets(groupKey, groupSecret, input, output, addVariables = {})
```
Here is an explanation of the parameters:
<ul>
  <li><code>groupKey</code>: The key of the group of variables to fetch from the remote server.</li>
  <li><code>groupSecret</code>: The secret key of the group of variables to fetch from the remote server.</li>
  <li><code>input</code>: The input file or directory where the configuration files to replace secrets are located.</li>
  <li><code>output</code>: The output directory where the resulting files will be saved. </li>
  <li><code>addVariables</code>: (Optional) Additional variables to merge with the fetched variables. This parameter should be an object containing the additional variables. If the additional variables are provided as a string, they will be parsed as JSON.</li>
</ul>

#### replaceFiles
  
```js
replaceFiles(input, output, addVariables = {})
```

Here is an explanation of the parameters:
<ul>
  <li><code>input</code>: The input file or directory where the configuration files to replace secrets are located.</li>
  <li><code>output</code>: The output directory where the resulting files will be saved. </li>
  <li><code>addVariables</code>: (Optional) Additional variables to merge with the fetched variables. This parameter should be an object containing the additional variables. If the additional variables are provided as a string, they will be parsed as JSON.</li>
</ul>

#### addUpdateSecret

```js
addUpdateSecret(groupKey, groupSecret, note, env)
```

Here is an explanation of the parameters:
<ul>
  <li><code>groupKey</code>: The key of the group of variables to fetch from the remote server.</li>
  <li><code>groupSecret</code>: The secret key of the group of variables to fetch from the remote server.</li>
  <li><code>note</code>: The note of the secret to add or update.</li>
  <li><code>env</code>: The environment of the secret to add or update. It can be "staging" or "production" or "site".</li>
</ul>

### Include as a command
If you want to use this like a command you can use the following commands:

#### replaceSecrets

To replace secrets in configuration files, use the following command:

```sh  
secret-fetcher replace-secrets --groupKey myGroup --groupSecret mySecret --input config/**/* --output .config --addVariables '{"myVariable": "myValue"}'
```

The following options are available:
<ul>
  <li><code>--groupKey</code>: The key of the group of variables to fetch from the remote server.</li>
  <li><code>--groupSecret</code>: The secret key of the group of variables to fetch from the remote server.</li>
  <li><code>--input</code>: The input file or directory where the configuration files to replace secrets are located.</li>
  <li><code>--output</code>: The output directory where the resulting files will be saved. </li>
  <li><code>--addVariables</code>: (Optional) Additional variables to merge with the fetched variables. This parameter should be an object containing the additional variables. If the additional variables are provided as a string, they will be parsed as JSON.</li>
</ul>

#### replaceFiles

To replace secrets in configuration files, use the following command:

```sh
secret-fetcher replace-files --input config/**/* --output .config --variables '{"myVariable": "myValue"}'
```

The following options are available:
<ul>
  <li><code>--input</code>: The input file or directory where the configuration files to replace secrets are located.</li>
  <li><code>--output</code>: The output directory where the resulting files will be saved. </li>
  <li><code>--variables</code>: (Optional) Additional variables to merge with the fetched variables. This parameter should be an object containing the additional variables. If the additional variables are provided as a string, they will be parsed as JSON.</li>
</ul>

#### addUpdateSecret

To add or update a secret, use the following command:

```sh
secret-fetcher add-update-secret --groupKey myGroup --groupSecret mySecret --note myNote --env site
```

The following options are available:
<ul>
  <li><code>--groupKey</code>: The key of the group of variables to fetch from the remote server.</li>
  <li><code>--groupSecret</code>: The secret key of the group of variables to fetch from the remote server.</li>
  <li><code>--note</code>: The note of the secret to add or update.</li>
  <li><code>--env</code>: The environment of the secret to add or update. It can be "staging" or "production" or "site".</li>
</ul>

## Example Usage

### Include as a functions

#### replaceSecrets

```js
import { replaceSecrets } from '@jumpgroup/secret-fetcher';

replaceSecrets('myGroup', 'mySecret', 'config/**/*', '.config'); 
```
This will replace secrets in all files in the config directory and its subdirectories and save the resulting files in a directory called ".config".

#### replaceFiles

```js
import { replaceFiles } from '@jumpgroup/secret-fetcher';

replaceFiles('config/**/*', '.config'); 
```

This will replace secrets in all files in the config directory and its subdirectories and save the resulting files in a directory called ".config".

#### addUpdateSecret

```js
import { addUpdateSecret } from '@jumpgroup/secret-fetcher';

addUpdateSecret('myGroup', 'mySecret', 'myNote', 'site'); 
```

This will create or update a secret with the note "myNote" using tag and name like "myGroup-site".

### Include as a command

#### replaceSecrets

```sh
secret-fetcher replace-secrets --groupKey myGroup --groupSecret mySecret --input config/**/* --output .config --addVariables '{"myVariable": "myValue"}'
```

This will replace secrets in all files in the config directory and its subdirectories and save the resulting files in a directory called ".config".

#### replaceFiles

```sh
secret-fetcher replace-files --input config/**/* --output .config --variables '{"myVariable": "myValue"}'
```

This will replace secrets in all files in the config directory and its subdirectories and save the resulting files in a directory called ".config".

#### addUpdateSecret

```sh
secret-fetcher add-update-secret --groupKey myGroup --groupSecret mySecret --note myNote --env site
```

This will create or update a secret with the note "myNote" using tag and name like "myGroup-site".
## License
This package is licensed under the MIT License.
