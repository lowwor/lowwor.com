---
templateKey: blog-post
id: 2be8814d64ed890d61f956932422fe09
title: Android Studio使用笔记 -快捷键篇
slug: /original-android-studio-keymap/
date: 2015-11-26T09:00:00.125Z
description: "Android Studio"
headerImage: https://i.loli.net/2019/09/15/LXc6dpCByNnrPHs.jpg
tags:
  - 快捷键
  - Android
  - Android Studio
---

在这里，罗列一些有用的快捷键，备查，随时更新。


跳转
----
Mac快捷键          |Windows快捷键          | 英文                              | 作用
:------------------  |:------------------  | :------------- | :------------- 
|`cmd`+`f12`|`ctrl`+`f12`  | File Structure  |弹出一个Structure窗口，内容是跟左边栏的Structure里的是一样
|`cmd`+`e` |`ctrl`+`e` |Recent Files   | 最近打开文件
|`cmd`+`shift`+`e`  | `ctrl`+`shift`+`e`  | Recently Changed Files |最近修改过的文件
|`cmd`+`b`   |`ctrl`+`b`   | Declaration  | 跳转到定义的地方
|`cmd`+`option`+`b ` |`ctrl`+`alt`+`b ` |   Implementation(s) |   跳转实现
|`cmd`+`[`    |`ctrl`+`alt`+ `←`    | Back  |上一个去到的地方。类似于eclipse的（ctrl+ ←）
|`cmd`+`]`    |`ctrl`+`alt`+ `→`   | Forward  | 下一个去到的地方
|`cmd`+`l`   |`ctrl`+`g`   | Line  | 跳转行
|`ctrl`+`↑` |`alt`+`↑` |Previous Method| 跳转到上一方法
|`ctrl`+`↓` |`alt`+`↓` |Next Method| 跳转到下一方法
|`ctrl`+`shift`+`option`+`↑` |`ctrl`+`shift`+`alt`+`↑`    |Previous Change | 上一处修改的地方
|`ctrl`+`shift`+`option`+`↓`  |`ctrl`+`shift`+`alt`+`↓`    |Next Change |   下一处修改的地方
|`f3` |`ctrl`+`shift`+数字    | Toggle Bookmark数字 | 增加书签
|`ctrl`+数字|`ctrl`+数字    | Go to Bookmark数字 | 跳转到书签
|`cmd`+`f3`  |`shift`+`f11`    | Show Bookmarks | 显示所有书签

编辑
----
Mac快捷键          | 快捷键          | 英文                              | 作用|
:------------------  | :------------------  | :------------- | :------------- 
|`option`+`space` |`ctrl`+`shift`+`i`     | Quick Definition  |  弹出一个小窗口，可以快速预览光标所指方法或类的实现
|`cmd`+`p` |`ctrl`+`p`   |Parameter Info   |  提示输入方法时，方法的参数 
|`f2`|`f2`      |  Next Highlighted Error |   在问题间跳转（右键编辑栏右边黄色等的错误空格，可以设置跳转的范围，只在高优先级的错误间跳转（go to high priority problem only）和在所有问题上（包括Warning等）跳转（go to next problem） ）
|`shift`+`f2`|`shift`+`f2`   |  Previous Highlighted Error  |  在问题间跳转
|`cmd`+`f7`  |`ctrl`+`f7`      | Find Usages In File  | 找到文件中用到这个东西的地方
|`cmd`+`option`+`f7`|`ctrl`+`alt`+`f7`  | Show Usages  | 找到工程中用到这个东西的地方
|`shift`+`cmd`+`f7`|`shift`+`ctrl`+`f7`  |Highlight Usages In File   |高亮文件中所有用到这个东西的地方（如果在throw上使用这个，会显示所有抛出异常的地方，在return上则会显示所有有返回的地方）
|`shift`+`enter`|`shift`+`enter` |Start New Line| 新的一行
|`shift`+`f6`|`shift`+`f6`  |Rename|   重命名（可以是变量，方法，类名，包名），会将整个工程中的名字重命名
|`option`+`backspace`|`ctrl`+`backspace`|Delete To Word Start| 删除光标前面的内容
|`option`+`delete`|`ctrl`+`delete`|Delete To Word End| 删除光标后面的内容（下一行的内容会接上来）
|`option`+`↑`     |`ctrl`+`w`        |Extend Selection| 拓大选择的内容区域
|`option`+`↓` |`ctrl`+`shift`+`w`   |Shrink Selection|减小选择的内容区域
|`cmd`+`d`|`ctrl`+`d`|Duplicate Line Or Block| 复制当前行
|`shift`+`option`+`↓` |`shift`+`alt`+`↓` |Move Line Down| 当前行移到下一行
|`shift`+`option`+`↑` |`shift`+`alt`+`↑`  |Move Line Up|当前行移到上一行
|`shift`+`cmd`+`↓`|`shift`+`ctrl`+`↓` |Move Statement Down| 块移到下一行
|`shift`+`cmd`+`↑`|`shift`+`ctrl`+`↑`  |Move Statement Up|块移到上一行
|`cmd`+`option`+`l`  |`ctrl`+`alt`+`l`  |Reformat Code|  格式代码
|`cmd`+`option`+`t`  |`ctrl`+`alt`+`t`   |Surround With|  将一段代码用代码段（循环，try-catch，或者Runnable）包裹住
|`cmd`+`shift`+`enter`|`ctrl`+`shift`+`enter` |Complete Current Statement|   代码完成，1.在行末输入“；”；2.输入if后，按这个，会在if后自动加入括号和花括号； 3.在定义方法后，按这个，自动输入花括号  。Notice：如果你当前行已经输入完的话，按这个，会自动跳到下一行
|`ctrl`+`shift`+`space`|`ctrl`+`shift`+`space` |Smart Type |智能代码完成 点一次，   再点一次的，会列出当前情景下，跟以输入代码相关的提示
|`cmd`+`shift`+`v`|`ctrl`+`shift`+`v`  |Paste From History|   剪切板历史，这样有时候多次复制粘贴就不会搞错
|`option`+鼠标拖动 |`alt`+鼠标拖动    ||     区域选中，可以直接选择划过的内容
|`ctrl`+`g`    |`alt`+`j`           |Add Selection For Next Occurence|     选中一个区域，然后按alt+j，那么在下一个出现选中的内容的地方，会再次出现光标，这样可以同时在多处地方同时
|`cmd`+`ctrl`+`g`  |`shift`+`ctrl`+`alt`+`j`   |Select All Occurence|  选择所有的
|`option`+`shift`  |`alt`+`shift`   |?|  添加光标
|`cmd`+`shift`+`u`|`ctrl`+`shift`+`u`  |Toggle Case|  大小写转换
|`shift`+`cmd`+`←`|`shift`+`ctrl`+`←`   |Stretch to right|  向右增量选择
|`shift`+`cmd`+`→`|`shift`+`ctrl`+`→`   |Stretch to left|  向左增量选择
|`shift`+`ctrl`+`j`|`shift`+`ctrl`+`j`   |Join Lines|  合并行

面板系列
----
|Mac快捷键          | Windows快捷键          | 英文                              | 作用|
:------------------  |:------------------  | :------------- | :------------- |
|`cmd`+`1` |`alt`+`1`  |  Project |打开关闭project面板 |
|`option`+`f12`  |`alt`+`f12`  | Terminal  |  命令行终端，可以在设置中设置另外的终端程序|
|`cmd`+`,` |`ctrl`+`alt`+`s` | Settings  | 设置窗口
|`cmd`+`↑` |`alt`+`home`  |Jump To Navigation Bar    | 唤出导航条
|`shift`+`f12`  |`shift`+`ctrl`+`f12`  |Restore Windows   |最大化编辑器窗口
|`shift`+`ctrl`+`p`|`shift`+`ctrl`+`p`  | Toggle Presentation Mode  | 设置全屏(这个快捷键需要自己调出来)
|`ctrl`+`tab` |`ctrl`+`tab`   | Switcher  |切换窗口
|`cmd`+ `↓`|`f4`   | Jump To Source  |焦点跳到源文件，就是将光标焦点移动到编辑器内，（相当于enter选中文件然后点击esc）
|`cmd`+`n` |`alt`+`insert`  |New    | 新建
|`cmd`+`shift`+`← `|`ctrl`+`shift`+`← `| Stretch To Left  |调整窗口大小
|`cmd`+`shift`+`↑` |`ctrl`+`shift`+`↑` | Stretch To Top   |调整窗口大小
|`cmd`+`shift`+`↓` |`ctrl`+`shift`+`↓` | Stretch To Bottom   |调整窗口大小
|`cmd`+`shift`+`→` |`ctrl`+`shift`+`→`  | Stretch To Right  |调整窗口大小

搜索
----
 Mac快捷键          |  Windows快捷键          | 英文                              | 作用|
:------------------  |:------------------  | :------------- | :------------- 
|双击`shift`   |双击`shift`       | Search Everywhere| 搜索几乎所有东西  包括下面几个搜索类啊，文件啊之类的，甚至还包括窗口（tool windows）动作（actions）设置等
|`cmd`+`o`|`ctrl`+`n`   |    Class       | 搜索类
|`cmd`+`shift`+`o`|`ctrl`+`shift`+`n` |     File| 搜索文件
|`cmd`+`option`+`o`|`ctrl`+`shift`+`alt`+`n` |  Symbol| 搜索符号Symbo，像是变量啊，方法啊之类的可以用这个搜

>  在搜索后加上“：40”，表示去搜到文件的40行 
在搜索前加上斜杠：“/”，表示搜索的是文件夹 
在搜索中输入 类名（文件名）或他们的首字母加上“.”加上内容（symbol），可以直接搜索到某个类里面对应的一些东西

重构
----
 Mac快捷键          |  Windows快捷键          | 英文                              | 作用|
:------------------  | :------------------  | :------------- | :------------- 
|`cmd`+`option`+`v`|`ctrl`+`alt`+`v` |Variable|将表达式等于一个变量
|`cmd`+`option`+`c`|`ctrl`+`alt`+`c`|Constant| 提取为常量
|`cmd`+`option`+`f`|`ctrl`+`alt`+`f`|Field|将鼠标指针处的变量变成类的变量
|`cmd`+`option`+`p`|`ctrl`+`alt`+`p`|Parameter| 提取为参数
|`cmd`+`option`+`m`|`ctrl`+`alt`+`m` |Method|将圈起来的代码提取为一个单独的方法
|`cmd`+`l`|`ctrl`+`alt`+`n` |Line|将行的内容提取出来



LiveTemplates
----

Mac快捷键               |Windows快捷键             | 英文       | 作用|
:------------------  | :------------------  | :------------- | :------------- 
|`cmd`+`j`   |`ctrl`+`j`    |  Insert Live Template| 可以查看所有live templates
|`cmd`+`option`+`j`|`ctrl`+`alt`+`j`    | Surround With Live Template| 可以查看所有可以包裹住的live templates



> ### Useful symbols for Mac:
> 
> &#8984; = Command Key 
> &#8997; = Option Key   
> &#8679; = Shift Key  
> &#8963; = Control Key

