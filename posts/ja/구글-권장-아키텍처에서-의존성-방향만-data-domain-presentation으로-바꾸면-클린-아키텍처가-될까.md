---
title: Google推奨アーキテクチャで依存性の方向をdata -> domain <- presentationに変えるだけでクリーンアーキテクチャになるのか？
date: '2025-10-11'
excerpt: >-
  依存性の方向を変えるだけでクリーンアーキテクチャになるのか？いいえ。Googleアプリアーキテクチャのdomainは
  UseCaseのみを含みますが、クリーンアーキテクチャにおけるdomainはより広い範囲を含みます。Now In Android
  Discussionで指摘された核心的な違いを分析します。
mainCategories:
  - dev
  - recommended
subCategories:
  - sub_1759713206951
author: Luke
thumbnail: /images/drafts/1762604922922-Gemini_Generated_Image_fyajrofyajrofyaj.png
seoTitle: "Googleアプリアーキテクチャ vs クリーンアーキテクチャ - 依存性の方向を変えるだけで良いのか？domainの本当の違い"
seoDescription: "Google推奨アーキテクチャで依存性の方向をdata→domain←presentationに変えればクリーンアーキテクチャになるのか？Now In Android Discussionの分析を通じて、2つのアーキテクチャにおけるdomainの意味の違いを解説します。"
seoKeywords:
  - クリーンアーキテクチャ
  - Clean Architecture
  - Googleアプリアーキテクチャ
  - Google App Architecture
  - Androidアーキテクチャ
  - domain layer
  - UseCase
  - Now In Android
  - 依存性の方向
  - Robert C Martin
  - Entity
  - business-logic
  - Android設計
summary: "Googleアプリアーキテクチャで依存性の方向を変えるだけではクリーンアーキテクチャにはならない。GoogleアーキテクチャのdomainはUseCaseのみを含むが、クリーンアーキテクチャのdomainはModel、Relation、データソース抽象化、ビジネスロジックまでを含むより広い概念である。core:domainをcore:business-logicに変更し、core:modelと共にまとめることで真のdomainとなる。"
keyTakeaways:
  - "GoogleアプリアーキテクチャのdomainはUseCaseの集まりであり、クリーンアーキテクチャのdomainはModel＋Relation＋データソース抽象化＋ビジネスロジックを含む"
  - "Googleアーキテクチャのdomainがoptionalになり得る理由は、実際にはUseCase集であるため"
  - "クリーンアーキテクチャに移行するにはcore:domainをcore:business-logicに変更し、core:modelと共にdomainとしてまとめる必要がある"
  - "Google公式ドキュメントもこの議論の後、「他のアーキテクチャのdomainと混同しないよう」注意書きを追加した"
  - "チームでdomainの定義を統一しないと、Modelの配置やモジュール構造で混乱が生じる可能性がある"
---
> 依存性の方向をdata -> domain <- presentationに変えたからといって、
Googleアプリアーキテクチャがクリーンアーキテクチャになるわけではありません。
>
> 2つのアーキテクチャが言うdomainの役割が異なるためです。
Googleアプリアーキテクチャのcore:domainをcore:business-logicに変更し、
core:modelとcore:business-logicを合わせてdomainとする必要があります。

---

Googleアプリアーキテクチャとクリーンアーキテクチャの違いは、ほとんどのAndroid開発者であれば知っているでしょう。
数年前からずっと関連する話題が出ており、面接でもよく聞かれる質問だからです。関連するブログ記事も非常に多いです。

しかし、ほとんどのブログではGoogleアプリアーキテクチャとクリーンアーキテクチャの違いを、依存性の方向の違いとGoogleアプリアーキテクチャのdomainモジュールがoptionalであるという程度しか紹介していません。

しかし、これ以外にも**重要な違い**がもう1つあります。

誰もが一度は見たことがあるであろう[NIA Github Discussion](https://github.com/android/nowinandroid/discussions/1273)で[motornyimaksymのコメント](https://github.com/android/nowinandroid/discussions/1273#discussioncomment-8792788)を見てみましょう。

**核心的な内容は以下の通りです。**
> **Models aka simple pojo classes for domain entities. E.g. Car, Human, etc.**
> モデルはドメインエンティティのためのシンプルなPOJOクラスです。例えばCar、Humanなど。
>
> **Then relations. Human that drive the car is Driver.**
> 次に関係を定義します。車を運転する人間はDriverです。
>
> **Than you define the abstractions for data sources for Cars, Humans.**
> 次にCarとHumanに対するデータソースの抽象化を定義します。
>
> **E.g. buyCar(money: Money): Car; hireDriver(money: Money).**
> 例えばbuyCar(money: Money): Car、hireDriver(money: Money)のようなものです。
>
> **Then some logic getCars+getHumans=makeTheRace.**
> 次にいくつかのロジックを追加します。getCars + getHumans = makeTheRace。
>
> **That's all about the domain.**
> それがdomainの全てです。

> （中略...）

>
> **The domain definition is not limited only to UseCases.**
domainの定義はUseCaseだけに限定されません。
>
> **The definition of the domain in documentation is wrong.**
ドキュメントにあるdomainの定義は間違っています。
>
> **The domain can't be optional while usecase can be.**
domainはoptionalにできませんが、UseCaseはoptionalにできます。
>
> **Rename the "domain" layer in docs to "business-logic" and you'll get traditional layered architecture:**
ドキュメントの「domain」レイヤーを「business-logic」に名前を変えれば、伝統的な階層型アーキテクチャになります。


<details>
<summary><strong>全文を見る（クリックで展開/折りたたみ）</strong></summary>

> **So then lets follow Separation Of Concerns principle as stated in docs**
> では、ドキュメントに記載された関心の分離（Separation of Concerns）原則に従いましょう。
>
> **Define domain with definitions and relations:**
> 定義と関係を含めてdomainを定義しましょう。
>
> **Models aka simple pojo classes for domain entities. E.g. Car, Human, etc.**
> モデルはドメインエンティティのためのシンプルなPOJOクラスです。例えばCar、Humanなど。
>
> **Then relations. Human that drive the car is Driver.**
> 次に関係を定義します。車を運転する人間はDriverです。
>
> **Than you define the abstractions for data sources for Cars, Humans.**
> 次にCarとHumanに対するデータソースの抽象化を定義します。
>
> **E.g. buyCar(money: Money): Car; hireDriver(money: Money).**
> 例えばbuyCar(money: Money): Car、hireDriver(money: Money)のようなものです。
>
> **Then some logic getCars+getHumans=makeTheRace.**
> 次にいくつかのロジックを追加します。getCars + getHumans = makeTheRace。
>
> **That's all about the domain.**
> それがdomainの全てです。
>
> **If you wan't you may split it in as many sublayers as you want.**
> 望むなら、好きなだけサブレイヤーに分割できます。
>
> **E.g. in this repo core.model could be the bottom part, data-api somewhere between core.model and business-logic.**
> 例えばこのリポジトリでは、core.modelが最下層にあり、data-apiはcore.modelとbusiness-logicの間のどこかに位置します。
>
> **And the business-logic will include two previous.**
> そしてbusiness-logicは前の2つの層を含みます。
>
> ---
>
> **Now we can proceed with implementation:**
> これで実装に進むことができます。
>
> **We depends on everything that I described above.**
> 私たちは上で説明した全てに依存します。
>
> **We may have different features that use any described particle model/data-api/domain-logic.**
> 説明されたmodel/data-api/domain-logicの一部のみを使用する様々な機能を持つことができます。
>
> **And indeed everything above the model level is optional in terms of some particular feature needs.**
> 実際、モデルレベルより上のものは、特定の機能の必要に応じてoptionalです。
>
> **Let's say I develop advertisement feature.**
> 例えば広告機能を開発するとしましょう。
>
> **I don't care about data sources or logic, I only need models.**
> データソースやロジックには関心がなく、モデルだけが必要です。
>
> **My feature will use models to create slogan: "Best Cars for Humans".**
> 私の機能はモデルを使って「Best Cars for Humans」というスローガンを作ります。
>
> **That's it.**
> それだけです。
>
> **No necessity to depends on data-api/business-logic.**
> data-apiやbusiness-logicに依存する必要はありません。
>
> **Or I may wan't to create some specific feature with some specific logic that depends only on data source, e.g. getHumans+getCars=makeTheExhibition.**
> あるいは、データソースにのみ依存する特定のロジックを持つ機能を作ることもできます。例えばgetHumans + getCars = makeTheExhibition。
>
> **Then it obviously will depends on model/data-api without business-logic.**
> その場合、business-logicなしでmodel/data-apiにのみ依存します。
>
> **Or just some simple UI mostly module that will consume the business-logic including model/data-api.**
> あるいは、model/data-apiを含むbusiness-logicを消費するシンプルなUI中心のモジュールでもあります。
>
> ---
>
> **Then it will increase the complexity of the project sctructure but bring more separation of concerns.**
> この方式はプロジェクト構造の複雑さを増しますが、関心の分離をより明確にします。
>
> **In case if we want to go back to simplify the project we may combine model+data-api+business-logic into one big domain layer and everything would be fine except the scalability problem.**
> プロジェクトを簡素化したい場合は、model + data-api + business-logicを1つの大きなdomainレイヤーに統合できます。スケーラビリティの問題を除けば問題ありません。
>
> **That's always a trade off.**
> それは常にトレードオフです。
>
> ---
>
> **And all of that starting from basic models and up to the place where we start talking about UI that's the domain.**
> 基本的なモデルからUIについて語り始めるところまで - これら全てがdomainです。
>
> **The domain definition is not limited only to UseCases.**
> domainの定義はUseCaseだけに限定されません。
>
> **That is what I'm trying to explain from the very beginning.**
> それが最初から説明しようとしていたことです。
>
> **The definition of the domain in documentation is wrong.**
> ドキュメントにあるdomainの定義は間違っています。
>
> **The domain can't be optional while usecase can be.**
> domainはoptionalにできませんが、UseCaseはoptionalにできます。
>
> ---
>
> **Rename the "domain" layer in docs to "business-logic" and you'll get traditional layered architecture:**
> ドキュメントの「domain」レイヤーを「business-logic」に名前を変えれば、伝統的な階層型アーキテクチャになります。
>
> **Where the business logic depends on the exact data source.**
> そこではbusiness logicが具体的なデータソースに依存します。
>
> **It's when you need to rewrite UseCase as soon as you would need to migrate your app from home ftp server to Amazon AWS.**
> 自宅のFTPサーバーからAmazon AWSに移行する際にUseCaseを書き直さなければならない状況です。
>
> **It's when migration from Retrofit to Ktor require domain layer changes.**
> RetrofitからKtorへの移行時にdomainレイヤーを修正しなければならない状況です。
>
> **It's when the definition of Car depends on exact shop you buy it from.**
> Carの定義がどの店で購入したかによって変わる状況です。
>
> ---
>
> **the official architecture is easier to grasp from a conceptual level, simply because the dependency arrows all go the same way**
> 公式アーキテクチャは概念的に理解しやすいです。依存性の矢印が全て同じ方向に向いているからです。
>
> **I have nothing against this approach.**
> 私はこのアプローチに反対しません。
>
> **It still widely used.**
> この方式は今でも広く使われています。
>
> **But if google recommend something then it would be really kind from their side to let users know about disadvantages of such approach at least.**
> しかし、Googleがこの方式を推奨するなら、少なくともそのアプローチの欠点もユーザーに知らせるのが親切でしょう。
>
> ---
>
> **We obviously see that we may change the direction of the injection and get independent "domain" layer.**
> 注入の方向を変えれば独立した「domain」レイヤーを得られることは明白です。
>
> **Where the situation when the logic depends on exact implementation would be not possible.**
> その場合、ロジックが具体的な実装に依存する状況は発生しません。
>
> ---
>
> **For experienced developer this repository is just another example of architecture.**
> 経験豊富な開発者にとって、このリポジトリは単なるアーキテクチャの一例に過ぎません。
>
> **We may take what we wan't from here and forget about the rest.**
> 必要なものだけ取り入れて、残りは忘れればいいのです。
>
> ---
>
> **But for those who study, for those who has no strong opinion this repo is the single source of truth.**
> しかし、学んでいる人たち、つまり確固たる意見を持たない人たちにとって、このリポジトリは唯一の真実です。
>
> **They'll take this project as a barebone for their pet projects.**
> 彼らはこのプロジェクトを個人プロジェクトの骨格として使うでしょう。
>
> **And will build interfaces and logic depends on the exact data sources.**
> そして具体的なデータソースに依存するインターフェースとロジックを構築するでしょう。
>
> **And then they will came to all of us on the interview with examples of how they thought Clean Architecture just because it has domain layer =).**
> そして面接で「domainレイヤーがあるからクリーンアーキテクチャです」という例を持って来るでしょう。
>
> **It's not CA example and will not be after proposed changes.**
> これはクリーンアーキテクチャの例ではなく、提案された変更後もそうではありません。
>
> **Moreover as I said I don't like CA because it's complicated.**
> さらに、私はクリーンアーキテクチャが好きではありません。複雑すぎるからです。
>
> **But this project is not much easier than CA for understanding.**
> しかし、このプロジェクトも理解するのはCAよりそれほど簡単ではありません。
>
> **So we will not takle all the problems at once.**
> したがって、全ての問題を一度に解決するわけではありません。
>
> **But the dependency direction rule change is a low hanging fruit that without doubts worth to pick up.**
> しかし、依存性の方向ルールを変更することは、間違いなく試す価値のある手軽な改善です。

</details>

motornyimaksymが言うdomainは以下の通りです。
- ドメインエンティティのためのモデル（Car、Human）
- 両者の関係（Car + Human = Driver）
- データソースの抽象化（buyCar、hireDriver）
- 追加ロジック（getCars + getHumans = makeTheRace）

motornyimaksymの主張が正しいか、[Robert C. Martinのブログ記事](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)を確認してみましょう。

Android - [クリーンアーキテクチャにおけるdomainはEntity、UseCaseの領域に該当](https://meetup.nhncloud.com/posts/345)するため、ブログ記事からEntity、UseCaseに関する部分を引用しました。

> **Entities**
> エンティティ
>
>**Entities encapsulate Enterprise wide business rules.**
エンティティは企業全体のビジネスルールをカプセル化します。
>
>**An entity can be an object with methods, or it can be a set of data >structures and functions.**
>エンティティはメソッドを持つオブジェクトであることもあれば、データ構造と関数の集合であることもあります。
>
>**It doesn't matter so long as the entities could be used by many different applications in the enterprise.**
>企業内の複数のアプリケーションで使用できるのであれば、その形態は重要ではありません。

>**If you don't have an enterprise, and are just writing a single application, then these entities are the business objects of the application.**
>企業規模のシステムではなく単一のアプリケーションを書いているなら、これらのエンティティはそのアプリケーションのビジネスオブジェクトとなります。

>**They encapsulate the most general and high-level rules.**
これらは最も一般的で高レベルなルールをカプセル化します。

>**They are the least likely to change when something external changes.**
外部の変化があるとき、最も変更される可能性が低いものです。

>**For example, you would not expect these objects to be affected by a change to page navigation, or security.**
例えば、ページナビゲーションやセキュリティの変更がこれらのオブジェクトに影響を与えるとは考えないでしょう。

>**No operational change to any particular application should affect the entity layer.**
特定のアプリケーションの運用上の変更がエンティティレイヤーに影響を与えてはなりません。

---

>**Use Cases**
ユースケース

>**The software in this layer contains application specific business rules.**
このレイヤーのソフトウェアは、アプリケーション固有のビジネスルールを含みます。

>**It encapsulates and implements all of the use cases of the system.**
このレイヤーはシステムの全てのユースケースをカプセル化し実装します。

>**These use cases orchestrate the flow of data to and from the entities,**
これらのユースケースはエンティティへのデータの流れとエンティティからのデータの流れを調整します。

>**and direct those entities to use their enterprise wide business rules to achieve the goals of the use case.**
そしてエンティティが企業全体のビジネスルールを使ってユースケースの目標を達成するよう指示します。

>**We do not expect changes in this layer to affect the entities.**
このレイヤーの変更がエンティティに影響を与えることは想定していません。

>**We also do not expect this layer to be affected by changes to externalities such as the database, the UI, or any of the common frameworks.**
また、データベース、UI、共通フレームワークなどの外部要素の変更がこのレイヤーに影響を与えることも想定していません。

>**This layer is isolated from such concerns.**
このレイヤーはそのような外部的な関心事から隔離されています。

>**We do, however, expect that changes to the operation of the application will affect the use-cases and therefore the software in this layer.**
ただし、アプリケーションの動作方式が変更されれば、その変化はユースケースとこのレイヤーのソフトウェアに影響を与えるでしょう。

>**If the details of a use-case change, then some code in this layer will certainly be affected.**
ユースケースの詳細が変更されれば、このレイヤーの一部のコードは必ず影響を受けます。

Robert C. Martinが定義するEntity、UseCaseを見ると、motornyimaksymが言うdomainと一致していることが確認できます。


クリーンアーキテクチャにおけるdomainは、UseCaseだけでなくModel、Relationなども含むということです。一方、GoogleアプリアーキテクチャにおけるdomainはUseCaseの集まりに過ぎません。つまり、Googleアプリアーキテクチャのdomainはクリーンアーキテクチャで言うdomainではなく、UseCaseの集まりです。（だからGoogleアプリアーキテクチャのdomainがoptionalになり得るのです。）


この内容の後、[Google公式ドキュメント](https://developer.android.com/topic/architecture/domain-layer)に関連内容が更新されました。

![pasted-image-1760193672155.png](/images/posts/1760193672153-image.png)
![pasted-image-1760154664222.png](/images/posts/1760154664220-image.png)


翻訳すると以下の通りです。
> ドメインレイヤーは、**複雑なビジネスロジック**や、**複数のViewModelで再利用されるシンプルなビジネスロジック**をカプセル化する役割を担います。
このレイヤーはoptionalです。全てのアプリがこのような要件を持つわけではないためです。
つまり、**複雑さに対処する必要があるか、再利用性を高めたい場合にのみ**使用すればよいのです。

> 注意：「ドメインレイヤー（domain layer）」という用語は、「クリーンアーキテクチャ（Clean Architecture）」などの他のソフトウェアアーキテクチャでも使われますが、その意味は異なります。
> Androidの公式アーキテクチャガイドで定義された「ドメインレイヤー」の意味を、他の資料で見た定義と混同しないようにしましょう。
> **微妙ですが重要な違い**がある可能性があります。


---

そのため、私は依存性の方向を変えるだけでGoogleアプリアーキテクチャがクリーンアーキテクチャになるとは考えていません。（domainの意味が全く異なるため）core:domainをcore:business-logicに変更し、domainがcore:modelとcore:business-logicであるとすれば、クリーンアーキテクチャと言えるでしょう。

### では、なぜこの違いを知る必要があるのか？
例えば、以下のような問題が起こり得ます。

1. チームメンバーAはGoogleアプリアーキテクチャのみを知っている。チームメンバーBはクリーンアーキテクチャのみを知っている。特定のModel Classを追加する際、チームメンバーAはcore:modelモジュールを作成して追加し、チームメンバーBはdomainモジュールに追加するという状況。

2. クリーンアーキテクチャのみを知っているチームメンバーがcore:domainモジュールを見たとき、UseCaseしか存在しないので混乱する可能性がある。


