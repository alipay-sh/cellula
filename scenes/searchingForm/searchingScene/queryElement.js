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
                console.log('blur')
                that.setNucleusAttrs('value',this.value);
            });
            $(this.rootNode).find('input').focus(function(e){
               that.clearErrorState();
            });
        },
        error:function(errMsg){
            $(this.rootNode).addClass('mi-form-item-error');
            $(this.rootNode).find('.mi-form-explain').get(0).innerHTML = errMsg;
        },
        clearErrorState:function(){
            $(this.rootNode).removeClass('mi-form-item-error');
            $(this.rootNode).find('.mi-form-explain').get(0).innerHTML =this.formExplain;
        }
    }).inherits(cellula.QueryElement);

    /**
     * 日历输入
     * 他的结构本身包含了一个预定义好的nucleus，按照固定日期格式进行校验
     * 所以，不必再设置一个nucleus实例了
     */
    cellula.QueryElement.Calendar = new cellula.Class('QueryElement.Calendar',{
        formExplain:'请填写',
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

        },
        registerEvents:function(){
            this._super();
            //todo:use Calender to input date value
        }
    }).inherits(cellula.QueryElement.Input);

    cellula.QueryElement.DoubleCalendar = new cellula.Class('QueryElement.DoubleCalendar',{
        formExplain:'请填写',
        startCalender:null,
        endCalender:null,
        init:function(cfg){
            
            this._super(cfg);
            //todo:这里结构问题会导致出错，root应该是指向容器。
            startCalender = new cellula.QueryElement.Calendar({
                rootNode:$(cfg.startCalenderRoot)
            })
            console.log(cfg.startCalenderRoot)
            endCalender = new cellula.QueryElement.Calendar({
                rootNode:$(cfg.endCalenderRoot)
            })
        },
        render:function(){
            this._super();
            var input1 =  $(this.rootNode).find('input').get(0);
            var input2 =  $(this.rootNode).find('input').get(1);
            var inputElV1 =  input1.value;
            var inputElV2 =  input2.value;
            var inputElV = {};
            if(inputElV1 && inputElV2){
                inputElV.date1 = inputElV1;
                inputElV.date2 = inputElV2;
                this.setNucleusAttrs('value',inputElV);
            }

            var inputV = this.getNucleus().get('value');
            input1.value = (inputV.date1)?inputV.date1:'';
            input2.value = (inputV.date2)?inputV.date2:'';

        },
        registerEvents:function(){
            this._super();
            //todo:use Calender to input date value
        },
        error:function(errMsg){
            $(this.rootNode).addClass('mi-form-item-error');
            $(this.rootNode).find('.mi-form-explain').get(0).innerHTML = errMsg;
        },
        clearErrorState:function(){
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