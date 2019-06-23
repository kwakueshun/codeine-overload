---
title: Url Routing in Swift
date: '2019-03-01'
description: ''
spoiler: Composing nice Swifty API endpoint urls.
---

A very common pattern in Swift projects when it comes to storing server `swift÷URL` strings is having a file named something like `Constants.swift` and declaring a couple of static `String` constants.

```swift
static let BASE_URL = "https://api.superdoperidesharingapp.com"
static let LOGIN_URL = "\(BASE_URL)/login.php"
static let SIGN_UP_URL = "\(BASE_URL)/register.php"
```

To be fair, I have used this more often than I like to admit.

While having all your end points at one place in this format seems super cool, it becomes a bit repetitive and error-prone as that list of paths increase.

### The Problem
Let's take a look at `BASE_URL`. This variable is being used in the string interpolation for all the paths. What exactly is wrong with this? you ask. We are basically repeating this variable for `n` times the number of paths and, thus, violating what is known as `The DRY Principle`.

So what exactly is this `DRY Principle`?
> Don't Repeat Yourself (DRY) is a principle of software development aimed at
> reducing repetition of software patterns, replacing it with abstractions or using
> data normalization to avoid redundancy.

Code duplication is not always bad but in cases like these it's usually a good idea to duplicate as little code as possible because with more duplication it's easier for us to introduce bugs when we're changing things.

This approach is error-prone because while adding more paths/routes to the list of constants, there is the tendency to say, remove a character, leading to unusual behavior that might be difficult to catch.

Let's take a look at a few ways to compose nice `swift÷URL` routes in a way to resolve the above problem.

### The Solution

In the spirit of `K.I.S.S`, an acronym for `"keep it simple, stupid"`, let's look at the simplest way that we can avoid repeating ourselves.

We have a function which takes a `path` string and returns the result of interpolating it with the `BASE_URL`.

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

What happens when your super cool 10x backend guy comes to you on Friday at 3pm and hands you a new base URL that is going to be used for sending emails and for some reason,it had to be on a totally different domain called _..wait for it..._

_https://emailapi.superdoperidesharingapp.com_

This new base URL also has a couple paths that you need to _consume_.

You might be thinking, uhh okay let's modify our URL helper function to include the `base URL` as a parameter. We then get something like this:
```swift{3}
func createPath(
    for pathString: String
    andBase base: String
) -> String {
    return "\(base)/\(pathString)"
}
```
At this point, we have the compiler screaming at us. Why? because the users of this function now need to add an extra argument to meet the function's signature.

Okay, what was that? default parameters? Sure.

```swift{3}
func createPath(
    for pathString: String
    andBase base: String = BASE_URL
) -> String {
    return "\(base)/\(pathString)"
}
```

So now what do we have here? ...
```swift
static let SEND_EMAIL_URL = createPath(
    for: "login.php", // oops
    andBase: EMAIL_BASE_URL
)
```

Do you see what is happening in the example above? We correctly created a `SEND_EMAIL_URL` path but then set it up with the wrong string, `"login.php"`.

Also, these are global variables and they make our application difficult to reason about because you have to take into account every function which makes use of them.

Granted, we can catch something like this with a unit test, but are we really going to write tests for each URL path in our app? That is highly unlikely. Let's look at a more Swifty way to deal with our `swift÷URL` using enums.

### The Swifty Way
We will create a protocol (or interface) named `APIRouter` where the types conforming to this protocol will have to declare their own static `baseURL` property for all instances of that type. This seems like a good way to make sure any new `baseURL` will be contained in a separate type without having to modify or extend previously declared types.

```swift
import Foundation

protocol APIRouter {
    static var baseURL: URL { get set }
}
```

### The Case For Enums
Now, we could make a `class` or a `struct` conform to our protocol above so why enums?
> Enums are a list of constants. When you need a predefined set of values and can only
> take one out of this set of values to use as the value for a variable, you should use
> an enum.

This seems perfect for our use case because we do have a finite set of paths and we will only ever need one at a time.
Unlike in languages like C and Objective-C where enums are merely representations of sets of integer values, Swift enums offer even more.

For instance, we can have our enum cases be representations of `String` values which is great because our paths are all strings. Also, we can add extra functionality to an instance because Swift enums can have methods.

So our backend engineer's list of endpoint paths might be of the form `foo.php`, `bar.php`, etc. We will use these as our enum cases but without the `.php` extension.

Our first attempt at conformance looks like this:

First, let's make the `baseURL` for main API our default by extending `APIRouter` so that it can be ommitted for that case.

```swift
extension APIRouter {
    static var baseURL: URL = URL(
        string: "https://api.superdoperidesharingapp.com"
    )!
}
```

Then for the main API route, we have:
```swift
enum MainAPIRoute: String, APIRouter {

    /// baseURL will use the default from the protocol extension

    case register, login
    case ridersAvailable = "riders_available"
}
```

And for the email API route, we have:
```swift
enum EmailAPIRoute: String, APIRouter {

    static var baseURL: URL = URL(
        string: "https://emailapi.superdoperidesharingapp.com"
    )!

    case welcomeEmail = "welcome_email"
    case verificationEmail, thankYouEmail
}


```

There is something interesting going on here. By declaring our enums to be of the type `String`, we are saying that our enum instances have a raw value type of `String`.

`String`, `Character`, `integer` and `floating-point` number types conform to a protocol named `RawRepresentable` which declares a property `rawValue` that contains the enum case's actual value of that type. For strings, the default value is the string representation of the case as is unless you explicitly assign a different string literal like in the examples above.

So, what can we do with this `rawValue`? you ask.

We can now extend our `APIRouter` protocol to construct our URLs for us. This can be achieved by extending this protocol on condition that our conforming type, denoted by the generic `Self`, also conforms to `RawRepresentable`.

Then, we now have the assurance that there is a `rawValue` property that we can use. Now, we can construct our URL with our file extension friend, `.php`, our `rawValue` and the `baseURL`, which will be different for each conforming type.

```swift
extension APIRouter where Self: RawRepresentable {

    var url: URL {
        let path: String = "/\(rawValue).php"
        return URL(string: path, relativeTo: Self.baseURL)!
    }
}
```

How do we know that this is going to get the job done?

Well.. because we are good people, we are going to write unit tests to confirm that our new `APIRouter` types are producing exactly what we expect.

```swift
func testSwiftyRoutes() {
    let weRoute = EmailAPIRoute.welcomeEmail.url
    let weExpected = "https://emailapi.superdoperidesharingapp.com/welcome_email.php"

    let loginRoute = MainAPIRoute.login.url
    let loginExpected = "https://api.superdoperidesharingapp.com/login.php"

    XCTAssertEqual(weRoute.absoluteString, weExpected)
    XCTAssertEqual(loginRoute.absoluteString, loginExpected)
}
```

As you can see, our tests are going to pass and now we have gotten rid of all code duplication and our `swift÷URL`s are looking a lot more Swifty.

### Conclusion
`Enums` with raw values are a great way to represent stringly APIs in a more expressive and safe manner. While it's not a complete replacement for declaring your global constants, it's a technique that's good to keep in mind when setting up any finite set of string values.

Another pattern that is a common alternative is to have a `struct` or `singleton` class to act as a namespace for a couple of static string constants.

If you have any questions, comments and feedback, please feel free to share them on twitter. You can find me [@samxeshun](https://twitter.com/samxeshun).

Thanks for reading!