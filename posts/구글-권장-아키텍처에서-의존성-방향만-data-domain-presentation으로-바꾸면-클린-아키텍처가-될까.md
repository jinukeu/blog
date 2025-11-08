---
title: 구글 권장 아키텍처에서 의존성 방향만 data -> domain <- presentation으로 바꾸면 클린 아키텍처가 될까?
date: '2025-10-11'
excerpt: >-
  의존성 방향만 바꾸면 클린 아키텍처가 될까? 아니다. 구글 앱 아키텍처의 domain은 UseCase만 포함하지만, 클린 아키텍처에서의
  domain은 더 넓은 범위를 포함한다. Now In Android Discussion에서 지적된 핵심 차이점을 분석한다.
mainCategories:
  - dev
  - recommended
subCategories:
  - sub_1759713206951
author: 이진욱
thumbnail: /images/drafts/1762604922922-Gemini_Generated_Image_fyajrofyajrofyaj.png
---
> 의존성 방향을 data -> domain <- presentation으로 바꾼다고 해서
구글 앱 아키텍처가 클린 아키텍처가 되지는 않는다.
>
> 두 아키텍처에서 말하는 domain의 역할이 다르기 때문이다.
구글 앱 아키텍처의 core:domain을 core:business-logic으로 바꾸고,
core:model과 core:business-logic을 함께 domain으로 묶어야 한다.

---

구글 앱 아키텍처와 클린 아키텍처의 차이는 대부분의 안드로이드 개발자라면 알고 있을 것이다.
몇년 전부터 계속 관련된 얘기가 나왔었고 또 면접 질문으로도 자주 나오기 때문이다. 관련 블로그 글도 엄청나게 많다.

하지만 대부분의 블로그에서 구글 앱 아키텍처와 클린 아키텍처의 차이점을 의존성 방향의 차이 그리고 구글 앱 아키텍처의 domain 모듈이 optional 하다는 것 정도만 소개하고 있다.

**블로그 글 1)**
![pasted-image-1760152598362.png](/images/posts/1760152598359-image.png)
![pasted-image-1760152675128.png](/images/posts/1760152675125-image.png)

**블로그 글 2)**
![pasted-image-1760152732651.png](/images/posts/1760152732648-image.png)

**블로그 글 3)**
![pasted-image-1760152790786.png](/images/posts/1760152790784-image.png)

하지만 이것 말고도 **중요한 차이점**이 하나 더 있다. 

모두가 한번씩은 봤을 법한 [NIA Github Discussion](https://github.com/android/nowinandroid/discussions/1273)에서 [motornyimaksym의 코멘트](https://github.com/android/nowinandroid/discussions/1273#discussioncomment-8792788)를 살펴보자.

**핵심 내용은 아래와 같다.**   
> **Models aka simple pojo classes for domain entities. E.g. Car, Human, etc.**
> 모델은 도메인 엔티티를 위한 단순한 POJO 클래스이다. 예를 들어 Car, Human 등이 있다.
>
> **Then relations. Human that drive the car is Driver.**
> 그다음 관계를 정의한다. 자동차를 운전하는 사람은 Driver이다.
>
> **Than you define the abstractions for data sources for Cars, Humans.**
> 그다음 Car와 Human에 대한 데이터 소스 추상화를 정의한다.
>
> **E.g. buyCar(money: Money): Car; hireDriver(money: Money).**
> 예를 들어 buyCar(money: Money): Car, hireDriver(money: Money) 같은 것이다.
>
> **Then some logic getCars+getHumans=makeTheRace.**
> 그다음 약간의 로직을 추가한다. getCars + getHumans = makeTheRace.
>
> **That's all about the domain.**
> 그게 도메인의 전부다.

> (중략 ...)

>
> **The domain definition is not limited only to UseCases.**   
도메인의 정의는 UseCase에만 한정되지 않는다.
>
> **The definition of the domain in documentation is wrong.**   
문서에 있는 도메인의 정의는 잘못되었다.
>
> **The domain can't be optional while usecase can be.**   
도메인은 선택적일 수 없지만, UseCase는 선택적일 수 있다.
>
> **Rename the "domain" layer in docs to "business-logic" and you'll get traditional layered architecture:**   
문서의 "domain" 레이어를 "business-logic"으로 이름 바꾸면 전통적인 계층형 아키텍처가 된다.


<details>
<summary><strong>전체 내용 보기 (클릭하여 펼치기/접기)</strong></summary>

> **So then lets follow Separation Of Concerns principle as stated in docs**
> 그렇다면 문서에 명시된 관심사 분리(Separation of Concerns) 원칙을 따르자.
>
> **Define domain with definitions and relations:**
> 정의와 관계를 포함하여 도메인을 정의하자.
>
> **Models aka simple pojo classes for domain entities. E.g. Car, Human, etc.**
> 모델은 도메인 엔티티를 위한 단순한 POJO 클래스이다. 예를 들어 Car, Human 등이 있다.
>
> **Then relations. Human that drive the car is Driver.**
> 그다음 관계를 정의한다. 자동차를 운전하는 사람은 Driver이다.
>
> **Than you define the abstractions for data sources for Cars, Humans.**
> 그다음 Car와 Human에 대한 데이터 소스 추상화를 정의한다.
>
> **E.g. buyCar(money: Money): Car; hireDriver(money: Money).**
> 예를 들어 buyCar(money: Money): Car, hireDriver(money: Money) 같은 것이다.
>
> **Then some logic getCars+getHumans=makeTheRace.**
> 그다음 약간의 로직을 추가한다. getCars + getHumans = makeTheRace.
>
> **That's all about the domain.**
> 그게 도메인의 전부다.
>
> **If you wan't you may split it in as many sublayers as you want.**
> 원한다면 원하는 만큼 여러 하위 계층으로 나눌 수 있다.
>
> **E.g. in this repo core.model could be the bottom part, data-api somewhere between core.model and business-logic.**
> 예를 들어 이 저장소에서는 core.model이 가장 아래 부분이고, data-api는 core.model과 business-logic 사이 어딘가에 있을 수 있다.
>
> **And the business-logic will include two previous.**
> 그리고 business-logic은 앞의 두 계층을 포함한다.
>
> ---
>
> **Now we can proceed with implementation:**
> 이제 구현으로 넘어갈 수 있다.
>
> **We depends on everything that I described above.**
> 우리는 위에서 설명한 모든 것에 의존한다.
>
> **We may have different features that use any described particle model/data-api/domain-logic.**
> 우리는 설명된 model/data-api/domain-logic 중 일부만 사용하는 다양한 기능을 가질 수 있다.
>
> **And indeed everything above the model level is optional in terms of some particular feature needs.**
> 실제로 모델보다 위의 계층들은 특정 기능의 필요에 따라 선택적이다.
>
> **Let's say I develop advertisement feature.**
> 예를 들어 광고 기능을 개발한다고 하자.
>
> **I don't care about data sources or logic, I only need models.**
> 나는 데이터 소스나 로직에는 관심이 없고, 모델만 필요하다.
>
> **My feature will use models to create slogan: "Best Cars for Humans".**
> 내 기능은 모델을 사용해 "Best Cars for Humans"라는 슬로건을 만든다.
>
> **That's it.**
> 그게 전부다.
>
> **No necessity to depends on data-api/business-logic.**
> data-api나 business-logic에 의존할 필요가 없다.
>
> **Or I may wan't to create some specific feature with some specific logic that depends only on data source, e.g. getHumans+getCars=makeTheExhibition.**
> 혹은 data source에만 의존하는 특정 로직을 가진 기능을 만들 수도 있다. 예를 들어 getHumans + getCars = makeTheExhibition.
>
> **Then it obviously will depends on model/data-api without business-logic.**
> 그렇다면 그것은 business-logic 없이 model/data-api에만 의존하게 된다.
>
> **Or just some simple UI mostly module that will consume the business-logic including model/data-api.**
> 혹은 model/data-api를 포함한 business-logic을 소비하는 단순한 UI 중심 모듈일 수도 있다.
>
> ---
>
> **Then it will increase the complexity of the project sctructure but bring more separation of concerns.**
> 이런 방식은 프로젝트 구조의 복잡성을 높이지만, 관심사 분리를 더 명확하게 가져온다.
>
> **In case if we want to go back to simplify the project we may combine model+data-api+business-logic into one big domain layer and everything would be fine except the scalability problem.**
> 프로젝트를 단순하게 되돌리고 싶다면 model + data-api + business-logic을 하나의 큰 도메인 레이어로 합칠 수 있으며, 확장성 문제만 제외하면 문제는 없다.
>
> **That's always a trade off.**
> 그건 언제나 트레이드오프다.
>
> ---
>
> **And all of that starting from basic models and up to the place where we start talking about UI that's the domain.**
> 기본 모델부터 UI를 다루는 지점까지 — 이 모든 것이 도메인이다.
>
> **The domain definition is not limited only to UseCases.**
> 도메인의 정의는 UseCase에만 한정되지 않는다.
>
> **That is what I'm trying to explain from the very beginning.**
> 그게 내가 처음부터 설명하려던 것이다.
>
> **The definition of the domain in documentation is wrong.**
> 문서에 있는 도메인의 정의는 잘못되었다.
>
> **The domain can't be optional while usecase can be.**
> 도메인은 선택적일 수 없지만, UseCase는 선택적일 수 있다.
>
> ---
>
> **Rename the "domain" layer in docs to "business-logic" and you'll get traditional layered architecture:**
> 문서의 "domain" 레이어를 "business-logic"으로 이름 바꾸면 전통적인 계층형 아키텍처가 된다.
>
> **Where the business logic depends on the exact data source.**
> 여기서 business logic은 특정한 데이터 소스에 의존한다.
>
> **It's when you need to rewrite UseCase as soon as you would need to migrate your app from home ftp server to Amazon AWS.**
> 홈 FTP 서버에서 Amazon AWS로 마이그레이션할 때 UseCase를 다시 써야 하는 상황이다.
>
> **It's when migration from Retrofit to Ktor require domain layer changes.**
> Retrofit에서 Ktor로 옮길 때 도메인 레이어를 수정해야 하는 상황이다.
>
> **It's when the definition of Car depends on exact shop you buy it from.**
> Car의 정의가 어떤 상점에서 샀는지에 따라 달라지는 상황이다.
>
> ---
>
> **the official architecture is easier to grasp from a conceptual level, simply because the dependency arrows all go the same way**
> 공식 아키텍처는 개념적으로 이해하기 더 쉽다. 의존성 화살표가 모두 같은 방향으로 가기 때문이다.
>
> **I have nothing against this approach.**
> 나는 이 접근 방식에 반대하지 않는다.
>
> **It still widely used.**
> 이 방식은 여전히 널리 사용된다.
>
> **But if google recommend something then it would be really kind from their side to let users know about disadvantages of such approach at least.**
> 하지만 구글이 이런 방식을 추천한다면, 최소한 그 접근 방식의 단점도 사용자에게 알려주는 게 친절할 것이다.
>
> ---
>
> **We obviously see that we may change the direction of the injection and get independent "domain" layer.**
> 우리는 주입 방향을 바꾸면 독립적인 "도메인" 레이어를 얻을 수 있음을 분명히 볼 수 있다.
>
> **Where the situation when the logic depends on exact implementation would be not possible.**
> 이 경우 로직이 구체적인 구현에 의존하는 상황은 발생하지 않는다.
>
> ---
>
> **For experienced developer this repository is just another example of architecture.**
> 숙련된 개발자에게 이 저장소는 단지 또 하나의 아키텍처 예시일 뿐이다.
>
> **We may take what we wan't from here and forget about the rest.**
> 우리는 여기서 필요한 것만 취하고 나머지는 잊으면 된다.
>
> ---
>
> **But for those who study, for those who has no strong opinion this repo is the single source of truth.**
> 하지만 배우는 사람들, 즉 뚜렷한 견해가 없는 이들에게는 이 저장소가 유일한 진리다.
>
> **They'll take this project as a barebone for their pet projects.**
> 그들은 이 프로젝트를 개인 프로젝트의 뼈대로 삼을 것이다.
>
> **And will build interfaces and logic depends on the exact data sources.**
> 그리고 구체적인 데이터 소스에 의존하는 인터페이스와 로직을 만들 것이다.
>
> **And then they will came to all of us on the interview with examples of how they thought Clean Architecture just because it has domain layer =).**
> 그리고 면접에서 "도메인 레이어가 있으니까 클린 아키텍처입니다"라는 예시를 들고 올 것이다.
>
> **It's not CA example and will not be after proposed changes.**
> 이건 클린 아키텍처의 예시가 아니며, 제안된 변경 이후에도 그렇지 않을 것이다.
>
> **Moreover as I said I don't like CA because it's complicated.**
> 게다가 나는 클린 아키텍처를 좋아하지 않는다. 너무 복잡하기 때문이다.
>
> **But this project is not much easier than CA for understanding.**
> 하지만 이 프로젝트도 이해하기는 크게 더 쉽지 않다.
>
> **So we will not takle all the problems at once.**
> 그래서 우리는 모든 문제를 한 번에 해결하지는 않을 것이다.
>
> **But the dependency direction rule change is a low hanging fruit that without doubts worth to pick up.**
> 하지만 의존성 방향 규칙을 바꾸는 것은 분명히 시도할 가치가 있는 손쉬운 선택이다.

</details>

motornyimaksym이 말하는 domain은 다음과 같다.
- 도메인 엔티티를 위한 모델 (Car, Human)
- 둘의 관계 (Car + Human = Driver)
- 데이터 소스 추상화 (buyCar, hireDriver)
- 추가 로직 (getCars + getHumans = makeTheRace)

motornyimaksym의 말이 사실인지 [Robert C. Martin의 블로그 포스트](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)를 살펴보자.

안드로이드 - [클린 아키텍처에서의 domain은 Entity, UseCase 영역에 해당](https://meetup.nhncloud.com/posts/345)하므로, 블로그 포스트에서 Entity, UseCase에 대한 부분을 가져왔다.

> **Entities**
> 엔티티
>
>**Entities encapsulate Enterprise wide business rules.**
엔티티는 기업 전반의 비즈니스 규칙을 캡슐화한다.
>
>**An entity can be an object with methods, or it can be a set of data >structures and functions.**
>엔티티는 메서드를 가진 객체일 수도 있고, 데이터 구조와 함수들의 집합일 수도 있다.
>
>**It doesn’t matter so long as the entities could be used by many different applications in the enterprise.**
>이 엔티티들이 기업 내 여러 애플리케이션에서 사용될 수 있다면 형태는 중요하지 않다.

>**If you don’t have an enterprise, and are just writing a single application, then these entities are the business objects of the application.**
>만약 기업 규모의 시스템이 아니라 단일 애플리케이션을 작성하고 있다면, 이 엔티티들은 그 애플리케이션의 비즈니스 객체가 된다.

>**They encapsulate the most general and high-level rules.**
이들은 가장 일반적이고 고수준의 규칙을 캡슐화한다.

>**They are the least likely to change when something external changes.**
이들은 외부적인 변화가 있을 때 가장 변경될 가능성이 낮다.

>**For example, you would not expect these objects to be affected by a change to page navigation, or security.**
예를 들어, 페이지 네비게이션이나 보안 정책의 변경이 이 객체들에 영향을 줄 것이라고는 예상하지 않는다.

>**No operational change to any particular application should affect the entity layer.**
특정 애플리케이션의 운영상의 변화는 엔티티 레이어에 영향을 주어서는 안 된다.

---

>**Use Cases**
유즈케이스

>**The software in this layer contains application specific business rules.**
이 레이어의 소프트웨어는 애플리케이션에 특화된 비즈니스 규칙을 포함한다.

>**It encapsulates and implements all of the use cases of the system.**
이 레이어는 시스템의 모든 유즈케이스를 캡슐화하고 구현한다.

>**These use cases orchestrate the flow of data to and from the entities,**
이 유즈케이스들은 엔티티로의 데이터 흐름과 엔티티로부터의 데이터 흐름을 조율한다.

>**and direct those entities to use their enterprise wide business rules to achieve the goals of the use case.**
그리고 엔티티가 그들의 기업 전반의 비즈니스 규칙을 사용하여 유즈케이스의 목표를 달성하도록 지시한다.

>**We do not expect changes in this layer to affect the entities.**
이 레이어의 변경이 엔티티에 영향을 주지는 않을 것으로 예상한다.

>**We also do not expect this layer to be affected by changes to externalities such as the database, the UI, or any of the common frameworks.**
또한, 데이터베이스, UI, 공통 프레임워크 등과 같은 외부 요소의 변경이 이 레이어에 영향을 주어서는 안 된다.

>**This layer is isolated from such concerns.**
이 레이어는 그러한 외부적 관심사로부터 격리되어 있다.

>**We do, however, expect that changes to the operation of the application will affect the use-cases and therefore the software in this layer.**
그러나 애플리케이션의 동작 방식이 변경된다면, 그 변화는 유즈케이스와 이 레이어의 소프트웨어에 영향을 미칠 것이다.

>**If the details of a use-case change, then some code in this layer will certainly be affected.**
만약 유즈케이스의 세부사항이 변경된다면, 이 레이어의 일부 코드는 반드시 영향을 받게 된다.

Robert C Martin이 말하는 Entity, UseCase의 정의를 봤을 때, motornyimaksym이 말하는 domain과 일치하는 것을 확인할 수 있다.


클린 아키텍처에서의 domain은 UseCase 뿐만 아니라 Model, Relation 등도 포함한다는 것이다. 반면에 구글 앱 아키텍처에서의 domain은 UseCase의 모음일 뿐이다. 즉, 구글 앱 아키텍처에서의 domain은 클린 아키텍처에서 말하는 domain이 아니라 UseCase의 모음이다. (그래서 구글 앱 아키텍처의 domain이 optional할 수 있는 것이다.)


이 내용 이후에 [구글 공식 문서](https://developer.android.com/topic/architecture/domain-layer)에 관련 내용이 업데이트 되었다.

![pasted-image-1760193672155.png](/images/posts/1760193672153-image.png)
![pasted-image-1760154664222.png](/images/posts/1760154664220-image.png)


번역하면 다음과 같다.
> 도메인 레이어는 **복잡한 비즈니스 로직**이나, **여러 ViewModel에서 재사용되는 단순한 비즈니스 로직**을 캡슐화하는 역할을 담당한다.
이 레이어는 선택 사항(optional)인데, 모든 앱이 이러한 요구사항을 가지는 것은 아니기 때문이다.
즉, **복잡성을 다뤄야 하거나 재사용성을 높이고 싶을 때만** 사용하면 된다.

> 참고: “도메인 레이어(domain layer)”라는 용어는 “클린 아키텍처(Clean Architecture)” 같은 다른 소프트웨어 아키텍처에서도 사용되지만, 그 의미가 다르다.
> 안드로이드 공식 아키텍처 가이드에서 정의한 “도메인 레이어”의 의미를 다른 자료에서 본 정의와 혼동하지 말자.
> **미묘하지만 중요한 차이점**이 있을 수 있다.


---

그래서 나는 의존성 방향만 바꾼다고 구글 앱 아키텍처가 클린 아키텍처가 된다고 생각하지 않는다. (domain의 의미가 완전히 다르기 때문에) core:domain을 core:business-logic으로 바꾸고 domain이 core:model, core:business-logic이라고 한다면 클린 아키텍처라고 볼 수 있을 것 같다.

### 그래서 왜 이 차이점을 알아야할까?
예를 들면, 이런 문제가 있을 것 같다.

1. 팀원 A는 구글 앱 아키텍처만 알고 있다. 팀원 B는 클린 아키텍처만 알고 있다. 특정 Model Class를 추가할 때, 팀원 A는 core:model 모듈을 만들어서 추가하고 팀원 B는 domain 모듈에 추가하는 상황

2. 클린 아키텍처만 알고 있는 팀원이 core:domain 모듈을 봤을 때, UseCase만 존재하니 헷갈릴 수 있다.


