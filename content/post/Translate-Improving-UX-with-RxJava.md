+++
author = ""
comments = true
date = "2015-11-23T21:41:57+08:00"
draft = false
image = ""
menu = "blog"
share = true
slug = ""
tags = ["翻译", "Android","RxJava"]
title = "[译]使用RxJava来提升用户体验"

+++

> 原文链接 : [Improving UX with RxJava](https://medium.com/@diolor/improving-ux-with-rxjava-4440a13b157f#5c79.ckugehlg3)
作者 : 	Dionysis Lorentzos

<!--more-->

在理想的手机世界中，用户永远不会失去网络连接，服务器请求永远不会出错。
用户总是希望应用有好的体验，但是对开发者来说，却并不容易实现。像以前那种用户点击按钮，然后等到后台返回数据再显示出来的那种烦人的交互已经过时了。[
!\[Search list animation][1] by [Daley P Maasz][2] from Dribbble.][3]

在这篇文章里，我们要利用Edittext来实现用户体验更好的搜索功能，同时在过程中，我们应时刻注意以下两点
 - 我们要尽可能少的发起网络请求
 - 我们要尽可能少的向用户显示错误信息
 Rx的逻辑非常简单并且让我们可以更多的关注到一些细节的东西。

----------
我们先从简单的逻辑开始：

当用户输入了一些东西以后，应用会发起网络搜索请求，然后从服务器中获得结果

    RxTextView.textChanges(searchEditText)
         .flatMap(Api::searchItems)
         .subscribe(this::updateList, t->showError());

1.减少网络请求
--------
为了减少网络请求，我们需要考虑到两个问题：

 1. 无论用户输入任何字母时，应用都会发起一次请求，比如说：当用户输入“a”，然后输入“b”变成“ab”，然后再输入一个“c”变成“abc”，这时，他发现自己多输了一个c，删掉c变成“ab”，最后，他才输入好自己想要的“abe”。在这个过程中，竟然发起了5次网络请求。可以想象如果网络很烂的话，会变得多么糟糕。
 2. 线程优先级问题，比如说：用户输入“a”，然后输入“b”变成“ab”。这时，“ab”才是要搜索的东西，“ab”的网络请求应该优先于“a”。但是，在这种情况下，最后的updateList()里，更新的却先是“a”的结果，然后才是“ab”的结果。
 

解决方法：

1.添加流控制(throttling behavior)：
通常,我们使用[debounce()][4]操作符来实现。根据以往经验，这个去抖动的时间控制在100-150ms效果最好。如果服务器请求需要消耗300ms，那么我们便可以在0.5s内实现UI的更新。

    RxTextView.textChanges(searchEditText)
         .debounce(150, MILLISECONDS)
         .flatMap(Api::searchItems)
         .subscribe(this::updateList, t->showError());

2.停止之前的请求:
使用[switchMap][5] 替代flatMap，来停止掉之前的提交。所以，如果在0+150ms的时候搜的是“ab”，在0+300ms的时候要搜的是“abcd”，但是“ab”的网络请求需要150ms来完成，所以，当你搜索“abcd”的时候，之前的请求会被取消掉，因而你获得的总是最新的结果。

    RxTextView.textChanges(searchEditText)
         .debounce(150, MILLISECONDS)
         .switchMap(Api::searchItems)
         .subscribe(this::updateList, t->showError());


无网络和无错误的操作
-----------
如果网络请求失败了，应用就不需要再监听输入内容的变化了
这个可以使用 [错误捕捉功能][6]实现
你可以直接使用

    RxTextView.textChanges(searchEditText)
         .debounce(150, MILLISECONDS)
         .switchMap(Api::searchItems)
         .onErrorResumeNext(t-> empty())
         .subscribe(this::updateList);

但是，这里还有可以继续优化的空间，我们先不要这样写，看看还能怎样优化。
如果这个错误是因为没有网络连接问题导致的，但是用户这时候却并没有注意到怎么办？
我们需要添加一个自动重试的机制：

    RxTextView.textChanges(searchEditText)
         .debounce(150, MILLISECONDS)
         .switchMap(Api::searchItems)
         .retryWhen(new RetryWithConnectivity())
         .subscribe(this::updateList, t->showError());

还能再优化吗？可以的，我们可以添加重试等待时间。像我们的UX设计师[Leander Lenzing][7]说的“1s在用户的世界中已经是很长的时间”，所以上述代码可以这样

    RxTextView.textChanges(searchEditText)
         .debounce(150, MILLISECONDS)
         .switchMap(Api::searchItems)
         .retryWhen(new RetryWithConnectivityIncremental(context, 5, 15, SECONDS))
         .subscribe(this::updateList, t->showErrorToUser());
     
那么 RetryWithConnectivityIncremental 与 RetryWithConnectivity 有什么区别?
当出现网络错误时，它会先等待5s，然后重试一次，如果还是出错，则抛出异常。
如果用户再次输入了内容，触发了操作，那么这个5s的重试等待时间会变得更长，比如说上面的15s。

代码如下
     
BroadcastObservable.java 

    import android.content.BroadcastReceiver;
    import android.content.Context;
    import android.content.Intent;
    import android.content.IntentFilter;
    import android.net.ConnectivityManager;
    import android.net.NetworkInfo;
    import android.os.Looper;
    import rx.Observable;
    import rx.Scheduler;
    import rx.Subscriber;
    import rx.Subscription;
    import rx.android.schedulers.AndroidSchedulers;
    import rx.functions.Action0;
    import rx.subscriptions.Subscriptions;
        public class BroadcastObservable implements Observable.OnSubscribe<Boolean> {
        
        	private final Context context;
    
    	public static Observable<Boolean> fromConnectivityManager(Context context) {
    		return Observable.create(new BroadcastObservable(context))
    				.share();
    	}
    
    	public BroadcastObservable(Context context) {
    		this.context = context;
    	}
    
    	@Override
    	public void call(Subscriber<? super Boolean> subscriber) {
    		BroadcastReceiver receiver = new BroadcastReceiver() {
    			@Override
    			public void onReceive(Context context, Intent intent) {
    				subscriber.onNext(isConnectedToInternet());
    			}
    		};
    
    		context.registerReceiver(receiver, new IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION));
    
    		subscriber.add(unsubscribeInUiThread(() -> context.unregisterReceiver(receiver)));
    	}
    
    	private boolean isConnectedToInternet() {
    		ConnectivityManager manager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
    		NetworkInfo networkInfo = manager.getActiveNetworkInfo();
    		return networkInfo != null && networkInfo.isConnected();
    	}
    
    	private static Subscription unsubscribeInUiThread(final Action0 unsubscribe) {
    		return Subscriptions.create(() -> {
    			if (Looper.getMainLooper() == Looper.myLooper()) {
    				unsubscribe.call();
    			} else {
    				final Scheduler.Worker inner = AndroidSchedulers.mainThread().createWorker();
    				inner.schedule(() -> {
    					unsubscribe.call();
    					inner.unsubscribe();
    				});
    			}
    		});
    	}
    
    }

RetryWithConnectivityIncremental.java

    import android.content.Context;
    import java.util.concurrent.TimeUnit;
    import java.util.concurrent.TimeoutException;
    import rx.Observable;
    import rx.functions.Func1;
    
    public class RetryWithConnectivityIncremental implements Func1<Observable<? extends Throwable>, Observable<?>> {
    	private final int maxTimeout;
    	private final TimeUnit timeUnit;
    	private final Observable<Boolean> isConnected;
    	private final int startTimeOut;
    	private int timeout;
    
    	public RetryWithConnectivityIncremental(Context context, int startTimeOut, int maxTimeout, TimeUnit timeUnit) {
    		this.startTimeOut = startTimeOut;
    		this.maxTimeout = maxTimeout;
    		this.timeUnit = timeUnit;
    		this.timeout = startTimeOut;
    		isConnected = getConnectedObservable(context);
    	}
    
    	@Override
    	public Observable<?> call(Observable<? extends Throwable> observable) {
    		return observable.flatMap((Throwable throwable) -> {
    			if (throwable instanceof RetrofitError && ((RetrofitError) throwable).getKind() == RetrofitError.Kind.NETWORK) {
    				return isConnected;
    			} else {
    				return Observable.error(throwable);
    			}
    		}).compose(attachIncementalTimeout());
    	}
    
    	private Observable.Transformer<Boolean, Boolean> attachIncementalTimeout() {
    		return observable -> observable.timeout(timeout, timeUnit)
    				.doOnError(throwable -> {
    					if (throwable instanceof TimeoutException) {
    						timeout = timeout > maxTimeout ? maxTimeout : timeout + startTimeOut;
    					}
    				});
    	}
    
    	private Observable<Boolean> getConnectedObservable(Context context) {
    		return BroadcastObservable.fromConnectivityManager(context)
    				.distinctUntilChanged()
    				.filter(isConnected -> isConnected);
    	}
    
    }
    
好了，这就是这篇文章的内容了！我们实现了对网络请求的控制，使用户看到的总是最新的内容，还有智能的重试机制。


  [1]: https://dribbble.com/shots/2004585-Search-animation
  [2]: https://dribbble.com/daleypmaasz
  [3]: https://dribbble.com/shots/2004585-Search-animation
  [4]: http://reactivex.io/documentation/operators/debounce.html
  [5]: http://reactivex.io/documentation/operators/flatmap.html
  [6]: https://github.com/ReactiveX/RxJava/wiki/Error-Handling-Operators
  [7]: https://medium.com/u/1929db36f9c5