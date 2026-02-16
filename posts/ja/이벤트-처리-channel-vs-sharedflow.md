---
title: イベント処理 Channel vs SharedFlow
date: '2023-12-01'
excerpt: バックグラウンドで発生したイベントが消えてしまう！？
mainCategories:
  - dev
  - recommended
subCategories:
  - sub_1759713206951
  - sub_1759713217297
author: Luke
thumbnail: /images/drafts/1762604843780-Gemini_Generated_Image_szub6pszub6pszub.png
seoTitle: "Android イベント処理 Channel vs SharedFlow 比較 - バックグラウンドイベント消失の解決法"
seoDescription: "AndroidにおけるChannelとSharedFlowを使ったイベント（サイドエフェクト）処理の違いを比較します。バックグラウンドでのイベント消失問題、複数サブスクライバー対応、EventFlowの実装まで、実践的なコード例と共に分析します。"
seoKeywords:
  - Android
  - Channel
  - SharedFlow
  - Kotlin Coroutines
  - イベント処理
  - Side Effect
  - EventFlow
  - MutableSharedFlow
  - repeatOnLifecycle
  - ViewModel
  - MVVM
  - バックグラウンドイベント
  - Flow
summary: "Androidでイベント（サイドエフェクト）を処理する際、Channelはバックグラウンドイベントを保持できるが単一サブスクライバー向きであり、SharedFlowは複数サブスクライバーに対応できるがバックグラウンドイベントが消失する。ほとんどの場合、イベントは一箇所で処理するため、Channelが簡潔で実用的な選択である。"
keyTakeaways:
  - "Channelはsend()がsuspendされるためバックグラウンドイベントが消失しないが、複数サブスクライバーがイベントを交互に受信する問題がある"
  - "SharedFlowは全サブスクライバーが同じイベントを受信できるが、バックグラウンドでemitされたイベントは消失する"
  - "SharedFlowのバックグラウンド消失問題はEventFlow（consumedパターン）で解決可能だが、複数サブスクライバーのメリットが失われる"
  - "slotStore（HashMap/ArrayDeque）パターンで複数サブスクライバー＋バックグラウンドイベント保持の両方を実現できる"
  - "イベントは通常一箇所で処理するため、Channelが最も簡潔で理解しやすい選択である"
---
> Androidでは、イベント（サイドエフェクト）は主にChannelまたはSharedFlowを使って処理します。

#### Channelを使ったイベント処理のサンプルコード

```kotlin
private val _effect: Channel<A> = Channel()
val effect = _effect.receiveAsFlow()
```

#### SharedFlowを使ったイベント処理のサンプルコード

```kotlin
private val _sideEffectFlow: MutableSharedFlow<SE>
val sideEffectFlow: SharedFlow<SE> = _sideEffectFlow.asSharedFlow()
```

では、`SharedFlow`と`Channel`を使ったイベント処理の違いは何でしょうか？

それぞれの長所と短所について見ていきましょう。

# Channel

## 長所と短所

長所：バックグラウンドで発生したイベントも収集可能

短所：複数のサブスクライバーを持つには不向き

## テスト1 - バックグラウンド

### MainViewModel

```kotlin
class MainViewModel : ViewModel() {
    private val _channel = Channel<Int>()
    val channel = _channel.receiveAsFlow()

    init {
        viewModelScope.launch {
            repeat(100) {
                Log.d("Channel", "MainViewModel - Send $it")
                _channel.send(it)
                delay(1000)
            }
        }
    }
}
```

### MainActivity

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.channel.collect { number ->
                    Log.d("Channel","MainActivity - Collected $number from channel")
                }
            }
        }
        // ...
}
```

### 結果

![pasted-image-1759713265068.png](/images/posts/1759713265065-image.png)

1. MainActivity - onStop（バックグラウンドに移行）

2. MainViewModel - channel send 7（バックグラウンドでsend）

3. MainActivity - onStart（フォアグラウンドに復帰）

4. MainActivity - collect 7（フォアグラウンドでcollect）


バックグラウンドでsendした7を正しくcollectしていることが確認できます。

これが可能な理由は、`channel`の`send()`は[channelのバッファが満杯であるか存在しない場合にsuspendされるため](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-send-channel/send.html)です。（suspending the caller while the buffer of this channel is full or if it does not exist, or throws an exception if the channel [is closed for `send`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-send-channel/is-closed-for-send.html) (see [close](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-send-channel/close.html) for details).）

## テスト2 - 複数のサブスクライバーがある場合

### MainActivity

```kotlin
lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.channel.collect { number ->
                    Log.d("Subscriber","Subscriber[1] - Collected $number from channel")
                }
            }
        }

lifecycleScope.launch {
        repeatOnLifecycle(Lifecycle.State.STARTED) {
            viewModel.channel.collect { number ->
                Log.d("Subscriber","Subscriber[2] - Collected $number from channel")
            }
        }
    }
```

### 結果

![pasted-image-1759713283873.png](/images/posts/1759713283870-image.png)

Channelで複数のサブスクライバーがある場合、各サブスクライバーが交互にcollectすることになります。

1. channel - send 1

2. subscriber\[1\] - collect 1

3. channel - send 2

4. subscriber\[2\] - collect 2


[公式ドキュメント](https://kotlinlang.org/docs/channels.html#channels-are-fair)によると、`Channel`は公平（fair）であるためです。

したがって、複数のサブスクライバーがある場合、各サブスクライバーが同じイベントを受信しないため、`Channel`よりも`SharedFlow`の方が適しています。

例えば、アプリ全体にtickを送って定期的にアプリのデータをリフレッシュする必要がある場合、`Channel`を使うのは不適切です。

# SharedFlow

長所：複数のサブスクライバーを持つことができる

短所：バックグラウンドで発生したイベントの収集ができない

## テスト1 - バックグラウンド

### MainActivity

```kotlin
lifecycleScope.launch {
    repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.sharedFlow.collect { number ->
            Log.d("SharedFlow","MainActivity - Collected $number from sharedFlow")
        }
    }
}
```

### 結果

![pasted-image-1759713296336.png](/images/posts/1759713296328-image.png)

1. MainActivity - onStop（バックグラウンドに移行）

2. MainViewModel - sharedFlow emit 8, 9, 10, 11（バックグラウンドでemit）

3. MainActivity - onStart（フォアグラウンドに復帰）

4. MainActivity - collect 12（フォアグラウンドでcollect）- 8, 9, 10, 11は消失


バックグラウンドでemitした8, 9, 10, 11が消失していることが確認できます。

## テスト2 - 複数のサブスクライバーがある場合

### MainActivity

```kotlin
lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.sharedFlow.collect { number ->
                    Log.d("Subscriber","Subscriber[1] - Collected $number from sharedFlow")
                }
            }
        }

        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.sharedFlow.collect { number ->
                    Log.d("Subscriber","Subscriber[2] - Collected $number from sharedFlow")
                }
            }
        }
```

### 結果

![pasted-image-1759713311261.png](/images/posts/1759713311259-image.png)

複数のサブスクライバーがあっても、すべてのサブスクライバーが同じイベントをcollectしていることが確認できます。

## 短所の克服方法

`sharedFlow`の短所は[MVVMのViewModelでイベントを処理する6つの方法](https://medium.com/prnd/mvvm%EC%9D%98-viewmodel%EC%97%90%EC%84%9C-%EC%9D%B4%EB%B2%A4%ED%8A%B8%EB%A5%BC-%EC%B2%98%EB%A6%AC%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95-6%EA%B0%80%EC%A7%80-31bb183a88ce)で解決できますが... こうすると複数のサブスクライバーを持てなくなります。これはどういうことでしょうか？詳しく見ていきましょう。（その前に[MVVMのViewModelでイベントを処理する6つの方法](https://medium.com/prnd/mvvm%EC%9D%98-viewmodel%EC%97%90%EC%84%9C-%EC%9D%B4%EB%B2%A4%ED%8A%B8%EB%A5%BC-%EC%B2%98%EB%A6%AC%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95-6%EA%B0%80%EC%A7%80-31bb183a88ce)の記事を読んでおきましょう。）

### 問題発生シナリオ

`event`オブジェクトがあり、それを`AFragment`と`BFragment`で`collect`していると仮定しましょう。

1.`event`が`emit`されると、`AFragment`と`BFragment`で`collect`されます。（わずかな差で`AFragment`が先に`collect`したと仮定）

![pasted-image-1759713323502.png](/images/posts/1759713323499-image.png)

2.このとき`AFragment`で`event`の`consumed`が`true`になります。

![pasted-image-1759713330677.png](/images/posts/1759713330673-image.png)

3.その後`BFragment`で`event`が`collect`されるべきですが、`event`はすでに`consumed`されているため`collect`されません。

![pasted-image-1759713335897.png](/images/posts/1759713335894-image.png)

### 解決方法

`slotStore`という`HashMap`を作成しました。

`slotStore`の`key`には現在`collect`している`collector`の名前と`slot`の`toString()`値が入ります。
`value`には`event`と同じ値を持つ新しい`event`が入ります。

先ほどと同様に、`event`オブジェクトがあり、それを`AFragment`と`BFragment`で`collect`していると仮定します。

1\. `event`が`emit`されると、`AFragment`と`BFragment`で`collect`されます。（わずかな差で`AFragment`が先に`collect`したと仮定）

2.このとき`slotStore`に`{ AFragment + event.toString() : Event(event.value) }`のような値が保存されます。

![pasted-image-1759713348116.png](/images/posts/1759713348112-image.png)

![pasted-image-1759713354736.png](/images/posts/1759713354732-image.png)

3.その後`slotStore`の`key`値が`AFragment + event.toString()`である`value`の`consumed`が`true`になります。

![pasted-image-1759713367369.png](/images/posts/1759713367366-image.png)

4.`BFragment`でも同じ動作が実行されます。

![pasted-image-1759713375343.png](/images/posts/1759713375340-image.png)

![pasted-image-1759713380810.png](/images/posts/1759713380807-image.png)

5.`collect`後、`BFragment`の`event`は`consumed`処理されます。

![pasted-image-1759713386527.png](/images/posts/1759713386525-image.png)

上記の方法を使って、2つ以上のサブスクライバーを持つ`EventFlow`が`emit`されたとき、1つのサブスクライバーだけが`collect`する問題を解決しました。
`slotStore`を使ったコードは[こちら](https://github.com/jinukeu/jinukeu/issues/2#issue-1843226523)で確認できます。

### 解決方法 - 改善

`Event`オブジェクトが使われなくなっても`slotStore`で参照が続くため、GCされない問題がありました。`ArrayDeque`を使って最大20個までの`EventFlowSlot`を保存するよう実装しました。最終的なコードは以下の通りです。

```kotlin
private class EventFlowImpl<T>(
    replay: Int
) : MutableEventFlow<T> {

    private val flow: MutableSharedFlow<EventFlowSlot<T>> = MutableSharedFlow(replay = replay)

    private val slotStore: ArrayDeque<Slot<EventFlowSlot<T>>> = ArrayDeque()

    @InternalCoroutinesApi
    override suspend fun collect(collector: FlowCollector<T>) = flow
        .collect { slot ->

            val slotKey = collector.javaClass.name + slot

            if(isContainKey(slotKey)) {
                if(slotStore.size > MAX_CACHE_EVENT_SIZE) slotStore.removeFirst()
                slotStore.addLast(Slot(slotKey, EventFlowSlot(slot.value)))
            }

            val slotValue = slotStore.find { it.key == slotKey }?.value ?: slot

            if (slotValue.markConsumed().not()) {
                collector.emit(slotValue.value)
            }
        }

    override suspend fun emit(value: T) {
        flow.emit(EventFlowSlot(value))
    }

    fun isContainKey(findKey: String): Boolean {
        return slotStore.find { it.key == findKey } == null
    }
}

private data class Slot<T>(
    val key: String,
    val value: T
)
```

---

## 結論

> イベント（サイドエフェクト）は通常、一箇所でのみ処理します。

`sharedFlow`を使ってバックグラウンドで発生したイベントを処理するには、`eventFlow`を作成する必要があります。`eventFlow`を作ること自体が追加のコードが必要になるという欠点があります。また、`eventFlow`を作った時点で`sharedFlow`の長所（複数のサブスクライバーを持てること）が失われます。これも上記で説明した方法で解決できますが、追加のコードが必要であり、コードの理解が難しくなります。

したがって、イベントは通常一箇所でのみ処理するため、`channel`を使ってイベントを受信するのが最もコードが少なく、比較的理解しやすい方法です。

必要な場合にのみ`sharedFlow`を使うのが良いと考えます。

### 参考

[\[Kotlin\] CoroutineのSharedFlowとChannel](https://velog.io/@morning-la/Kotlin-Coroutine%EC%9D%98-SharedFlow-%EC%99%80-Channel)

[StateFlow vs SharedFlowを比較してみよう #イベントハンドリング](https://developer88.tistory.com/entry/StateFlow-vs-SharedFlow-%EB%A5%BC-%EB%B9%84%EA%B5%90%ED%95%B4%EB%B3%B4%EC%9E%90-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%ED%95%B8%EB%93%A4%EB%A7%81)

[MVVMのViewModelでイベントを処理する6つの方法](https://medium.com/prnd/mvvm%EC%9D%98-viewmodel%EC%97%90%EC%84%9C-%EC%9D%B4%EB%B2%A4%ED%8A%B8%EB%A5%BC-%EC%B2%98%EB%A6%AC%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95-6%EA%B0%80%EC%A7%80-31bb183a88ce)
