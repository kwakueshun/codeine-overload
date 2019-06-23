---
title: Tiny Persistence Library
date: '2019-04-08'
description: ''
spoiler: A simple way to store data locally in an iOS app.
---

Persisting data is a very important aspect of many mobile applications. Whether you want to ensure that some specific settings data is there the next time a user launches your app after quitting or that you want to have an offline-first application where you can show the user some web service data from the last time they had internet connection, there are many ways to achieve this.

Let's look at how to approach this for a typical iOS application.

### Options
There are many ways to store different types of data for use in an iOS app. The following are some popular options that come to mind:
***

<dl>
<dt>UserDefaults</dt>
<dd>Apple's docs defines this as:</dd>
<blockquote>An interface to the user's defaults database, where you store key-value pairs persistently across launches of your app.
</blockquote>
<dd>As the name vaguely suggests, this should primarily be used for storing user preferences and app settings only and it is not advisable for storing sensitive data. If you want to save something such as a user's authentication token then you might want to look at <b><i>Keychain</i></b> instead. <br>Preferences such as flags for whether a user is logged in or whether a user has toggled a setting to say, use <i>Touch ID</i>, are a good way to use this.
There is a significant performance hit when you try storing and loading large amounts of data because the whole property list file containing this key-value store is loaded into memory anytime the app launches.</dd>

<dt>Keychain</dt>
<dd>The Keychain services API provides your app with a mechanism to securely store small bits of data in an encrypted database called a keychain on behalf of the user.
<br>
Unlike the <b><i>UserDefaults</i></b> where you can use an external app to retrieve the data from the property list file, this data is encrypted and a good way to store user secrets such as credit card information as well as API Keys and authentication tokens.
</dd>


<dt>Core Data</dt>
<dd>Core Data is a full-fledged object graph and persistent framework which supports large data transactions. It basically acts as a wrapper or ORM on top of an existing data source such as an SQLite file, XML file or a binary file. It has powerful capabilities such as filtering and sorting but tends to be an overkill for most projects. Also, migrating to new versions can be a pain and an unnecessary complexity that most projects should not have to worry about.</dd>
</dl>

<dt>Realm Database</dt>
<dd>This is similar to Core Data as it also acts as an object graph framework but with less configuration to do and without the complexities of setting up a Core Data store. It has encryption features and data can be easily shared with Android apps using their version of the framework.
<br>
This is a third party solution and resolving this dependency with every major OS or API changes can add some overhead. Also, migrating to new versions can be as painful as with Core Data.
</dd>
</dl>

***

Before going the full monty with any of the above, let's look at another way we can approach this by writing and reading serialised `Codable` models to a json file on disk.

### The Problem
Many iOS apps these days use classes or structs conforming to the `Codable` protocol to model their data. A typical setup is when you have a response from a web service in the form of a `Data` object and you decode it into an object using the `JSONDecoder` API.

```swift
let decoded = try? JSONDecoder().decode(T.self, from: responseData)
```

Then the inverse of that is to encode a struct or class to a `Data` object using the `JSONEncoder` API.

```swift
///
let encoded = try? JSONEncoder().encode(foo)
```
<br/>

How are we going to use this information to create a persistent layer for our apps?

### The Solution
We are going to create a protocol named `Persistible` where the types conforming to it will be required to provide a `filename` string.

```swift
import Foundation

protocol Persistible {
    static var fileName: String { get }
}
```
<br/>

What do we want to do with this `filename`. You ask.

We are going to use this filename to create a `URL` path named `archiveUrl` in our app's document directory pointing to a file with this name and a `.json` file extension. While we are at it, let's throw in another utility method to help us delete the file at this `archiveUrl` for when we want to have a clean slate.

We will extend `Persistible` protocol to add these:
```swift
extension Persistible {

    static var archiveUrl: URL {
        let documentDirectory = FileManager.default.urls(
            for: .documentDirectory,
            in: .userDomainMask
        ).first!

        return documentDirectory.appendingPathComponent(
            fileName
        ).appendingPathExtension("json")
    }

    static func deleteFile() {
        _ = try? FileManager.default.removeItem(at: archiveUrl)
    }
}
```

<br/>

This looks good so far but we can make the life of our conforming type even easier by providing a default `filename` that is basically a string representation of this type. We can achieve this by using the initializer `String.init(describing:)`.

```swift
extension Persistible {

    /** `self` refers to Self.self because we are in a static property
     so we want a string representation of the type and not an instance
     */
    static var fileName: String {
        return String(describing: self)
    }
}
```


So for a conforming struct `Foo`, printing `Foo.filename` should return `"Foo"`.

Now, we want to extend `Persistible` for the case of `Codable` types to have default shared `JSONEncoder` and `JSONDecoder` objects.

```swift
extension Persistible where Self: Codable {

    static func getEncoder() -> JSONEncoder {
        let encoder = JSONEncoder()
        encoder.outputFormatting = .prettyPrinted
        return encoder
    }

    static func getDecoder() -> JSONDecoder {
        return JSONDecoder()
    }
}
```
<br/>

This is all great but can we skip to the part where we save and load our data? Sure.

### Loading and Saving the data
Let's extend `Persistible` again constrained to `Codable` conformance and add a method for saving an object to file.
```swift
extension Persistible where Self: Codable {

   func saveToFile() {
       /// implementation to come ..
   }
}
```
<br />

Let's say our `json` file does not yet exist and we are about to persist our very first object. Our simple implementation looks like this:

```swift{4-11}
extension Persistible where Self: Codable {

   func saveToFile() {
       do {
           let encoder = Self.getEncoder()
           let encoded = try encoder.encode(self)
           try encoded.write(to: Self.archiveUrl, options: [])
       }
       catch let error {
           print(error.localizedDescription)
       }
   }
}
```
<br />

Now, we can have another method to load the contents of our file that was saved. The return value is a single instance of our conforming type.
```swift
extension Persistible where Self: Codable {

    static func loadFromFile() throws -> Self {
        let decoder = Self.getDecoder()
        let retrieved = try Data(contentsOf: Self.archiveUrl)
        let decoded = try decoder.decode(self, from: retrieved)
        return decoded
    }
}
```
<br />

This is all working fine now but what do we think is going to happen the next time we call `saveToFile` on another object?

What is going to happen is that our file's content is going to be replaced by this new encoded object and we are basically going to lose the previous entry. This is behaviour that we clearly do not want here so we need to find a way to resolve this.

What we can do is, before saving an entry, we can check if there is already data in there which would be true if we have previously saved an entry. We can then check if the new entry coming in is equal to the old one we just fetched, then we can proceed.

So, what do we do in the case that this incoming data is not the same as the old data? We can create an array with the old data as the first index and append the new one to the end, then save to file.

Our save method should now look like this

```swift{5-7}
extension Persistible where Self: Codable {

   func saveToFile() {
       do {
           let existent = try Self.loadFromFile()
           if existent != self {
               let list = [existent, self]
               /// save this array to file
           }
       }
       catch let error {
           print(error.localizedDescription)
       }
   }
}
```

<br/>

But our compiler is not happy with us at all. It is screaming at us with a message:

`Binary operator '!=' cannot be applied to two 'Self' operands`.

What exactly is this error trying to tell us?

Well, in our snippet above, you can see that we are comparing the old and new object with the operator `"!="`. That is clearly not sufficient information for the compiler to compare these two. What exact properties of our objects are we comparing against?

Now a way to resolve this error is to make our type conform to the `Equatable` protocol like this:
```swift{1}
extension Persistible where Self: Codable & Equatable {

   func saveToFile() {
   ///
}
```

Now, our error has disappeared and why is that?

The Standard Library describes this protocol as:
> A type that can be compared for value equality.

And for the implementation of the `"=="` function,
> Returns a Boolean value indicating whether two values are equal.
> Equality is the inverse of inequality. For any values `a` and `b`,
> `a == b` implies that `a != b` is `false`.

Many types in the standard library already conform to this protocol. If we want to compare two instances of our custom types, we have to conform to this protocol and implement the necessary function, `"=="`, which takes two instances and returns a `boolean` to indicate if they are equal. Structs and enums will get this implementation for free but classes do not.

Now that the error is behind us, let's figure out how to save our array containing our new and old object.

We will create a new method `saveToFile` on an instance of an array by extending the array with its generic `Element` conforming to the necessary protocols.

So an implementation of this would be:

```swift
extension Array where Element: Persistible & Codable & Equatable {

    func saveToFile() throws {
        guard count > 0 else { return }
        let encoded = try Element.getEncoder().encode(self)
        try encoded.write(to: Element.archiveUrl, options: [])
    }
}
```

We first make sure that we have a non-empty array before proceeding. Then because our `Element` is of the type `Persistible & Codable`, we can grab its `encoder` and save to its `archiveUrl`.

This is really great.. so now we can add our array's implementation of `saveToFile` to file to the `Persistible` extension to look like this:

```swift{9}
extension Persistible where Self: Codable & Equatable {

   func saveToFile() {
       do {
           let existent = try Self.loadFromFile()
           if existent != self {
             let list = [existent, self]
             /// save this array to file
             try list.saveToFile()
          }
       }
       catch let error {
           print(error.localizedDescription)
       }
   }
}
```

Awesome! So how do we plan on fetching our data now? Our old `loadFromFile()` would not work here because it returns a single instance. Granted, we could create a generic form of this method for both cases, single and array types, but for the sake of readability, we will create a `loadListFromFile` version for the array case.

This should like similar to the first one:
```swift
static func loadListFromFile() throws -> [Self] {
    let decoder = Self.getDecoder()
    let retrieved = try Data(contentsOf: Self.archiveUrl)
    let decoded = try decoder.decode([Self].self, from: retrieved)
    return decoded
}
```

I guess we can go home now or is there anything that we are missing or haven't thought of?   ... Actually, yes.

Our first `saveToFile` looks this at the moment:
```swift
let existent = try Self.loadFromFile()

if existent != self {
    let list = [existent, self]
    /// save this array to file
    try list.saveToFile()
}
```

<br/>

What do you see happening the next time we call `saveToFile` on an instance of `Persistible` after saving an array to a file?

This will be our offending line:
```swift{1}
let existent = try Self.loadFromFile()
```
We are going to have a runtime exception because the method above will not be able to decode our file which contains an array now. If we print the error in the catch block when that happens, we notice that it is a `DecodingError.typeMismatch(_, _)` error.

We can add a special `catch` block for this case so that whenever we get that error, we know there's an array there in our file so we append the new array and save to file. Then, our main `catch` block will be there for the case where we could not decode because there is nonexistent data as there is no file yet, i.e. when we are starting from a clean slate.

Our final `saveToFile` method should look like this:
```swift{12-18}
func saveToFile() throws {

    /// Tried appending to a single instance
    do {
        let existent = try Self.loadFromFile()
        if existent != self {
            let list = [existent, self]
            try list.saveToFile()
        }
    }
        /// Could not decode because found an array instead of a single object
    catch DecodingError.typeMismatch(_, _) {

        if var existent = try? Self.loadListFromFile(), !existent.contains(self) {
            existent.append(self)
            try existent.saveToFile()
        }
    }
        /// Could not decode because data is in wrong format as there is no file yet
    catch {
        let encoder = Self.getEncoder()
        let encoded = try encoder.encode(self)
        try encoded.write(to: Self.archiveUrl, options: [])
    }
}
```

<br />

But now that we are appending contents of arrays, we have a potential issue of duplicating entries. We are going to be defensive and find a way of preventing this by making sure that new entries are always unique. We can achieve this by using a `Set` initializer on our appended array and converting back to an array.

```swift
extension Array where Element: Persistible & Codable & Equatable {

    func saveToFile() throws {
        guard count > 0 else { return }
        var copy = self

        if let existentArray = try? Element.loadListFromFile(), existentArray.count > 0 {
            copy.append(contentsOf: existentArray)
            let unique = Set<Element>(copy)
            copy = Array(unique)
        }
        let encoded = try Element.getEncoder().encode(copy)
        try encoded.write(to: Element.archiveUrl, options: [])
    }
}
```

Even though we had good intentions, this has a time complexity of `O(n)` for iterating over the array regardless of the fact that adding each element to the hash set is `O(1)`. This is really important to consider before fully committing to this approach.

Wait a minute, our compiler is screaming at us again? Yep, and this time the message is:

`Type 'Element' does not conform to protocol 'Hashable'`

For an object to qualify to be hashed its type has to conform to the `Hashable` protocol. Without this, we cannot use a type as a key for a dictionary or as a member of a `Set` because the hash value indicates its uniqueness and we need that to create a set. We have to fix this at two places.

```swift{1}
extension Persistible where Self: Codable & Hashable {
    /// implementation
}
```
Then:

```swift{1}
extension Array where Element: Persistible & Codable & Hashable {
    /// implementation
}
```

By replacing `Equatable` with `Hashable`, we have satisfied allowing our elements to be hashed and allowing them to be compared using the `!=` because `Hashable` conforms to another protocol `Equatable` that we saw earlier.

We can now call `loadFromFile` and `loadListFromFile` to access our saved data but let's look at an alternative way of fetching this data. We will create an enum with associated values for cases, `single` and `array` and have a unified `load` method with a completion handler for this type.

```swift
enum PersistenceData<T: Persistible> {
    case single(T)
    case array([T])
}
```

<br/>

```swift
extension Persistible where Self: Codable & Hashable {

    static func load(completion: @escaping (PersistenceData<Self>) -> Void) throws {
        do {
            let data = try loadFromFile()
            completion(.single(data))
        }
        catch DecodingError.typeMismatch(_, _) {
            let data = try loadListFromFile()
            completion(.array(data))
        }
    }
}
```

<br/>

We can now use this method at our call site for a `Person` struct:

```swift

do {
    try Person.load { data in

        switch data {

        case .single(let val):
            print("\(val.name), \(val.age), \(val.school)")

        case .array(let values):
            print(
                values.map { "\($0.name), \($0.age), \($0.school)" }
            )
        }
    }
}
catch {
    print(error.localizedDescription)
}
```

### Conclusion
Using this tiny persistence library, we don't need to import a large framework such as Realm, or have a difficult setup and migration issues with something like Core Data. We simply store and retrieve our data from locally saved json files.

We would need to do some performance profiling to find out how effective this approach is as our data grows but for now this is a very simple persistence layer that we could use to manage our app's data.

The complete code can be found on [Github](https://github.com/kwakueshun/Persistible/blob/master/src/Persistible.swift).

If you have any questions, comments and feedback, please feel free to share them on twitter. You can find me [@samxeshun](https://twitter.com/samxeshun).

Thanks for reading!