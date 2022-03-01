var time = null;
//公式：（100-0）/10 = 10  （100-10）/10 = 9  （100-19）/10 = 8.1

//回调函数，当移动执行完变色
//为第三个参数callback添加函数，写在定时器结束位置
function animate(obj, target, callback) {
    clearInterval(obj.time);
    obj.time = setInterval(function() {
        //将步长值写到定时器的里面
        //step会慢慢变小
        //把步长改为整数，不要出现小数问题
        //往上取整函数math.ceil()
        //通过以下一行代码可以实现点击800后点500，方块会返回，因为500-800就为负数了

        var step = (target - obj.offsetLeft) / 10;
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        //大于0向上取值，小于0向下取值，解决从800到500的bug和点击500到的却是495左右的bug

        if (obj.offsetLeft == target) {
            clearInterval(obj.time);
            //回调函数写在这
            if (callback) { //判断有没有回调函数
                callback();
            }
        }
        obj.style.left = obj.offsetLeft + step + 'px';
    }, 15);
}