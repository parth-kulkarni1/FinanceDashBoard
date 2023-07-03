# Finance Dashboard
A personal financial dashboard using UPBANK's Open API created with React.js, Node.js, Express.js and Tremor (Styling Library). 
<br>
Live demo: https://up-bank-dashboard.netlify.app/

## How To Use / Generate Token (instructions copied from https://developer.up.com.au/)

Claim your Personal Access Token

Your personal access token is the key to your financial kingdom. Guard it fiercely and never share it online or give it out. If you are worried it may have fallen into the wrong hands it’s easy to generate a new one (and expire the old one) - see below.

Steps to claim
1. Go to https://api.up.com.au (or tap the Personal Access Token button in the top right) in a web browser. This must be done on a tablet or computer.

2. Open the Up app on your mobile, swipe right and select "Scan QR Code".

3. Scan the QR code displayed on the webpage.

4. Presto! You now have a Personal Access Token. Copy this and store it safely.

Reissuing your Personal Access Token
It’s better to be safe than sorry. If, for any reason, you’re worried about the safety of your Personal Access Token follow these very simple steps to generate a new one.

1. Follow the instructions above to log in to https://api.up.com.au.

2. You should now be looking at your access token – simply click the refresh button to generate a new one. Your old token will immediately stop working.

## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Screenshots](#screenshots)
* [Setup](#setup)
* [Project Status](#project-status)
* [Room for Improvement](#room-for-improvement)
* [Acknowledgements](#acknowledgements)
* [Contact](#contact)

## General Information

This project is orientated for up bank customers, and provides them with insights and information of their daily purchases, income and allows them to modify properties of transactions. 

I decided to create this project because currently UP bank does not have a web based application for desktops or laptops and only have a mobile based application. What if I want to view my daily banking information on my personal computer? Seeing that they are the only bank in Australia with an open API, I decided to then make this application. 

## Technologies Used
<ul>
  
  <li>React.js (Create React App + Typescript) - 18.2.0</li>

  <li>Express.js (Typescript) - 1.0.0</li>

</ul>


## Screenshots

![image](https://github.com/parth-kulkarni1/FinanceDashBoard/assets/96555771/fbf37d7e-7e15-4792-b14c-4b3e5f65d23d)

![image](https://github.com/parth-kulkarni1/FinanceDashBoard/assets/96555771/a0b646e3-7b4f-43a5-9bc8-8e3e7a882081)

![image](https://github.com/parth-kulkarni1/FinanceDashBoard/assets/96555771/5123aedb-375b-4fec-a2a4-ace79669f692)

![image](https://github.com/parth-kulkarni1/FinanceDashBoard/assets/96555771/cc4c5845-943c-4988-8a34-3bb9f89c9ad5)

![image](https://github.com/parth-kulkarni1/FinanceDashBoard/assets/96555771/3cb9d5ba-6418-4dfd-9afb-207b9c2649a7)

## Setup

To set this project up on your own computer, simply download the client-end and express directory and run the command <code>yarn install</code> on each respective directory.

## Project Status

Project is: complete (Initial Version has been completed, more features to be added).

## Room For Improvement

Room For Improvement:
<ul>
  <li>Use More Colours (Not a big design guy)</li>
  <li>Implement Web Hook to reduce API polling, however this is not exactly necessary as this is a small-scale project.</li>
</ul>

To do:

<ul>
  <li>Improve the styling of the current about me page</li>
  <li>Implement a feature that enables user to download transaction into a csv file. </li>
  <li>Add some filtering options to the transactions table</li>
</ul>

## Acknowledgements
<ul>
  <li>Many thanks to UP bank itself, for developing an API that enabled me to do this project: https://up.com.au/, https://developer.up.com.au/.</li>
  <li>Many thanks to [@ndench](https://github.com/ndench/up-bank-api/) for making a typescript wrapper around the API. This really saved time in developing this project, as I did not need to worry about creating types for most for the API responses. </li>
</ul>

## Contact
Created by [@parth-kulkarni-1](https://github.com/parth-kulkarni1/) - feel free to contact me!
