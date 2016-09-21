(function(win){

	function Lunbo(opts){
		if(opts) $.extend(this.options, opts);
		this.init();
	}	

	var obj = {

		options: {
			urls: [],     //图片的url
			speed1: 400,  //图片切换的事件
			speed2: 3000, //轮播的间隔时间
			width: 300,   //单张图片宽度
			height: 200,  //单张图片高度
			space: 80,    //图片间隔
		},

		get: function(key){
			return this.options[key];
		},

		//初始化
		init: function(){
			this.$el = $(this.get('wrapper'));
			this.ref = 0; //基数
			this.render();
			this.bindEvent();
			this.automove();
		},

		//渲染
		render: function(){
			var imgarr = this.get('urls'),
				btnhtml = ['<button data-index="-1" class="pre-btn"><</button>',
						   '<button data-index="1" class="next-btn">></button>'].join('');
				imghtml = '',navhtml='';
			for(var i = 0; i<imgarr.length; i++){
				imghtml+='<img src="'+imgarr[i]+'">';
				navhtml+='<li></li>';
			}
			this.$el.html(imghtml).append(btnhtml).append('<ul>'+navhtml+'</ul>');
			this.$imgs = $('img',this.$el);
			this.setStyle(); 
		},

		//绑定事件
		bindEvent: function(){
			var me = this;
			$('button',this.$el).on('click',function(){
				me.stopAutomove();
				me.move($(this).data('index'));
				me.automove();
			});
			$('li',this.$el).on('click', function(){
				$self = $(this);
				me.stopAutomove();
				$self.addClass('active').siblings().removeClass('active');
				me.ref = $(this).index()-1;
				me.move(1);
				me.automove();
			});
		},

		//设置样式
		setStyle: function(){
			var me = this,
				ref = me.ref;
				length = me.$imgs.length;
			me.$el.css({
				'width':me.get('width')+me.get('space')*2,
				'height':me.get('height')});//容器的宽度恰好容纳所有图片
			me.$imgs.each(function(){
				var $self = $(this);
				$self.css(me.getStyle($self.index()));
			});
			$('li',me.$el).eq(0).addClass('active');
		},

		//获取样式
		getStyle: function(index){
			var me = this, result,
				width = me.get('width'),
				height = me.get('height'),
				space = me.get('space'),
				ref = me.ref;
				length = me.$imgs.length;
			switch(index-ref){
				case 0:
					result = {
						'left': space,
						'width': width,
						'height': height,
						'opacity': 1,
						'z-index':3
					};
					break;
				case 1:
				case -length+1:
					width = width-60;
					height = height*(width/me.get('width'));
					space = me.get('width')+space-(width-space);
					result = {
						'left': space,
						'width': width,
						'height': height,
						'opacity': 0.5,
						'z-index':2
					};
					break;
				case -1:
				case (length-1):
					width = width-60;
					height = height*(width/me.get('width'));
					result = {
						'left': 0,
						'width': width,
						'height': height,
						'opacity': 0.5,
						'z-index':2
					};
					break;
				default:
					width = width-60*2;
					height = height*(width/me.get('width'));
					space = space+(me.get('width')-width)/2; 
					result = {
						'left': space,
						'width': width,
						'height': height,
						'opacity': 0,
						'z-index':1,
					};
					break;
			}
			return result;
		},

		//dir:1左移，-1右移
		move: function(dir){
			var me = this,
				length = me.$imgs.length,
				speed = me.get('speed1');
			me.ref = ((this.ref||length) + dir)%length;
			me.$imgs.each(function(){
				var $self = $(this),cssobj = me.getStyle($self.index());
				$self.css('z-index',cssobj['z-index']);
				$self.stop(true,true); //连续点击停止所有
				$self.animate(cssobj,speed);
			});
			$('li',me.$el).removeClass('active').eq(me.ref).addClass('active');
		},

		//停止轮播
		stopAutomove: function(){
			if(this.I){
				clearInterval(this.I||(this.I=null));
			}
		},

		//启动轮播
		automove: function(){
			var me = this;
			me.stopAutomove();
			me.I = setInterval(function(){
				me.move(1);
			},me.get('speed2'));
		}

	}

	$.extend(Lunbo.prototype, obj);

	win.Lunbo = Lunbo;

})(window);