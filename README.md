## Usage

| Param      | Abbrv. | Default          | Description                                         |
|------------|--------|------------------|-----------------------------------------------------|
| secret     | s      |                  | AWS Secret Name                                     |
| region     | r      | us-west-2        | AWS Region NAME                                     |
| aws-key    |        | null             | AWS Access Key                                      |
| aws-secret |        | null             | AWS Secret Key                                      |
| name       | n      | <--secret value> | Name of k8s Secret (Defaults to the --secret value) |

```
kubectl apply -n <k8s Namespace> -f - | aws-k8s-secrets -s <secret> -n <name>
```
