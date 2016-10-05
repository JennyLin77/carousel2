/* 通过ID获取元素 */
var getById = function(id){
	return typeof id === "string" ? document.getElementById(id) : id;
};

/* 通过tagName来获取元素，可借助祖先元素来加快搜索速度 */
var getByTagName = function(tagName, parentObj){
	return (parentObj || document).getElementsByTagName(tagName);
};

/* 
	图片轮播（无动画效果）
	参数id：图片轮播最外层容器的id
*/
var carousel = function(id){
	this.initialize(id);
};

carousel.prototype = {
	/* 初始化 */
	initialize: function(id){
		var thisObj = this;
		this.container = getById(id);
		this.picList = getByTagName("ul",this.container)[0];
		this.selList = getByTagName("ul",this.container)[1];
		this.btnGroup = getByTagName("div",this.container)[1];
		this.picItem = getByTagName("li",this.picList);
		this.selItem = getByTagName("li",this.selList);
		this.prevBtn = getByTagName("a",this.btnGroup)[0];
		this.nextBtn = getByTagName("a",this.btnGroup)[1];
		this.imgWidth = getByTagName("img",this.container)[0].width;
		console.log(this.imgWidth);
		this.autoTimer = null;
		this.timer = null;
		this.interval = 2000;
		this.currentIndex = 0;
		this.toggle();
		this.autoTimer = setInterval(function(){
			thisObj.jumpNext();
		}, thisObj.interval);

		/* 绑定鼠标悬浮事件：图片轮播将暂停 */
		this.container.onmouseover = function(){
			clearInterval(thisObj.autoTimer);
		};

		/* 绑定鼠标移出事件：图片轮播继续执行 */
		this.container.onmouseout = function(){
			thisObj.autoTimer = setInterval(function(){
				thisObj.jumpNext();
			},thisObj.interval);
		};

		/* 为每个图片选择小圆点绑定鼠标悬浮事件：将跳转到相应图片 */
		for (var i = 0; i < this.selItem.length; i++) {
			this.selItem[i].index = i;
			this.selItem[i].onmouseover = function(){
				thisObj.currentIndex = this.index;
				thisObj.toggle();
			};
		};

		/* 跳转到前一张图片 */
		this.prevBtn.onclick = function(){
			thisObj.currentIndex--;
			if (thisObj.currentIndex == -1){ thisObj.currentIndex = thisObj.selItem.length-1; };
			thisObj.toggle();
			return false;
		};

		/* 跳转到后一张图片 */
		this.nextBtn.onclick = function(){
			thisObj.jumpNext();
			return false;
		};
	},
	/* 切换图片，改变图片选择小圆点的样式 */
	toggle: function(){
		for (var i = 0; i < this.selItem.length; i++) {
			this.selItem[i].className = "carousel-selItem";
		};
		this.selItem[this.currentIndex].className = "carousel-selItem current";
		this.move(-(this.currentIndex*this.imgWidth));

	},
	/* 跳转到下一张图片：改变currentIndex */
	jumpNext: function(){
		this.currentIndex++;
		if (this.currentIndex == this.selItem.length) { this.currentIndex = 0; };
		this.toggle();
	},
	/* 移动picList以实现滚动效果(offsetDistance:滚动某张图片所需的picList相对容器的偏移距离) */
	move: function(offsetDistance){
		console.log(offsetDistance);
		var thisObj = this;
		clearInterval(thisObj.timer);
		thisObj.timer = setInterval(function(){
			var speed = (offsetDistance - thisObj.picList.offsetLeft)/5; /* 5:可改成其他数字，可改变滚动速度 */
			speed = (speed > 0) ? Math.ceil(speed) : Math.floor(speed);
			(thisObj.picList.offsetLeft == offsetDistance) ? clearInterval(thisObj.timer) : (thisObj.picList.style.left = thisObj.picList.offsetLeft + speed + "px");
		}, 30);  /* 30:可换成其他数字，可改变滚动速度 */
	}
};

window.onload = function(){
	new carousel("myCarousel");
};