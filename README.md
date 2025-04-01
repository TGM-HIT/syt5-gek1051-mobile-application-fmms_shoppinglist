# SYT Shoppinglist Application

## About the Project

The **SYT Shoppinglist Application** is a web-based tool designed to help users manage their shopping lists efficiently across multiple devices. It leverages **PouchDB** and **CouchDB** for seamless data synchronization.

## Installation

### 1. Clone the Repository

```sh
git clone https://github.com/TGM-HIT/syt5-gek1051-mobile-application-fmms_shoppinglist.git
cd syt5-gek1051-mobile-application-fmms_shoppinglist
```

### 2. Build the Docker Image

```sh
docker build --network host -t fmms-shoppinglist .
```

### 3. Start the Docker Container

```sh
docker run -p 8080:80 fmms-shoppinglist
```

Once the container is running, you can access the application in your web browser at:

```
http://<HOST_IP>:8080
```

### 4. Set Up Syncing with CouchDB/PouchDB

**Note**: Before enabling syncing, ensure that you have created a CouchDB database and have the necessary access credentials.

1. Click on the **Settings** icon (top-right corner of the website).
2. Set the `Sync URL` to:

   ```
   http://<USER>:<PASSWORD>@<HOST_IP>:5984/<DATABASE_NAME>
   ```

3. Click on **START SYNC**.
4. If everything is set up correctly, the `Sync Status` will display **Syncing**.

## Team & Documentation

### Team
- **[Manuel Fellner](https://github.com/MfellnerDev)** – Product Owner
- **[Felix Dahmen](https://github.com/texotek)** – Technical Architect
- **[Sebastian Pollak](https://github.com/sebastianpollak)** – A-meise
- **[Milos Matic](https://github.com/mmatic64)** – B-meise

### Documentation
- **User Stories**: [STORIES.md](docs/STORIES.md)
- **Contributing Guide**: [CONTRIBUTION.md](docs/CONTRIBUTION.md)
- **Technical Documentation**: [TechDoc.md](docs/TechDoc.md)
- **Feature Documentation**: [FEATURES.md](docs/FEATURES.md)

## Credits

This project is inspired by and builds upon the work of **IBM Watson Data Lab**:

[ibm-watson-data-lab/shopping-list-vuejs-pouchdb](https://github.com/ibm-watson-data-lab/shopping-list-vuejs-pouchdb)