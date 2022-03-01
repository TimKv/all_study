window.addEventListener('load', function() {
    // this.alert(1);
    var a = document.querySelectorAll('a');
    console.log(a);
    var focus = document.querySelector('.foucs');
    //进入出现左右光标，移出消失
    //鼠标经过停止最后自动播放的定时器，移出继续
    focus.addEventListener('mouseenter', function() {
        a[0].style.display = 'block';
        a[1].style.display = 'block';
        clearInterval(timer)
    })
    focus.addEventListener('mouseleave', function() {
        a[0].style.display = 'none';
        a[1].style.display = 'none';
        timer = setInterval(function() {
            a[1].click();
        }, 2000);
    });
    //动态创建小圆点
    var ul = focus.querySelector('ul');
    var ol = focus.querySelector('.circle');
    console.log(ul.children.length);
    var focuWidth = focus.offsetWidth;

    for (var i = 0; i < ul.children.length; i++) {
        var li = document.createElement('li');
        //记录当前里的index
        li.setAttribute('index', i);
        ol.appendChild(li);
        ol.children[0].className = 'current';

        //利用排他思想点击小圆圈变色
        //使用外侧循环给每个li都绑定以下事件
        //当点击时，先清除所有li的样式
        //循环结束后再更改this的样式
        li.addEventListener('click', function() {
            for (var j = 0; j < ol.children.length; j++) {
                ol.children[j].className = '';
            }
            this.className = 'current';
            var index = this.getAttribute('index');
            //每当li改变时吧index给num，还要给小圆圈的circle，修复bug
            num = index;
            circle = index
            var focuWidth = focus.offsetWidth;
            console.log(index);
            console.log(focuWidth);
            animate(ul, -index * focuWidth);
        })
    }
    var num = 0;
    var circle = 0;
    //右侧箭头功能
    //克隆第一张图片放到ul最后面
    //由于小圆圈生成在克隆之前所有数量不会受影响
    var first = ul.children[0].cloneNode(true);
    ul.appendChild(first);


    //节流阀
    var flag = true;
    a[1].addEventListener('click', function() {
        if (flag) {
            flag = false; //关闭节流阀
            if (num == ul.children.length - 1) {
                ul.style.left = 0;
                num = 0;
            }
            num++;
            //动画执行完毕打开节流阀
            animate(ul, -num * focuWidth, function() {
                flag = true;
            });
            circle++;
            if (circle == ol.children.length) {
                circle = 0;
            }
            for (var i = 0; i < ol.children.length; i++) {
                ol.children[i].className = '';
            }
            ol.children[circle].className = 'current';
        }

    });
    //左侧箭头功能
    a[0].addEventListener('click', function() {
        if (flag) {
            flag = false; //关闭节流阀
            if (num == 0) {
                num = ul.children.length - 1;
                ul.style.left = -num * focuWidth + 'px';
            }
            num--;
            animate(ul, -num * focuWidth, function() {
                flag = true;
            });
            circle--;
            if (circle < 0) {
                circle = ol.children.length - 1;
            }
            for (var i = 0; i < ol.children.length; i++) {
                ol.children[i].className = '';
            }
            ol.children[circle].className = 'current';
        }
    });
    //自动播放，使用手动调用事件
    var timer = setInterval(function() {
        a[1].click();
    }, 2000);

});