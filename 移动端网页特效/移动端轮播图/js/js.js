window.addEventListener('load', function() {
    var focus = document.querySelector('.focus');
    var ul = focus.children[0];
    var w = focus.offsetWidth; //获取focus盒子的宽度
    var index = 0;
    var ol = focus.children[1];
    //利用定时器实现自动播放
    var timer = setInterval(function() {
        index++;
        // if (index == focus.children.length + 1) {
        //     index = 0;
        // }
        var translatex = -index * w;
        ul.style.transition = 'all .3s' //css3的过度属性，使播放时比较顺滑
        ul.style.transform = 'translateX(' + translatex + 'px)';
    }, 2000);

    //等着我们过渡完成之后，再去判断 监听过渡完成的事件 transitionend
    ul.addEventListener('transitionend', function() {
        // console.log(1);
        if (index >= 3) {
            index = 0;
            ul.style.transition = 'none'; //去掉过渡效果
            var translatex = -index * w; //用最新index乘
            ul.style.transform = 'translateX(' + translatex + 'px)';
        } else if (index < 0) {
            index = 2
            ul.style.transition = 'none'; //去掉过渡效果
            var translatex = -index * w; //用最新index乘
            ul.style.transform = 'translateX(' + translatex + 'px)';
        }
        //使用classname实现小圆圈功能
        //把ol里面li带有current类名的选出来去掉类名 remove
        //让当前索引号的li加上current类
        ol.querySelector('.current').classList.remove('current');
        ol.children[index].classList.add('current')
    });

    //手指滑动轮播图
    //触碰元素touchstart：获取手指初始坐标
    var startX = 0;
    var moveX = 0;
    ul.addEventListener('touchstart', function(e) {
        //计算移动距离
        startX = e.targetTouches[0].pageX - startX;
        //停止定时器
        clearInterval(timer);
    });
    ul.addEventListener('touchmove', function(e) {
        moveX = e.targetTouches[0].pageX - startX;
        var translatex = -index * w + moveX;
        ul.style.transition = 'none' //css3的过度属性，使播放时比较顺滑
        ul.style.transform = 'translateX(' + translatex + 'px)';

    });

    //根据移动的距离选择移动图片还是弹回原图片
    //滑动距离大于50px就移动到另一张，小于就弹回
    //通过moveX的正负判断向右还是向左换图
    ul.addEventListener('touchend', function(e) {
        if (Math.abs(moveX) > 50) {
            if (moveX > 0) {
                index--;
            } else {
                index++
            }
            var translatex = -index * w;
            ul.style.transition = 'all .3s' //css3的过度属性，使播放时比较顺滑
            ul.style.transform = 'translateX(' + translatex + 'px)';
        } else {
            var translatex = -index * w;
            ul.style.transition = 'all .1s' //css3的过度属性，使播放时比较顺滑
            ul.style.transform = 'translateX(' + translatex + 'px)';
        }
        //手指离开重新开启定时器
        clearInterval(timer);
        timer = setInterval(function() {
            index++;
            // if (index == focus.children.length + 1) {
            //     index = 0;
            // }
            var translatex = -index * w;
            ul.style.transition = 'all .3s' //css3的过度属性，使播放时比较顺滑
            ul.style.transform = 'translateX(' + translatex + 'px)';
        }, 2000);

    });


    //返回顶部按钮,offsettop元素到顶部的距离，window.pageYoffset页面被卷去的距离
    var goBack = document.querySelector('.goBack');
    var nav = document.querySelector('nav');
    window.addEventListener('scroll', function() {
        // console.log(window.pageYOffset);
        // console.log(nav.offsetTop);
        if (window.pageYOffset >= nav.offsetTop) {
            goBack.style.display = 'block';
        } else {
            goBack.style.display = 'none'
        }
        // console.log(window.pageYOffset);
        // console.log(nav.offsetTop);

    })
    goBack.addEventListener('click', function() {
        window.scroll(0, 0);
    })




});