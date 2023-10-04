# CCC Admin Client

This custom Admin client UI was built on top of Okta's React Hosted Login example app. This was to ensure the Admin client is secured by user authentication, and to demonstrate how the user details in the identity provider token can be leveraged for registering the Admin client and communicating with the Flex UI.

# Okta React + Okta Hosted Login Example

This example shows you how to use the [Okta React Library][] and [React Router](https://github.com/ReactTraining/react-router) to login a user to a React application. The login is achieved with the [Okta Sign In Widget][], which gives you more control to customize the login experience within your app.

This example is built with [Create React App][].

## Prerequisites

Before running this sample, you will need the following:

- An Okta Account, you can sign up for a developer account at https://developer.okta.com/signup/.
- An Okta Application, configured for Single-Page App (SPA) mode. This is done from the Okta Developer Console, you can see the [OIDC SPA Setup Instructions][]. When following the wizard, use the default properties. They are are designed to work with our sample applications.

## Running This Example

After cloning this repository or extracting the repository zip file, install the dependencies:

Then install dependencies:

```bash
npm install
```

Now you need to gather the following information from the Okta Console:

- **Client Id** - The client ID of the SPA application that you created earlier. This can be found on the "General" tab of an application, or the list of applications. This identifies the application that tokens will be minted for.
- **Issuer** - This is the URL of the authorization server that will perform authentication. All Developer Accounts have a "default" authorization server. The issuer is a combination of your Org URL (found in the upper right of the console home page) and `/oauth2/default`. For example, `https://dev-1234.oktapreview.com/oauth2/default`.

You will also need the base domain name where your serverless code will be hosted. The serverless code will be responsible for generating a Twilio access token. This solution includes an example Twilio Serverless Function in the `/serverless` folder.

These values must exist as environment variables. Rename `.env.sample` in the root of the `ccc-admin-ui` folder to `.env` and populate the following Okta variables. See [dotenv](https://www.npmjs.com/package/dotenv) for more details on this file format.

```ini
ISSUER=https://yourOktaDomain.com/oauth2/default
CLIENT_ID=123xxxxx123
SERVERLESS_DOMAIN=your.serverlessdomain.com
```

> NOTE: If you are running the sample against an org that has [Okta's Identity Engine](https://developer.okta.com/docs/concepts/ie-intro/) enabled, you will need to add the following environment variable to your `.env` file
> USE_INTERACTION_CODE=true

With variables set, you can start the app server. For development with active change detection, run:

```bash
npm run dev
```

To preview the build version of the app, run:

```bash
npm start
```

Now navigate to http://localhost:8080 in your browser.

If you see a home page that prompts you to login, then things are working! Clicking the **Log in** button will render a custom login page component that uses the Okta Sign-In Widget to perform authentication.

You can login with the same account that you created when signing up for your Developer Org, or you can use a known username and password from your Okta Directory.

**Note:** If you are currently using your Developer Console, you already have a Single Sign-On (SSO) session for your Org. You will be automatically logged into your application as the same user that is using the Developer Console. You may want to use an incognito tab to test the flow from a blank slate.

[create react app]: https://create-react-app.dev
[okta react library]: https://github.com/okta/okta-react
[oidc spa setup instructions]: https://developer.okta.com/docs/guides/sign-into-spa/react/before-you-begin
[okta sign in widget]: https://github.com/okta/okta-signin-widget
