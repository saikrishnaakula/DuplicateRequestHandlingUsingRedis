# Duplicate Request Handling Using Redis

This project illustrates a method for preventing the processing of duplicate requests on the server by utilizing Redis to store requests. Duplicate requests are identified based on session, request URL, parameters, and body content.

## Prerequisites
 - Redis
 - Node.js

## installation

### Clone the repository
git clone https://github.com/saikrishnaakula/DuplicateRequestHandlingUsingRedis.git

### Navigate to the project directory
cd DuplicateRequestHandlingUsingRedis

### Install dependencies
npm install

## Usage

### Start redis server
brew services start redis

### Start the server
npm start

Open your web browser and go to http://localhost:3000

