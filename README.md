# Martas Website

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.4.

## Backend Server

A simple Node.js/Express backend with SQLite is located in the `server/` directory.

To start the backend server, navigate to the `server/` directory and run:

```bash
npm install
node index.js
```

The server will be available at `http://localhost:3000`.

In production use pm2 to run it:

```bash
pm2 start index.js --name "MartasDatabase"
```

### API Endpoints

- `GET /api/content`: Get all content (optional query param `?type=...`)
- `GET /api/content/:id`: Get a specific content item
- `POST /api/content`: Create new content (supports `multipart/form-data` for image upload)
- `PUT /api/content/:id`: Update content
- `DELETE /api/content/:id`: Delete content

## Building

To build the project run:

```bash
ng build
```
