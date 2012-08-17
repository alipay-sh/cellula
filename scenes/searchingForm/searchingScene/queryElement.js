/**
 * 查询场景使用的查询条件元素
 * 抽象基类
 * 继承自Cell
 */
(function(cellula){
    var UtilTools = cellula._util;
    cellula.QueryElement = new cellula.Class('QueryElement',{
        //细胞核存放数据
        _nucleus:null,
        init : function (cfg) {
            if (UtilTools.isObject(cfg)) {
                for (var n in this) {
                    UtilTools.isObject(this[n]) && UtilTools.isObject(cfg[n]) ? this[n] = UtilTools.deepMix({},this[n],cfg[n]): this[n] = cfg[n] ? cfg[n] : this[n];
                }
            }
            this.render();
            this.getNucleus().on('error',this.error,this)
        },
        getNucleus:function(){
            return this._nucleus;
        },
        setNucleus:function(nu){
            this._nucleus = nu;
        },
        setNucleusAttrs:function(key, value, opt){
            return this._nucleus.set(key, value, opt);
        }

    }).inherits(cellula.Cell);

    cellula.QueryElement.Input = new cellula.Class('QueryElement.Input',{
        formExplain:'请填写',
        render:function(){
            this._super();
            var input =  $(this.rootNode).find('input').get(0);
            var inputElV =  input.value;
            if(inputElV) this.setNucleusAttrs('value',inputElV);
            var inputV = this.getNucleus().get('value');
            input.value = (inputV)?inputV:'';
        },
        registerEvents:function(){
            var that = this;
            $(this.rootNode).find('input').blur(function(e){
                that.setNucleusAttrs('value',this.value);
            });
            $(this.rootNode).find('input').focus(function(e){
               that.clearErrorStatus();
            });
        },
        error:function(errMsg){
            $(this.rootNode).addClass('mi-form-item-error');
            $(this.rootNode).find('.mi-form-explain').get(0).innerHTML = errMsg;
        },
        clearErrorStatus:function(){
            $(this.rootNode).removeClass('mi-form-item-error');
            $(this.rootNode).find('.mi-form-explain').get(0).innerHTML =this.formExplain;
        }
    }).inherits(cellula.QueryElement);

    /**
     * 日历输入
     * 他的结构本身包含了一个预定义好的nucleus，按照固定日期格式进行校验
     * 所以，不必再设置一个nucleus实例了
     * Calender的rootNode将指向input本身，目的是为了后续双日历或者三日历控件的组合使用
     */
    cellula.QueryElement.Calendar = new cellula.Class('QueryElement.Calendar',{
        formExplain:'请填写',
        status:true,
        container:false,
        regCal : /^\d{4}-((0[1-9]{1})|(1[0-2]{1}))-((0[1-9]{1})|([1-2]{1}[0-9]{1})|(3[0-1]{1}))$/,
        init:function(cfg){
            var that = this;
            var tmpNuCl = new cellula.Class({
                validate:function(data,el){
                    var v = data.value ;
                    if(!(that.regCal.test(v))){
                        return '日期格式错误！';
                    }
                }
            }).inherits(cellula.Nucleus);
            cfg._nucleus = new tmpNuCl({value:cfg.value});
            this._super(cfg);
        },
        render:function(){
            this._super();
            var input =  $(this.rootNode).get(0);
            var inputElV =  input.value;
            if(inputElV) this.setNucleusAttrs('value',inputElV);
            var inputV = this.getNucleus().get('value');
            input.value = (inputV)?inputV:'';
            this.container = $(this.rootNode).parent('.mi-form-item').get(0);


        },
        registerEvents:function(){
            var that = this;
            $(this.rootNode).blur(function(e){
                that.setNucleusAttrs('value',this.value);
            });
            $(this.rootNode).focus(function(e){
               that.clearErrorStatus();
            });
            //todo:use Calender to input date value
        },
        error:function(errMsg){
            if(this.container){
                $(this.container).addClass('mi-form-item-error');
                $(this.container).find('.mi-form-explain').get(0).innerHTML = errMsg;
            }
            this.status = false;
        },
        clearErrorStatus:function(){
             if(this.container){
                 $(this.container).removeClass('mi-form-item-error');
                 $(this.container).find('.mi-form-explain').get(0).innerHTML =this.formExplain;
             }
             this.status = true;
        }
    }).inherits(cellula.QueryElement);

    cellula.QueryElement.DoubleCalendar = new cellula.Class('QueryElement.DoubleCalendar',{
        formExplain:'请填写',
        startCalender:null,
        endCalender:null,
        init:function(cfg){
            var tmpNuCl = new cellula.Class({
                startCalenderNucleus:null,
                endCalenderNucleus:null,
                validate:function(data,el){
                   
                }
            }).inherits(cellula.Nucleus);
            this._super(cfg);
            this.startCalender = new cellula.QueryElement.Calendar({
                rootNode:$(cfg.startCalenderRoot)
            });
            this.endCalender = new cellula.QueryElement.Calendar({
                rootNode:$(cfg.endCalenderRoot)
            });
            this.startCalender.getNucleus().on('change',this.changeHandler,this);
            this.endCalender.getNucleus().on('change',this.changeHandler,this);
            this._nucleus = new tmpNuCl({startCalenderNucleus:this.startCalender.getNucleus(),endCalenderNucleus:this.endCalender.getNucleus()});
        },
        render:function(){
            this._super();
        },
        registerEvents:function(){
            this._super();
            //todo:use Calender to input date value
            var that = this;


        },
        changeHandler:function(attrs){
            console.log('change');
            if(this.startCalender.status && this.endCalender.status ){
                var d1 = this.startCalender.getNucleus().get('value');
                var d2 = this.endCalender.getNucleus().get('value');
                console.log(d1);
                if(new Date(d1) > new Date(d2)){
                    this.trigger('error',that);
                    console.log('开始时间不能晚于结束时间');
                    this.error('开始时间不能晚于结束时间');
                }
            }
        },
        error:function(errMsg){
            $(this.rootNode).addClass('mi-form-item-error');
            $(this.rootNode).find('.mi-form-explain').get(0).innerHTML = errMsg;
        },
        clearErrorStatus:function(){
            $(this.rootNode).removeClass('mi-form-item-error');
            $(this.rootNode).find('.mi-form-explain').get(0).innerHTML =this.formExplain;
        }
    }).inherits(cellula.QueryElement);


})(Cellula);


/**
 * 查询元素产出工厂
 * @param elements []配置信息
 * @return array 产出数组信息
 */
var QueryElementFactory = function (elements) {
    if (!Cellula._util.isArray(elements)) {
        elements = [elements];
    }
    var result = [];
    Cellula._util.each(elements,function(item,index){

        if(item.key && item.classType && item.rootNode){
            var tmpNuCl;
            tmpNuCl = new Cellula.Class(item.key,{
                validate:(item.validate)?item.validate:function(){}
            }).inherits(Cellula.Nucleus);

            item._nucleus = new tmpNuCl({value:item.value});
            var tmp = new item.classType(item);

            result.push(tmp);
        }
    });
    return result;
};