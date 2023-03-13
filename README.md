# Secrets Replacer

This is a Node.js package that replaces secrets in configuration files. It works by fetching variables from a remote server, merging them with any additional variables provided, and then replacing placeholders in configuration files with the merged variables. The resulting files are then saved to a specified output directory.

## Installation
To install this package, run the following command:

```sh
npm install @jumpgroup/secret-fetcher
```

## Usage
To use this package, import the replaceSecrets function from the package and call it with the necessary parameters. The function has the following signature:

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

<p>Example usage:</p>

```js
import { replaceSecrets } from '@jumpgroup/secret-fetcher';

replaceSecrets('myGroup', 'mySecret', 'config/**/*', '.config'); 
```
This will replace secrets in all files in the config directory and its subdirectories and save the resulting files in a directory called ".config".

## License
This package is licensed under the MIT License.
