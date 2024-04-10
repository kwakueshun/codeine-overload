---
title: Stub Server
date: '2024-03-18'
description: ''
spoiler: A productivity hack for user-facing app engineers.
---

When developing a user-facing part of an application that relies on a web service, it can be frustrating for engineers to wait for the REST API to be ready before they can start working. However, with a stub server, client engineers can continue their work by serving JSON files as a temporary web service.

### The Problem
Scaling a robust client-server application is often more effective when the backend handles the bulk of the work, including system design and integrations. This approach allows the clients to focus solely on providing a seamless user experience, while the server becomes the single source of truth for all clients across various platforms, including desktop and mobile.

Backend delays can arise from various factors. It can be challenging to accurately assess the complexity of a feature based solely on its design. For example, a seemingly simple task like updating a user's profile in the database may involve just one network request after a button tap. However, more complex tasks, such as integrating a user's bank account data with a service like Plaid, can require interactions with multiple external services. Developing and testing these integrations can be time-consuming and complex, especially in large, interconnected systems.

Also, product managers frequently encounter pressure to rapidly introduce new features in each sprint. This leads to setting up a comprehensive roadmap of features for an entire quarter to ensure the team always has something to deliver. Consequently, client engineers often find themselves in a perpetual state of waiting on the backend team for web services, a situation made worse for smaller teams.

### Why Use a Stub Server?
In early development stages, stub servers enable client engineers to begin work on the UI and application logic without needing the backend to be fully implemented, as long as there is agreement on the web service contract (i.e., expected request data and responses). This approach can accelerate development cycles and facilitate faster feedback loops.

For testing and demonstration purposes, client engineers can use stub servers to simulate different scenarios and edge cases, ensuring that their application behaves as expected under various conditions. This is particularly important for setting up complex user flows that require specific states for a user's data, such as in a financial loan app where a user needs to have a bank account, a credit card, and a social security number set up, each managed by a different external service. By serving JSON data with these setups already in place for different endpoints, stub servers significantly reduce friction and enable rapid development and testing cycles.

Prototyping with stub servers allows for rapid exploration of new features or ideas without the need to modify the actual backend. This approach is valuable for testing different design options and gathering early feedback from stakeholders before committing to specific implementations.

### Setting Up a Stub Server
Setting up a stub server is relatively straightforward. There are several popular tools and libraries available that can help you create a stub server quickly, such as Express.js with Faker.js or Go. These tools enable you to define your API endpoints and your data in JSON format, which the stub server serves on localhost. Once you've pointed the URL on the clients to this local server, ensured hot reloading is enabled, you're all set to go. For more advanced functionality, you can use libraries like [ts-morph](https://ts-morph.com/) or [jen](https://github.com/dave/jennifer) for code generation of the paths where the json files live. 

A simple setup could look like this in Go:
```go
import (
    "fmt"
    "log"
	"github.com/go-chi/chi/v5"
    "github.com/go-chi/render"
)

func main() {
	r := chi.NewRouter()
	r.Get("/users", func(w http.ResponseWriter, r *http.Request) {
		response, _ := readJSONFile("/path/to/users.json")
        render.JSON(w, r, response)
	})

	port := 3000
	log.Printf("✨ Starting server on port %d", port)
	err := http.ListenAndServe(fmt.Sprintf(":%d", port), r)
	log.Fatal(err)
}

func readJSONFile(filepath string) ([]byte, error) {
	jsonFile, err := os.ReadFile(filepath)
	if err != nil {
		return nil, err
	}

	var resp map[string]interface{}

	err = json.Unmarshal(jsonFile, &resp)
	if err != nil {
		return nil, err
	}

	render.JSON(w, r, resp)
}
```

### Conclusion
Using a stub server can be a valuable productivity hack for client engineers. It allows them to get early feedback, test complex states in their applications more effectively, and prototype new features quickly while meeting and exceeding business goals.

If you have any questions, comments and feedback, please feel free to send them via my email or other social accounts linked below.
Thanks for reading!