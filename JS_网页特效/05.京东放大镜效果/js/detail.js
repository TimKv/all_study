window.addEventListener('load', function() {
    var preview_img = this.document.querySelector('.preview_img');
    var mask = this.document.querySelector('.mask');
    var big = this.document.querySelector('.big');

    preview_img.addEventListener('mouseover', function() {
        mask.style.display = 'block';
        big.style.display = 'block';
    });
    preview_img.addEventListener('mouseout', function() {
        mask.style.display = 'none';
        big.style.display = 'none';
    });
    //放大镜色块是以父元素手机图片盒子为定位对象的
    preview_img.addEventListener('mousemove', function(e) {
        //计算鼠标在盒子内坐标
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;
        //mask.offsetwidth和mask.offsetheight为色块盒子的一半
        var maskX = x - mask.offsetWidth / 2
        var maskY = y - mask.offsetHeight / 2

        //超出边界判断
        var mashMax = preview_img.offsetWidth - mask.offsetWidth;
        if (maskX <= 0) {
            maskX = 0;
        } else if (maskX >= preview_img.offsetWidth - mask.offsetWidth) {
            maskX = preview_img.offsetWidth - mask.offsetWidth;
        }

        if (maskY <= 0) {
            maskY = 0;
        } else if (maskY >= preview_img.offsetHeight - mask.offsetHeight) {
            maskY = preview_img.offsetHeight - mask.offsetHeight;
        }

        mask.style.left = maskX + 'px';
        mask.style.top = maskY + 'px';

        //大图片的移动距离 = 遮挡层移动距离+大图片最大移动距离/遮挡层的最大移动距离
        var bigIMG = document.querySelector('.bigImg');
        var bigMax = bigIMG.offsetWidth - big.offsetWidth;
        var bigx = maskX * bigMax / mashMax;
        var bigy = maskY * bigMax / mashMax;
        bigIMG.style.left = -bigx + 'px';
        bigIMG.style.top = -bigy + 'px';



    })

});