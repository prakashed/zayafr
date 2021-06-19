# WebApp Starter
A starter template to create React apps.

## Content
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
- [Info](#info)
  - [Dev Dependencies](#dev-dependencies)
  - [Dependencies](#dependencies)

## Installation
Here are general guidelines as to how you can run this project on your machine.

### Prerequisites
1. You need to have nodejs (>= 6.x) installed. You can get it [here](https://nodejs.org/en/download/)
1. Install yarn, you can find the documentation over [here](https://yarnpkg.com/en/docs/install)

### Getting Started
1. Clone the repository using `git clone`. For eg. `git clone https://github.com/zayalabs/o3schools-webapp.git`
1. Install dependencies using `yarn`
1. Serve the app using `yarn serve`
1. Build the app using `yarn build`

## Info
Technical information about this project 

### Dev Dependencies
- `webpack` - Needed to take care of our bundling needs.
- `babel-core` - Babel modules are necessary for converting ES2015 js to vanilla js. It also helps us maintain crossbrowser and old browser compatiability.
- `less` - Parses our LESS to CSS.
- `babel-loader`, `babel-preset-env`, `babel-preset-react` - Babel presets and loader for webpack.
- `css-loader`, `less-loader`, `style-loader` - These are loaders usually needed to bundle stylesheets (CSS and LESS) using webpack.
- `webpack-dev-server` - Needed to serve our application using a local servver. Used for development purposes.
- `html-webpack-plugin` - Injects modules into our main HTML page.
- `less-vars-to-js` - Converts less variables from a file and returns them in a single JSON. Wee need this to override theme variables.
- `babel-plugin-import` - Ambiguously named plugin. It is a babel plugin for the `antd` framework that we are using.

### Dependencies
- `react`, `react-dom` - React JS view library used to make the app. `react-dom` is used to write applications for web browsers.
- `antd` - Ant Design component library. 