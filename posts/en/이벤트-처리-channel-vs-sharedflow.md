---
title: "Event Handling: Channel vs SharedFlow"
date: '2023-12-01'
excerpt: Events emitted in the background just... disappear!??
mainCategories:
  - dev
  - recommended
subCategories:
  - sub_1759713206951
  - sub_1759713217297
author: Luke
thumbnail: /images/drafts/1762604843780-Gemini_Generated_Image_szub6pszub6pszub.png
seoTitle: "Android Event Handling: Channel vs SharedFlow - Solving Background Event Loss"
seoDescription: "Compare Channel and SharedFlow for handling events (side effects) in Android. Analyze background event loss, multiple subscriber handling, and EventFlow implementation with practical examples and test results."
seoKeywords:
  - Android
  - Channel
  - SharedFlow
  - Kotlin Coroutines
  - event handling
  - side effects
  - EventFlow
  - MutableSharedFlow
  - repeatOnLifecycle
  - ViewModel
  - MVVM
  - background events
  - Flow
  - Kotlin Flow
summary: "When handling events (side effects) in Android, Channel preserves background events but is limited to a single subscriber, while SharedFlow supports multiple subscribers but loses events emitted in the background. Since events are typically handled in one place, Channel is the most concise and practical choice for most cases."
keyTakeaways:
  - "Channel's send() suspends when the buffer is full, preserving background events, but multiple subscribers receive events in alternation rather than all receiving the same event"
  - "SharedFlow delivers the same event to all subscribers, but events emitted while in the background are lost"
  - "SharedFlow's background loss can be solved with an EventFlow (consumed pattern), but this eliminates the multi-subscriber advantage"
  - "A slotStore (HashMap/ArrayDeque) pattern can achieve both multiple subscribers and background event preservation"
  - "Since events are typically handled in one place, Channel is the simplest and most understandable choice"
---
> In Android, events (side effects) are typically handled using either a channel or a sharedFlow.

#### Event handling example with channel

```kotlin
private val _effect: Channel<A> = Channel()
val effect = _effect.receiveAsFlow()
```

#### Event handling example with sharedFlow

```kotlin
private val _sideEffectFlow: MutableSharedFlow<SE>
val sideEffectFlow: SharedFlow<SE> = _sideEffectFlow.asSharedFlow()
```

So what is the difference between handling events with `SharedFlow` vs `Channel`?

Let's explore the pros and cons of each.

# Channel

## Pros and Cons

Pros: Can collect events emitted in the background

Cons: Not suitable for having multiple subscribers

## Test 1 - Background

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

### Result

![pasted-image-1759713265068.png](/images/posts/1759713265065-image.png)

1. MainActivity - onStop (enters background)

2. MainViewModel - channel send 7 (send while in background)

3. MainActivity - onStart (returns to foreground)

4. MainActivity - collect 7 (collect in foreground)


We can see that the value 7 sent in the background was correctly collected.

This is possible because `channel`'s `send()` [suspends the caller while the buffer of this channel is full or if it does not exist.](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-send-channel/send.html) (suspending the caller while the buffer of this channel is full or if it does not exist, or throws an exception if the channel [is closed for `send`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-send-channel/is-closed-for-send.html) (see [close](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-send-channel/close.html) for details).)

## Test 2 - Multiple Subscribers

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

### Result

![pasted-image-1759713283873.png](/images/posts/1759713283870-image.png)

When a Channel has multiple subscribers, each subscriber collects events in alternation.

1. channel - send 1

2. subscriber\[1\] - collect 1

3. channel - send 2

4. subscriber\[2\] - collect 2


According to the [official documentation](https://kotlinlang.org/docs/channels.html#channels-are-fair), `Channel` is fair.

Therefore, when there are multiple subscribers, each subscriber does not receive the same event, making `SharedFlow` more suitable than `Channel`.

For example, if you need to send a tick to the entire app for periodic data refresh, using `Channel` would be inappropriate.

# sharedFlow

Pros: Can have multiple subscribers

Cons: Cannot collect events emitted in the background

## Test 1 - Background

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

### Result

![pasted-image-1759713296336.png](/images/posts/1759713296328-image.png)

1. MainActivity - onStop (enters background)

2. MainViewModel - sharedFlow emit 8, 9, 10, 11 (emit while in background)

3. MainActivity - onStart (returns to foreground)

4. MainActivity - collect 12 (collect in foreground) - 8, 9, 10, 11 are lost


We can confirm that events 8, 9, 10, 11 emitted in the background were lost.

## Test 2 - Multiple Subscribers

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

### Result

![pasted-image-1759713311261.png](/images/posts/1759713311259-image.png)

Even with multiple subscribers, we can confirm that all subscribers collect the same event.

## Overcoming the Drawback

The drawback of `sharedFlow` can be overcome using the approach described in [6 Ways to Handle Events in MVVM ViewModel](https://medium.com/prnd/mvvm%EC%9D%98-viewmodel%EC%97%90%EC%84%9C-%EC%9D%B4%EB%B2%A4%ED%8A%B8%EB%A5%BC-%EC%B2%98%EB%A6%AC%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95-6%EA%B0%80%EC%A7%80-31bb183a88ce) ... but then you lose the ability to have multiple subscribers. What does this mean? Let's dive in. (But first, read the [6 Ways to Handle Events in MVVM ViewModel](https://medium.com/prnd/mvvm%EC%9D%98-viewmodel%EC%97%90%EC%84%9C-%EC%9D%B4%EB%B2%A4%ED%8A%B8%EB%A5%BC-%EC%B2%98%EB%A6%AC%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95-6%EA%B0%80%EC%A7%80-31bb183a88ce) post.)

### Problem Scenario

Suppose there is an `event` object being `collect`ed by both `AFragment` and `BFragment`.

1.When `event` is `emit`ted, both `AFragment` and `BFragment` `collect` it. (Assume `AFragment` collects first by a narrow margin.)

![pasted-image-1759713323502.png](/images/posts/1759713323499-image.png)

2.At this point, the `consumed` flag of `event` in `AFragment` is set to `true`.

![pasted-image-1759713330677.png](/images/posts/1759713330673-image.png)

3.After that, `BFragment` should `collect` the `event`, but since it was already `consumed`, it is not collected.

![pasted-image-1759713335897.png](/images/posts/1759713335894-image.png)

### Solution

I created a `HashMap` called `slotStore`.

The `key` of `slotStore` contains the name of the current `collector` and the `toString()` value of the `slot`.
The `value` contains a new `event` with the same value as the original `event`.

As before, suppose there is an `event` object being `collect`ed by both `AFragment` and `BFragment`.

1\. When `event` is `emit`ted, both `AFragment` and `BFragment` `collect` it. (Assume `AFragment` collects first by a narrow margin.)

2.At this point, a value like `{ AFragment + event.toString() : Event(event.value) }` is stored in `slotStore`.

![pasted-image-1759713348116.png](/images/posts/1759713348112-image.png)

![pasted-image-1759713354736.png](/images/posts/1759713354732-image.png)

3.After that, the `consumed` flag of the `value` in `slotStore` whose `key` is `AFragment + event.toString()` is set to `true`.

![pasted-image-1759713367369.png](/images/posts/1759713367366-image.png)

4.The same operation is performed for `BFragment`.

![pasted-image-1759713375343.png](/images/posts/1759713375340-image.png)

![pasted-image-1759713380810.png](/images/posts/1759713380807-image.png)

5.After `collect`, the `BFragment`'s `event` is marked as `consumed`.

![pasted-image-1759713386527.png](/images/posts/1759713386525-image.png)

Using this approach, I solved the issue where only a single subscriber could `collect` when an `EventFlow` with two or more subscribers `emit`ted an event.
The code using `slotStore` can be found [here](https://github.com/jinukeu/jinukeu/issues/2#issue-1843226523).

### Solution - Improvement

There was an issue where `Event` objects were not garbage collected because `slotStore` kept referencing them even after they were no longer in use. I implemented it using an `ArrayDeque` to store a maximum of 20 `EventFlowSlot`s. The final code is as follows.

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

## Conclusion

> Events (side effects) are typically handled in only one place.

Using `sharedFlow` to handle background events requires creating an `eventFlow`. Creating an `eventFlow` itself has the downside of requiring additional code. Moreover, the moment you create an `eventFlow`, you lose the advantage of `sharedFlow` (the ability to have multiple subscribers). This can also be solved using the approach described above. However, it requires additional code and the code is not easy to understand.

Therefore, since events are usually handled in one place, using `channel` to receive events requires the least code and is relatively easy to understand.

I believe it's best to use `sharedFlow` only when specifically needed.

### References

[\[Kotlin\] Coroutine's SharedFlow and Channel](https://velog.io/@morning-la/Kotlin-Coroutine%EC%9D%98-SharedFlow-%EC%99%80-Channel)

[StateFlow vs SharedFlow Comparison #Event Handling](https://developer88.tistory.com/entry/StateFlow-vs-SharedFlow-%EB%A5%BC-%EB%B9%84%EA%B5%90%ED%95%B4%EB%B3%B4%EC%9E%90-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%ED%95%B8%EB%93%A4%EB%A7%81)

[6 Ways to Handle Events in MVVM ViewModel](https://medium.com/prnd/mvvm%EC%9D%98-viewmodel%EC%97%90%EC%84%9C-%EC%9D%B4%EB%B2%A4%ED%8A%B8%EB%A5%BC-%EC%B2%98%EB%A6%AC%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95-6%EA%B0%80%EC%A7%80-31bb183a88ce)
