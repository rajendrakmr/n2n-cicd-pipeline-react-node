#!/bin/bash
sed -e
NAMESPACE="ecommerce-ns"
CONFIGMAP_NAME="mysql-initdb"
SQL_PATH="./init-db/init.sql"
echo "Updating ConfigMap '$CONFIGMAP_NAME' in namespace '$NAMESPACE'..."

kubectl create configmap $CONFIGMAP_NAME \
  --from-file=init.sql=$SQL_FILE \
  -n $NAMESPACE \
  --dry-run=client -o yaml | kubectl apply -f -

echo "ConfigMap updated successfully."
