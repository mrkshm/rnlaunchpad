# SupaStarter Native

## ⚠️ Work in progress ⚠️

An extended starter template for React Native with Supabase. Includes auth flow, user profile (with editing and image upload), internationalization, error logging and more.

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

## Get Going

### Supabase

1. Set up a new Supabase project.
2. In the project, create a new storage bucket.
3. Create a policy for your new storage bucket: choose "Get Started Quickly" and then "Give users access to only their own top level folder named as uid", allow everything (DELETE, UPDATE, INSERT, SELECT)
4. Change the email templates for sign-up, password-reset and confirmation to something like: `<p>Here is your token<p><p>{{ .Token }}</p>`
5. Rename example.env to .env and fill in the values for Supabase Anon Key, Supabase Url and the name of the bucket you just created.
6. If you have not yet installed Supabase CLI, do so now.
7. Link your local project with the Supabase project.
8. Push the migrations. (supabase db push)

### Notes about Authentication

I decided on using OTP Codes for everything, to make it easier to get started. Setting up deep linking can be a bit difficult. When a registered user is trying to sign up again, he is logged in automatically. I cheat a little for password reset: Supabase Starter simply does a passwordless sign in for the email address provided, and on successful entering the confirmation code, forwards to the password change screen. If you want to modify any of these behaviours, you can easily do so in /context/auth-provider.tsx

### Internationalization

Everything is already set up for Internationalization with Lingui. Check the Lingui docs on how to use it.

The very basics:

- Use `npm run extract` to rebuild the po translation files (it will automatically find all the translation strings in your code) so you or your translators can translate.
- Once you have translated the po files, use `npm run compile` to compile them to json files that will be used by Lingui to display the translations.

If you do not need internationalization, you can delete the language switcher and pretty much ignore it. (If you are really sure that you will never need it you may want to uninstall Lingui as well as the @formatjs tools from the project and replace all {t`some string`} with some string)

### Analytics (optional)

To enable analytics with Mixpanel, create a project in Mixpanel and replace the fake Mixpanel token in the .env file with your real one. Then set EXPO_PUBLIC_ENABLE_ANALYTICS=true
By default, analytics is set to false and tracked events are simply logged to the console.

### Error Reporting (optional)

To enable error reporting with Bugsnag, run:
`npx bugsnag-expo-cli init`
When it asks you if you want code added to App.js, answer No.
After the setup is complete, set EXPO_PUBLIC_ERROR_REPORTING=true
By default, error reporting is set to false and errors are simply logged to the console.

## Docs and Presentation

Find better and more detailed documentation on the NativeSupaStarterKit website.

## Credits

This project is indebted to:

- the great [starter template](https://github.com/FlemingVincent/expo-supabase-starter) by Vincent Fleming (@veesentayy)
- the [starter template](https://github.com/mrzachnugent/react-native-reusables) for React Reusables by Zach Nugent (@mrzachnugent)
