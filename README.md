# React Native Launchpad (feat. Supabase)

An extended starter template for React Native with Supabase. Includes auth flow, user profile (with editing and image upload), internationalization, error logging and more.

Setup instructions in this README file or on the [RN Launchpad website](https://rnlaunchpad.com).

## Technologies Used

- [Expo](https://expo.dev)
- [NativeWind](https://www.nativewind.dev)
- [React Native Reusables](https://github.com/mrzachnugent/react-native-reusables) (ShadCN components for React Native)
- [React Hook Form](https://react-hook-form.com)
- [Tanstack Query](https://tanstack.com/query/latest)
- [Valibot](https://valibot.dev)
- [Zustand](https://zustand-demo.pmnd.rs)
- [Lingui](http://lingui.dev)
- [Bugsnag](https://www.bugsnag.com)
- [Mixpanel](http://mixpanel.com)

## Getting Started

### The Basics

1. Clone this repo. `git clone https://github.com/mrkshm/rnlaunchpad.git`
2. Move into the new folder `cd rnlaunchpad`
3. Install the dependencies `npm install`
4. Rename example.env to .env
5. In your .env file, you may want to change the values for `IOS_BUNDLE_IDENTIFIER` and `ANDROID_PACKAGE_NAME`.

### Setting Up Supabase

1. Set up a new Supabase project.
2. Find your Supabase Url and enter it in the .env file ("EXPO_PUBLIC_SUPABASE_URL").
3. Find your Supabase API Key and enter it in the .env file ("EXPO_PUBLIC_SUPABASE_ANON_KEY").
4. In Supabase, under the Storage tab, create a bucket.
5. Enter the name of your newly created Storage bucket in the .env file ("EXPO_PUBLIC_SUPABASE_USER_BUCKET").
6. Create a policy for your storage bucket. Choose "Get Started Quickly" and then "Give users access to only their own top level folder named as uid". Allow everything (DELETE, UPDATE, INSERT, SELECT).
7. In the Authentication tab under Email Templates, change the email templates for "Confirm signup", "Change Email Address" and "Reset Password" to something like: `<p>Please enter the following code in the activation screen<p><p>{{ .Token }}</p>`.
8. In Supabase, navigate to Authentication -> Provider -> Email and deselect *Secure Email Change*.
9. If you have not yet installed Supabase CLI, please do so now before continuing.
10. Link your local project with the Supabase project. `supabase link`, then choose the project you just created.
11. Push the migrations (`supabase db push`). When asked if you want to push the migrations, confirm by pressing `Y`.

### The First Build

1. In the .env file, adjust `IOS_BUNDLE_IDENTIFIER` and `ANDROID_PACKAGE_NAME`.
2. In your terminal, run `npx expo run:ios` (This will be only necessary for the first build, next time you want to start the project, `npx expo` will be enough.)
3. Press "i" to open your simulator. (You may have to configure it first.)
4. Press the button "Show an Error for Testing". You should see a message getting logged to the console. Same for the other button "Log an Event for Testing".

## Advanced Topics

### Notes about Authentication

I decided on using OTP Codes for everything, to make it easier to get started. Setting up deep linking can be a bit involved. When a registered user is trying to sign up again, he is logged in automatically. I cheat a little for password reset: Supabase Starter simply does a passwordless login for the email address provided, and, once the user successfully enters the confirmation code, navigates to the password change screen. If you want to modify any of these behaviours, you can easily do so in /context/auth-provider.tsx

### Internationalization

Everything is already set up for Internationalization with Lingui. Check the [Lingui docs](https://lingui.dev/introduction) on how to use it in detail.

The very basics:

- Use `npm run extract` to rebuild the po translation files (it will automatically find all the translation strings in your code) so you (or your translators, or your preferred AI) can translate.
- Once you have translated the po files, use `npm run compile` to compile them to json files. Those will be used by Lingui to display the translations.

If you do not need internationalization, you can simply delete the language switcher and pretty much ignore it. (If you are really sure that you will never need it you may want to uninstall Lingui as well as the @formatjs tools from the project and replace all `{t`some string`}` with `some string`)

### Analytics (optional)

To enable analytics with Mixpanel, create a project in Mixpanel and replace the fake Mixpanel token in the .env file with your real one. Then set EXPO_PUBLIC_ENABLE_ANALYTICS=true
By default, analytics is set to false and tracked events are simply logged to the console.

### Error Reporting (optional)

To enable error reporting with Bugsnag, run `npx bugsnag-expo-cli init`.
When it asks you if you want code added to App.js, answer No.
After the setup is complete, set EXPO_PUBLIC_ERROR_REPORTING=true
By default, error reporting is set to false and errors are simply logged to the console.

## Goals

This project wants to make it easier to get started with a React Native project to experiment with app ideas or build a prototype fast.

## Credits

This project is indebted to:

- the great [starter template](https://github.com/FlemingVincent/expo-supabase-starter) by Vincent Fleming (@veesentayy)
- the [starter template](https://github.com/mrzachnugent/react-native-reusables) for React Reusables by Zach Nugent (@mrzachnugent)
