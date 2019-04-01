---
title: Url Routing in Swift
date: '2019-03-01'
description: ''
spoiler: Composing nice Swifty API endpoint urls.
---

A very common pattern in Swift projects when it comes to storing server end point `URL` strings is having a file named something like `Constants.swift` and like you already imagined, declaring a couple of constants.

```swift
static let BASE_URL = "https://api.superdoperidesharingapp.com"
static let LOGIN_URL = "\(BASE_URL)/login.php"
static let SIGN_UP_URL = "\(BASE_URL)/register.php"
```

To be fair, I have used this more often than I like to admit.

While having all your end points at one place in this format seems super cool (read: so not cool), it becomes a bit repetitive and error-prone as that list of paths increase.

### The Problem
Firstly, take a look at `BASE_URL`. This variable is being used in the string interpolation for all the paths. What exactly is wrong with this, you ask? We are basically repeating this variable for _n_ times the number of paths and, thus, violating what is known as the _DRY Principle_.

So what exactly is this _DRY Principle_?
> Don't Repeat Yourself (DRY) is a principle of software development aimed at
> reducing repetition of software patterns, replacing it with abstractions or using
> data normalization to avoid redundancy.

Secondly, this approach is error-prone because while adding more paths/routes to the list of constants, there is the tendency to remove a character, leading to unusual behavior that might be difficult to catch.

Let's take a look at a few ways to compose nice URL routes in a way to resolve the above.

### The Solution

**KISS**

KISS, an acronym for "keep it simple, stupid", is a design principle noted by
the U.S. Navy and a popular principle amongst software developers.

It states that:
> Most systems work best if they are kept simple rather than made complicated; therefore,
> simplicity should be a key goal in design, and unnecessary complexity should be avoided

In the spirit of _K.I.S.S_, let's look at the most simple way that we can avoid repeating ourselves.

We have a function which takes a _path_ string and returns the result of interpolating it with the _base URL_.

```swift
func createPath(for pathString: String) -> String {
    return "\(BASE_URL)/\(pathString)"
}
```

Then we can have paths like:
```swift
static let LOGIN_URL = createPath(for: "login.php")
```

That is our solution right there. We can all go home now.

Yeah, not so fast.

What happens when your super cool 10x backend guy comes to you on Friday at 3pm and hands you a new base URL that is going to be used for sending emails and for some reason,it had to be on a totally different domain called _..wait for it..._ "emailapi.supercoolridersharing.com". This new base URL also has a couple paths that you need to _consume_.

You might be thinking, errm okay let's modify our URL helper function to including the base URL as a parameter. We then get something like this:
```swift
func createPath(
    for pathString: String
    andBase base: String
) -> String {
    return "\(base)/\(pathString)"
}
```
At this point, we have the compiler screaming at us. Okay, what was that? default parameters? Sure.

```swift
andBase base: String = BASE_URL
```

So ...
```swift
static let SEND_EMAIL_URL = createPath(
    for: "login.php",
    andBase: EMAIL_BASE_URL
)
```
<!-- ![Chinese Salty Egg](./salty_egg.jpg) -->
