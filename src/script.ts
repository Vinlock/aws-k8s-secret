import AWS from 'aws-sdk'
import minimist from 'minimist'

// Get arguments
const args = minimist(process.argv.slice(2), {
  alias: {
    n: 'name',
    r: 'region',
    s: 'secret',
  },
  default: {
    region: 'us-west-2',
  },
  string: [
    'secret',
    'name',
    'region',
    'aws-key',
    'aws-secret',
  ],
});

const secret: string = args.secret
const region: string = args.region
const accessKeyId: string = args['aws-key']
const secretAccessKey: string = args['aws-secret']
const metaname = args.name || secret;

// Validate
if (!secret || secret.length === 0) {
  throw new Error('--secret|-s must be provided.')
}

// Instantiate Secrets Manager
export interface IOptions {
  accessKeyId?: string
  apiVersion: string,
  region: string,
  secretAccessKey?: string
}

const options: AWS.SecretsManager.Types.ClientConfiguration = {
  apiVersion: '2017-10-17',
  region,
}

if (accessKeyId && accessKeyId.length > 1) {
  options.accessKeyId = accessKeyId;
}

if (secretAccessKey && secretAccessKey.length > 1) {
  options.secretAccessKey = secretAccessKey;
}

const secretsManager = new AWS.SecretsManager(options);

// Get Secret
const params = {
  SecretId: secret,
};

// Get secrets and create secret
secretsManager.getSecretValue(params).promise()
  .then(({ SecretString }) => {
    const secrets = JSON.parse(SecretString)
    const secretData: {[s: string]: string} = {}

    Object.keys(secrets).forEach((s) => {
      secretData[s] = Buffer.from(secrets[s]).toString('base64')
    })

    const k8sSecret = {
      apiVersion: 'v1',
      data: secretData,
      kind: 'Secret',
      metadata: {
        name: metaname
      },
      type: 'Opaque',
    }

    process.stdout.write(JSON.stringify(k8sSecret))
  })
  .catch((err) => {
    throw new Error(`AWS Error: ${err.message}.`)
  });
