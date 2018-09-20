# AndroidApp

This is the repo for Gods Eye android app. It contains everything you need
to modify and re-compile the app. The code can be found in `www/` and instructions
for setting up the environment can be found bellow.

## Setting up the project
Use the following steps to setup the development environment for this project.

Clone the repo: `git clone https://github.com/Gods-Eye-BTH/AndroidApp.git`

download node modules: `npm install`

add the desired platforms: `cordova platform add --save <platform>`  
with <platform> being either `browser` or `android`

run the app to a connected android device: `cordova run android --device`

or to your browser for easier debugging: `cordova run browser`


## Dependencies
To follow the steps above you need the following Dependencies

- git
- npm
- Cordova\*

*\*NOTE: Cordova might have its own dependencies such as android studio*

## License
See `LICENSE` for license information.
