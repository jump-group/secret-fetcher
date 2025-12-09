# Secrets Fetcher

A Node.js package that seamlessly replaces secrets in configuration files. It fetches variables from a remote password service, merges them with additional variables, and replaces placeholders in your configuration files using Handlebars templating.

## 🚀 Features

- **Flexible Authentication**: Use credentials via parameters or configuration file
- **Template Processing**: Handlebars-based placeholder replacement
- **Multiple Commands**: Replace secrets, manage passwords, and retrieve configurations
- **Environment Support**: Manage secrets across different environments (staging, production, site)
- **CLI & Programmatic**: Use as command-line tool or import as Node.js module

## 📦 Installation

```sh
npm install @jumpgroup/secret-fetcher
```

## 🔧 Configuration

### Option 1: Configuration File (Traditional)
Create a `.secret-fetcher` file in your project root:
```env
groupKey=myGroupKey
groupSecret=myGroupSecret
# other optional parameters
```

### Option 2: Direct Parameters (New in v2.1.0)
Pass credentials directly as parameters - no configuration file needed!

## 📚 Available Functions

- **`replaceSecrets`** - Replace secrets in configuration files
- **`replaceFiles`** - Replace variables in files (without remote fetch)
- **`addUpdateSecret`** - Add or update secrets in the password service
- **`getSecrets`** - Retrieve secrets from the password service  
- **`updateNoteSecret`** - Update secret configurations

## 💻 Programmatic Usage

### replaceSecrets(options)
Replace secrets in configuration files by fetching from remote service.

```js
import { replaceSecrets } from '@jumpgroup/secret-fetcher';

// With credentials (no config file needed)
await replaceSecrets({
  groupKey: 'myGroup',
  groupSecret: 'mySecret', 
  input: 'config/**/*',
  output: '.config/',
  addVariables: { myVar: 'myValue' }
});

// Using .secret-fetcher file
await replaceSecrets({
  input: 'config/**/*',
  output: '.config/'
});
```

**Parameters:**
- `groupKey` *(optional)*: Group identifier for remote secrets
- `groupSecret` *(optional)*: Secret key for authentication  
- `input` *(optional)*: Input file/directory pattern (default: `'trellis/**'`)
- `output` *(optional)*: Output directory (default: `'.trellis/'`)
- `addVariables` *(optional)*: Additional variables to merge

### replaceFiles(input, output, variables)
Replace variables in files without remote fetching.

```js
import { replaceFiles } from '@jumpgroup/secret-fetcher';

await replaceFiles('config/**/*', '.config/', {
  database: { host: 'localhost', port: 5432 },
  api: { endpoint: 'https://api.example.com' }
});
```

### addUpdateSecret(options)
Add or update a secret in the password service.

```js
import { addUpdateSecret } from '@jumpgroup/secret-fetcher';

await addUpdateSecret({
  groupKey: 'myGroup',
  groupSecret: 'mySecret',
  note: 'database:\n  host: localhost\n  port: 5432',
  env: 'production'
});
```

### getSecrets(options) 
Retrieve secrets from the password service.

```js
import { getSecrets } from '@jumpgroup/secret-fetcher';

// Get all secrets for a group
const secrets = await getSecrets({
  groupKey: 'myGroup',
  groupSecret: 'mySecret'
});

// Get secrets for specific environment
const prodSecrets = await getSecrets({
  groupKey: 'myGroup', 
  groupSecret: 'mySecret',
  env: 'production'
});
```

### updateNoteSecret(options)
Update the configuration/note of an existing secret.

```js
import { updateNoteSecret } from '@jumpgroup/secret-fetcher';

await updateNoteSecret({
  groupKey: 'myGroup',
  groupSecret: 'mySecret', 
  env: 'site',
  note: 'updated_key: new_value\nexisting_key: existing_value'
});
```

## 🖥️ CLI Usage

All commands support both credential methods:

### replace
Replace secrets in configuration files.

```bash
# With credentials (recommended)
secret-fetcher replace -g myGroup -s mySecret -i "config/**" -o ".config/"

# Using .secret-fetcher file  
secret-fetcher replace -i "config/**" -o ".config/"

# With additional variables
secret-fetcher replace -g myGroup -s mySecret -v '{"extra":"value"}'
```

**Options:**
- `-g, --groupKey` - Group identifier
- `-s, --secretKey` - Secret key for authentication
- `-i, --input` - Input file/directory pattern (default: `trellis/**`)
- `-o, --output` - Output directory (default: `.trellis/`) 
- `-v, --add-variables` - Additional variables as JSON string

### replace-files
Replace variables in files without fetching from remote service.

```bash
secret-fetcher replace-files -i "config/**" -o ".config/" -v '{"db":"localhost"}'
```

**Options:**
- `-i, --input` - Input file/directory pattern *(required)*
- `-o, --output` - Output directory *(required)*
- `-v, --variables` - Variables as JSON string *(required)*

### add-update-secret
Add or update a secret in the password service.

```bash
# Add/update a secret
secret-fetcher add-update-secret -g myGroup -s mySecret -n "db_host: localhost" -e production

# Using .secret-fetcher file
secret-fetcher add-update-secret -n "api_key: xyz123" -e site
```

**Options:**
- `-g, --groupKey` - Group identifier
- `-s, --secretKey` - Secret key for authentication
- `-n, --note` - Secret configuration as YAML string
- `-e, --env` - Environment (default: `site`)

### get-secrets ✨ *New*
Retrieve and display secrets from the password service.

```bash
# Get all secrets for a group
secret-fetcher get-secrets -g myGroup -s mySecret

# Get secrets for specific environment
secret-fetcher get-secrets -g myGroup -s mySecret -e production

# Filter by name
secret-fetcher get-secrets -g myGroup -s mySecret -n mySecretName
```

**Options:**
- `-g, --groupKey` - Group identifier  
- `-s, --secretKey` - Secret key for authentication
- `-e, --env` - Filter by environment
- `-n, --name` - Filter by secret name

### update-note-secret ✨ *New*
Update the configuration of an existing secret.

```bash
# Update secret configuration
secret-fetcher update-note-secret -g myGroup -s mySecret -nt "new_key: new_value" -e site

# Update using .secret-fetcher file
secret-fetcher update-note-secret -na mySecret -nt "updated_config: true"
```

**Options:**
- `-g, --groupKey` - Group identifier
- `-s, --secretKey` - Secret key for authentication  
- `-na, --name` - Secret name to update
- `-e, --env` - Environment (default: `site`)
- `-nt, --note` - New configuration as YAML string

## 📖 Examples

### Configuration File Template
Your configuration files can use Handlebars syntax:

```yaml
# config/database.yml
production:
  host: {{ database.host }}
  port: {{ database.port }}
  username: {{ database.username }}
  password: {{ database.password }}

development:
  host: localhost
  port: 5432
```

### Complete Workflow Example

```bash
# 1. Add a secret to the password service
secret-fetcher add-update-secret \
  -g "myapp" \
  -s "secret123" \
  -n "database:
    host: prod-db.example.com
    port: 5432
    username: myapp_user
    password: secure_password" \
  -e production

# 2. Process configuration files
secret-fetcher replace \
  -g "myapp" \
  -s "secret123" \
  -i "config/**/*.yml" \
  -o "deploy/"

# 3. Verify the secrets were retrieved
secret-fetcher get-secrets -g "myapp" -s "secret123" -e production
```

### Programmatic Integration

```js
import { replaceSecrets, getSecrets } from '@jumpgroup/secret-fetcher';

async function deployApp() {
  try {
    // Get current secrets
    const secrets = await getSecrets({
      groupKey: 'myapp',
      groupSecret: 'secret123',
      env: 'production'
    });
    
    console.log('Available secrets:', Object.keys(secrets));
    
    // Process configuration files
    await replaceSecrets({
      groupKey: 'myapp',
      groupSecret: 'secret123',
      input: 'config/**/*.yml',
      output: 'deploy/',
      addVariables: {
        app: {
          name: 'MyApp',
          version: process.env.APP_VERSION
        }
      }
    });
    
    console.log('Configuration files processed successfully!');
  } catch (error) {
    console.error('Deployment failed:', error.message);
  }
}
```

## 🛡️ Security Best Practices

- **Never commit** `.secret-fetcher` files to version control
- Use **environment variables** or secure parameter stores in CI/CD
- Regularly **rotate** your group secrets  
- Use **specific environments** to isolate secrets (production, staging, etc.)

## 🔧 Troubleshooting

### Common Issues

**"No .secret_fetcher file found"**
- Either create the file or pass credentials via CLI parameters
- Ensure the file is in the current working directory

**"groupKey e groupSecret devono essere definiti"**  
- Provide credentials either via parameters or configuration file
- Check that your `.secret-fetcher` file contains both `groupKey` and `groupSecret`

**"Note is not a valid yaml"**
- Ensure your note parameter contains valid YAML syntax
- Use proper indentation and escaping for special characters

## 📝 License
This package is licensed under the MIT License.
