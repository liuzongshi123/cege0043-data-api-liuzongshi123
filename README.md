# Data API

<p align="justify">This is a technical guide for API setting. This part setting the data API for both <strong>Question Setting App</strong> and <strong>Quiz App</strong>, which allow them insert data or get data from database. It also add an https server to serve files to make sure location-based and other functions work correctly on browser.</p>

## Table of Contents
* System Requirements
* Deployment
* Testing
* File description
* Code reference

## 1. System Requirements
* <p align="justify">In order to enable the full functionality of data-API, a browser that supports https connection is required. So most browsers can be used for these two apps. In order to make sure the apps can locate and zoom into user positions, it is recommended to use Chrome(Version 73.0.3683.75 or above) or Safari(Version 13.1 or above).</p>

* <p align="justify">Data-API requires to make connections to a Ubuntu Server (Virtual Machine). You could use BitVise, Pycharm or other SSH software to connect to the Ubuntu Server.</p>

* <p align="justify">If you are going to use this app outside the UCL campus (not connected to Eduroam), make sure you are connected to UCL VPN by following the instructions at https://www.ucl.ac.uk/isd/services/get-connected/remote-working-services/ucl-virtualprivate-network-vpn.</p>

## 2. Deployment
<p align="justify">1. Clone the source code of the corresponding Node JS server from Github to CEGE server at <code>home/studentuser/code</code>.</p>

```javascript
cd /home/studentuser/code
git clone https://github.com/ucl-geospatial/cege0043-data-api-liuzongshi123
```

<p align="justify">2. Go to the <code>cege0043-data-api-liuzongshi123</code> folder and start the Node JS server.</p>

```javascript
cd /home/studentuser/code/cege0043-data-api-liuzongshi123
pm2 start dataAPI.js
```

<p align="justify">3. Make sure the Node JS server is successfully started. If any error occurs, you could enter the debug mode through the command line window by typing:</p>

```javascript
cd /home/studentuser/code/cege0043-data-api-liuzongshi123
node dataAPI.js
```

## 3. Testing
* <p align="justify">Procedures to test dataAPI:</p>

<p align="justify">1. Make sure your device is connected to UCL Wifi or UCL VPN.</p>

<p align="justify">2. Make sure the Node JS server and app server is active.</p>

<p align="justify">3. In a browser that supports https connection, type the following address: https://developer.cege.ucl.ac.uk:30283, make sure you can see "hello world from the Data API" printed on the screen.</p>

## 4. File description