---
title: "Does Reversing the Dependency Direction to data -> domain <- presentation in Google's Recommended Architecture Make It Clean Architecture?"
date: '2025-10-11'
excerpt: >-
  Does simply reversing the dependency direction make it Clean Architecture? No. The domain in Google's App Architecture only contains UseCases, but the domain in Clean Architecture encompasses a much broader scope. We analyze the key differences highlighted in the Now In Android Discussion.
mainCategories:
  - dev
  - recommended
subCategories:
  - sub_1759713206951
author: Luke
thumbnail: /images/drafts/1762604922922-Gemini_Generated_Image_fyajrofyajrofyaj.png
seoTitle: "Google App Architecture vs Clean Architecture - Is Reversing Dependencies Enough?"
seoDescription: "Does changing the dependency direction to data->domain<-presentation in Google's recommended architecture make it Clean Architecture? We analyze the real difference in what 'domain' means through the Now In Android Discussion."
seoKeywords:
  - Clean Architecture
  - Google App Architecture
  - Android architecture
  - domain layer
  - UseCase
  - Now In Android
  - dependency direction
  - Robert C Martin
  - Entity
  - business logic
  - Android design patterns
  - software architecture
  - dependency inversion
summary: "Simply reversing the dependency direction in Google's App Architecture does not make it Clean Architecture. Google's domain only contains UseCases, while Clean Architecture's domain includes Models, Relations, data source abstractions, and business logic. You need to rename core:domain to core:business-logic and combine it with core:model to form a true domain layer."
keyTakeaways:
  - "Google App Architecture's domain is a collection of UseCases, while Clean Architecture's domain includes Models, Relations, data source abstractions, and business logic"
  - "Google's domain can be optional precisely because it is actually just a collection of UseCases"
  - "To transition to Clean Architecture, rename core:domain to core:business-logic and combine it with core:model to form the true domain"
  - "After this discussion, Google's official documentation added a note warning not to confuse their domain layer with the domain concept in other architectures"
  - "If the team does not agree on the definition of 'domain', confusion will arise in model placement and module structure"
---
> Simply changing the dependency direction to data -> domain <- presentation does not turn Google's App Architecture into Clean Architecture.
>
> This is because the role of "domain" differs between the two architectures.
You need to rename core:domain in Google's App Architecture to core:business-logic, and then combine core:model and core:business-logic together to form the domain.

---

Most Android developers are probably aware of the differences between Google's App Architecture and Clean Architecture.
This topic has been discussed for years, and it frequently comes up in interviews. There are also countless blog posts on the subject.

However, most blog posts only cover the difference in dependency direction and the fact that the domain module in Google's App Architecture is optional.

But there is **one more important difference**.

Let's look at [motornyimaksym's comment](https://github.com/android/nowinandroid/discussions/1273#discussioncomment-8792788) from the [NIA Github Discussion](https://github.com/android/nowinandroid/discussions/1273) that most of us have seen at least once.

**The key points are as follows.**
> **Models aka simple pojo classes for domain entities. E.g. Car, Human, etc.**
> Models are simple POJO classes for domain entities. For example, Car, Human, etc.
>
> **Then relations. Human that drive the car is Driver.**
> Then define relations. A Human that drives a car is a Driver.
>
> **Than you define the abstractions for data sources for Cars, Humans.**
> Then define the abstractions for data sources for Cars and Humans.
>
> **E.g. buyCar(money: Money): Car; hireDriver(money: Money).**
> For example, buyCar(money: Money): Car, hireDriver(money: Money).
>
> **Then some logic getCars+getHumans=makeTheRace.**
> Then add some logic: getCars + getHumans = makeTheRace.
>
> **That's all about the domain.**
> That's all there is to the domain.

> (omitted ...)

>
> **The domain definition is not limited only to UseCases.**
The domain definition is not limited to UseCases alone.
>
> **The definition of the domain in documentation is wrong.**
The definition of domain in the documentation is wrong.
>
> **The domain can't be optional while usecase can be.**
The domain cannot be optional, while UseCases can be.
>
> **Rename the "domain" layer in docs to "business-logic" and you'll get traditional layered architecture:**
Rename the "domain" layer in the docs to "business-logic" and you get a traditional layered architecture.


<details>
<summary><strong>View Full Content (click to expand/collapse)</strong></summary>

> **So then lets follow Separation Of Concerns principle as stated in docs**
> Let's follow the Separation of Concerns principle as stated in the docs.
>
> **Define domain with definitions and relations:**
> Define the domain with definitions and relations.
>
> **Models aka simple pojo classes for domain entities. E.g. Car, Human, etc.**
> Models are simple POJO classes for domain entities. For example, Car, Human, etc.
>
> **Then relations. Human that drive the car is Driver.**
> Then define relations. A Human that drives a car is a Driver.
>
> **Than you define the abstractions for data sources for Cars, Humans.**
> Then define the abstractions for data sources for Cars and Humans.
>
> **E.g. buyCar(money: Money): Car; hireDriver(money: Money).**
> For example, buyCar(money: Money): Car, hireDriver(money: Money).
>
> **Then some logic getCars+getHumans=makeTheRace.**
> Then add some logic: getCars + getHumans = makeTheRace.
>
> **That's all about the domain.**
> That's all there is to the domain.
>
> **If you wan't you may split it in as many sublayers as you want.**
> You can split it into as many sublayers as you want.
>
> **E.g. in this repo core.model could be the bottom part, data-api somewhere between core.model and business-logic.**
> For example, in this repo, core.model could be the bottom layer, and data-api could sit somewhere between core.model and business-logic.
>
> **And the business-logic will include two previous.**
> And business-logic would include the two previous layers.
>
> ---
>
> **Now we can proceed with implementation:**
> Now we can proceed with the implementation.
>
> **We depends on everything that I described above.**
> We depend on everything described above.
>
> **We may have different features that use any described particle model/data-api/domain-logic.**
> We may have different features that use any of the described model/data-api/domain-logic components.
>
> **And indeed everything above the model level is optional in terms of some particular feature needs.**
> Indeed, everything above the model level is optional depending on a particular feature's needs.
>
> **Let's say I develop advertisement feature.**
> Let's say I'm developing an advertisement feature.
>
> **I don't care about data sources or logic, I only need models.**
> I don't care about data sources or logic -- I only need models.
>
> **My feature will use models to create slogan: "Best Cars for Humans".**
> My feature will use models to create the slogan: "Best Cars for Humans."
>
> **That's it.**
> That's it.
>
> **No necessity to depends on data-api/business-logic.**
> No need to depend on data-api or business-logic.
>
> **Or I may wan't to create some specific feature with some specific logic that depends only on data source, e.g. getHumans+getCars=makeTheExhibition.**
> Or I may want to create a specific feature with specific logic that depends only on the data source, e.g. getHumans + getCars = makeTheExhibition.
>
> **Then it obviously will depends on model/data-api without business-logic.**
> Then it would obviously depend on model/data-api without business-logic.
>
> **Or just some simple UI mostly module that will consume the business-logic including model/data-api.**
> Or it could be a simple UI-focused module that consumes business-logic including model/data-api.
>
> ---
>
> **Then it will increase the complexity of the project sctructure but bring more separation of concerns.**
> This will increase the complexity of the project structure but bring more separation of concerns.
>
> **In case if we want to go back to simplify the project we may combine model+data-api+business-logic into one big domain layer and everything would be fine except the scalability problem.**
> If we want to simplify the project, we can combine model + data-api + business-logic into one big domain layer. Everything would be fine except for the scalability problem.
>
> **That's always a trade off.**
> That's always a trade-off.
>
> ---
>
> **And all of that starting from basic models and up to the place where we start talking about UI that's the domain.**
> All of that -- from basic models up to the point where we start talking about the UI -- that's the domain.
>
> **The domain definition is not limited only to UseCases.**
> The domain definition is not limited to UseCases alone.
>
> **That is what I'm trying to explain from the very beginning.**
> That's what I've been trying to explain from the very beginning.
>
> **The definition of the domain in documentation is wrong.**
> The definition of domain in the documentation is wrong.
>
> **The domain can't be optional while usecase can be.**
> The domain cannot be optional, while UseCases can be.
>
> ---
>
> **Rename the "domain" layer in docs to "business-logic" and you'll get traditional layered architecture:**
> Rename the "domain" layer in the docs to "business-logic" and you get a traditional layered architecture.
>
> **Where the business logic depends on the exact data source.**
> Where the business logic depends on the exact data source.
>
> **It's when you need to rewrite UseCase as soon as you would need to migrate your app from home ftp server to Amazon AWS.**
> It's the situation where you need to rewrite your UseCase when migrating from a home FTP server to Amazon AWS.
>
> **It's when migration from Retrofit to Ktor require domain layer changes.**
> It's when migrating from Retrofit to Ktor requires domain layer changes.
>
> **It's when the definition of Car depends on exact shop you buy it from.**
> It's when the definition of Car depends on exactly which shop you buy it from.
>
> ---
>
> **the official architecture is easier to grasp from a conceptual level, simply because the dependency arrows all go the same way**
> The official architecture is easier to grasp conceptually, simply because the dependency arrows all point in the same direction.
>
> **I have nothing against this approach.**
> I have nothing against this approach.
>
> **It still widely used.**
> It is still widely used.
>
> **But if google recommend something then it would be really kind from their side to let users know about disadvantages of such approach at least.**
> But if Google recommends something, it would be considerate of them to at least let users know about the disadvantages of that approach.
>
> ---
>
> **We obviously see that we may change the direction of the injection and get independent "domain" layer.**
> We can clearly see that we may change the direction of injection and get an independent "domain" layer.
>
> **Where the situation when the logic depends on exact implementation would be not possible.**
> In this case, the situation where logic depends on exact implementation would be impossible.
>
> ---
>
> **For experienced developer this repository is just another example of architecture.**
> For an experienced developer, this repository is just another example of architecture.
>
> **We may take what we wan't from here and forget about the rest.**
> We can take what we want from here and forget about the rest.
>
> ---
>
> **But for those who study, for those who has no strong opinion this repo is the single source of truth.**
> But for those who are studying, for those who don't have a strong opinion, this repo is the single source of truth.
>
> **They'll take this project as a barebone for their pet projects.**
> They'll use this project as the skeleton for their pet projects.
>
> **And will build interfaces and logic depends on the exact data sources.**
> And they'll build interfaces and logic that depend on exact data sources.
>
> **And then they will came to all of us on the interview with examples of how they thought Clean Architecture just because it has domain layer =).**
> And then they'll come to interviews with examples of what they thought was Clean Architecture just because it has a domain layer =).
>
> **It's not CA example and will not be after proposed changes.**
> It's not a Clean Architecture example, and it won't be even after the proposed changes.
>
> **Moreover as I said I don't like CA because it's complicated.**
> Moreover, as I said, I don't like Clean Architecture because it's complicated.
>
> **But this project is not much easier than CA for understanding.**
> But this project is not much easier to understand than Clean Architecture.
>
> **So we will not takle all the problems at once.**
> So we won't tackle all the problems at once.
>
> **But the dependency direction rule change is a low hanging fruit that without doubts worth to pick up.**
> But changing the dependency direction rule is a low-hanging fruit that is undoubtedly worth picking up.

</details>

What motornyimaksym describes as domain is the following:
- Models for domain entities (Car, Human)
- Relations between them (Car + Human = Driver)
- Data source abstractions (buyCar, hireDriver)
- Additional logic (getCars + getHumans = makeTheRace)

Let's verify whether motornyimaksym's claims hold true by examining [Robert C. Martin's blog post](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).

In Android, [the domain in Clean Architecture corresponds to the Entity and UseCase layers](https://meetup.nhncloud.com/posts/345), so I have extracted the relevant sections about Entity and UseCase from the blog post.

> **Entities**
>
>**Entities encapsulate Enterprise wide business rules.**
Entities encapsulate enterprise-wide business rules.
>
>**An entity can be an object with methods, or it can be a set of data >structures and functions.**
>An entity can be an object with methods, or it can be a set of data structures and functions.
>
>**It doesn't matter so long as the entities could be used by many different applications in the enterprise.**
>It doesn't matter as long as the entities can be used by many different applications in the enterprise.

>**If you don't have an enterprise, and are just writing a single application, then these entities are the business objects of the application.**
>If you don't have an enterprise and are just writing a single application, then these entities are the business objects of the application.

>**They encapsulate the most general and high-level rules.**
They encapsulate the most general and high-level rules.

>**They are the least likely to change when something external changes.**
They are the least likely to change when something external changes.

>**For example, you would not expect these objects to be affected by a change to page navigation, or security.**
For example, you would not expect these objects to be affected by a change in page navigation or security.

>**No operational change to any particular application should affect the entity layer.**
No operational change to any particular application should affect the entity layer.

---

>**Use Cases**

>**The software in this layer contains application specific business rules.**
The software in this layer contains application-specific business rules.

>**It encapsulates and implements all of the use cases of the system.**
It encapsulates and implements all of the use cases of the system.

>**These use cases orchestrate the flow of data to and from the entities,**
These use cases orchestrate the flow of data to and from the entities,

>**and direct those entities to use their enterprise wide business rules to achieve the goals of the use case.**
and direct those entities to use their enterprise-wide business rules to achieve the goals of the use case.

>**We do not expect changes in this layer to affect the entities.**
We do not expect changes in this layer to affect the entities.

>**We also do not expect this layer to be affected by changes to externalities such as the database, the UI, or any of the common frameworks.**
We also do not expect this layer to be affected by changes to externalities such as the database, the UI, or any of the common frameworks.

>**This layer is isolated from such concerns.**
This layer is isolated from such concerns.

>**We do, however, expect that changes to the operation of the application will affect the use-cases and therefore the software in this layer.**
We do, however, expect that changes to the operation of the application will affect the use cases and therefore the software in this layer.

>**If the details of a use-case change, then some code in this layer will certainly be affected.**
If the details of a use case change, then some code in this layer will certainly be affected.

When we look at Robert C. Martin's definitions of Entity and UseCase, we can confirm that they align with what motornyimaksym describes as domain.


The domain in Clean Architecture includes not only UseCases but also Models, Relations, and more. In contrast, the domain in Google's App Architecture is merely a collection of UseCases. In other words, the "domain" in Google's App Architecture is not the "domain" that Clean Architecture refers to -- it is simply a collection of UseCases. (This is precisely why the domain in Google's App Architecture can be optional.)


After this discussion, the [Google official documentation](https://developer.android.com/topic/architecture/domain-layer) was updated with relevant information.

![pasted-image-1760193672155.png](/images/posts/1760193672153-image.png)
![pasted-image-1760154664222.png](/images/posts/1760154664220-image.png)


The translation is as follows:
> The domain layer is responsible for encapsulating **complex business logic** or **simple business logic that is reused by multiple ViewModels**.
This layer is optional because not all apps have these requirements.
In other words, **use it only when you need to handle complexity or improve reusability**.

> Note: The term "domain layer" is used in other software architectures such as "Clean Architecture," but its meaning differs.
> Do not confuse the definition of "domain layer" in the Android official architecture guide with definitions you may have seen in other sources.
> There may be **subtle but important differences**.


---

This is why I don't believe that simply reversing the dependency direction turns Google's App Architecture into Clean Architecture. (Because the meaning of "domain" is entirely different.) If you rename core:domain to core:business-logic and define the domain as the combination of core:model and core:business-logic, then it could be considered Clean Architecture.

### So Why Should We Know This Difference?
For example, issues like these could arise:

1. Team member A only knows Google's App Architecture. Team member B only knows Clean Architecture. When adding a specific Model class, team member A creates a core:model module and places it there, while team member B adds it to the domain module.

2. A team member who only knows Clean Architecture might be confused when they see the core:domain module and find that it contains only UseCases.


