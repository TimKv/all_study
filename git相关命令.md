初次建立的库记得
git init

git status 
查看当前项目情况
红色部分上面是修改的部分，下面是新增的部分

git add .
可以更新状态，再git status就不会有红色部分了

git commit -m "完成了某某功能" 
提交消息命令

git branch
查看分支

git checkout master
切换到master主分支

git checkout login
切换到login分支

切换到master主分支后执行git merge login就可以吧login中的所有代码合并到master中

切换到master主分支后执行git push把本地的master分支推送到gitee中

git checkout -b user
创建user新分支并切换到新分支 checkout切换分支 -b user创建名为user的新分支

git push -u origin user
推送当前分支的内容到origin仓库的user分支中，origin疑似默认

每次别的分支的代码写完记得合并到主分支比如login功能的代码git merge login

master分支下上传代码直接 git push就行
