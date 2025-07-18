#!/bin/bash

# Paths
SQL_FILE="./k8s/init-db/init.sql"
YAML_FILE="./k8s/mysql-config.yml"

# ConfigMap details
CONFIGMAP_NAME="mysql-initdb-config"
NAMESPACE="ecommerce-ns"

# Check for init.sql existence
if [ ! -f "$SQL_FILE" ]; then
  echo "❌ init.sql not found at $SQL_FILE"
  exit 1
fi

# Delete old ConfigMap if it exists
kubectl delete configmap $CONFIGMAP_NAME -n $NAMESPACE --ignore-not-found

# Create new ConfigMap YAML from SQL file
kubectl create configmap $CONFIGMAP_NAME \
  --from-file=init.sql=$SQL_FILE \
  -n $NAMESPACE \
  --dry-run=client -o yaml > $YAML_FILE

echo "✅ ConfigMap YAML generated at $YAML_FILE"
