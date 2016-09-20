(function(win){

	function Pixel(opts){
		this.options = Pixel.extend({
			size: 10,
			space: 1,
			imgurl: '',
			id: ''
		}, opts);
		this.canvas = document.createElement('canvas');
		this.container = document.getElementById(this.get('id'));
	}

	Pixel.extend = function(option){
		var length = arguments.length;
		if(length<2 || !option) return option || {};
		for(var i=1; i<length; i++){
			var obj = arguments[i];
			for(key in obj){
				option[key] = obj[key];
			}
		}
		return option;
	}

	Pixel.prototype = {
		constructor: Pixel,

		get: function(key){
			return this.options[key];
		},

		set: function(key, value){
			this.options[key] = value;
		},

		create: function(){
			var me = this;
			me._loadImage(function(){
				me.imgdata = me._getImgColorData();
				me.colorArr = me._parseImgData(me.imgdata.data);
				me.container.innerHTML = me._getImgHTML();
			});
			
		},

		_loadImage: function(callback){
			var img = new Image(),
				cvs = this.canvas,
				ctx = cvs.getContext('2d');

			img.onload = function(){
				cvs.width = img.width;
				cvs.height = img.height;
				ctx.drawImage(img, 0, 0);
				callback && callback();
			}
			img.src = this.get('imgurl');
		},

		_getImgColorData: function(){
			var cvs = this.canvas,
				ctx = cvs.getContext('2d');
			return ctx.getImageData(0, 0, cvs.width, cvs.height)
		},

		_parseImgData: function(data){
			var result = [];
			for(var i = 0, len = data.length; i<len; i+=4){
				var r = data[i],
					g = data[i+1],
					b = data[i+2],
					a = data[i+3];
				result.push('rgba('+r+','+g+','+b+','+a+')');
			}
			return result;
		},

		_getImgHTML: function(){
			var me = this,
				colorArr = me.colorArr,
				size = me.get('size'),
				width = me.imgdata.width,
				height = me.imgdata.height,
				wsize = Math.ceil(width/size),
				hsize = Math.ceil(height/size),
				html = '',
				cssStr = 'width: '+size+'px; ' +
						 'height: '+size+'px;';

			for(var i=0; i<hsize; i++){
				html+='<div style="height: '+size+'px">';
				for(var j=0; j<wsize; j++){
					html+='<span style="background-color:'+colorArr[j*size+i*size*width]+';'+cssStr+'"></span>';
				}
				html+='</div>';
			}

			return html || '';
		}
	}

	win.Pixel = Pixel;
	
})(window)