---
title:  Describing URL Routes in Frontend Apps
publish_date: 2023-06-25
---

> This guide describes a better way to handle URL routes in frontend
> applications. It suggests using a JavaScript/TypeScript definition to describe
> the URL, making it look complex if it simplifies the user's life, and avoiding
> lifetime hooks. The guide provides examples of defining routes with dynamic
> parameters, multiple dynamic parameters, optional dynamic parameters,
> mid-route dynamic parameters, global dynamic parameters, and hooks inside.

## Introduction

Tracking all the routes you have in your frontend application can be difficult.
The first time developers need to link between pages usually results in URLs
that are defined inline, just passed as an `href` to the link component. This
results in a lot of problems later on when someone needs to update the route
path, or when someone accidentally mistypes the link URL. With time developers
start to realise that there’s a better way to deal with accessing URLs in their
applications.

In this guide I’m aiming document my experience with defining web app routes.
There are a couple of fundamental principles that you should keep in mind when
defining routes:

- JavaScript/TypeScript definition should describe what URL you will get.
- Don’t be afraid to make it look complex if it simplifies life of it’s user.
- Try to go as static as possible. Depending on lifetime hooks is usually a bad
  idea.

## Basic example

Lets start with the most simple example you will need. If your application does
not have any dynamic routes, this might be all you will need.

```jsx
const ROUTES = {
  index: "/",
  books: "/books"
  users: {
    index: "/users",
    me: "/users/me",
  },
  externalLink: "https://quassum.com/"
}

ROUTES.books       // -> /books
ROUTES.users.index // -> /users
ROUTES.users.me    // -> /users/me
```

Every route level get’s their own object here. The root level routes stay in the
root level object. As soon as there are nested routes we add another object. In
this case you can see that since `/users` have a nested route `/users/me`
everything that starts with `/users` goes into its’ own object. For the `/users`
route itself we add `index` key that corresponds with the way browsers deal with
the `index.html` file.

## With dynamic parameters

The next step in the route definition journey are the dynamic routes. As soon as
you will have data coming from a database you will most likely need dynamic
routes. This is solved with a simple function. With TypeScript it’s also
type-safe!

```jsx
const ROUTES = {
  users: {
    index: "/users",
    byId: (id: string) => `/users/${id}`,
  }
}

ROUTES.users.byId('1234') // -> /users/1234
```

Dynamic routes become easy to handle with this setup. Every time you want to
access a user by their ID you have to use `byId` function, which reminds you
that you need to pass an `id` which has to be of type `string`.

You can also use objects instead of regular parameters…

```tsx
const ROUTES = {
  users: {
    index: "/users",
    byId: ({ id }: { id: string }) => `/users/${id}`,
  },
};

ROUTES.users.byId({ id: "1234" }); // -> /users/1234
```

## With multiple dynamic parameters

Naturally, it becomes slightly more complex when you have multiple dynamic
segments. But nothings that we cannot manage.

```tsx
const ROUTES = {
  users: {
    index: "/users",
    byId: (id: string) => {
      return {
        bySlug: (slug: string) => `/users/${id}/${slug}`,
      };
    },
  },
};

ROUTES.users.byId("1234").bySlug("something"); // -> /users/1234/something
```

Here, instead of returning the URL from `byId` straight away, we return an
object with another function you can call. In this case you just chain these
function calls and you get a nicely formatted URL.

Don’t forget that in these dynamic segments you are not forced to pass simple
types through parameters. You could have a function that takes a whole object
and just returns one string, joining multiple properties from that object into
url. For example, you could have URL defined form user data:

```tsx
const ROUTES = {
  user: {
    publicUrl: {
      byUserData: (user: UserData) => `/u/${user.username}/${user.id}`,
    },
  },
};
```

The main thing to keep in mind here is the first principle that I’ve described
in the intro. Your structure should explain to it’s user how the URL will look
like. Try to avoid cases where you just have: `userById` but then return a url
that looks like this: `/user/info/something/[id]/something-else`

## With optional dynamic parameters

Having optional parameters is also quite simple. You can achieve this by either
having optional parameters or optional property in an object. The only thing you
have to keep in mind is how you manage the cases when that parameter is not
passed in.

```tsx
const joinIfPresent = (base: string, str?: string) =>
  str ? `${base}${str}` : base;

const ROUTES = {
  users: {
    index: "/users",
    byId: ({ id, slug }: { id: string; slug?: string }) =>
      `/users/${id}${joinIfPresent("/", slug)}`,
  },
};
```

## With mid-route dynamic parameters

This one is quite simple, but important to show. If you have a the dynamic
segment somewhere in the middle of the route. This is how you handle it.

```tsx
const ROUTES = {
  users: {
    index: "/users",
    byId: ({ id }: { id: string }) => {
      return {
        settings: `/users/${id}/settings`,
        account: `/users/${id}/account`,
      };
    },
  },
};
```

## With global dynamic parameters

Sometimes you need to have global parameter. In this case it’s locale of your
URL. If you provide locale, it will be available throughout the routes. The fact
that you have to pass it into the localisation strings manually might look like
not the best solution, but remember, we might have external links here, or some
links might not be localised. When doing it manually we ensure that it’s exactly
where it’s supposed to be, while enabling flexibility to modify the URL
structure.

```tsx
const getRoutes = (locale?: string = "en") => {
  const l = locale === "en" ? "" : `/${locale}`;

  return {
    users: {
      index: `${l}/users`,
      byId: (id: string) => `${l}/users/${id}`,
    },
  };
};
```

## With hooks inside

Now, `getRoutes` should be preferred when it comes to providing global
variables, but sometimes it makes sense to use hooks instead. When you can only
access certain data from a hook, it might be fine to convert your `getRoutes` to
`useRoutes` and put the hook you depend on inside.

The main thing to keep in mind here is that you have to make sure that your
hooks work reliably on the server side. If you don’t, you will encounter
hydration errors, so make sure that data matches between server and client side.

```tsx
const getRoutes = (locale?: string = "en") => {
  const l = locale === "en" ? "" : `/${locale}`;

  return {
    users: {
      index: `${l}/users`,
      byId: (id: string) => `${l}/users/${id}`,
    },
  };
};

const useRoutes = () => {
  const locale = useLocale();
  const l = locale == "en" ? "" : `/${locale}`;

  return getRoutes(l);
};

// In your component
const YourComponent = () => {
  const routes = useRoutes();

  // when locale is "de", then it links to: /de/users/1234
  return <a href={routes.users.byId("1234")} />;
};
```

## Summary

The examples in this guide offer most of the use cases you will need for a
centralised route definition. Feel free to use this guide as a look up
cheatsheet.
