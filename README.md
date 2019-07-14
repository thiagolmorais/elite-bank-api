# Bem vindo ao Elite-bank

## Sobre o Elite-bank

## Integrantes

- Antônio Simões
- Gustavo Ferreira
- Ivonaldo Soares
- Luiz Gustavo
- Stenio Aguiar
- Thiago Morais

## Informações adicionais

### Framework utilizados

mongo  | v4.0.10
node   | v10.16.0
docker | v18.09.2

### Instalando docker para usar o MongoDB

```shell
### ---- MONGODB
docker run \
    --name mongodb \
    -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=adminpass \
    -d \
    mongo:4

docker run \
    --name mongoclient \
    -p 3000:3000 \
    --link mongodb:mongodb \
    -d \
    mongoclient/mongoclient

docker exec -it mongodb mongo --host localhost -u admin -p adminpass --authenticationDatabase admin --eval "db.getSiblingDB('bank').createUser({user: 'bankadmin', pwd: 'adminbankpwd', roles: [{role: 'readWrite', db: 'bank'}]})"
```
