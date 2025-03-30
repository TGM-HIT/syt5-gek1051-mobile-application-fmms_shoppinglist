# SYT Shoppinglist Application

## About the Project

This project is a Shoppinglist Application available on the web.
It leverages PouchDB and CouchDB for seamless data synchronization,
allowing users to manage their shopping lists efficiently across devices.


**Team**: 
  - [Manuel Fellner](https://github.com/MfellnerDev), Product Owner
  
  - [Felix Dahmen](https://github.com/texotek), Technical Architect

  - [Sebastian Pollak](https://github.com/sebastianpollak), A-meise

  - [Milos Matic](https://github.com/mmatic64), B-meise

**Userstories**: [STORIES.md](docs/STORIES.md)

**Contributing**: [CONTRIBUTION.md](docs/CONTRIBUTION.md)

**Technical Documentation**: [TechDoc.md](docs/TechDoc.md)

## Installation

1. **Clone the repository**

```
git clone https://github.com/TGM-HIT/syt5-gek1051-mobile-application-fmms_shoppinglist
cd syt5-gek1051-mobile-application-fmms_shoppinglist
```

2. **Add Credentials**

```
vim .env

COUCHDB_USER=<user>
COUCHDB_PASSWORD=<password>
```

3. **Use docker-compose to start the application**

```
docker compose up
```

Now you can open the App in your Web Browser on `localhost:8081`. 

4. **Set up the Syncing with CouchDB/PouchDB**

On the right-top side of the Website you can see settings icon. Click on it and
set the `Sync URL` to:

`http://<user>:<password>@localhost:5984/shopping-list`

Click on `START SYNC` and the `Sync Status` should should `Syncing`.


## Credits

[ibm-watson-data-lab/shopping-list-vuejs-pouchdb](https://github.com/ibm-watson-data-lab/shopping-list-vuejs-pouchdb)
