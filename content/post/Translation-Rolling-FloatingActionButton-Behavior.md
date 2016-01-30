+++
author = ""
comments = true
date = "2015-11-24T21:41:57+08:00"
draft = false
image = ""
menu = "blog"
share = true
slug = ""
tags = ["翻译", "Android","FAB"]
title = "[译]浮动操作按钮（FloatingActionButton）的滚动behavior"

+++

> 原文链接 : [Rolling FloatingActionButton Behavior](https://medium.com/@nullthemall/rolling-floatingactionbutton-behavior-d86fb797a1e#.7esf5u4xo)
作者 : 	Nikola Despotoski
<!--more-->

平常，我喜欢上materialup.com去看看有没有什么新的内容，或者用Material guideline里的关键字来搜索看相关的内容。几天前，我看到了这张图里的效果:
![A rolling fab, freaking lolz.][1]

滚动进入效果
----------

为了保证SnackBar的behavior仍然有效，我们要在原有的FloatinghActionButton.Behavior基础上实现rolling behavior。
只有在继承了nested scrolling动作的view滑动时，我们才需要滚动FAB：

    @Override
    public boolean layoutDependsOn(....View dependency) {
        return super.layoutDependsOn(parent, child, dependency) || dependency instanceof NestedScrollingChild;
    }
    
    @Override
    public boolean onStartNestedScroll(CoordinatorLayout coordinatorLayout, ..., int nestedScrollAxes) {
        return (nestedScrollAxes & ViewCompat.SCROLL_AXIS_VERTICAL) != 0;

当界面滑动的距离差不多是FAB的高度时，我们让FAB开始滚动离开
使拉力（tension）的阀值在0.5f，用来控制FAB是否完全滚动离开。
当我们向下滑动的时候，让FAB开始滚动进入。

    @Override
    public void onNestedPreScroll(... FloatingActionButton child... int dx, int dy, ..) {
        if (dy > 0 && mTotalDy < 0) {
            mTotalDy = 0;
            if (mTensionFactor <= 0.5f)
                rollInFabCompletely(child);
        } else if (dy < 0 && mTotalDy > 0) {
            mTotalDy = 0;
        }
    
        mTotalDy += dy;
        if (mTotalDy >= child.getHeight() && getRollingFabState() == IDLE) {
            float rollBy = (float) (mTotalDy - child.getHeight()) / child.getHeight();
            rollOutFabBy(child, rollBy);
        } else if (mTotalDy < -child.getHeight()) {
            if (getRollingFabState() ==   RollingFabState.ROLLED_OUT) {
                rollInFabCompletely(child);
            } else if (getRollingFabState() ==   RollingFabState.ROLLING_OUT) {
                ViewCompat.animate(child).cancel();
                rollInFabCompletely(child);
            }
        }
    }

如果滑动的距离没够，利用拉力（Tension）来使FAB恢复原来的位置和旋转角度。

    @Override
    public void onStopNestedScroll(CoordinatorLayout coordinatorLayout, FloatingActionButton child, View target) {
     if (mTensionFactor >= 0.5)
        postRollFabOutCompletely(child);
    else if (mTensionFactor < 0.5 && getRollingFabState() !=   RollingFabState.ROLLED_OUT)
        postRollFabInCompletely(child);
    }

代码如下：
RollingFloatingActionButtonBehavior.java

    package samples.despotoski.nikola.com.appbarlayoutsample.view;
    
    import android.annotation.TargetApi;
    import android.content.Context;
    import android.os.Build;
    import android.support.annotation.IntDef;
    import android.support.design.widget.AppBarLayout;
    import android.support.design.widget.CoordinatorLayout;
    import android.support.design.widget.FloatingActionButton;
    import android.support.design.widget.Snackbar;
    import android.support.v4.view.NestedScrollingChild;
    import android.support.v4.view.ViewCompat;
    import android.support.v4.view.ViewPropertyAnimatorListener;
    import android.support.v4.view.ViewPropertyAnimatorListenerAdapter;
    import android.support.v4.view.animation.FastOutLinearInInterpolator;
    import android.util.AttributeSet;
    import android.view.View;
    import android.view.animation.Interpolator;
    
    import java.lang.annotation.Retention;
    import java.lang.annotation.RetentionPolicy;
    
    /**
     * Created by Nikola D. on 11/17/2015.
     */
    public class RollingFloatingActionButtonBehavior extends FloatingActionButton.Behavior {
        private static final Interpolator FAST_OUT_SLOW_IN_INTERPOLATOR = new FastOutLinearInInterpolator();
        private static final float TENSION_THRESHOLD = 0.5f;
        private int mTotalDy;
    
    
        private int mRollingState = RollingFabState.IDLE;
        private boolean mTensionFlag = false;
        private int mOffscreenTranslation;
        private float mTensionFactor = 0f;
        private long mTimeInitial;
        private float mCurrentSpeed;
        private static final float VELOCITY_THRESHOLD = 100;
    
        public int getRollingFabState() {
            return mRollingState;
        }
    
    
        @IntDef({RollingFabState.IDLE, RollingFabState.ROLLING_OUT, RollingFabState.ROLLING_IN, RollingFabState.ROLLED_OUT})
        private @interface RollingFabState {
            int ROLLING_OUT = -1;
            int ROLLING_IN = 0;
            int ROLLED_OUT = 1;
            int IDLE = 2;
        }
    
    
        public RollingFloatingActionButtonBehavior() {
            super();
        }
    
    
        public RollingFloatingActionButtonBehavior(Context context, AttributeSet attrs) {
    
        }
    
        private ViewPropertyAnimatorListener mRollingOutListener = new ViewPropertyAnimatorListenerAdapter() {
            @Override
            public void onAnimationStart(View view) {
                setRollingState(RollingFabState.ROLLING_OUT);
            }
    
            @Override
            public void onAnimationEnd(View view) {
                setRollingState(RollingFabState.ROLLED_OUT);
            }
        };
    
        private ViewPropertyAnimatorListener mRollingInListener = new ViewPropertyAnimatorListenerAdapter() {
            @Override
            public void onAnimationStart(View view) {
                setRollingState(RollingFabState.ROLLING_IN);
            }
    
            @Override
            public void onAnimationEnd(View view) {
                mTensionFactor = 0.0f;
                setRollingState(RollingFabState.IDLE);
            }
        };
    
    
        @Override
        public boolean layoutDependsOn(CoordinatorLayout parent, FloatingActionButton child, View dependency) {
            return super.layoutDependsOn(parent, child, dependency) || dependency instanceof NestedScrollingChild;
        }
    
        @Override
        public boolean onStartNestedScroll(CoordinatorLayout coordinatorLayout, FloatingActionButton child, View directTargetChild, View target, int nestedScrollAxes) {
            return (nestedScrollAxes & ViewCompat.SCROLL_AXIS_VERTICAL) != 0;
        }
    
        @Override
        public boolean onNestedPreFling(CoordinatorLayout coordinatorLayout, FloatingActionButton child, View target, float velocityX, float velocityY) {
            if (Math.abs(velocityY) < Math.abs(velocityX)) return false;
    
            if (Math.abs(velocityY) >= child.getHeight()) {
                if (velocityY < 0 && getRollingFabState() == RollingFabState.ROLLED_OUT) {
                    postRollFabInCompletely(child);
                } else if (velocityY > 0 && getRollingFabState() == RollingFabState.IDLE) {
                    postRollFabOutCompletely(child);
                }
            }
            return false;
        }
    
        private void postRollFabOutCompletely(final FloatingActionButton fab) {
            ViewCompat.postOnAnimation(fab, new Runnable() {
                @Override
                public void run() {
                    rollOutFabCompletely(fab);
                }
            });
        }
    
        private void postRollFabInCompletely(final FloatingActionButton fab) {
            ViewCompat.postOnAnimation(fab, new Runnable() {
                @Override
                public void run() {
                    rollInFabCompletely(fab);
                }
            });
        }
    
        @Override
        public void onNestedPreScroll(CoordinatorLayout coordinatorLayout, FloatingActionButton child, View target, int dx, int dy, int[] consumed) {
            if (dy > 0 && mTotalDy < 0) {
                mTotalDy = 0;
                if (mTensionFactor <= 0.5f)
                    rollInFabCompletely(child);
            } else if (dy < 0 && mTotalDy > 0) {
                mTotalDy = 0;
            }
    
            mTotalDy += dy;
            if (mTotalDy >= child.getHeight() && getRollingFabState() == RollingFabState.IDLE) {
                float rollBy = (float) (mTotalDy - child.getHeight()) / child.getHeight();
                rollOutFabBy(child, rollBy);
            } else if (mTotalDy < -child.getHeight()) {
                if (getRollingFabState() == RollingFabState.ROLLED_OUT) {
                    rollInFabCompletely(child);
                } else if (getRollingFabState() == RollingFabState.ROLLING_OUT) {
                    ViewCompat.animate(child).cancel();
                    rollInFabCompletely(child);
                }
            }
        }
    
        private void rollInFabCompletely(FloatingActionButton child) {
            ViewCompat.animate(child).translationX(0f).translationY(0f).rotation(0).setDuration(200)
                    .setInterpolator(FAST_OUT_SLOW_IN_INTERPOLATOR).setListener(mRollingInListener).start();
    
        }
    
    
        @Override
        public void onStopNestedScroll(CoordinatorLayout coordinatorLayout, FloatingActionButton child, View target) {
            if (mTensionFactor >= 0.5)
                postRollFabOutCompletely(child);
            else if (mTensionFactor < 0.5 && getRollingFabState() != RollingFabState.ROLLED_OUT)
                postRollFabInCompletely(child);
        }
    
    
        @Override
        public boolean onLayoutChild(CoordinatorLayout parent, FloatingActionButton child,
                                     int layoutDirection) {
            boolean superLayout = super.onLayoutChild(parent, child, layoutDirection);
            float center = child.getWidth() / 2;
            ViewCompat.setPivotX(child, center);
            ViewCompat.setPivotY(child, center);
            mOffscreenTranslation = child.getWidth() + child.getWidth() / 2;
            return superLayout;
        }
    
        private void rollOutFabBy(final FloatingActionButton child, float rollBy) {
            float offScreen = Math.abs(child.getWidth() * rollBy);
            if (offScreen <= child.getWidth() * TENSION_THRESHOLD) {
                ViewCompat.setRotation(child, 360 * rollBy);
                ViewCompat.setTranslationX(child, offScreen);
                ViewCompat.setTranslationY(child, offScreen);
                mTensionFlag = true;
                mTensionFactor = rollBy;
            } else {
                mTensionFlag = false;
                postRollFabOutCompletely(child);
            }
        }
    
    
        private void rollOutFabCompletely(FloatingActionButton child) {
            ViewCompat.animate(child).translationX(mOffscreenTranslation).translationY(mOffscreenTranslation).rotation(360).setDuration(200).setInterpolator(FAST_OUT_SLOW_IN_INTERPOLATOR).setListener(mRollingOutListener).start();
        }
    
        @Override
        public void onNestedScroll(CoordinatorLayout coordinatorLayout, FloatingActionButton child, View target, int dxConsumed, int dyConsumed, int dxUnconsumed, int dyUnconsumed) {
            super.onNestedScroll(coordinatorLayout, child, target, dxConsumed, dyConsumed, dxUnconsumed, dyUnconsumed);
        }
    
        @Override
        public boolean onDependentViewChanged(CoordinatorLayout parent, FloatingActionButton child, View dependency) {
            if (dependency instanceof Snackbar.SnackbarLayout || dependency instanceof AppBarLayout) {
                super.onDependentViewChanged(parent, child, dependency);
            }
            return false;
        }
    
    
        private void setRollingState(@RollingFabState int rollingState) {
            this.mRollingState = rollingState;
        }
    
    }

用法：

     <android.support.design.widget.FloatingActionButton
            android:id="@+id/fab"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_margin="@dimen/fab_margin"
            android:src="@android:drawable/ic_dialog_email"
            app:layout_anchorGravity="bottom|end"
            app:layout_anchor="@+id/nested_scrollview"
            app:layout_behavior=".view.RollingFloatingActionButtonBehavior" />



  [1]: https://cdn-images-1.medium.com/max/800/1*yQl9PjYWSVrgpmDMbPgwCg.gif