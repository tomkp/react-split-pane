This directory contains the source for [react-split-pane.surge.sh](https://react-split-pane.surge.sh).
The website structure was created with [`create-react-app`](https://github.com/facebook/create-react-app), although it has since been ejected in order to add custom Webpack loaders.

## Local development

Run the NPM "build:watch" command in the project root to watch for changes to `react-split-pane` and rebuild:

```sh
 cd /local/path/to/react-split-pane
 npm run build:watch
```

Lastly, run the NPM "start" command from the website directory to run the local webserver:

```sh
cd /local/path/to/react-split-pane/website
npm run start
```

## Deployment

To deploy this website to Surge, use the NPM "deploy" command from this directory:

```sh
cd /local/path/to/react-split-pane/website
npm run deploy
```
