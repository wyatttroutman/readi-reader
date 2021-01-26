# Readi

A proof of concept book catelogue management and reading tool. Built using React.js, Recoil, Electron, Node.js, Express, and SQLite.

![Alt Text](https://i.imgur.com/6SdY9Vs.gif)

## Background

I have always been a Calibre user, using it to manage my e-books and load them onto my devices. However, I always found the UI to be very lacking from a UX perspective. I decided to make my own library management tool, challenging myself to use frameworks and tools that I have minimal experience with. This application represents my first attempts at using Recoil, Electron, Express, and SQLite.

I also strived to follow the Material Design specification, although I did break from that in some cases.

## Running Readi

Currently Readi requires running 2 terminal instances concurrently. In one terminal, navigate to the application directory and run `npm start` to launch the React.js app in development mode. In another terminal, navigate to the application directory and run `npm run electron-dev` to launch the electron application & backend services.

## Technologies

Ready uses React.js and Electron for the application user interface. State management is handled by Facebook's experimental library, Recoil.js.

Due to limitations in some downstream libraries, Readi uses an Express webserver and a local SQLite database to manage and serve data. The database is automatically created when running the application.

## Future Changes

There is still some refactoring and cleanup to do to the current code. Beyond that, I'd like to add some basic support for:

- Editing book metadata through the catelogue interface.
- Integrating with Calibre to automatically convert non e-pub books to e-pub format.
- Possibly integrating with Calibre to extract additional metadata for files.

## Liability

This repository is provided as is. I make no representations or warranties of any kind concerning the legality, safety, suitability, lack of viruses, inaccuracies, typographical errors, or other harmful components of this repository. There are inherent dangers in the use of any software, and you are solely responsible for determining whether this software is compatible with your equipment and other software installed on your equipment. You are also solely responsible for the protection of your equipment and backup of your data, and I will not be liable for any damages you may suffer in connection with using, modifying, or distributing this software. This software was written for educational purposes only.
